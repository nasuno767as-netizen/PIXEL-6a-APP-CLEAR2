import { useState } from 'react';
import { Zap, Terminal, Check, Copy, ExternalLink, Sparkles, Smartphone, ChevronRight } from 'lucide-react';
import { MACRO_DROID_STEPS, ADB_COMMANDS } from '../data/macroGuide';

export function QuickSetupGuide() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* イントロバナー */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-950/40 via-emerald-950/30 to-slate-900 border border-emerald-500/30">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              PC不要！Pixel 6a 単体で今すぐ「一発消去」を実現する裏技
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              自作アプリをAndroid Studioでビルドする環境がない場合でも、Google Playの自動化アプリ「MacroDroid」を使用すれば、
              <strong className="text-emerald-400 font-semibold"> わずか3分でホーム画面に『履歴全消去』アイコンを設置</strong>
              できます。内部的な仕組み（ユーザー補助APIによるUI自動タップ）は専用アプリと全く同じです。
            </p>
          </div>
        </div>
      </div>

      {/* MacroDroid 設定ステップ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>MacroDroid での作成レシピ（全6手順）</span>
          </h4>
          <span className="text-xs text-slate-400">Google Playで無料配布中</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MACRO_DROID_STEPS.map((step, idx) => (
            <div
              key={step.title}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-bold text-emerald-400 block mb-1">
                  {step.category}
                </span>
                <h5 className="text-xs font-bold text-slate-200 mb-1.5">{step.title}</h5>
                <p className="text-xs text-slate-400 leading-relaxed">{step.detail}</p>
              </div>
              {step.note && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-500 whitespace-pre-line">
                  {step.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ADB / 開発者向けコマンド */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>ADB（ワイヤレスデバッグ）から直接叩く場合</span>
          </h4>
          <span className="text-xs text-slate-400">Pixel 6a 開発者向け</span>
        </div>

        <div className="space-y-3">
          {ADB_COMMANDS.map((item) => (
            <div
              key={item.title}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <div className="text-xs font-semibold text-slate-300">{item.title}</div>
                <div className="text-xs font-mono text-cyan-400 mt-1 break-all">{item.cmd}</div>
              </div>
              <button
                onClick={() => handleCopy(item.cmd)}
                className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700 transition shrink-0 cursor-pointer"
              >
                {copiedCmd === item.cmd ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">コピー済み</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>コピー</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
