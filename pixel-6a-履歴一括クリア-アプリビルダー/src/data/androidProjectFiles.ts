import { ProjectFile } from '../types';

export const ANDROID_PROJECT_FILES: ProjectFile[] = [
  {
    name: 'ClearAllAccessibilityService.kt',
    path: 'app/src/main/java/com/example/pixelclearall/ClearAllAccessibilityService.kt',
    language: 'kotlin',
    description: 'Pixel 6aのアプリ履歴を開き、「すべてクリア」を検知・自動タップしてホームに戻る中核サービス',
    content: `package com.example.pixelclearall

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.content.Intent
import android.graphics.Path
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

/**
 * Pixel 6a (Android 13/14/15) 最適化 履歴一括全消去 ユーザー補助サービス
 */
class ClearAllAccessibilityService : AccessibilityService() {

    companion object {
        private const val TAG = "PixelClearAll"
        const val ACTION_TRIGGER_CLEAR = "com.example.pixelclearall.ACTION_TRIGGER"
        var instance: ClearAllAccessibilityService? = null
            private set
    }

    private val handler = Handler(Looper.getMainLooper())
    private var isClearing = false
    private var attempts = 0
    private val maxAttempts = 8

    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this
        Log.d(TAG, "ClearAllAccessibilityService 接続完了")
    }

    override fun onDestroy() {
        super.onDestroy()
        instance = null
        Log.d(TAG, "ClearAllAccessibilityService 終了")
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_TRIGGER_CLEAR) {
            triggerClearAllSequence()
        }
        return START_NOT_STICKY
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // トリガー中のみ画面イベントを監視
        if (!isClearing) return

        // 履歴画面（Pixel Launcher: com.google.android.apps.nexuslauncher）の更新をキャッチ
        val rootNode = rootInActiveWindow ?: return
        checkAndClickClearAll(rootNode)
    }

    override fun onInterrupt() {
        isClearing = false
    }

    /**
     * 一括消去シーケンスの開始:
     * 1. 履歴画面 (GLOBAL_ACTION_RECENTS) を開く
     * 2. 「すべてクリア」ボタンを探索
     * 3. 見つからない場合は左端まで高速スクロールジェスチャー
     * 4. タップ成功後、ホーム画面へ戻る
     */
    fun triggerClearAllSequence() {
        if (isClearing) return
        isClearing = true
        attempts = 0
        Log.d(TAG, "履歴消去シーケンス開始")

        // 1. 最近使ったアプリ画面を表示
        performGlobalAction(GLOBAL_ACTION_RECENTS)

        // 画面が展開するのを待って探索開始
        handler.postDelayed({
            searchLoop()
        }, 350)
    }

    private fun searchLoop() {
        if (!isClearing) return

        val root = rootInActiveWindow
        if (root != null && checkAndClickClearAll(root)) {
            // 見つかってクリック成功
            finishSequence()
            return
        }

        attempts++
        if (attempts < maxAttempts) {
            // まだ見つからない場合: Pixelの「すべてクリア」は左端にあるため右方向に高速フリック（カードを右へ押し出す）
            performFlickToLeftmost()
            handler.postDelayed({
                searchLoop()
            }, 300)
        } else {
            Log.w(TAG, "「すべてクリア」が見つかりませんでした (履歴が既に空の可能性)")
            finishSequence()
        }
    }

    /**
     * UIツリーから「すべてクリア」「Clear all」ボタンを探索してクリック
     */
    private fun checkAndClickClearAll(root: AccessibilityNodeInfo): Boolean {
        // 日本語・英語・リソースIDの多段探索
        val targetTexts = listOf("すべてクリア", "すべて消去", "Clear all", "Clear All", "CLEAR ALL")
        for (text in targetTexts) {
            val nodes = root.findAccessibilityNodeInfosByText(text)
            if (!nodes.isNullOrEmpty()) {
                for (node in nodes) {
                    if (clickNodeOrParent(node)) {
                        Log.d(TAG, "「$text」ボタンをタップ成功")
                        return true
                    }
                }
            }
        }

        // Pixel Launcher 特有のリソースID探索
        val idList = listOf(
            "com.google.android.apps.nexuslauncher:id/clear_all",
            "com.android.launcher3:id/clear_all"
        )
        for (resId in idList) {
            val nodes = root.findAccessibilityNodeInfosByViewId(resId)
            if (!nodes.isNullOrEmpty()) {
                for (node in nodes) {
                    if (clickNodeOrParent(node)) {
                        Log.d(TAG, "リソースID $resId をタップ成功")
                        return true
                    }
                }
            }
        }

        return false
    }

    private fun clickNodeOrParent(node: AccessibilityNodeInfo?): Boolean {
        var current = node
        while (current != null) {
            if (current.isClickable) {
                return current.performAction(AccessibilityNodeInfo.ACTION_CLICK)
            }
            current = current.parent
        }
        return false
    }

    /**
     * 左端（すべてクリアボタン）に向けて画面中央を右へ高速スワイプ
     */
    private fun performFlickToLeftmost() {
        val displayMetrics = resources.displayMetrics
        val width = displayMetrics.widthPixels.toFloat()
        val height = displayMetrics.heightPixels.toFloat()

        // 画面中央よりやや下を左から右へ素早くスワイプ（カードを右に流し、一番左のカード/ボタンへ）
        val startX = width * 0.15f
        val startY = height * 0.55f
        val endX = width * 0.85f
        val endY = height * 0.55f

        val path = Path().apply {
            moveTo(startX, startY)
            lineTo(endX, endY)
        }

        val stroke = GestureDescription.StrokeDescription(path, 0, 180)
        val gesture = GestureDescription.Builder().addStroke(stroke).build()

        dispatchGesture(gesture, null, null)
    }

    private fun finishSequence() {
        isClearing = false
        // 500ms後にホーム画面に復帰
        handler.postDelayed({
            performGlobalAction(GLOBAL_ACTION_HOME)
        }, 500)
    }
}
`
  },
  {
    name: 'MainActivity.kt',
    path: 'app/src/main/java/com/example/pixelclearall/MainActivity.kt',
    language: 'kotlin',
    description: 'ユーザー補助権限のステータス表示・有効化誘導・テスト実行を行うメイン画面',
    content: `package com.example.pixelclearall

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.text.TextUtils
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var statusText: TextView
    private lateinit var permissionBtn: Button
    private lateinit var executeBtn: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        statusText = findViewById(R.id.statusText)
        permissionBtn = findViewById(R.id.permissionBtn)
        executeBtn = findViewById(R.id.executeBtn)

        permissionBtn.setOnClickListener {
            // Androidの「設定 > ユーザー補助」画面へ直接遷移
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
            startActivity(intent)
            Toast.makeText(this, "「Pixel 履歴一括クリア」をONにしてください", Toast.LENGTH_LONG).show()
        }

        executeBtn.setOnClickListener {
            if (isAccessibilityServiceEnabled(this, ClearAllAccessibilityService::class.java)) {
                val service = ClearAllAccessibilityService.instance
                if (service != null) {
                    service.triggerClearAllSequence()
                } else {
                    val intent = Intent(this, ClearAllAccessibilityService::class.java).apply {
                        action = ClearAllAccessibilityService.ACTION_TRIGGER_CLEAR
                    }
                    startService(intent)
                }
            } else {
                Toast.makeText(this, "先にユーザー補助の許可が必要です", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onResume() {
        super.onResume()
        updateStatus()
    }

    private fun updateStatus() {
        val isEnabled = isAccessibilityServiceEnabled(this, ClearAllAccessibilityService::class.java)
        if (isEnabled) {
            statusText.text = "ステータス: 有効 (準備完了 ✅)"
            statusText.setTextColor(0xFF10B981.toInt())
            permissionBtn.isEnabled = false
            permissionBtn.text = "ユーザー補助: 許可済み"
            executeBtn.isEnabled = true
        } else {
            statusText.text = "ステータス: 未許可 ⚠️ (権限設定が必要です)"
            statusText.setTextColor(0xFFEF4444.toInt())
            permissionBtn.isEnabled = true
            permissionBtn.text = "設定画面を開いて許可する"
            executeBtn.isEnabled = false
        }
    }

    /**
     * ユーザー補助サービスがOS側でONになっているか判定
     */
    private fun isAccessibilityServiceEnabled(context: Context, service: Class<*>): Boolean {
        val expectedComponentName = "\${context.packageName}/\${service.canonicalName}"
        val enabledServicesSetting = Settings.Secure.getString(
            context.contentResolver,
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        ) ?: return false

        val colonSplitter = TextUtils.SimpleStringSplitter(':')
        colonSplitter.setString(enabledServicesSetting)

        while (colonSplitter.hasNext()) {
            val componentName = colonSplitter.next()
            if (componentName.equals(expectedComponentName, ignoreCase = true)) {
                return true
            }
        }
        return false
    }
}
`
  },
  {
    name: 'ClearQuickTileService.kt',
    path: 'app/src/main/java/com/example/pixelclearall/ClearQuickTileService.kt',
    language: 'kotlin',
    description: 'Pixel 6aの通知パネル（クイック設定）からいつでも1タップで全消去を実行できるTileService',
    content: `package com.example.pixelclearall

import android.content.Intent
import android.service.quicksettings.Tile
import android.service.quicksettings.TileService
import android.widget.Toast

/**
 * Pixel 6a の通知トグル（クイック設定パネル）から直接起動するタイル
 */
class ClearQuickTileService : TileService() {

    override fun onStartListening() {
        super.onStartListening()
        val tile = qsTile ?: return
        tile.state = if (ClearAllAccessibilityService.instance != null) {
            Tile.STATE_ACTIVE
        } else {
            Tile.STATE_INACTIVE
        }
        tile.label = "履歴全消去"
        tile.contentDescription = "アプリ履歴を一発で全消去します"
        tile.updateTile()
    }

    override fun onClick() {
        super.onClick()
        val service = ClearAllAccessibilityService.instance
        if (service != null) {
            service.triggerClearAllSequence()
        } else {
            Toast.makeText(this, "先にアプリでユーザー補助を有効にしてください", Toast.LENGTH_SHORT).show()
            val intent = Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            startActivityAndCollapse(intent)
        }
    }
}
`
  },
  {
    name: 'ClearWidgetProvider.kt',
    path: 'app/src/main/java/com/example/pixelclearall/ClearWidgetProvider.kt',
    language: 'kotlin',
    description: 'Pixel 6aのホーム画面に配置して1タップで消去する1x1ウィジェット',
    content: `package com.example.pixelclearall

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews

/**
 * ホーム画面に置ける「履歴一括消去」ウィジェット (1x1)
 */
class ClearWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            val intent = Intent(context, ClearAllAccessibilityService::class.java).apply {
                action = ClearAllAccessibilityService.ACTION_TRIGGER_CLEAR
            }
            val pendingIntent = PendingIntent.getService(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val views = RemoteViews(context.packageName, R.layout.widget_clear_all)
            views.setOnClickPendingIntent(R.id.widget_button, pendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
`
  },
  {
    name: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    description: 'ユーザー補助機能、クイック設定タイル、ウィジェットの定義と権限設定',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.pixelclearall">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.PixelClearAll">

        <!-- メイン画面 -->
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- ユーザー補助サービス (AccessibilityService) -->
        <service
            android:name=".ClearAllAccessibilityService"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService" />
            </intent-filter>
            <meta-data
                android:name="android.accessibilityservice"
                android:resource="@xml/accessibility_service_config" />
        </service>

        <!-- クイック設定パネル用タイル -->
        <service
            android:name=".ClearQuickTileService"
            android:icon="@drawable/ic_sweep"
            android:label="履歴全消去"
            android:permission="android.permission.BIND_QUICK_SETTINGS_TILE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.service.quicksettings.action.QS_TILE" />
            </intent-filter>
        </service>

        <!-- ホーム画面ウィジェット -->
        <receiver
            android:name=".ClearWidgetProvider"
            android:exported="true">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/widget_clear_all_info" />
        </receiver>

    </application>

</manifest>
`
  },
  {
    name: 'accessibility_service_config.xml',
    path: 'app/src/main/res/xml/accessibility_service_config.xml',
    language: 'xml',
    description: '画面イベント取得、ウィンドウ内容探索、自動ジェスチャー実行の権限定義',
    content: `<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:description="@string/accessibility_service_desc"
    android:packageNames="com.google.android.apps.nexuslauncher,com.android.launcher3"
    android:accessibilityEventTypes="typeWindowStateChanged|typeWindowContentChanged"
    android:accessibilityFlags="flagDefault|flagRetrieveInteractiveWindows"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:notificationTimeout="50"
    android:canRetrieveWindowContent="true"
    android:canPerformGestures="true" />
`
  },
  {
    name: 'build.gradle.kts',
    path: 'app/build.gradle.kts',
    language: 'groovy',
    description: 'Pixel 6a (Android 12〜15) 向け Gradle ビルド設定',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.example.pixelclearall"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.pixelclearall"
        minSdk = 29 // Android 10以上 (Pixel 6aは初期Android 12)
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
}
`
  }
];
