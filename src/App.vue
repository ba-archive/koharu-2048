<template>
  <div class="gameApp">
    <TopEffect :height="playerHeight" :width="playerWidth" />
    <div class="gameApp__afterLoading" v-if="!loading">
      <BoardView class="board" />
    </div>
  </div>
  <TextLayer />
</template>

<script lang="ts" setup>
import BoardView from "./layers/2048Layer/BoardView.vue";
import init from ".";
import { onMounted, ref } from "vue";
import eventBus from "./event";
import TextLayer from "@/layers/textLayer/TextLayer.vue";
import TopEffect from "./layers/top-effect/index.vue";

if (import.meta.env.DEV) {
  Reflect.set(window, "eventBus", eventBus);
  eventBus.on("*", (e, args) => console.log("events:", e, "args:", args));
}
const playerHeight = ref(0);
const playerWidth = ref(0);
const loading = ref(true);
onMounted(() => {
  init().then(() => {
    loading.value = false;
  });
  setTimeout(() => {
    playerHeight.value = document.body.clientHeight;
    playerWidth.value = document.body.clientWidth;
  }, 40);
});
</script>

<style>
body {
  background-image: url(./assets/testBg.jpg);
  background-size: cover;
}
.gameApp {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  font-family: "Clear Sans", sans-serif;
  font-size: 21px;
}

.board {
  width: 80vmin;
  max-width: 440px;
  aspect-ratio: 1;
}
</style>
