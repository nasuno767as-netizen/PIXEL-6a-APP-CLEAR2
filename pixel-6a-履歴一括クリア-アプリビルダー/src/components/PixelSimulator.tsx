import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, RefreshCw, Smartphone, Play, Zap, CheckCircle2, 
  Layers, ArrowLeftRight, Clock, Sparkles, ShieldCheck
} from 'lucide-react';
import { RunningApp } from '../types';
import confetti from 'canvas-confetti';

const INITIAL_APPS: RunningApp[] = [
  { id: '1', name: 'Google Chrome', iconName: '🌐', previewColor: 'from-amber-500/20 to-blue-500/20', type: 'Webブラウザ', memoryMb: 340 },
  { id: '2', name: 'YouTube', iconName: '▶️', previewColor: 'from-red-600/20 to-red-950/30', type: '動画再生', memoryMb: 420 },
  { id: '3', name: 'X (Twitter)', iconName: '✖️', previewColor: 'from-slate-700/30 to-slate-900/50', type: 'SNS', memoryMb: 280 },
  { id: '4', name: 'LINE', iconName: '💬', previewColor: 'from-emerald-600/20 to-emerald-950/30', type: 'メッセージ', memoryMb: 195 },
  { id: '5', name: 'カメラ', iconName: '📷', previewColor: 'from-cyan-600/20 to-blue-950/40', type: 'メディア', memoryMb: 310 },
  { id: '6', name: '設定', iconName: '⚙️', previewColor: 'from-indigo-600/20 to-slate-900/40', type: 'システム', memoryMb: 110 },
  { id: '7', name: 'Googleマップ', iconName: '🗺️', previewColor: 'from-green-600/20 to-blue-950/40', type: 'ナビ', memoryMb: 390 },
];

