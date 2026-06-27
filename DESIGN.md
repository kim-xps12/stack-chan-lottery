---
version: alpha
name: Stack-chan Lottery Party
description: "ｽﾀｯｸﾁｬﾝ誕生会2026抽選会アプリのデザインシステム。プロジェクター投影向けの高コントラスト・お祭り感のあるビジュアル。"
colors:
  primary: "#ffd700"
  secondary: "#ee5a24"
  tertiary: "#ff6b6b"
  neutral: "#0f0c29"
  surface: "#1a1a2e"
  on-surface: "#ffffff"
  on-surface-muted: "rgba(255, 255, 255, 0.4)"
  speech-bg: "#ffffff"
  speech-text: "#333333"
  highlight-bg: "rgba(255, 215, 0, 0.2)"
typography:
  headline-display:
    fontFamily: "Hiragino Kaku Gothic ProN, Noto Sans JP, sans-serif"
    fontSize: 2.5rem
    fontWeight: 900
    letterSpacing: 0.15em
  headline-md:
    fontFamily: "Hiragino Kaku Gothic ProN, Noto Sans JP, sans-serif"
    fontSize: 1rem
    fontWeight: 400
    letterSpacing: 0.05em
  body-lg:
    fontFamily: "Hiragino Kaku Gothic ProN, Noto Sans JP, sans-serif"
    fontSize: 2.2rem
    fontWeight: 700
  body-md:
    fontFamily: "Hiragino Kaku Gothic ProN, Noto Sans JP, sans-serif"
    fontSize: 1.1rem
    fontWeight: 400
  label-lg:
    fontFamily: "Hiragino Kaku Gothic ProN, Noto Sans JP, sans-serif"
    fontSize: 2.5rem
    fontWeight: 900
    letterSpacing: 0.2em
  label-digit:
    fontFamily: "Hiragino Kaku Gothic ProN, Noto Sans JP, sans-serif"
    fontSize: 7rem
    fontWeight: 900
  label-sm:
    fontFamily: "Hiragino Kaku Gothic ProN, Noto Sans JP, sans-serif"
    fontSize: 0.9rem
    fontWeight: 400
rounded:
  sm: 6px
  md: 8px
  lg: 16px
  xl: 20px
  full: 50px
spacing:
  xs: 0.3vh
  sm: 0.5vw
  md: 1.5vw
  lg: 3vw
  xl: 5vw
  section-pad: 2vh
components:
  button-primary:
    backgroundColor: "linear-gradient(135deg, {colors.tertiary}, {colors.secondary})"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    padding: 2vh 5vw
  button-primary-disabled:
    backgroundColor: "linear-gradient(135deg, #555, #444)"
  button-reset:
    backgroundColor: "rgba(255, 255, 255, 0.08)"
    textColor: "{colors.on-surface-muted}"
    rounded: "{rounded.sm}"
    padding: 0.3vh 1vw
  button-reset-hover:
    textColor: "{colors.tertiary}"
    backgroundColor: "rgba(255, 107, 107, 0.1)"
  speech-bubble:
    backgroundColor: "{colors.speech-bg}"
    textColor: "{colors.speech-text}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.xl}"
    padding: 1.5vh 2vw
  roulette-slot:
    backgroundColor: "linear-gradient(180deg, {colors.surface}, #16213e, {colors.surface})"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    width: 160px
    height: 200px
  roulette-slot-stopped:
    textColor: "{colors.primary}"
  history-number:
    backgroundColor: "rgba(255, 255, 255, 0.1)"
    textColor: "rgba(255, 255, 255, 0.7)"
    rounded: "{rounded.md}"
    padding: 0.3vh 0.8vw
  history-number-latest:
    backgroundColor: "{colors.highlight-bg}"
    textColor: "{colors.primary}"
---

# Stack-chan Lottery Party Design System

## Overview

ｽﾀｯｸﾁｬﾝ誕生会2026で使用する抽選会アプリのデザインシステム。PC＋プロジェクター投影を主な使用環境とし、暗い会場でも遠くから視認できる高コントラスト設計。お祭り感・ワクワク感を演出するために、ダークな宇宙的背景にゴールドのアクセントカラーを組み合わせたパーティー向けビジュアルを採用。

ブランドパーソナリティは「楽しい・華やか・ドキドキ」。キャラクター（ｽﾀｯｸﾁｬﾝ）が司会進行する形式で、親しみやすさと演出性を両立する。

## Colors

カラーパレットは暗い宇宙的背景に映えるゴールド＋レッドの組み合わせ。プロジェクター投影時のコントラストを最優先に設計。

