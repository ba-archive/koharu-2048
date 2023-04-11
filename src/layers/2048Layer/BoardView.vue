<template>
  <div class="container-main">
    <div class="game-container">
      <div class="tile-container"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import GameManager from "./js/game_manager";
import HTMLActuator from "./js/html_actuator";
import LocalStorageManager from "./js/local_storage_manager";
import eventBus from "@/event";
const MoveMap = {
  up: 0,
  right: 1,
  down: 2,
  left: 3,
};

let gameManager: GameManager;
const difficultyKey = "difficulty";
function gameStart(difficulty: number | undefined) {
  if (difficulty) {
    gameManager.difficulty = difficulty;
    localStorage.setItem(difficultyKey, difficulty.toString());
  }
  gameManager.restart();
}
function planaNext() {
  if (!gameManager.isGameTerminated()) {
    gameManager.botMove(2);
  }
}
function koharuNext() {
  const directions = Object.values(MoveMap);
  gameManager.move(directions[Math.floor(Math.random() * directions.length)]);
}
function move(direction: keyof typeof MoveMap) {
  gameManager.move(MoveMap[direction]);
}
onMounted(() => {
  const difficultyCache = localStorage.getItem(difficultyKey);
  const difficulty = difficultyCache ? Number(difficultyCache) : 2;
  gameManager = new GameManager(
    4,
    HTMLActuator,
    LocalStorageManager,
    difficulty
  );
  eventBus.on("gameStart", gameStart);
  eventBus.on("planaNext", planaNext);
  eventBus.on("koharuNext", koharuNext);
  eventBus.on("move", move);
});
onBeforeUnmount(() => {
  eventBus.off("gameStart", gameStart);
  eventBus.off("planaNext", planaNext);
  eventBus.off("koharuNext", koharuNext);
  eventBus.off("move", move);
});
</script>

<style lang="scss" src="./style/main.scss"></style>
