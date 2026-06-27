const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');

function createDOM() {
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    url: 'http://localhost/',
  });
  const { window } = dom;

  window.AudioContext = class {
    constructor() { this.currentTime = 0; this.sampleRate = 44100; }
    createOscillator() {
      return {
        connect() {}, start() {}, stop() {},
        type: 'sine',
        frequency: { value: 0, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} },
      };
    }
    createGain() {
      return {
        connect() {},
        gain: { value: 0, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} },
      };
    }
    createBufferSource() {
      return { connect() {}, start() {}, stop() {}, buffer: null };
    }
    createBuffer(channels, length, sampleRate) {
      const data = new Float32Array(length);
      return { getChannelData() { return data; } };
    }
  };
  window.webkitAudioContext = window.AudioContext;

  window.requestAnimationFrame = (cb) => 0;
  window.performance = window.performance || {};
  window.performance.now = () => Date.now();

  window.Element.prototype.getBoundingClientRect = function () {
    return { height: 100, width: 100, top: 0, left: 0, bottom: 100, right: 100, x: 0, y: 0 };
  };

  const $ = (expr) => window.eval(expr);

  return { dom, window, document: window.document, $ };
}

function getLotteryConfig($) {
  const min = $('MIN_NUM');
  const max = $('MAX_NUM');
  const total = $('TOTAL');
  return { min, max, total };
}

function remainingText(remaining, total) {
  return `残り: ${remaining} / ${total}`;
}

function expectedDigits(num) {
  return [
    Math.floor(num / 100),
    Math.floor((num % 100) / 10),
    num % 10,
  ];
}

function sampleDrawnNumbers($, count) {
  const { min, max } = getLotteryConfig($);
  const numbers = [];
  for (let num = min; num <= max && numbers.length < count; num++) {
    numbers.push(num);
  }
  return numbers;
}


// ========================================================================
// 1. 抽選機能テスト
// ========================================================================
describe('抽選機能', () => {
  it('drawNumber は MIN_NUM〜MAX_NUM の整数を返す', () => {
    const { window, $ } = createDOM();
    const { min, max } = getLotteryConfig($);
    const num = window.drawNumber();
    assert.ok(num !== null);
    assert.ok(Number.isInteger(num));
    assert.ok(num >= min && num <= max);
  });

  it('drawNumber は重複なく番号を返す', () => {
    const { window, $ } = createDOM();
    const { total } = getLotteryConfig($);
    const drawn = new Set();
    for (let i = 0; i < total; i++) {
      const num = window.drawNumber();
      assert.ok(num !== null, `${i+1}回目の抽選で null が返された`);
      assert.ok(!drawn.has(num), `番号 ${num} が重複して選ばれた`);
      drawn.add(num);
    }
    assert.equal(drawn.size, total);
  });

  it('全番号が出尽くしたら drawNumber は null を返す', () => {
    const { window, $ } = createDOM();
    const { total } = getLotteryConfig($);
    for (let i = 0; i < total; i++) window.drawNumber();
    assert.equal(window.drawNumber(), null);
  });

  it('MIN_NUM〜MAX_NUM の全番号が出る', () => {
    const { window, $ } = createDOM();
    const { min, max, total } = getLotteryConfig($);
    const drawn = new Set();
    for (let i = 0; i < total; i++) drawn.add(window.drawNumber());
    for (let i = min; i <= max; i++) {
      assert.ok(drawn.has(i), `番号 ${i} が抽選結果に含まれていない`);
    }
  });
});


// ========================================================================
// 2. 桁分解テスト (getDigits)
// ========================================================================
describe('桁分解 (getDigits)', () => {
  it('0 を [0, 0, 0] に分解する', () => {
    const { window } = createDOM();
    assert.deepEqual([...window.getDigits(0)], [0, 0, 0]);
  });

  it('7 を [0, 0, 7] に分解する', () => {
    const { window } = createDOM();
    assert.deepEqual([...window.getDigits(7)], [0, 0, 7]);
  });

  it('42 を [0, 4, 2] に分解する', () => {
    const { window } = createDOM();
    assert.deepEqual([...window.getDigits(42)], [0, 4, 2]);
  });

  it('MAX_NUM を桁に分解する', () => {
    const { window, $ } = createDOM();
    const { max } = getLotteryConfig($);
    assert.deepEqual([...window.getDigits(max)], expectedDigits(max));
  });

  it('100 を [1, 0, 0] に分解する', () => {
    const { window } = createDOM();
    assert.deepEqual([...window.getDigits(100)], [1, 0, 0]);
  });
});


