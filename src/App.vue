<template>
  <div class="gameApp">
    <div class="gameApp__afterLoading" v-if="!loading">
      <BoardView class="board" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import BoardView from "./layers/2048Layer/BoardView.vue";
import init from ".";
import { onMounted, ref } from "vue";
import eventBus from "./event";

if (import.meta.env.DEV) {
  Reflect.set(window, "eventBus", eventBus);
  eventBus.on("*", (e, args) => console.log("events:", e, "args:", args));
}

const loading = ref(true);
onMounted(() => {
  init().then(() => (loading.value = false));
});
</script>

<style>
@font-face {
  font-family: "Clear Sans";
  src: url("./assets/clear-sans.ttf") format("truetype");
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