export function PixelSimulator() {
  const [apps, setApps] = useState<RunningApp[]>(INITIAL_APPS);
  const [screen, setScreen] = useState<'home' | 'recents' | 'clearing'>('home');
  const [accessibilityEnabled, setAccessibilityEnabled] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(1); // 1 = latest apps (right), 0 = leftmost ('Clear all' visible)
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [triggerMethod, setTriggerMethod] = useState<'widget' | 'tile' | 'app'>('widget');
  const [logs, setLogs] = useState<{ id: string; time: string; text: string; success?: boolean }[]>([
    { id: 'init', time: '00:00.00', text: 'AccessibilityService 待機中 (Pixel 6a ready)' }
  ]);

  const recentsScrollRef = useRef<HTMLDivElement>(null);

  const addLog = (text: string, success?: boolean) => {
    const now = new Date();
    const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0')}`;
    setLogs((prev) => [{ id: Math.random().toString(), time: timeStr, text, success }, ...prev.slice(0, 19)]);
  };

  const handleResetApps = () => {
    setApps(INITIAL_APPS);
    setScreen('home');
    setScrollPosition(1);
    addLog('アプリ履歴を再設定しました (7件のアクティブアプリ)');
  };

  // ワンタップ自動クリアのシミュレーションシーケンス
  const runAutoClearSequence = async (source: string) => {
    if (isAutoRunning) return;
    if (!accessibilityEnabled) {
      addLog('❌ エラー: ユーザー補助機能がOFFのため自動操作を実行できません', false);
      return;
    }
    if (apps.length === 0) {
      addLog('⚠️ 履歴にアプリが存在しません');
      return;
    }

    setIsAutoRunning(true);
    addLog(`🚀 [${source}] からワンタップ起動: 履歴一括消去開始`);

    // 1. 履歴画面を開く (performGlobalAction(GLOBAL_ACTION_RECENTS))
    addLog('1. performGlobalAction(GLOBAL_ACTION_RECENTS) 発行 ➔ 履歴画面へ遷移');
    setScreen('recents');
    setScrollPosition(1);

    await new Promise((r) => setTimeout(r, 450));

    // 2. 「すべてクリア」ボタンの探索 (まだ右端にいるため見つからない)
    addLog('2. UI探索: "すべてクリア" は現在画面外 (左端に存在)');

    // 3. 左端へ高速フリックジェスチャー (dispatchGesture)
    addLog('3. dispatchGesture: 右へ高速フリックを実行して左端へスクロール');
    setScrollPosition(0);

    await new Promise((r) => setTimeout(r, 500));

    // 4. 「すべてクリア」ボタンの自動タップ
    addLog('4. findAccessibilityNodeInfosByText("すべてクリア") ➔ performAction(CLICK) 成功！', true);
    
    // 消去エフェクト
    await new Promise((r) => setTimeout(r, 350));
    setApps([]);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // safe fallback
    }

    addLog('5. すべてのタスクスタックを全消去完了 🧹');

    // 5. ホーム画面へ復帰 (performGlobalAction(GLOBAL_ACTION_HOME))
    await new Promise((r) => setTimeout(r, 450));
    addLog('6. performGlobalAction(GLOBAL_ACTION_HOME) ➔ ホーム画面に復帰');
    setScreen('home');
    setIsAutoRunning(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* 左側: Pixel 6a リアルフレーム */}
      <div className="lg:col-span-6 flex flex-col items-center">
        {/* Pixel 6a Frame */}
        <div className="relative w-[340px] sm:w-[360px] h-[720px] bg-slate-950 rounded-[44px] p-3 shadow-2xl ring-1 ring-slate-700 shadow-emerald-950/20 border-4 border-slate-800 flex flex-col">
          {/* Pixel 6a Top Speaker & Camera Punchhole */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 pointer-events-none">
            <div className="w-4 h-4 rounded-full bg-black ring-1 ring-slate-800/60 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            </div>
          </div>

          {/* Screen Container */}
          <div className="relative flex-1 w-full bg-slate-900 rounded-[34px] overflow-hidden flex flex-col select-none border border-slate-800">
            {/* Status Bar */}
            <div className="h-9 px-6 flex items-center justify-between text-[11px] font-medium text-slate-300 z-20 bg-slate-900/40 backdrop-blur-sm">
              <span>09:41</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-400 font-bold">5G</span>
                <span>📶</span>
                <span>89%</span>
              </div>
            </div>

            {/* Screen Content Area */}
            <div className="relative flex-1 flex flex-col overflow-hidden">
              <AnimatePresence mode="wait">
                {screen === 'home' && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.04 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 flex flex-col justify-between p-5 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950"
                  >
                    {/* Google Widget Bar & Clock */}
                    <div>
                      <div className="mt-4 text-center">
                        <div className="text-4xl font-light text-slate-100 tracking-tight">09:41</div>
                        <div className="text-xs text-slate-400 mt-1">火曜日, 9月1日 • 26°C 晴れ</div>
                      </div>

                      {/* ホーム画面の「履歴全消去」ウィジェット */}
                      <div className="mt-8 bg-slate-800/80 border border-slate-700/70 rounded-2xl p-3 shadow-md backdrop-blur-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md">
                              <Trash2 className="w-5 h-5 font-bold" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-100">履歴全消去 1-Tap</div>
                              <div className="text-[10px] text-slate-400">
                                {apps.length > 0 ? `${apps.length}個のアプリが起動中` : '履歴は空です'}
                              </div>
                            </div>
                          </div>
                          <button
                            id="pixel-widget-trigger-btn"
                            disabled={isAutoRunning}
                            onClick={() => runAutoClearSequence('ホームウィジェット')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
                          >
                            消去
                          </button>
                        </div>
                      </div>

                      {/* クイック通知バーのトグル（モック表示） */}
                      <div className="mt-3 bg-slate-800/40 border border-slate-700/40 rounded-xl p-2.5 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">クイック設定タイルから実行:</span>
                        <button
                          id="pixel-tile-trigger-btn"
                          disabled={isAutoRunning}
                          onClick={() => runAutoClearSequence('クイック設定タイル')}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-emerald-400 text-[11px] font-semibold transition active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                          <Zap className="w-3 h-3" />
                          <span>全消去タイル</span>
                        </button>
                      </div>
                    </div>

                    {/* App Grid on Home */}
                    <div>
                      <div className="grid grid-cols-4 gap-3 text-center mb-6">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-11 h-11 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-lg shadow-sm">
                            🌐
                          </div>
                          <span className="text-[10px] text-slate-300">Chrome</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-11 h-11 rounded-2xl bg-red-600/30 border border-red-500/40 flex items-center justify-center text-lg shadow-sm">
                            ▶️
                          </div>
                          <span className="text-[10px] text-slate-300">YouTube</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-11 h-11 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-lg shadow-sm">
                            💬
                          </div>
                          <span className="text-[10px] text-slate-300">LINE</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-11 h-11 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-lg shadow-sm">
                            ⚙️
                          </div>
                          <span className="text-[10px] text-slate-300">設定</span>
                        </div>
                      </div>

                      {/* Search Bar at bottom (Pixel Launcher style) */}
                      <div className="h-11 rounded-full bg-slate-800/80 border border-slate-700/60 px-4 flex items-center justify-between text-xs text-slate-400 shadow-inner">
                        <span className="flex items-center gap-2">
                          <span className="font-bold text-slate-200">G</span> アプリや連絡先を検索
                        </span>
                        <span>🎙️</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {screen === 'recents' && (
                  <motion.div
                    key="recents"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 flex flex-col justify-between py-4 bg-slate-950/95"
                  >
                    {/* Recents App Carousel */}
                    <div className="text-center pt-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        最近使ったアプリ (Overview)
                      </span>
                    </div>

                    <div
                      ref={recentsScrollRef}
                      className="relative w-full h-[360px] overflow-hidden flex items-center"
                    >
                      {apps.length === 0 ? (
                        <div className="w-full text-center px-6">
                          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                            <CheckCircle2 className="w-8 h-8" />
                          </div>
                          <div className="text-sm font-bold text-slate-200">最近使った項目はありません</div>
                          <div className="text-xs text-slate-500 mt-1">履歴はすべてクリアされました</div>
                        </div>
                      ) : (
                        <motion.div
                          animate={{
                            x: scrollPosition === 1 ? -160 : 20,
                          }}
                          transition={{ type: 'spring', stiffness: 220, damping: 25 }}
                          className="flex items-center gap-4 px-6 min-w-max"
                        >
                          {/* 左端に配置された「すべてクリア」ボタン (Pixel標準の配置) */}
                          <motion.button
                            id="pixel-clear-all-native-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              addLog('手動タップ: 「すべてクリア」をクリック');
                              setApps([]);
                              setTimeout(() => setScreen('home'), 400);
                            }}
                            className="w-32 h-44 rounded-2xl border-2 border-dashed border-emerald-400/50 bg-emerald-500/10 hover:bg-emerald-500/20 flex flex-col items-center justify-center gap-2 text-emerald-300 font-bold text-xs p-3 transition shadow-lg cursor-pointer"
                          >
                            <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                              <Trash2 className="w-5 h-5" />
                            </div>
                            <span>すべてクリア</span>
                            <span className="text-[10px] font-normal text-emerald-400/70">Clear all</span>
                          </motion.button>

                          {/* アプリカード一覧 */}
                          {apps.map((app, idx) => (
                            <div
                              key={app.id}
                              className="w-48 h-64 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-xl flex flex-col overflow-hidden relative"
                            >
                              <div className="px-3 py-2 border-b border-slate-800 bg-slate-800/60 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5">
                                  <span>{app.iconName}</span>
                                  <span className="font-semibold text-slate-200 truncate max-w-[100px]">
                                    {app.name}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400">{app.memoryMb}MB</span>
                              </div>
                              <div className={`flex-1 bg-gradient-to-br ${app.previewColor} flex flex-col items-center justify-center p-3 text-center`}>
                                <span className="text-3xl mb-2">{app.iconName}</span>
                                <span className="text-xs text-slate-300 font-medium">{app.name}</span>
                                <span className="text-[10px] text-slate-500 mt-1">{app.type}</span>
                              </div>
                              <div className="p-2 bg-slate-900/90 border-t border-slate-800 flex items-center justify-around text-[10px] text-slate-400">
                                <span>スクリーンショット</span>
                                <span>分割画面</span>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>

                    {/* 下部ボタン */}
                    <div className="flex items-center justify-center gap-2 px-6">
                      <button
                        onClick={() => setScrollPosition((p) => (p === 1 ? 0 : 1))}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                        <span>{scrollPosition === 1 ? '← 左端（すべてクリア）へ' : '最新アプリへ →'}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Android Navigation Bar (Gesture Pill) */}
            <div className="h-6 flex items-center justify-center bg-slate-950 z-20">
              <button
                id="gesture-bar-btn"
                onClick={() => setScreen((s) => (s === 'home' ? 'recents' : 'home'))}
                title="タップでホーム / 履歴画面をトグル"
                className="w-28 h-1 bg-slate-500 hover:bg-slate-300 rounded-full cursor-pointer transition"
              />
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 mt-3 text-center">
          💡 画面下部の白いバーをタップすると手動で「履歴画面」と「ホーム」を切り替えられます
        </div>
      </div>

      {/* 右側: コントロールパネル & 実行ログ */}
      <div className="lg:col-span-6 space-y-4">
        {/* ステータスカード */}
        <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-100">ユーザー補助サービス (AccessibilityService)</h2>
                <span className="text-xs text-slate-400">Pixel 6a 実機権限ステータス</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={accessibilityEnabled}
                onChange={(e) => {
                  setAccessibilityEnabled(e.target.checked);
                  addLog(e.target.checked ? 'ユーザー補助を有効化しました' : 'ユーザー補助を無効化しました');
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">現在起動中の履歴:</span>
              <span className="text-sm font-bold text-slate-200">{apps.length} アプリ</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">ターゲットOS:</span>
              <span className="text-sm font-bold text-emerald-400">Pixel 6a (Android 14)</span>
            </div>
          </div>
        </div>

        {/* 実行テストボタン群 */}
        <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 shadow-md space-y-3">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>ワンタップ全消去の動作テスト</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pixel 6aで「すべてクリア」が一番左端に配置されているため、ユーザー補助サービスが自動で
            <strong className="text-slate-200">「履歴展開 ➔ 高速フリック ➔ ボタン自動タップ ➔ ホーム復帰」</strong>
            を瞬時に行います。
          </p>

          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              id="test-run-btn"
              disabled={isAutoRunning}
              onClick={() => runAutoClearSequence('シミュレータテスト')}
              className="flex-1 min-w-[180px] py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide transition shadow-lg shadow-emerald-500/20 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{isAutoRunning ? '自動消去実行中...' : '一発全消去を実行'}</span>
            </button>

            <button
              id="test-reset-btn"
              onClick={handleResetApps}
              className="py-2.5 px-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>履歴を復元</span>
            </button>
          </div>
        </div>

        {/* リアルタイム実行ログ */}
        <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Accessibility 実行イベントログ</span>
            </h2>
            <button
              onClick={() => setLogs([])}
              className="text-[11px] text-slate-400 hover:text-slate-200"
            >
              クリア
            </button>
          </div>

          <div className="h-44 overflow-y-auto font-mono text-[11px] space-y-1.5 pr-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
            {logs.length === 0 ? (
              <div className="text-slate-600 text-center py-8">イベントログはありません</div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className={`leading-tight flex items-start gap-2 ${
                    log.success ? 'text-emerald-400' : 'text-slate-300'
                  }`}
                >
                  <span className="text-slate-500 shrink-0">[{log.time}]</span>
                  <span>{log.text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