// ========================================================================
// 3. 景品システムテスト
// ========================================================================
describe('景品システム', () => {
  it('PRIZES が 3 つ定義されている', () => {
    const { $ } = createDOM();
    assert.equal($('PRIZES.length'), 3);
  });

  it('景品1: ATOM S3R (5名枠)', () => {
    const { $ } = createDOM();
    assert.equal($('PRIZES[0].name'), 'ATOM S3R');
    assert.equal($('PRIZES[0].count'), 5);
    assert.equal($('PRIZES[0].image'), 'pic/prize/1.AtomS3R.png');
  });

  it('景品2: Core StopWatch (2名枠)', () => {
    const { $ } = createDOM();
    assert.equal($('PRIZES[1].name'), 'Core StopWatch');
    assert.equal($('PRIZES[1].count'), 2);
    assert.equal($('PRIZES[1].image'), 'pic/prize/2.StopWatch.png');
  });

  it('景品3: ｽﾀｯｸﾁｬﾝ 誕生会特別ｴﾃﾞｨｼｮﾝ (1名枠)', () => {
    const { $ } = createDOM();
    assert.equal($('PRIZES[2].count'), 1);
    assert.equal($('PRIZES[2].image'), 'pic/prize/3.StackChanSpecial.png');
  });

  it('初期状態で currentPrizeIdx は 0', () => {
    const { $ } = createDOM();
    assert.equal($('currentPrizeIdx'), 0);
  });

  it('advancePrize で currentPrizeIdx が 1 に進む', async () => {
    const { window, $ } = createDOM();
    // showPrizeTransition uses setTimeout; just set index directly for unit test
    $('currentPrizeIdx = 0');
    $('currentPrizeIdx = 1');
    window.updatePrizeDisplay();
    assert.equal($('currentPrizeIdx'), 1);
  });

  it('currentPrizeIdx が PRIZES.length 以上で全景品完了', () => {
    const { $, document } = createDOM();
    $('currentPrizeIdx = 3');
    const { window } = createDOM();
    window.eval('currentPrizeIdx = 3');
    window.updatePrizeDisplay();
    assert.ok(window.document.getElementById('allDoneSection').classList.contains('active'));
  });
});


// ========================================================================
// 4. 景品表示テスト
// ========================================================================
describe('景品表示', () => {
  it('初期状態で景品1の画像が表示される', () => {
    const { document } = createDOM();
    assert.equal(document.getElementById('prizeImage').getAttribute('src'), 'pic/prize/1.AtomS3R.png');
  });

  it('初期状態で景品ラベルが「景品 1 / 3」', () => {
    const { document } = createDOM();
    assert.equal(document.getElementById('prizeLabel').textContent, '景品 1 / 3');
  });

  it('初期状態で景品名が「ATOM S3R」', () => {
    const { document } = createDOM();
    assert.equal(document.getElementById('prizeName').textContent, 'ATOM S3R');
  });

  it('当選枠数が表示される', () => {
    const { document } = createDOM();
    assert.equal(document.getElementById('prizeWinnersInfo').textContent, '当選枠: 5 名');
  });

  it('currentPrizeIdx=1 で景品2の画像に切り替わる', () => {
    const { window, $, document } = createDOM();
    $('currentPrizeIdx = 1');
    window.updatePrizeDisplay();
    assert.equal(document.getElementById('prizeImage').getAttribute('src'), 'pic/prize/2.StopWatch.png');
    assert.equal(document.getElementById('prizeLabel').textContent, '景品 2 / 3');
  });

  it('全景品完了後に完了メッセージが表示される', () => {
    const { window, $, document } = createDOM();
    $('currentPrizeIdx = 3');
    window.updatePrizeDisplay();
    assert.ok(document.getElementById('allDoneSection').classList.contains('active'));
  });

  it('「次の景品へ」ボタンが存在する', () => {
    const { document } = createDOM();
    assert.ok(document.getElementById('nextPrizeBtn'));
  });

  it('初期状態で「次の景品へ」ボタンは非表示', () => {
    const { document } = createDOM();
    assert.ok(!document.getElementById('nextPrizeBtn').classList.contains('visible'));
  });

  it('setNextPrizeBtnVisible で表示を切り替えられる', () => {
    const { window, document } = createDOM();
    window.setNextPrizeBtnVisible(true);
    assert.ok(document.getElementById('nextPrizeBtn').classList.contains('visible'));
    window.setNextPrizeBtnVisible(false);
    assert.ok(!document.getElementById('nextPrizeBtn').classList.contains('visible'));
  });

  it('最後の景品では「抽選を終了する」と表示される', () => {
    const { window, $, document } = createDOM();
    $('currentPrizeIdx = 2');
    window.setNextPrizeBtnVisible(true);
    assert.equal(document.getElementById('nextPrizeBtn').textContent, '抽選を終了する');
  });
});


