<template>
  <div class="container">
    <div class="heading">
      <h1 class="title">2048</h1>
      <div class="scores-container">
        <div class="score-container">0</div>
        <div class="best-container">0</div>
      </div>
    </div>

    <div class="above-game">
      <p class="game-intro">
        Join the numbers and get to the <strong>2048 tile!</strong>
      </p>
      <a class="restart-button">New Game</a>
    </div>

    <div id="ai-container" class="ai-container">
      <a class="start-ai-deep-button">Run AI (Deep)</a>
      <a class="start-ai-fast-button">Run AI (Fast)</a>
    </div>

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
import KeyboardInputManager from "./js/keyboard_input_manager";
import HTMLActuator from "./js/html_actuator";
import LocalStorageManager from "./js/local_storage_manager";

onMounted(() => {
  new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
});
</script>

<style src="./style/main.css"></style>
