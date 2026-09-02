export interface MacroStep {
  title: string;
  category: string;
  detail: string;
  note?: string;
}

export const MACRO_DROID_STEPS: MacroStep[] = [
  {
    category: '1. インストール',
    title: 'Google PlayからMacroDroidを入手',
    detail: 'Pixel 6aでGoogle Playを開き、「MacroDroid - デバイス自動化」をインストールします（無料版で動作可能）。',
    note: '起動時に「ユーザー補助」と「他のアプリの上に重ねて表示」の権限を許可します。'
  },
  {
    category: '2. トリガー設定',
    title: '起動のきっかけを選ぶ',
    detail: '「トリガー」の [+] を押し、以下から好きな方法を選択します：',
    note: '・ウィジェット/ショートカット（ホーム画面に1タップアイコンを配置）\n・クイック設定タイル（通知バーからワンタップ）\n・端末を振る / 音量ボタン長押し'
  },
  {
    category: '3. アクション①',
    title: '最近使ったアプリ（履歴）を開く',
    detail: '「アクション」の [+] ➔ 「端末操作」 ➔ 「ユーザー補助操作」 ➔ 「最近使ったアプリ」 を選択。',
    note: 'Pixel 6aのアプリ履歴画面（Overview）が自動で開きます。'
  },
  {
    category: '4. アクション②',
    title: '待機時間を挿入 (0.3秒)',
    detail: '「アクション」の [+] ➔ 「MacroDroid固有」 ➔ 「待機」 ➔ 「300ミリ秒」 を指定。',
    note: '画面がアニメーション展開するわずかな時間を確保します。'
  },
  {
    category: '5. アクション③',
    title: '「すべてクリア」を自動タップ',
    detail: '「アクション」の [+] ➔ 「端末操作」 ➔ 「UI画面操作」 ➔ 「クリック」 ➔ 「テキスト内容」で『すべてクリア』と入力。',
    note: '※英語設定の場合は『Clear all』。左端に隠れている場合は、直前に「ジェスチャー（右スワイプ）」を1手挟むと100%確実に押せます。'
  },
  {
    category: '6. アクション④',
    title: 'ホーム画面に戻る',
    detail: '「アクション」の [+] ➔ 「端末操作」 ➔ 「ユーザー補助操作」 ➔ 「ホーム」 を選択。',
    note: 'これで消去後、自動で元のホーム画面に戻ります！'
  }
];

export const ADB_COMMANDS = [
  {
    title: 'Pixel 6aの現在の履歴一覧を確認',
    cmd: 'adb shell dumpsys activity recents'
  },
  {
    title: 'バックグラウンドプロセスの一括強制停止（※画面履歴カード自体は残る仕様）',
    cmd: 'adb shell am kill-all'
  },
  {
    title: 'Pixel 6aで「すべてクリア」のキーストローク・タップをADBから送る',
    cmd: 'adb shell input keyevent KEYCODE_APP_SWITCH && sleep 0.5 && adb shell input swipe 200 1200 900 1200 150 && sleep 0.3 && adb shell input tap 150 1400'
  }
];