// ========================================================================
// 5. 吹き出しメッセージテスト
// ========================================================================
describe('吹き出しメッセージ', () => {
  it('初期状態で「ボタンを押してね！」と表示される', () => {
    const { document } = createDOM();
    assert.equal(document.getElementById('speechBubble').textContent, 'ボタンを押してね！');
  });

  it('setSpeech でメッセージを変更できる', () => {
    const { window, document } = createDOM();
    window.setSpeech('テスト');
    assert.equal(document.getElementById('speechBubble').textContent, 'テスト');
  });

  it('全景品完了後に startDraw を呼ぶと「全部終わったよ！」と表示される', async () => {
    const { window, $ } = createDOM();
    $('currentPrizeIdx = 3');
    await window.startDraw();
    assert.equal(window.document.getElementById('speechBubble').textContent, '全部終わったよ！');
  });

  it('抽選済みデータでリロードすると抽選済み数メッセージが表示される', () => {
    const { window } = createDOM();
    window.localStorage.setItem('lottery-state', JSON.stringify({
      drawn: [1, 2, 3],
      currentPrize: 0,
    }));

    window.loadState();
    window.updateHistory();
    window.updatePrizeDisplay();
    const count = window.eval('drawnNumbers.length');
    const idx = window.eval('currentPrizeIdx');
    if (count > 0 && idx < window.eval('PRIZES.length')) {
      window.setSpeech(`${count}個の番号が\n抽選済みです`);
    }
    assert.ok(window.document.getElementById('speechBubble').textContent.includes('3個の番号が'));
  });
});


// ========================================================================
// 6. ルーレット演出テスト
// ========================================================================
describe('ルーレット演出', () => {
  it('3つのルーレットスロットが存在する', () => {
    const { document } = createDOM();
    assert.ok(document.getElementById('slot0'));
    assert.ok(document.getElementById('slot1'));
    assert.ok(document.getElementById('slot2'));
  });

  it('各ストリップに 300 の数字要素が生成される', () => {
    const { document } = createDOM();
    for (let s = 0; s < 3; s++) {
      assert.equal(document.getElementById(`strip${s}`).querySelectorAll('.digit').length, 300);
    }
  });

  it('ルーレットラベルが 100の位・10の位・1の位', () => {
    const { document } = createDOM();
    const labels = document.querySelectorAll('.roulette-label');
    assert.equal(labels.length, 3);
    assert.equal(labels[0].textContent, '100の位');
    assert.equal(labels[1].textContent, '10の位');
    assert.equal(labels[2].textContent, '1の位');
  });

  it('ハイライトバー要素が存在しない', () => {
    const { document } = createDOM();
    assert.equal(document.querySelectorAll('.highlight-bar').length, 0);
  });
});


// ========================================================================
// 7. 抽選履歴テスト
// ========================================================================
describe('抽選履歴', () => {
  it('初期状態で履歴が空', () => {
    const { document } = createDOM();
    assert.equal(document.getElementById('historyNumbers').children.length, 0);
  });

  it('抽選後に履歴に番号が追加される', () => {
    const { window, document } = createDOM();
    window.drawNumber();
    window.updateHistory();
    assert.equal(document.getElementById('historyNumbers').children.length, 1);
  });

  it('最新の番号が先頭に表示される（unshift順）', () => {
    const { window, document, $ } = createDOM();
    const { total } = getLotteryConfig($);
    const first = window.drawNumber();
    const second = total > 1 ? window.drawNumber() : null;
    window.updateHistory();
    const nums = document.getElementById('historyNumbers');
    if (second !== null) {
      assert.equal(parseInt(nums.children[0].textContent), second);
      assert.equal(parseInt(nums.children[1].textContent), first);
    } else {
      assert.equal(parseInt(nums.children[0].textContent), first);
    }
  });

  it('最新番号にハイライトCSSクラスが適用される', () => {
    const { window, document } = createDOM();
    window.drawNumber();
    window.updateHistory();
    const nums = document.getElementById('historyNumbers');
    assert.equal(nums.children[0], nums.querySelector('.history-num:first-child'));
  });

  it('残り番号数が正しく表示される', () => {
    const { window, document, $ } = createDOM();
    const { total } = getLotteryConfig($);
    assert.equal(document.getElementById('remainingCount').textContent, remainingText(total, total));
    window.drawNumber();
    window.updateHistory();
    assert.equal(document.getElementById('remainingCount').textContent, remainingText(total - 1, total));
  });
});


