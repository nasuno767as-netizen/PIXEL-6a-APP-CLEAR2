import { ShieldAlert, Cpu, CheckCircle2, HelpCircle, AlertTriangle, Lightbulb } from 'lucide-react';

export function TechnicalExplainer() {
  return (
    <div className="space-y-6">
      {/* 疑問1: なぜ普通のアプリでは消去できないのか */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2.5 text-amber-400">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-sm font-bold text-slate-100">
            Android OSのセキュリティ仕様：なぜ一般的なAPIで履歴全消去ができないのか？
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          GoogleはAndroidのセキュリティ保護のため、**アプリ間が互いに干渉できないサンドボックス構造**を徹底しています。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="font-bold text-rose-400 block mb-1">❌ 一般アプリに禁止されていること</span>
            <ul className="space-y-1 text-slate-400">
              <li>• 他アプリの履歴タスク削除 (<code className="text-slate-300">ActivityTaskManager.removeTask</code> 等)</li>
              <li>• システム署名が必要な特権権限 (<code className="text-slate-300">MANAGE_ACTIVITY_TASKS</code>)</li>
              <li>• バックグラウンドから勝手に画面を閉じること</li>
            </ul>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="font-bold text-emerald-400 block mb-1">✅ ユーザー補助（AccessibilityService）なら可能な理由</span>
            <ul className="space-y-1 text-slate-400">
              <li>• OS公認のユーザー支援機能として「画面の閲覧と操作の代行」が許可される</li>
              <li>• 人間が指で画面を操作するのと同じように「ボタンを認識してタップ」できる</li>
              <li>• root化や改造を行わずに安全にPixel 6a上で実行可能</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 疑問2: Pixel 6a 特有の注意点 */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2.5 text-cyan-400">
          <Cpu className="w-5 h-5" />
          <h3 className="text-sm font-bold text-slate-100">
            Pixel 6a（Pixel Launcher）の構造とコード実装の肝
          </h3>
        </div>

        <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
          <p>
            Pixel 6aの標準ホームアプリである <strong className="text-slate-100">Pixel Launcher（com.google.android.apps.nexuslauncher）</strong> では、
            「すべてクリア」ボタンがアプリカード群の<strong>一番左端</strong>に隠れて配置されています。
          </p>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>本プロジェクトでの解決策：</span>
            </div>
            <p>
              1. 履歴画面が開いた直後に「すべてクリア」が見つからない場合、<code className="text-cyan-300">dispatchGesture</code> で画面中央を右方向に素早く1回フリック。
            </p>
            <p>
              2. 一番左端までスクロールされた瞬間に <code className="text-cyan-300">findAccessibilityNodeInfosByText("すべてクリア")</code> で検出し即時タップ。
            </p>
            <p>
              3. タップ完了を検知して <code className="text-cyan-300">performGlobalAction(GLOBAL_ACTION_HOME)</code> で自動的にホームへ戻ります。
            </p>
          </div>
        </div>
      </div>

      {/* 疑問3: メモリとバッテリーの真実 */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2.5 text-amber-400">
          <Lightbulb className="w-5 h-5" />
          <h3 className="text-sm font-bold text-slate-100">
            知っておきたい豆知識：履歴全消去はバッテリーに良いのか？
          </h3>
        </div>

        <div className="text-xs text-slate-300 leading-relaxed space-y-2">
          <p>
            Android（Pixel 6a）の最近使ったアプリ履歴に残っているアプリのほとんどは、メモリ上にキャッシュされた「一時停止（Freeze）状態」であり、CPUやバッテリーを消費していません。
          </p>
          <p className="text-slate-400">
            毎回すべて消去すると、次回アプリを起動する際にゼロから読み込む「コールドスタート」となり、かえってCPU負荷と電池消費が増えるケースがあります。
          </p>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 flex items-start gap-2">
            <span className="text-emerald-400 font-bold">推奨される使い方:</span>
            <span>
              「作業を切り替えて画面をすっきり整理したいとき」「人に見られたくない履歴を隠したいとき（プライバシー保護）」「特定のアプリがフリーズしてリセットしたいとき」に使うのが最も効果的です！
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
