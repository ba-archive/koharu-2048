<template>
  <div class="container">
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
      <div class="diamond-number disSkew setFont">{{ diamondNumber }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const playerName = ref("Sensei");
const playerLevel = ref(85);
const playerRank = ref(114514);
const diamondNumber = ref(114514);
</script>

<style lang="scss" scoped>
.setFont {
  // 不是很清楚最后字体怎么决定了，如果决定了就把下面的改了就可以了
  font-family: 'Courier New', Courier, monospace;
}

.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  .player-info {
    position: relative;
    left: -5vw;
    top: 3vh;
    background-image: linear-gradient(90deg, #255496, #1e3753);
    width: 50vw;
    height: 9vh;
    transform: skewX(-10deg);
    border-radius: 8px;
    .padding {
      display: grid;
      grid-template-rows: 1fr 1fr;
      grid-template-columns: 2fr 7fr;
      left: 7vw;
      width: 43vw;
      height: 100%;
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
    position: absolute;
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
      background-image: url("../../assets/diamond.png");
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
</style>