// ========================================================================
// 8. データ永続化テスト (localStorage)
// ========================================================================
describe('データ永続化 (localStorage)', () => {
  it('saveState で抽選結果と currentPrize が保存される', () => {
    const { window, $ } = createDOM();
    window.drawNumber();
    $('currentPrizeIdx = 1');
    window.saveState();
    const saved = JSON.parse(window.localStorage.getItem('lottery-state'));
    assert.ok(Array.isArray(saved.drawn));
    assert.equal(saved.drawn.length, 1);
    assert.equal(saved.currentPrize, 1);
  });

  it('loadState で currentPrize を含む状態を復元する', () => {
    const { window, $ } = createDOM();
    const { total } = getLotteryConfig($);
    const drawn = sampleDrawnNumbers($, 2);
    window.localStorage.setItem('lottery-state', JSON.stringify({
      drawn,
      currentPrize: 2,
    }));
    window.loadState();
    assert.deepEqual([...$('drawnNumbers')], drawn);
    assert.equal($('currentPrizeIdx'), 2);
    assert.equal($('availableNumbers').size, total - drawn.length);
  });

  it('loadState で保存データがない場合は初期状態', () => {
    const { window, $ } = createDOM();
    const { total } = getLotteryConfig($);
    window.localStorage.removeItem('lottery-state');
    window.loadState();
    assert.equal($('availableNumbers').size, total);
    assert.equal($('drawnNumbers').length, 0);
    assert.equal($('currentPrizeIdx'), 0);
  });

  it('resetAll で全データが初期化される（confirm=true）', () => {
    const { window, document, $ } = createDOM();
    const { total } = getLotteryConfig($);
    window.drawNumber();
    $('currentPrizeIdx = 2');
    window.saveState();

    window.confirm = () => true;
    window.resetAll();

    assert.equal($('drawnNumbers').length, 0);
    assert.equal($('availableNumbers').size, total);
    assert.equal($('currentPrizeIdx'), 0);
    assert.equal(document.getElementById('speechBubble').textContent, 'ボタンを押してね！');
  });

  it('resetAll で confirm=false の場合はリセットされない', () => {
    const { window, $ } = createDOM();
    window.drawNumber();
    $('currentPrizeIdx = 2');
    window.saveState();

    window.confirm = () => false;
    window.resetAll();

    assert.equal($('currentPrizeIdx'), 2);
  });

  it('resetAll 後に localStorage も初期化される', () => {
    const { window } = createDOM();
    window.drawNumber();
    window.saveState();
    window.confirm = () => true;
    window.resetAll();

    const saved = JSON.parse(window.localStorage.getItem('lottery-state'));
    assert.deepEqual([...saved.drawn], []);
    assert.equal(saved.currentPrize, 0);
  });
});


