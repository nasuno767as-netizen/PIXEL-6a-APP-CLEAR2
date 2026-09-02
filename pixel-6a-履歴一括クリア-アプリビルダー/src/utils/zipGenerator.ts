import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';

export async function generateAndroidProjectZip(): Promise<Blob> {
  const zip = new JSZip();
  const rootDir = 'PixelClearAll-AndroidStudio';

  // 1. 各ソースファイル
  for (const file of ANDROID_PROJECT_FILES) {
    zip.file(`${rootDir}/${file.path}`, file.content);
  }

  // 2. 追加の必須リソースファイル (XML layouts, strings, values)
  zip.file(
    `${rootDir}/app/src/main/res/layout/activity_main.xml`,
    `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:gravity="center"
    android:padding="24dp"
    android:background="#0F172A">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Pixel 6a 履歴一括クリア"
        android:textSize="22sp"
        android:textStyle="bold"
        android:textColor="#F8FAFC"
        android:layout_marginBottom="16dp" />

    <TextView
        android:id="@+id/statusText"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="ステータス: 確認中..."
        android:textSize="15sp"
        android:textColor="#94A3B8"
        android:layout_marginBottom="32dp" />

    <Button
        android:id="@+id/permissionBtn"
        android:layout_width="match_parent"
        android:layout_height="56dp"
        android:text="ユーザー補助を有効にする"
        android:backgroundTint="#3B82F6"
        android:layout_marginBottom="16dp" />

    <Button
        android:id="@+id/executeBtn"
        android:layout_width="match_parent"
        android:layout_height="56dp"
        android:text="今すぐ履歴を一括全消去 (テスト)"
        android:backgroundTint="#10B981" />

</LinearLayout>`
  );

  zip.file(
    `${rootDir}/app/src/main/res/values/strings.xml`,
    `<resources>
    <string name="app_name">Pixel 履歴全消去</string>
    <string name="accessibility_service_desc">Pixel 6aの最近使ったアプリ履歴画面を自動検知し、「すべてクリア」を自動実行します。</string>
</resources>`
  );

  zip.file(
    `${rootDir}/app/src/main/res/xml/widget_clear_all_info.xml`,
    `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="40dp"
    android:minHeight="40dp"
    android:targetCellWidth="1"
    android:targetCellHeight="1"
    android:updatePeriodMillis="0"
    android:initialLayout="@layout/widget_clear_all"
    android:resizeMode="none"
    android:widgetCategory="home_screen" />`
  );

  zip.file(
    `${rootDir}/app/src/main/res/layout/widget_clear_all.xml`,
    `<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/widget_button"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@android:drawable/btn_default">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:text="🧹消去"
        android:textSize="12sp"
        android:textColor="#FFFFFF" />
</FrameLayout>`
  );

  // 3. ルートプロジェクト設定
  zip.file(
    `${rootDir}/settings.gradle.kts`,
    `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "PixelClearAll"
include(":app")
`
  );

  zip.file(
    `${rootDir}/build.gradle.kts`,
    `plugins {
    id("com.android.application") version "8.5.2" apply false
    id("org.jetbrains.kotlin.android") version "1.9.24" apply false
}
`
  );

  zip.file(
    `${rootDir}/gradle.properties`,
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
kotlin.code.style=official
`
  );

  zip.file(
    `${rootDir}/README.md`,
    `# Pixel 6a 履歴一括クリア アプリ (Kotlin / Android Studio)

## ビルド＆インストール手順
1. Android Studioを開き、「Open」からこのフォルダ（PixelClearAll-AndroidStudio）を選択します。
2. Pixel 6a をUSB接続（またはワイヤレスデバッグ）して「Run」を実行します。
3. インストール後、アプリを開いて「ユーザー補助を有効にする」をタップし、一覧から「Pixel 履歴全消去」をONにします。
4. ホーム画面にウィジェットを置くか、通知パネル（クイック設定）に「履歴全消去」タイルを追加すれば、いつでも1タップで全消去可能です！
`
  );

  return await zip.generateAsync({ type: 'blob' });
}
