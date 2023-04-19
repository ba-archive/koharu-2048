<template>
  <div class="container">
    <div class="display-wrapper">
      <div class="headup-display">
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
          <div class="diamond-number disSkew setFont">{{ gameDuration }}s</div>
        </div>
      </div>
      <div class="action-button-group">
        <div class="action-button" @click="handleHelp" ref="HelpButtonRef">
          <div class="action-button-pic help-pic">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 0C4.02991 0 0 4.02991 0 9C0 13.9701 4.02991 18 9 18C13.9701 18 18 13.9701 18 9C18 4.02991 13.9701 0 9 0ZM9 14.2232C8.55603 14.2232 8.19643 13.8636 8.19643 13.4196C8.19643 12.9757 8.55603 12.6161 9 12.6161C9.44397 12.6161 9.80357 12.9757 9.80357 13.4196C9.80357 13.8636 9.44397 14.2232 9 14.2232ZM10.2636 9.81361C10.0817 9.88387 9.92514 10.0073 9.81441 10.1679C9.70368 10.3284 9.6439 10.5186 9.64286 10.7136V11.1696C9.64286 11.258 9.57054 11.3304 9.48214 11.3304H8.51786C8.42946 11.3304 8.35714 11.258 8.35714 11.1696V10.7377C8.35714 10.2737 8.49174 9.81562 8.75692 9.43393C9.01607 9.06027 9.37768 8.775 9.80357 8.61228C10.4866 8.34911 10.9286 7.77656 10.9286 7.15178C10.9286 6.26585 10.0627 5.54464 9 5.54464C7.93728 5.54464 7.07143 6.26585 7.07143 7.15178V7.30446C7.07143 7.39286 6.99911 7.46518 6.91071 7.46518H5.94643C5.85804 7.46518 5.78571 7.39286 5.78571 7.30446V7.15178C5.78571 6.36228 6.13125 5.625 6.75804 5.07656C7.36071 4.54821 8.15625 4.25893 9 4.25893C9.84375 4.25893 10.6393 4.55022 11.242 5.07656C11.8687 5.625 12.2143 6.36228 12.2143 7.15178C12.2143 8.31294 11.4489 9.35759 10.2636 9.81361Z"
                fill="#4A6294"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="action-button-group">
        <div
          class="action-button"
          @click="handlePlanaNext"
          ref="PlanaButtonRef"
        >
          <div class="action-button-pic help-pic">
            <svg
              width="18"
              height="16"
              viewBox="0 0 18 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.1485 7.57743L9.39362 0.115912C9.10491 -0.160775 8.68127 0.0888448 8.68127 0.536957V15.463C8.68127 15.9111 9.10491 16.1607 9.39362 15.8841L17.1485 8.41952C17.3725 8.20299 17.3725 7.79397 17.1485 7.57743ZM8.51398 7.57743L0.759101 0.115912C0.470384 -0.160775 0.0467529 0.0888448 0.0467529 0.536957V15.463C0.0467529 15.9111 0.470384 16.1607 0.759101 15.8841L8.51398 8.41952C8.62461 8.31126 8.68127 8.15487 8.68127 7.99848C8.68127 7.84209 8.62461 7.6857 8.51398 7.57743Z"
                fill="#4A6294"
              />
            </svg>
          </div>
        </div>
      </div>
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
  <BaDialog
    v-model:show="showHelpDialog"
    title="提示"
    height="500px"
    width="390px"
  >
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
  <GameOverScreen
    v-if="showGameOverScreen"
    :game-succeed="gameSucceed"
    :plana-help-count="planaNextCount"
    :game-duration="gameDuration"
  />
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import BaDialog from "@/layers/textLayer/BaDialog.vue";
import BaButton from "@/layers/textLayer/BaButton.vue";
import eventBus from "@/event";
import { KoharuSound, Live2dTextConfig } from "@/types/events";
import gsap from "gsap";
import { clientIsMobile } from "@/utils";
import event from "@/event";
import GameOverScreen from "@/layers/textLayer/assets/GameOverScreen.vue";
import { buttonAnimation } from "@/layers/textLayer/utils";

