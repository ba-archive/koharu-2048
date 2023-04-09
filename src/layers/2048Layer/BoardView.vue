<template>
  <div class="container">
    <div class="game-container">
      <div class="game-message">
        <p></p>
        <div class="lower">
          <a class="keep-playing-button">Keep going</a>
          <a class="retry-button">Try again</a>
        </div>
      </div>

      <div class="grid-container">
        <div class="grid-row">
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
        </div>
        <div class="grid-row">
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
        </div>
        <div class="grid-row">
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
        </div>
        <div class="grid-row">
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
        </div>
      </div>

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
  const gameManager = new GameManager(4, HTMLActuator, LocalStorageManager);
  eventBus.on("gameStart", () => gameManager.restart());
  eventBus.on("planaNext", () => gameManager.startAIFast());
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

<style src="./style/main.css"></style>
