/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { InstallGuide } from './components/InstallGuide';
import { PixelSimulator } from './components/PixelSimulator';
import { CodeViewer } from './components/CodeViewer';
import { QuickSetupGuide } from './components/QuickSetupGuide';
import { TechnicalExplainer } from './components/TechnicalExplainer';
import { TabType } from './types';
import { generateAndroidProjectZip } from './utils/zipGenerator';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('install');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateAndroidProjectZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Pixel6a_ClearAllApp_AndroidStudio.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.2 }
        });
      } catch {
        // safe fallback
      }
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('ZIP生成エラー:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadZip={handleDownloadZip}
        isDownloading={isDownloading}
      />

      {/* ダウンロード完了トースト */}
      {downloadSuccess && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-2xl flex items-center gap-2.5 animate-bounce">
          <span>📦</span>
          <span>Android Studio用プロジェクトZIPのダウンロードが完了しました！</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'install' && (
          <InstallGuide
            onDownloadZip={handleDownloadZip}
            isDownloading={isDownloading}
            onGoToMacroDroid={() => setActiveTab('macrodroid')}
          />
        )}
        {activeTab === 'simulator' && <PixelSimulator />}
        {activeTab === 'code' && (
          <CodeViewer onDownloadZip={handleDownloadZip} isDownloading={isDownloading} />
        )}
        {activeTab === 'macrodroid' && <QuickSetupGuide />}
        {activeTab === 'architecture' && <TechnicalExplainer />}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          Pixel 6a (Android 13 / 14 / 15) 専用 ユーザー補助自動消去ソリューション • Android Studio Kotlin ソースコード生成
        </div>
      </footer>
    </div>
  );
}

