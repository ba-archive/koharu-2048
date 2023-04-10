<template>
  <div class="container">
    <div class="game-container">
      <div class="tile-container"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import GameManager from "./js/game_manager";
import HTMLActuator from "./js/html_actuator";
import LocalStorageManager from "./js/local_storage_manager";
import eventBus from "@/event";

onMounted(() => {
  const gameManager = new GameManager(4, HTMLActuator, LocalStorageManager, 2);
  eventBus.on("gameStart", e => {
    if (e) {
      gameManager.difficulty = e;
    }
    gameManager.restart();
  });
  eventBus.on("planaNext", () => {
    if (!gameManager.isGameTerminated()) {
      gameManager.botMove(2);
    }
  });
  eventBus.on("move", e => {
    const MoveMap = {
      up: 0,
      right: 1,
      down: 2,
      left: 3,
    };
    gameManager.move(MoveMap[e]);
  });
});
</script>

<style lang="scss" src="./style/main.scss"></style>
