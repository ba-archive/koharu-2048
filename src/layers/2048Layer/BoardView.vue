<template>
  <div class="board" tabIndex="1">
    <div v-for="(r_item, r_i) in board.cells" :key="r_i" class="cells">
      <cell v-for="(c_item, c_i) in r_item" :key="c_i"></cell>
    </div>
    <tile-view v-for="(tile, i) in tiles" :tile="tile" :key="i"> </tile-view>
    <game-end-overlay :board="board" :onrestart="onRestart"></game-end-overlay>
  </div>
</template>

<script lang="ts" setup>
import Cell from "./components/Cell.vue";
import TileView from "./components/TileView.vue";
import GameEndOverlay from "./components/GameEndOverlay.vue";
import { Board, MoveMap, setDifficulty } from "./board";
import { onMounted, onBeforeUnmount, ref, computed, watch } from "vue";
import eventBus from "@/event";
import { Events } from "@/types/events";
const board = ref(new Board());

const handleKeyDown: (event: KeyboardEvent) => void = event => {
  if (board.value.hasWon()) {
    return;
  }
  if (event.keyCode >= 37 && event.keyCode <= 40) {
    event.preventDefault();
    var direction = event.keyCode - 37;
    board.value.move(direction);
  }
};
const onRestart = () => {
  board.value = new Board();
};

function cellMove(direction: Events["move"]) {
  board.value.move(MoveMap[direction]);
}
function koharuNext() {
  const directions = Object.values(MoveMap);
  board.value.move(directions[Math.floor(Math.random() * directions.length)]);
}
function newGame(difficulty: undefined | number) {
  if (difficulty) {
    setDifficulty(difficulty);
  }
  board.value = new Board();
}
onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  eventBus.on("move", cellMove);
  eventBus.on("koharuNext", koharuNext);
  eventBus.on("gameStart", newGame);
  eventBus.on("puranaNext", koharuNext);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
  eventBus.off("move", cellMove);
  eventBus.off("koharuNext", koharuNext);
  eventBus.off("gameStart", newGame);
  eventBus.off("puranaNext", koharuNext);
});
const tiles = computed(() => {
  return board.value.tiles.filter(tile => tile.value != 0);
});

watch(
  () => board.value.hasWon(),
  value => {
    if (value) {
      eventBus.emit("gameSucceed");
    }
  }
);
watch(
  () => board.value.hasLost(),
  value => {
    if (value) {
      eventBus.emit("gameFail");
    }
  }
);
</script>

<style lang="scss" scoped>
.board {
  order: 1;
  padding: 1%;
  background-color: #baa;
  border-radius: 7px;
  outline: none;
  position: relative;
  .cells {
    height: 25%;
  }
}
</style>

<style lang="scss">
@function calcPosition($count) {
  @return 24% * $count + 1% * (floor($count/2) + 1);
}

@for $row from 0 through 3 {
  @for $column from 0 through 3 {
    .position_#{$row}_#{$column}:not(.isMoving) {
      top: calcPosition($row);
      left: calcPosition(($column));
    }
  }
}

@for $fromRow from 0 through 3 {
  @for $toRow from 0 through 3 {
    $name: row_from_#{$fromRow}_to_#{$toRow};

    @if $fromRow == $toRow {
      .#{$name} {
        top: calcPosition($toRow);
      }
    } @else {
      .#{$name} {
        animation-duration: 0.2s;
        animation-name: $name;
        animation-fill-mode: forwards;
      }

      @keyframes #{$name} {
        from {
          top: calcPosition($fromRow);
        }
        to {
          top: calcPosition(($toRow));
        }
      }
    }
  }
}

@for $fromColumn from 0 through 3 {
  @for $toColumn from 0 through 3 {
    $name: column_from_#{$fromColumn}_to_#{$toColumn};

    @if $fromColumn == $toColumn {
      .#{$name} {
        left: calcPosition($toColumn);
      }
    } @else {
      .#{$name} {
        animation-duration: 0.2s;
        animation-name: $name;
        animation-fill-mode: forwards;
      }

      @keyframes #{$name} {
        from {
          left: calcPosition($fromColumn);
        }
        to {
          left: calcPosition($toColumn);
        }
      }
    }
  }
}
</style>
