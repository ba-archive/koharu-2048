<template>
  <div class="container">
    <div class="player-info">
      <div class="player-level">Lv. {{ playerLevel }}</div>
      <div class="player-rank">Rank. {{ playerRank }}</div>
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
      <div class="bubble">这是一个气泡</div>
    </div>
  </div>
  <BaDialog v-model:show="showInfo" title="提示">
    <div class="ba-dialog-content">这是一些提示</div>
    <div class="ba-dialog-button-group">
      <BaButton class="polyblue" @click="onConfirm">确定</BaButton>
    </div>
  </BaDialog>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { isMobile } from "@/layers/backgroundLayer";
import BaDialog from "@/layers/textLayer/BaDialog.vue";
import BaButton from "@/layers/textLayer/BaButton.vue";
import eventBus from "@/event";
import { KoharuSound, Live2dTextConfig } from "@/types/events";

const dialogMarginRight = 10;
const dialogMarginLeft = 10;
const dialogMarginBottom = 10;
const playerLevel = ref(114);
const playerRank = ref(514);
const dialogMaxWidth = ref(999);
const dialogOffsetY = ref(100);
const DialogRef = ref<HTMLElement>();
const showInfo = ref(true);

function onConfirm() {
  eventBus.emit("playSound", { name: "back" });
  // 让按钮动画显示完
  setTimeout(() => {
    showInfo.value = false;
  }, 300);
}

function showLive2dText(config: Live2dTextConfig) {
  new Promise<{ content: string; duration: number }>(resolve => {
    if (typeof config === "string") {
      // 进入live2d处理流程
      const cfg = KoharuSoundDurationMap[config];
      resolve(cfg);
    } else {
      // 进入不在live对话的处理流程, 需要自己提供duration
      resolve({ content: config.name, duration: config.duration });
    }
  }).then(data => {});
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

onMounted(() => {
  relocationDialog();
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
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;

  .player-info {
    left: 0;
    top: 0;
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
  overflow-y: auto;
  padding: 0.3125em 0.4375em;
  background-color: #f0f0f0;
  font-size: 1.2em;
}

.ba-dialog-button-group {
  margin-top: 1em;
  text-align: center;
}
</style>
