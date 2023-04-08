<template>
  <span :class="classes" ref="tileView"
    ><img :src="imageUrl" :alt="tile.value" />
    <div class="tipNumber">{{ tile.value }}</div>
  </span>
</template>

<script lang="ts" setup>
import eventBus from "@/event";
import { toRefs, ref, computed, watch } from "vue";
import { Tile } from "../board";
import { useElementSize } from "@vueuse/core";
const props = defineProps<{ tile: Tile }>();
const { tile } = toRefs(props);
const numberImages = import.meta.glob<{ default: string }>("../assets/*.png", {
  eager: true,
});

const imageUrl = computed(() => {
  const numberImage = Reflect.get(
    numberImages,
    `../assets/number_item_${tile.value.value}.png`
  );
  if (numberImage) {
    return numberImage.default;
  } else {
    return "";
  }
});

const tileView = ref<HTMLSpanElement | null>(null);
const tipFontSize = computed(() => `${tileWidth.value * 0.3}px`);
const { width: tileWidth } = useElementSize(tileView);
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

<style lang="scss" scoped>
@use "sass:list";
@use "sass:math";
.tile {
  user-select: none;
  cursor: default;
}

.tile {
  width: calc(92% / 4);
  height: calc(92% / 4);
  margin: 1%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 7px;
  color: #766;
  background-color: #dcb;
  position: relative;
  img {
    max-width: 100%;
    max-height: 100%;
  }

  .tipNumber {
    font-size: v-bind(tipFontSize);
    position: absolute;
    right: 3%;
    bottom: 0;
  }
}

$bgColors: #ecf4fe #d9e7fc #b2cffa #8cb8f7 #65a0f5 #65a0f5 #4c91f5 #3383f5
  #c89baa #1b74f5;
$textColors: #333333 #333333 #333333 #ffffff #ffffff #ffffff #ffffff #ffffff
  #ffffff #ffffff;

@for $i from 1 through 10 {
  .tile#{math.pow(2,$i+1)} {
    background-color: list.nth($bgColors, $i);
    color: list.nth($textColors, $i);
  }
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
