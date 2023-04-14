<template>
  <div id="top_effect"></div>
</template>

<script lang="ts" setup>
import { Application } from "pixi.js";
import { clickEffect } from "./click-effect";
import { ref, watch } from "vue";
let props = defineProps<{
  height: number;
  width: number;
}>();
const topEffectApp = ref();
watch(
  () => [props.width, props.height],
  () => {
    const elem = document.querySelector(`#top_effect`);
    topEffectApp.value = new Application({
      height: props.height,
      width: props.width,
      antialias: true,
      autoDensity: true,
      resolution: 2,
      backgroundAlpha: 0,
      eventMode: "none",
    });
    topEffectApp.value.view.addEventListener("mousedown", trigger);
    topEffectApp.value.view.addEventListener("touchstart", trigger);
    elem?.appendChild(topEffectApp.value.view as any);
    // (globalThis as any).__PIXI_APP__ = topEffectApp.value;
  }
);

const trigger = (e: MouseEvent | TouchEvent) => {
  let x = 0,
    y = 0;
  if (e instanceof MouseEvent) {
    x = e.offsetX;
    y = e.offsetY;
  }
  if (e instanceof TouchEvent) {
    var rect = (e.target as any).getBoundingClientRect();
    x = e.targetTouches[0].pageX - rect.left;
    y = e.targetTouches[0].pageY - rect.top;
  }
  clickEffect(topEffectApp.value, x, y);
};
</script>
<style lang="scss">
#top_effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  pointer-events: none;
  canvas {
    pointer-events: auto;
  }
}
</style>
