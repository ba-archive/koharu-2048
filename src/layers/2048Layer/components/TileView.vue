<template>
  <span :class="classes" ref="tileView">{{ tile.value }}</span>
</template>

<script lang="ts" setup>
import eventBus from "@/event";
import { toRefs, ref, computed, watch } from "vue";
import { Tile } from "../board";
const props = defineProps<{ tile: Tile }>();
const { tile } = toRefs(props);

const tileView = ref<HTMLSpanElement | null>(null);
watch(tile, () => {
  if ([256, 512, 1024, 2048].includes(tile.value.value)) {
    if (tileView.value) {
      eventBus.emit("numberEffect", {
        value: tile.value.value,
        element: tileView.value,
      });
    }
  }
});
const classes = computed(() => {
  var classArray = ["tile"];
  classArray.push("tile" + tile.value.value);
  if (!tile.value.mergedInto) {
    classArray.push("position_" + tile.value.row + "_" + tile.value.column);
  }
  if (tile.value.mergedInto) {
    classArray.push("merged");
  }
  if (tile.value.isNew()) {
    classArray.push("new");
  }
  if (tile.value.hasMoved()) {
    classArray.push(
      "row_from_" + tile.value.fromRow() + "_to_" + tile.value.toRow()
    );
    classArray.push(
      "column_from_" + tile.value.fromColumn() + "_to_" + tile.value.toColumn()
    );
    classArray.push("isMoving");
  }

  return classArray.join(" ");
});
</script>

<style>
.tile {
  user-select: none;
  cursor: default;
}

.tile {
  width: calc(92% / 4);
  height: calc(92% / 4);
  margin: 1%;
  line-height: 90px;
  display: inline-block;
  font-size: 55px;
  font-weight: bold;
  text-align: center;
  vertical-align: middle;
  border-radius: 7px;
  font-family: "Clear Sans";
  color: #766;
  background-color: #dcb;
}

.tile0 {
  background-color: #dcb;
}

.tile2 {
  background-color: #eee;
}

.tile4 {
  background-color: #eec;
}

.tile8 {
  color: #ffe;
  background-color: #fb8;
}

.tile16 {
  color: #ffe;
  background-color: #f96;
}

.tile32 {
  color: #ffe;
  background-color: #f75;
}

.tile64 {
  color: #ffe;
  background-color: #f53;
}

.tile128 {
  color: #ffe;
  background-color: #ec7;
  font-size: 45px;
}

.tile256 {
  color: #ffe;
  background-color: #ec6;
  font-size: 45px;
}

.tile512 {
  color: #ffe;
  background-color: #ec5;
  font-size: 45px;
}

.tile1024 {
  color: #fff;
  background-color: #ec3;
  font-size: 35px;
}

.tile2048 {
  color: #fff;
  background-color: #ec2;
  font-size: 35px;
}

.tile {
  position: absolute;
}

.tile.merged {
  display: none;
}

.tile.merged.isMoving {
  display: inline;
}

.tile.new {
  animation-duration: 0.2s;
  animation-name: newTile;
  animation-fill-mode: forwards;
  animation-delay: 0.15s;
  transform: scale(0);
}

@keyframes newTile {
  from {
    transform: scale(0);
  }

  to {
    transform: scale(1);
  }
}
</style>