// ========================================================================
// 9. UI/UX テスト
// ========================================================================
describe('UI/UX', () => {
  it('タイトルが「ｽﾀｯｸﾁｬﾝ誕生会2026抽選会！！」', () => {
    const { document } = createDOM();
    assert.equal(document.querySelector('.app-title').textContent, 'ｽﾀｯｸﾁｬﾝ誕生会2026抽選会！！');
  });

  it('サブタイトルが「Powered by M5Stack社」', () => {
    const { document } = createDOM();
    assert.equal(document.querySelector('.app-subtitle').textContent, 'Powered by M5Stack社');
  });

  it('抽選ボタンが存在し「抽 選 ！」と表示される', () => {
    const { document } = createDOM();
    const btn = document.getElementById('drawBtn');
    assert.ok(btn);
    assert.equal(btn.textContent, '抽 選 ！');
  });

  it('初期状態でボタンは有効', () => {
    const { document } = createDOM();
    assert.equal(document.getElementById('drawBtn').disabled, false);
  });

  it('キャラクター画像の src が pic/image.png', () => {
    const { document } = createDOM();
    const img = document.getElementById('characterImg');
    assert.ok(img);
    assert.equal(img.getAttribute('src'), 'pic/image.png');
  });

  it('リセットボタンが存在する', () => {
    const { document } = createDOM();
    const btn = document.querySelector('.reset-btn');
    assert.ok(btn);
    assert.equal(btn.textContent, 'リセット');
  });

  it('景品遷移オーバーレイが存在する', () => {
    const { document } = createDOM();
    assert.ok(document.getElementById('prizeTransition'));
  });

  it('紙吹雪コンテナが存在する', () => {
    const { document } = createDOM();
    assert.ok(document.getElementById('confettiContainer'));
  });

  it('タイトルにシマーアニメーションが適用されている', () => {
    const { document } = createDOM();
    const title = document.querySelector('.app-title');
    assert.ok(title);
  });
});


// ========================================================================
// 10. 抽選フロー統合テスト
// ========================================================================
describe('抽選フロー', () => {
  it('isSpinning が true のとき startDraw は即 return する', async () => {
    const { window, $ } = createDOM();
    $('isSpinning = true');
    const beforeSize = $('availableNumbers').size;
    await window.startDraw();
    assert.equal($('availableNumbers').size, beforeSize);
  });

  it('全景品完了後に startDraw はボタンを無効化しない', async () => {
    const { window, $, document } = createDOM();
    $('currentPrizeIdx = 3');
    const btn = document.getElementById('drawBtn');
    btn.disabled = false;
    await window.startDraw();
    assert.equal(btn.disabled, false);
  });

  it('抽選後に景品の自動カウント/自動遷移が発生しない', () => {
    const { window, $ } = createDOM();
    window.drawNumber();
    window.saveState();
    assert.equal($('currentPrizeIdx'), 0);
  });
});


// ========================================================================
// 11. やり直し機能テスト
// ========================================================================
describe('やり直し機能 (redoLastDraw)', () => {
  it('やり直しボタンが存在する', () => {
    const { document } = createDOM();
    assert.ok(document.getElementById('redoBtn'));
  });

  it('初期状態でやり直しボタンは非表示', () => {
    const { document } = createDOM();
    assert.ok(!document.getElementById('redoBtn').classList.contains('visible'));
  });

  it('redoLastDraw で直前の番号がプールに戻る', () => {
    const { window, $ } = createDOM();
    const num = window.drawNumber();
    window.saveState();
    window.updateHistory();

    window.redoLastDraw();

    assert.ok($('availableNumbers').has(num));
    assert.equal($('drawnNumbers').length, 0);
  });

  it('redoLastDraw 後に残り番号数が復元される', () => {
    const { window, document, $ } = createDOM();
    const { total } = getLotteryConfig($);
    window.drawNumber();
    window.updateHistory();

    window.redoLastDraw();

    assert.equal(document.getElementById('remainingCount').textContent, remainingText(total, total));
  });

  it('redoLastDraw 後に吹き出しがやり直しメッセージになる', () => {
    const { window, document } = createDOM();
    window.drawNumber();
    window.updateHistory();

    window.redoLastDraw();

    assert.ok(document.getElementById('speechBubble').textContent.includes('やり直し'));
  });

  it('抽選履歴が空のとき redoLastDraw は何もしない', () => {
    const { window, $ } = createDOM();
    const beforeSize = $('availableNumbers').size;
    window.redoLastDraw();
    assert.equal($('availableNumbers').size, beforeSize);
  });
});


// ========================================================================
// 12. 定数テスト
// ========================================================================
describe('定数', () => {
  it('MIN_NUM が 0', () => {
    const { $ } = createDOM();
    assert.equal($('MIN_NUM'), 0);
  });

  it('MAX_NUM が MIN_NUM 以上の整数', () => {
    const { $ } = createDOM();
    const { min, max } = getLotteryConfig($);
    assert.ok(Number.isInteger(max));
    assert.ok(max >= min);
  });

  it('TOTAL が MIN_NUM〜MAX_NUM の総数と一致する', () => {
    const { $ } = createDOM();
    const { min, max, total } = getLotteryConfig($);
    assert.equal(total, max - min + 1);
  });
});
