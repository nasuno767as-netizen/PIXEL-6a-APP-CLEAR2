import { useState } from 'react';
import { Copy, Check, FileCode, FolderGit2, Download, Info } from 'lucide-react';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';
import { ProjectFile } from '../types';

interface CodeViewerProps {
  onDownloadZip: () => void;
  isDownloading: boolean;
}

export function CodeViewer({ onDownloadZip, isDownloading }: CodeViewerProps) {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(ANDROID_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 説明バナー */}
      <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Android Studioにそのまま貼り付け／開ける完全実装コード
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Pixel 6a（Pixel Launcher `com.google.android.apps.nexuslauncher`）のUIノード構造とジェスチャーAPIに最適化されています。
            </p>
          </div>
        </div>
        <button
          id="code-viewer-download-zip-btn"
          onClick={onDownloadZip}
          disabled={isDownloading}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-md shadow-emerald-500/20 shrink-0 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? '生成中...' : 'プロジェクト一式をZIP保存'}</span>
        </button>
      </div>

      {/* ファイルツリー ＆ コードエディタ表示 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        {/* 左側: ファイルリスト */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/60 p-3 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2 flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-emerald-400" />
            <span>プロジェクトファイル一覧</span>
          </div>

          <div className="space-y-1">
            {ANDROID_PROJECT_FILES.map((file) => {
              const isSelected = selectedFile.name === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase shrink-0">{file.language}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <span className="font-semibold text-slate-200 block">💡 ビルド方法</span>
            <p>1. ZIPをダウンロードして展開</p>
            <p>2. Android Studioで開く</p>
            <p>3. Pixel 6aを接続して実行 (Run)</p>
          </div>
        </div>

        {/* 右側: コード本文 */}
        <div className="lg:col-span-8 flex flex-col bg-slate-950">
          {/* コードヘッダー */}
          <div className="p-3.5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-slate-200">{selectedFile.path}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</p>
            </div>

            <button
              id="copy-code-btn"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">コピー完了</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>コードをコピー</span>
                </>
              )}
            </button>
          </div>

          {/* コード本文 */}
          <div className="p-4 overflow-x-auto max-h-[580px] font-mono text-xs text-slate-300 leading-relaxed bg-slate-950">
            <pre>
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
