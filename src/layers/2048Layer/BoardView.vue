<template>
  <div class="board" tabIndex="1">
    <div v-for="(r_item, r_i) in board.cells" :key="r_i">
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
import { Board, MoveMap } from "./board";
import { onMounted, onBeforeUnmount, ref, computed } from "vue";
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
onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  eventBus.on("move", cellMove);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
  eventBus.off("move", cellMove);
});
const tiles = computed(() => {
  return board.value.tiles.filter(tile => tile.value != 0);
});
</script>

<style>
.board {
  order: 1;
  width: 440px;
  height: 440px;
  padding: 5px;
  background-color: #baa;
  border-radius: 7px;
  outline: none;
  position: relative;
}
</style>

<style lang="scss">
@for $row from 0 through 3 {
  @for $column from 0 through 3 {
    .position_#{$row}_#{$column}:not(.isMoving) {
      top: 110px * $row + 5px;
      left: 110px * $column + 5px;
    }
  }
}

@for $fromRow from 0 through 3 {
  @for $toRow from 0 through 3 {
    $name: row_from_#{$fromRow}_to_#{$toRow};

    @if $fromRow == $toRow {
      .#{$name} {
        top: 110px * $toRow + 5px;
      }
    } @else {
      .#{$name} {
        animation-duration: 0.2s;
        animation-name: $name;
        animation-fill-mode: forwards;
      }

      @keyframes #{$name} {
        from {
          top: 110px * $fromRow + 5px;
        }
        to {
          top: 110px * $toRow + 5px;
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
        left: 110px * $toColumn + 5px;
      }
    } @else {
      .#{$name} {
        animation-duration: 0.2s;
        animation-name: $name;
        animation-fill-mode: forwards;
      }

      @keyframes #{$name} {
        from {
          left: 110px * $fromColumn + 5px;
        }
        to {
          left: 110px * $toColumn + 5px;
        }
      }
    }
  }
}
</style>
