import { useState } from 'react';
import { 
  Download, Laptop, Smartphone, CheckCircle2, AlertTriangle, 
  Settings, Key, ExternalLink, ArrowRight, ShieldAlert, Sparkles, HelpCircle 
} from 'lucide-react';

interface InstallGuideProps {
  onDownloadZip: () => void;
  isDownloading: boolean;
  onGoToMacroDroid: () => void;
}

export function InstallGuide({ onDownloadZip, isDownloading, onGoToMacroDroid }: InstallGuideProps) {
  const [selectedMethod, setSelectedMethod] = useState<'pc' | 'phone'>('phone');

  return (
    <div className="space-y-6">
      {/* 方式選択タブ */}
      <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row gap-1.5">
        <button
          onClick={() => setSelectedMethod('phone')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            selectedMethod === 'phone'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>【おすすめ】スマホ単体で3分導入（PC不要・MacroDroid方式）</span>
        </button>

        <button
          onClick={() => setSelectedMethod('pc')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            selectedMethod === 'pc'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Laptop className="w-4 h-4" />
          <span>【本格派】Android StudioでAPKを自作ビルドして入れる（PC要）</span>
        </button>
      </div>

      {/* 方式1: スマホ単体（MacroDroid） */}
      {selectedMethod === 'phone' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-900 border border-emerald-500/30">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-100">
                  PCやプログラミング環境がなくても、スマホ単体で今すぐ動かせます
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Androidのセキュリティ仕様上、自作アプリを動かすにはパソコンでAPKファイルをビルドしてインストールする必要があります。
                  しかし、Google Play公認アプリ「MacroDroid」を使えば、
                  <strong className="text-emerald-400"> このアプリと全く同じ「ユーザー補助機能による一発全消去」がスマホ単体で3分で完成</strong>します。
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              手順（所要時間: 約3分）
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
                <div>
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mb-2">
                    1
                  </div>
                  <h5 className="text-xs font-bold text-slate-200">MacroDroidをインストール</h5>
                  <p className="text-xs text-slate-400 mt-1">
                    Pixel 6aでGoogle Playストアを開き、「MacroDroid」と検索してインストールします（無料）。
                  </p>
                </div>
                <span className="text-[11px] text-slate-500">
                  ※ 初回起動時に「ユーザー補助」の権限をONにします
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
                <div>
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mb-2">
                    2
                  </div>
                  <h5 className="text-xs font-bold text-slate-200">全消去マクロを1本作る</h5>
                  <p className="text-xs text-slate-400 mt-1">
                    トリガーに「ウィジェット」、アクションに「最近使ったアプリ」➔「待機0.3秒」➔「すべてクリアをクリック」を設定します。
                  </p>
                </div>
                <button
                  onClick={onGoToMacroDroid}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>詳しい設定レシピを見る</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
                <div>
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mb-2">
                    3
                  </div>
                  <h5 className="text-xs font-bold text-slate-200">ホーム画面に配置して完成</h5>
                  <p className="text-xs text-slate-400 mt-1">
                    Pixel 6aのホーム画面を長押し ➔ ウィジェット ➔ MacroDroidショートカットを選び、作成したマクロを指定します。
                  </p>
                </div>
                <span className="text-[11px] text-emerald-400/80 font-medium">
                  🎉 1タップで全消去できるようになります！
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 方式2: Android Studioでビルド（PC要） */}
      {selectedMethod === 'pc' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Laptop className="w-4 h-4 text-emerald-400" />
                <span>PCを使用したAndroid Studioでのインストール手順</span>
              </h3>
              <button
                onClick={onDownloadZip}
                disabled={isDownloading}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isDownloading ? '作成中...' : 'プロジェクトZIPをDL'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              この画面で提供している完全なソースコード（ZIP）は、Android公式の開発ツール「Android Studio」で直接開いてビルドできる構成になっています。
            </p>
          </div>

          {/* ステップ一覧 */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200">プロジェクトZIPをPCに保存して解凍する</h4>
                <p className="text-xs text-slate-400">
                  右上の「Android StudioプロジェクトZIP」ボタンを押してダウンロードし、PC上でzipファイルを解凍（展開）します。
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200">Android Studio でフォルダを開く</h4>
                <p className="text-xs text-slate-400">
                  PCで <a href="https://developer.android.com/studio" target="_blank" rel="noreferrer" className="text-emerald-400 underline">Android Studio</a>（無料）を起動し、
                  <strong>「Open」</strong> から解凍したフォルダ（<code>PixelClearAll-AndroidStudio</code>）を選択します。自動的にGradleの同期が始まります。
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200">Pixel 6a の「USBデバッグ」をONにして接続</h4>
                <p className="text-xs text-slate-400">
                  Pixel 6aの「設定」➔「デバイス情報」➔一番下の「ビルド番号」を<strong>7回連続タップ</strong>して開発者向けオプションを解放します。<br />
                  その後、「設定」➔「システム」➔「開発者向けオプション」➔<strong>「USBデバッグ」をON</strong>にして、USBケーブルでPCに接続します。
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">
                4
              </span>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200">Android Studio の「Run (▶)」ボタンをクリック</h4>
                <p className="text-xs text-slate-400">
                  上部ツールバーで接続した「Google Pixel 6a」が選択されているのを確認し、緑の再生マーク（Run）を押します。自動でビルドされ、スマホにアプリがインストール＆起動します。
                </p>
              </div>
            </div>

            {/* Android 13/14/15 制限付き設定の超重要回避策 */}
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-amber-300">
                  【Pixel 6a / Android 13〜15の重要注意点】「制限付き設定」の解除方法
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  自作アプリで「ユーザー補助」をONにしようとした際、Pixelでは画面に
                  <strong className="text-rose-400">「制限付き設定 - ユーザーを保護するため、この設定は現在使用できません」</strong>
                  と表示されてトグルが押せない場合があります。これはAndroidのセキュリティ保護による仕様です。
                </p>
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <div className="font-semibold text-emerald-400">解除する手順:</div>
                  <div>1. Pixel 6aのホーム画面でインストールされたアプリのアイコンを<strong>長押し</strong> ➔ 「アプリ情報 (ⓘ)」をタップ</div>
                  <div>2. 画面右上にある<strong>「︙（3点メニュー）」</strong>をタップ</div>
                  <div>3. <strong>「制限付き設定を許可」</strong>をタップして、指紋またはPINで承認</div>
                  <div>4. 再びアプリに戻り、「ユーザー補助を有効にする」を開くとONにできるようになります！</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">
                5
              </span>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200">ホーム画面にウィジェットを配置</h4>
                <p className="text-xs text-slate-400">
                  ホーム画面の空いている場所を長押し ➔「ウィジェット」➔「Pixel 履歴全消去」を選んでホームに置きます。
                  これでいつでも1タップで全消去できるようになります！
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
