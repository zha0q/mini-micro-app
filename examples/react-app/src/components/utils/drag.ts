import { thisTypeAnnotation } from "@babel/types";
import {
  getWidth,
  getHeight,
  getStyle,
  getPosition,
  setHeight,
  setPosition,
  setWidth,
  EventBus,
  throttle,
} from "./utils";

export default class Drag {
  // 放在构造函数中的属性，都是属于每一个实例单独拥有
  elem: any = null;
  // this.elem = document.getElementById(id)

  startX = 0;
  startY = 0;
  sourceX = 0;
  sourceY = 0;
  sourceHeight = 0;
  sourceWidth = 0;

  attachPos: any = {};
  sensitive: any;
  type: any = null;
  attachCallback: any;

  // throttleSetPosition = throttle(setPosition, 1000);

  constructor(
    selector: any,
    public eventBus: EventBus,
    resizeable: boolean,
    public attach: any
  ) {
    // 放在构造函数中的属性，都是属于每一个实例单独拥有
    this.elem = selector;
    // this.elem = document.getElementById(id)
    this.init();
  }

  init() {
    this.setDrag();
    this.addCursor();

    this.eventBus.on(
      "attach",
      (type: any, pos: any, sensitive: any, cb: any) => {
        this.type = type;
        this.attachPos = pos;
        this.sensitive = sensitive;
        this.attachCallback = cb;
      }
    );
  }

  setDrag() {
    const that = this;
    this.elem.addEventListener("mousedown", start);

    let throttleCalculateSpeed: (
      that: this,
      distanceX: number,
      distanceY: number
    ) => number;

    // 拖动速度的计算值
    let speed: number = 20;

    function start(e: MouseEvent) {
      that.startX = e.pageX;
      that.startY = e.pageY;
      that.sourceWidth = getWidth(that.elem);
      that.sourceHeight = getHeight(that.elem);
      let pos = getPosition(that.elem);
      that.sourceX = pos.x;
      that.sourceY = pos.y;

      let preX = 0,
        preY = 0;

      // 根据单位时间（200ms）内的移动距离来计算光标移动速度，以此作为用户是否想要进行吸附的判断
      throttleCalculateSpeed = throttle(
        (distanceX: number, distanceY: number) => {
          const speed: number = Math.max(
            Math.abs(distanceX - preX),
            Math.abs(distanceY - preY)
          );
          preX = distanceX;
          preY = distanceY;
          return speed;
        },
        200
      );

      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", end);

      e.stopPropagation();
    }

    function move(e: MouseEvent) {
      let currentX = e.pageX,
        currentY = e.pageY;

      let distanceX = currentX - that.startX,
        distanceY = currentY - that.startY;

      speed = throttleCalculateSpeed(that, distanceX, distanceY) ?? speed;

      // 判断是否有需要进行吸附的水平线或垂直线
      if (
        speed >= 20 ||
        !that.type ||
        (that.attachPos.diffH !== null &&
          Math.abs(
            that.sourceX +
              that.attachPos.diffH +
              distanceX -
              that.attachPos.nearLineH
          ) > that.sensitive) ||
        (that.attachPos.diffV !== null &&
          Math.abs(
            that.sourceY +
              that.attachPos.diffV +
              distanceY -
              that.attachPos.nearLineV
          ) > that.sensitive)
      ) {
        setPosition(that.elem, {
          x: (that.sourceX + distanceX).toFixed(),
          y: (that.sourceY + distanceY).toFixed(),
        });
        that.eventBus.dispatch("drag", [e]);
      } else {
        setPosition(that.elem, {
          x: that.attachPos.nearLineH
            ? that.attachPos.nearLineH - that.attachPos.diffH
            : (that.sourceX + distanceX).toFixed(),
          y: that.attachPos.nearLineV
            ? that.attachPos.nearLineV - that.attachPos.diffV
            : (that.sourceY + distanceY).toFixed(),
        });
        that.attachCallback();
        that.type = null;
        that.eventBus.dispatch("drag", [e]);
      }

      //通知 Rnd 拖拽
    }

    function end() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
    }
  }

  addCursor() {
    this.elem.addEventListener("mousemove", (e: MouseEvent) => {
      const pos = getPosition(this.elem);
      const movePos = {
        startX: e.pageX,
        startY: e.pageY,
        rect: this.elem.getBoundingClientRect(),
        sourceWidth: getWidth(this.elem),
        sourceHeight: getHeight(this.elem),
        sourceX: pos.x,
        sourceY: pos.y,
      };

      if (
        Math.abs(movePos.startX - movePos.rect.x - movePos.sourceWidth) <= 6 ||
        Math.abs(movePos.startX - movePos.rect.x) <= 6 ||
        Math.abs(movePos.startY - movePos.rect.y) <= 6 ||
        Math.abs(movePos.startY - movePos.rect.y - movePos.sourceHeight) <= 6
      ) {
        return;
      }
      this.elem.style.cursor = "move";
    });
  }
}
