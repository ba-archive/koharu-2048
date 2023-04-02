import { MoveMap } from "@/layers/2048Layer/board";

//以接受事件的层组织事件
export type Events = {
  //ui layer
  gameSucceed: undefined;
  gameFail: undefined;

  //l2d layer
  /**
   * 播放某个l2d差分, 包括文字语音
   */
  l2dPlay: string;

  //2048 layer
  gameStart: undefined;
  /**
   * 操作格子移动
   */
  move: keyof typeof MoveMap;
  /**
   * 小春帮你下一步
   */
  koharuNext: undefined;

  //effect layer
  numberEffect: {
    value: number;
    element: HTMLSpanElement;
  };
  click: { x: number; y: number };
};
