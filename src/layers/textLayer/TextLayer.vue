<template>
  <div class="container">
    <div class="player-info">
      <div class="padding">
        <div class="left-side">
          <div class="level-text setFont">Lv.</div>
          <div class="player-level setFont">{{ playerLevel }}</div>
        </div>
        <div class="right-side">
          <div class="player-name setFont">{{ playerName }}</div>
          <div class="hr"></div>
          <div class="player-rank setFont">Rank: {{ playerRank }}</div>
        </div>
      </div>
    </div>
    <div class="diamond-container">
      <div class="diamond-pic disSkew"></div>
      <div class="diamond-number disSkew setFont">{{ diamondNumber }}</div>
    </div>
    <div
      class="dialog"
      :style="{
        '--max-width': dialogMaxWidth,
        '--offset-y': dialogOffsetY,
        '--offset-x': dialogMarginLeft,
      }"
      ref="DialogRef"
    >
      <div class="bubble">{{ bubble }}</div>
    </div>
  </div>
  <BaDialog v-model:show="showHelpDialog" title="提示">
    <div class="ba-dialog-content">
      <div class="text">
        <div>和小春一起做蛋糕！</div>
        <div>
          每次可以选择上下左右其中一个方向去滑动，每滑动一次，所有的方块都会往滑动的方向靠拢，同时会随机生成一个新的方块。相同方块在相撞时会叠加并合成一个新的方块。合成出蛋糕则游戏胜利。当所有格子都被填满时，游戏结束。
        </div>
        <div>合并规则如下：</div>
      </div>
      <div>
        <img src="./assets/koharu_help.webp" alt="烫烫烫" />
      </div>
    </div>
    <div class="ba-dialog-button-group">
      <BaButton class="polyblue" @click="onConfirm">确定</BaButton>
    </div>
  </BaDialog>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { isMobile } from "@/layers/backgroundLayer";
import BaDialog from "@/layers/textLayer/BaDialog.vue";
import BaButton from "@/layers/textLayer/BaButton.vue";
import eventBus from "@/event";
import { KoharuSound, Live2dTextConfig } from "@/types/events";
import gsap from "gsap";

const dialogMarginRight = 10;
const dialogMarginLeft = 10;
const dialogMarginBottom = 10;
const dialogMaxWidth = ref(999);
const dialogOffsetY = ref(100);
const DialogRef = ref<HTMLElement>();
const showHelpDialog = ref(false);
const bubble = ref("");
let bubbleTimeline: gsap.core.Timeline | undefined;
function onConfirm() {
  eventBus.emit("playSound", { name: "back" });
  // 让按钮动画显示完
  setTimeout(() => {
    showHelpDialog.value = false;
  }, 150);
}

function onShowLive2dText(_config: Live2dTextConfig) {
  new Promise<{ content: string; duration: number }>(resolve => {
    if (typeof _config === "string") {
      // 进入live2d处理流程
      const cfg = KoharuSoundDurationMap[_config];
      resolve(cfg);
    } else {
      // 进入不在live对话的处理流程, 需要自己提供duration
      resolve({ content: _config.name, duration: _config.duration });
    }
  }).then(data => {
    if (bubbleTimeline) {
      bubbleTimeline.pause();
      bubbleTimeline.kill();
      bubbleTimeline = undefined;
    }
    nextTick(() => {
      bubble.value = data.content;
      bubbleTimeline = gsap.timeline();
      bubbleTimeline
        .to(DialogRef.value!, {
          opacity: 1,
          duration: 0.5,
        })
        .to(DialogRef.value!, {
          opacity: 0,
          duration: 0.5,
          delay: data.duration / 1000 + 1.5,
        })
        .then(() => {
          bubble.value = "";
        });
    });
  });
}

watch(
  () => bubble.value,
  cur => {
    if (cur) {
      nextTick(() => {
        relocationDialog();
      });
    }
  }
);

function onShowHelpDialog() {
  showHelpDialog.value = true;
}

function relocationDialog(width?: number) {
  const gameBoard = document.querySelector(
    ".gameApp__afterLoading"
  ) as HTMLElement;
  if (!gameBoard) {
    setTimeout(relocationDialog, 1000);
    return;
  }
  const gameBoardStyle = getComputedStyle(gameBoard);
  if (!width && isMobile()) {
    width = getComputedStyle(
      document.querySelector("#app")!
    ).width.computedCssToNumber();
  }
  if (!width && !isMobile()) {
    width = gameBoardStyle.width.computedCssToNumber() + 60;
  }
  if (!width) {
    console.error("no width provide");
    return;
  }
  const _width = width as number;
  const dialogStyle = getComputedStyle(DialogRef.value!);
  const dialogWidth = dialogStyle.width.computedCssToNumber();
  new Promise<void>(resolve => {
    const leftSpace = _width / 2 - dialogMarginRight - dialogMarginLeft;
    if (dialogWidth > leftSpace) {
      dialogMaxWidth.value = leftSpace;
      nextTick(resolve);
    } else {
      resolve();
    }
  }).then(() => {
    const dialogStyle = getComputedStyle(DialogRef.value!);
    const dialogHeight = dialogStyle.height.computedCssToNumber();
    const gameBoardValue =
      gameBoard.offsetTop - dialogMarginBottom - dialogHeight;
    // 判断是在中间好还是在game board上方好
    const screenHeight = getComputedStyle(
      document.querySelector("#app")!
    ).height.computedCssToNumber();
    const screenValue = screenHeight / 2 - dialogHeight / 2;
    if (screenValue < gameBoardValue) {
      dialogOffsetY.value = screenValue;
    } else {
      dialogOffsetY.value = gameBoardValue;
    }
  });
}