const dialogMarginRight = 10;
const dialogMarginLeft = 10;
const dialogMarginBottom = 10;
const dialogMaxWidth = ref(999);
const dialogOffsetY = ref(100);
const DialogRef = ref<HTMLElement>();
const showHelpDialog = ref(false);
const bubble = ref("");
const HelpButtonRef = ref<HTMLElement>();
const PlanaButtonRef = ref<HTMLElement>();
let bubbleTimeline: gsap.core.Timeline | undefined;
function onConfirm() {
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
  if (!width && clientIsMobile()) {
    width = getComputedStyle(
      document.querySelector("#app")!
    ).width.computedCssToNumber();
  }
  if (!width && !clientIsMobile()) {
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
  buttonAnimation({ elem: PlanaButtonRef.value });
  buttonAnimation({ elem: HelpButtonRef.value });
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
const playerRank = ref("max");
const gameEnded = ref(false);

function getGameDuration() {
  return parseInt((localStorage.getItem("gameDuration") as string) || "0");
}

function getPlanaNextCount() {
  return parseInt((localStorage.getItem("planaNextCount") as string) || "0");
}

const gameDuration = ref(getGameDuration());
const planaNextCount = ref(getPlanaNextCount());

function setGameDuration(duration: number) {
  localStorage.setItem("gameDuration", duration.toString());
}

function setPlanaNextCount(count: number) {
  localStorage.setItem("planaNextCount", count.toString());
}

function recordGameDuration() {
  gameDuration.value++;
  setGameDuration(gameDuration.value);
}

function recordPlanaNext() {
  planaNextCount.value++;
  setPlanaNextCount(planaNextCount.value);
}

eventBus.on("gameStart", () => {
  showGameOverScreen.value = false;
  gameDuration.value = 0;
  planaNextCount.value = 0;
  setGameDuration(0);
  setPlanaNextCount(0);
});

const timer = setInterval(recordGameDuration, 1000);

eventBus.on("gameFail", () => {
  clearInterval(timer);
});

eventBus.on("gameSucceed", () => {
  clearInterval(timer);
});

function handlePlanaNext() {
  recordPlanaNext();
  eventBus.emit("planaNext");
  eventBus.emit("playSound", { name: "click" });
}

function handleHelp() {
  showHelpDialog.value = true;
  eventBus.emit("playSound", { name: "click" });
}

const showGameOverScreen = ref(false);
const gameSucceed = ref(false);

eventBus.on("gameFail", () => {
  showGameOverScreen.value = true;
});

eventBus.on("gameSucceed", () => {
  gameSucceed.value = true;
  showGameOverScreen.value = true;
});
</script>

<style lang="scss" scoped>
.setFont {
  // 不是很清楚最后字体怎么决定了，如果决定了就把下面的改了就可以了
  font-family: "Microsoft YaHei", "PingFang SC", -apple-system, system-ui,
    "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", BlinkMacSystemFont,
    "Helvetica Neue", "Hiragino Sans GB", Arial, sans-serif;
}

.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 11;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;

  .display-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media screen and (min-width: 768px) {
      width: 768px;
    }
  }

  .headup-display {
    margin-top: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 2rem;

    @media screen and (max-width: 768px) {
      margin-top: 1rem;
    }
  }

  .player-info {
    background-image: linear-gradient(90deg, #255496, #1e3753);
    padding: 0;
    transform: skewX(-10deg);
    border-radius: 8px;

    .padding {
      display: grid;
      grid-template-rows: 1fr 1fr;
      grid-template-columns: 2fr 7fr;
      padding: 1rem;
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
      background-image: url("../../assets/clock.svg");
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

@media screen and (min-width: 768px) {
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

.action-button-group {
  display: flex;
  flex-direction: column;
}
</style>
