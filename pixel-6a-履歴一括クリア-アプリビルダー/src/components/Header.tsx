import { Smartphone, Download, Code2, PlayCircle, Zap, ShieldCheck } from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onDownloadZip: () => void;
  isDownloading: boolean;
}

export function Header({ activeTab, setActiveTab, onDownloadZip, isDownloading }: HeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
            <Smartphone className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-100 tracking-tight">
                Pixel 6a 履歴一括全消去
              </h1>
              <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Pixel 6a / Android 13-15
              </span>
            </div>
            <p className="text-xs text-slate-400">
              AccessibilityService によるワンタップ全消去の実装コード＆実機シミュレーター
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="download-zip-btn"
            onClick={onDownloadZip}
            disabled={isDownloading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs tracking-wide transition shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'ZIP作成中...' : 'Android StudioプロジェクトZIP'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto no-scrollbar gap-1 border-t border-slate-800/80">
        <button
          id="tab-install"
          onClick={() => setActiveTab('install')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'install'
              ? 'border-emerald-400 text-emerald-300 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">📱 スマホへのインストール手順</span>
        </button>

        <button
          id="tab-simulator"
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'simulator'
              ? 'border-emerald-400 text-emerald-300 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <PlayCircle className="w-4 h-4" />
          <span>Pixel 6a 動作シミュレーター</span>
        </button>

        <button
          id="tab-code"
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'code'
              ? 'border-emerald-400 text-emerald-300 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Kotlin アプリソースコード (全ファイル)</span>
        </button>

        <button
          id="tab-macrodroid"
          onClick={() => setActiveTab('macrodroid')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'macrodroid'
              ? 'border-emerald-400 text-emerald-300 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>ノーコード即時導入 (MacroDroid / ADB)</span>
        </button>

        <button
          id="tab-architecture"
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === 'architecture'
              ? 'border-emerald-400 text-emerald-300 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>技術仕様・OS制限と仕組み解説</span>
        </button>
      </div>
    </header>
  );
}