function onDispose() {
  eventBus.off("showLive2dText", onShowLive2dText);
  eventBus.off("showHelpDialog", onShowHelpDialog);
}

onMounted(() => {
  eventBus.on("showLive2dText", onShowLive2dText);
  eventBus.on("showHelpDialog", onShowHelpDialog);
  eventBus.on("dispose", onDispose);
});

onUnmounted(() => {
  onDispose();
});

const KoharuSoundDurationMap: {
  [key in KoharuSound]: { content: string; duration: number };
} = {
  Koharu_MemorialLobby_1_1: {
    content: "干、干什么……！？",
    duration: 800,
  },
  Koharu_MemorialLobby_1_2: {
    content: "（这、这个……难道说、马上要……！？）",
    duration: 2850,
  },
  Koharu_MemorialLobby_2_1: {
    content: "我、我也没有说错什么吧！？",
    duration: 2750,
  },
  Koharu_MemorialLobby_2_2: {
    content: "（等等，难道说按照这个发展我就要，和老师……！？）",
    duration: 2850,
  },
  Koharu_MemorialLobby_3: {
    content:
      "（这、这种发展，我在书上见过很多次……！）\n（真的、真的要变成那种剧情了吗！？）",
    duration: 3250,
  },
  Koharu_MemorialLobby_4_1: {
    content: "（先、先是那样，然后再这样，之类的……）",
    duration: 2750,
  },
  Koharu_MemorialLobby_4_2: {
    content: "（！？难、难道说，还要做那种事情……！？）",
    duration: 3050,
  },
  Koharu_MemorialLobby_5_1: {
    content: "终、终于显露出本性了吧，老师……！？",
    duration: 2300,
  },
  Koharu_MemorialLobby_5_2: {
    content: "（完了完了完了……！）\n（我、我还没有做好任何心理准备啊！？）",
    duration: 1850,
  },
};
const playerName = ref("Sensei");
const playerLevel = ref(85);
const playerRank = ref(114514);
const diamondNumber = ref(114514);
</script>

<style lang="scss" scoped>
.setFont {
  // 不是很清楚最后字体怎么决定了，如果决定了就把下面的改了就可以了
  font-family: 'Courier New', Courier, monospace;
}

.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  .player-info {
    position: relative;
    left: -5vw;
    top: 3vh;
    background-image: linear-gradient(90deg, #255496, #1e3753);
    width: 50vw;
    height: 9vh;
    transform: skewX(-10deg);
    border-radius: 8px;
    .padding {
      display: grid;
      grid-template-rows: 1fr 1fr;
      grid-template-columns: 2fr 7fr;
      left: 7vw;
      width: 43vw;
      height: 100%;
      position: relative;
      .left-side {
        grid-row: 1 / span 2;
        grid-column: 1;
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: 100%;
        .level-text {
          font-size: min(2.5vh, 60px);
          line-height: min(3.5vh, 80px);
          color: #fbd729;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .player-level {
          font-size: min(3.5vh, 80px);
          line-height: min(3.5vh, 80px);
          font-weight: 400;
          color: #fff;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }
      }

      .right-side {
        grid-row: 1 / span 2;
        grid-column: 2;
        display: flex;
        justify-content: center;
        flex-direction: column;
        transform: skewX(10deg);
        font-size: min(2.5vh, 40px);
        width: 100%;
        .player-name {
          color: #fff;
          display: flex;
          align-items: flex-end;
          justify-content: left;
        }
        .hr {
          width: 85%;
          height: 4px;
          background-color: #fcee2c;
        }
        .player-rank {
          font-weight: 1000;
          width: fit-content;
          background: linear-gradient(90deg, #f6f2be, #fcfff6, #f7de4a);
          background-clip: text;
          -webkit-text-fill-color: transparent;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: left;
        }
      }
    }
  }
  .diamond-container {
    position: absolute;
    display: flex;
    flex-direction: row;
    right: 5vw;
    top: 3vh;
    height: 6vh;
    background-color: #f9f9f9cc;
    transform: skewX(-10deg);
    border-radius: 8px;
    box-shadow: #0006 0px 4px 8px 0px;
    .disSkew {
      transform: skewX(10deg);
    }
    .diamond-pic {
      margin-left: 15px;
      width: 60px;
      background-image: url("../../assets/diamond.png");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
    .diamond-number {
      margin-right: 15px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: min(2.5vh, 60px);
      font-weight: 400;
    }
  }
}

.dialog {
  --max-width: 999;
  --offset-y: 100;
  --offset-x: 10;
  position: absolute;
  top: calc(var(--offset-y) * 1px);
  left: calc(var(--offset-x) * 1px + 50%);
  z-index: -1;
  opacity: 0;

  .bubble {
    $color: rgba(255, 255, 255, 0.8);
    position: relative;
    display: inline-block;
    background-color: $color;
    border-radius: 6px;
    padding: 8px;
    z-index: 2;
    max-width: calc(var(--max-width) * 1px);
    word-break: break-all;
    white-space: pre-line;

    &::before {
      content: "";
      position: absolute;
      left: -16px;
      top: 50%;
      transform: translateY(-50%);
      display: block;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 8px;
      border-color: transparent $color transparent transparent;
    }
  }
}

.ba-dialog-content {
  flex: 1;
  border: solid #d1d7dc 2px;
  border-radius: 0.25em;
  padding: 1rem;
  background-color: #f0f0f0;
  font-size: 1.2rem;
  overflow-y: scroll;
  white-space: pre-line;
  .text {
    > div {
      margin-bottom: 1rem;
    }
  }
}

.ba-dialog-button-group {
  margin-top: 1rem;
  text-align: center;
}
</style>
