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
      <BaButton class="polylight">取消</BaButton>
      <BaButton class="polylight">确定</BaButton>
    </div>
  </BaDialog>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { isMobile } from "@/layers/backgroundLayer";
import BaDialog from "@/layers/textLayer/BaDialog.vue";
import BaButton from "@/layers/textLayer/BaButton.vue";

const dialogMarginRight = 10;
const dialogMarginLeft = 10;
const dialogMarginBottom = 10;
const playerLevel = ref(114);
const playerRank = ref(514);
const dialogMaxWidth = ref(999);
const dialogOffsetY = ref(100);
const DialogRef = ref<HTMLElement>();
const showInfo = ref(true);

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
    white-space: break-spaces;

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
