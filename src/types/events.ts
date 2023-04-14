import CompleteCallback = PIXI.sound.CompleteCallback;
import PlayOptions = PIXI.sound.PlayOptions;

//以接受事件的层组织事件
export type Events = {
  //ui layer
  gameSucceed: undefined;
  gameFail: undefined;

  //l2d layer
  /**
   * 播放某个l2d差分, 包括文字语音
   */
  l2dPlay: KoharuAnimation;

  /**
   * 播放某个声音
   */
  playSound: PlaySound;

  //2048 layer
  /**
   * 游戏开始, 参数的作用是设置难度, 随机生成的数字最小值会被设置为难度系数X2
   */
  gameStart: undefined | number;
  /**
   * 操作格子移动
   */
  move: "up" | "down" | "right" | "left";
  /**
   * 小春帮你下一步
   */
  koharuNext: undefined;
  /**
   * 普拉娜帮你下一步
   */
  planaNext: undefined;

  //effect layer
  numberEffect: {
    value: number;
    element: HTMLDivElement;
  };
  click: { x: number; y: number };
  /**
   * 销毁实例
   */
  dispose: void;
};

export type KoharuAnimation =
  | "Idle"
  | "Talk1"
  | "Talk2"
  | "Talk3"
  | "Talk4"
  | "Talk5";

export type ButtonSound = "click" | "back";

export type KoharuSound =
  // ― 干、干什么……！？ | ― （这、这个……难道说、马上要……！？）
  | "Koharu_MemorialLobby_1_1"
  | "Koharu_MemorialLobby_1_2"
  // ― 我、我也没有说错什么吧！？ | ― （等等，难道说按照这个发展我就要，和老师……！？）
  | "Koharu_MemorialLobby_2_1"
  | "Koharu_MemorialLobby_2_2"
  // ― （这、这种发展，我在书上见过很多次……！） ― （真的、真的要变成那种剧情了吗！？）
  | "Koharu_MemorialLobby_3"
  // ― （先、先是那样，然后再这样，之类的……） | ― （！？难、难道说，还要做那种事情……！？）
  | "Koharu_MemorialLobby_4_1"
  | "Koharu_MemorialLobby_4_2"
  // ― 终、终于显露出本性了吧，老师……！？ | ― （完了完了完了……！） | ― （我、[wa:600]我还[wa:350]没有做好[wa:900]任何心理准备啊！？）
  | "Koharu_MemorialLobby_5_1"
  | "Koharu_MemorialLobby_5_2";

export type PlaySoundA = KoharuSound | ButtonSound;

export type PlaySound = {
  name: PlaySoundA;
  options?: PlayOptions | CompleteCallback | string;
};
