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

  attaching = false;
  attachPos: any = {};

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

    this.eventBus.on("attach", (attaching: boolean, pos?: any) => {
      this.attaching = attaching;
      if (attaching) {
        this.attachPos = pos;
      }
    });
  }

  setDrag() {
    const that = this;
    this.elem.addEventListener("mousedown", start);

    function start(e: MouseEvent) {
      that.startX = e.pageX;
      that.startY = e.pageY;
      that.sourceWidth = getWidth(that.elem);
      that.sourceHeight = getHeight(that.elem);
      let pos = getPosition(that.elem);
      that.sourceX = pos.x;
      that.sourceY = pos.y;

      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", end);

      e.stopPropagation();
    }

    function move(e: MouseEvent) {
      let currentX = e.pageX,
        currentY = e.pageY;

      let distanceX = currentX - that.startX,
        distanceY = currentY - that.startY;

      if (!that.attaching) {
        setPosition(that.elem, {
          x: (that.sourceX + distanceX).toFixed(),
          y: (that.sourceY + distanceY).toFixed(),
        });
        that.eventBus.dispatch("drag", [e]);
      } else {
        console.log(distanceY);
        setPosition(that.elem, {
          x: that.attachPos.x ?? (that.sourceX + distanceX).toFixed(),
          y: that.attachPos.y ?? (that.sourceY + distanceY).toFixed(),
        });
        // that.throttleSetPosition(that, that.elem, that.attachPos);
        // setPosition(that.elem, that.attachPos);
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