- **Primary (#ffd700):** ゴールド。タイトル、ハイライト、当選番号など最も重要な情報に使用。祝祭感を象徴する色。
- **Secondary (#ee5a24):** ディープオレンジ。抽選ボタンのグラデーション終点。アクション要素に使用。
- **Tertiary (#ff6b6b):** コーラルレッド。抽選ボタンのグラデーション起点。エネルギッシュな印象を与える。
- **Neutral (#0f0c29):** ディープネイビー。背景グラデーションの基調色。宇宙的な深みを演出。
- **Surface (#1a1a2e):** ダークインディゴ。ルーレットスロットなどの部品背景に使用。
- **On-Surface (#ffffff):** ホワイト。ダーク背景上のすべてのテキストに使用。
- **Speech (#ffffff bg / #333333 text):** 吹き出しは白背景に暗いテキスト。キャラクターの台詞として明確に区別。

紙吹雪アニメーションでは、ゴールド、レッド、ブルー、ピンク、パープルなど8色のバリエーションを使用し、お祝いの華やかさを演出する。

## Typography

日本語環境を前提とし、Hiragino Kaku Gothic ProN を第一候補、Noto Sans JP をフォールバックに指定。すべてのサイズは `clamp()` を使用したレスポンシブ設計で、プロジェクター投影でも視認可能な大きなサイズを基本とする。

- **Display（タイトル）:** 2.5rem / weight 900。ゴールドグラデーションで塗りつぶし、半角カナでレトロ感を表現。
- **Subtitle:** 1rem / weight 400。控えめな透明度で副次情報として表示。
- **Speech Bubble:** 2.2rem / bold。キャラクターの台詞として十分な存在感を確保。
- **Roulette Digit:** 7rem / weight 900。最も大きな文字サイズ。ルーレット演出の主役。
- **Button Label:** 2.5rem / weight 900。letter-spacing 0.2em で堂々とした印象。
- **History:** 1.1rem。控えめなサイズで過去の結果を一覧表示。
- **Meta（残数・ラベル）:** 0.9rem。補助情報として最小サイズ。

## Layout

横長画面（16:9 プロジェクター）に最適化した Flexbox レイアウト。全体を `100vh` に収め、スクロールなしで全情報を表示。

3つのエリアに分割:
1. **ヘッダー:** タイトル＋サブタイトル（上部固定、flex-shrink: 0）
2. **メインエリア:** キャラクター＋吹き出し（左）とルーレット＋ボタン（右）を横並び配置。flex: 1 で残り領域を使用。
3. **フッター:** 抽選履歴＋残数＋リセットボタン（下部固定、min-height: 8vh）

メインエリア内のギャップは 3vw。キャラクター画像は最大 280px 幅。

## Elevation & Depth

フラットデザインを基本としつつ、box-shadow と glow エフェクトで奥行きを表現。

- **ボタン:** `box-shadow: 0 6px 30px rgba(238, 90, 36, 0.5)` でフローティング感を演出。ホバー時に影を拡大。
- **吹き出し:** `box-shadow: 0 4px 20px rgba(0,0,0,0.3)` で浮遊感。
- **ルーレットスロット:** 外側に `box-shadow: 0 0 30px rgba(255, 215, 0, 0.2)` のゴールドグロー、内側に `inset 0 0 30px rgba(0,0,0,0.5)` で凹み感。
- **キャラクター画像:** `drop-shadow(0 0 20px rgba(100, 200, 255, 0.4))` で幻想的な発光。
- **結果確定時:** ゴールドの radial-gradient フラッシュでハイライト演出。

## Shapes

全体的に丸みを帯びた形状で親しみやすさを表現。角丸サイズはコンポーネントの重要度に比例。

- **ボタン:** 50px radius（完全なピル型）。最も目立つインタラクティブ要素。
- **吹き出し:** 20px radius。キャラクターの台詞らしい柔らかさ。
- **ルーレットスロット:** 16px radius。機械的な印象と丸みのバランス。
- **履歴番号:** 8px radius。コンパクトなタグ型。
- **リセットボタン:** 6px radius。最小限の丸み。

## Components

### 抽選ボタン
メイン CTA。コーラルレッドからディープオレンジへのグラデーション背景。ピル型。ホバー時に上方に 3px 浮上し、影が拡大する。抽選中は無効化され、グレーに変化。letter-spacing 0.2em で「抽 選 ！」のテキストに堂々とした存在感を持たせる。

### ルーレットスロット
3つ並び（100の位・10の位・1の位）。ダークインディゴ背景にゴールドのボーダー。上下にグラデーションのフェードマスクを適用し、中央の数字だけが明瞭に見える演出。停止時にアクティブな数字がゴールドに変化し、中央にゴールドのハイライトバーが表示される。

### 吹き出し
キャラクターの上に配置。白背景にダークテキスト。下部に三角形の吹き出しポインター。状態に応じてメッセージが変化（待機→抽選中→結果発表→出尽くし）。

### 履歴番号タグ
flex-wrap で横並び。各番号は半透明背景のタグ型。最新の番号（:first-child）のみゴールド系でハイライト。max-height 制限とoverflow-y: auto でスクロール対応。

### リセットボタン
画面右下に配置。目立たないデザイン（半透明背景、細ボーダー）。ホバー時にレッド系に変化し、破壊的操作であることを暗示。

## Do's and Don'ts

- Do: 全てのテキストサイズに `clamp()` を使用し、異なる画面サイズに対応する
- Do: ゴールド（#ffd700）は重要な情報やハイライトにのみ使用する
- Do: 抽選中はボタンを無効化し、連打を防止する
- Do: 結果確定時には複数の演出（紙吹雪・フラッシュ・ファンファーレ）を組み合わせて祝祭感を最大化する
- Don't: 外部 CDN やフォントファイルに依存しない（単一 HTML ファイル完結）
- Don't: 横スクロールが発生するレイアウトにしない
- Don't: キャラクター画像の白背景を透過加工しない（そのまま使用）
- Don't: 効果音に外部音声ファイルを使用しない（Web Audio API で合成）
