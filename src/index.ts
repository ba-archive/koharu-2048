import store from "./store";
import { BackgroundLayer } from "@/layers/backgroundLayer";
import * as PIXI from "pixi.js";
import { PixiPlugin } from "gsap/PixiPlugin";
import gsap from "gsap";

PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);
/**
 * 各层需要将需要的初始化操作放在此函数中运行
 */
export default async function init() {
  BackgroundLayer.init(document.querySelector("#app")! as HTMLElement).then();
}
