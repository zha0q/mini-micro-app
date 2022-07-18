import {
  getWidth,
  getHeight,
  getStyle,
  getPosition,
  setHeight,
  setPosition,
  setWidth,
  EventBus,
} from "./utils";

type Options = {
  clientX: number;
  clientY: number;
  sourceWidth: number;
  sourceHeight: number;
};

const cursors = [
  "nw-resize",
  "n-resize",
  "ne-resize",
  "e-resize",
  "se-resize",
  "s-resize",
  "sw-resize",
  "w-resize",
];

export default class Resize {
  elem: any = null;

  shapes: any;
  startX = 0;
  startY = 0;
  sourceX = 0;
  sourceY = 0;
  sourceHeight = 0;
  sourceWidth = 0;

  minWidth = 10;
  minHeight = 10;

  onResizeStop: any = () => {};

  constructor(
    selector: any,
    public eventBus: EventBus,
    public shapeColor: any
  ) {
    this.elem = selector;

    this.init();
  }

  init() {
    this.initResize();
    // this.addCursor();
  }

  resize(e: MouseEvent, pos: any, width: number, height: number) {
    setPosition(this.elem, { x: pos.x, y: pos.y });
    setWidth(this.elem, width);
    setHeight(this.elem, height);

    this.setResize();

    this.eventBus.dispatch("resize", [e]);
  }

  resizeL = (e: MouseEvent) => {
    const move = (e: MouseEvent) => {
      let distanceX = e.pageX - this.startX;
      let currentX = this.sourceX + distanceX;
      console.log(distanceX);
      if (this.sourceWidth - distanceX >= this.minHeight) {
        this.resize(
          e,
          { x: currentX, y: this.sourceY },
          this.sourceWidth - distanceX,
          this.sourceHeight
        );
      }
    };

    function end() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
    }
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
  };

  resizeT = (e: MouseEvent) => {
    const move = (e: any) => {
      let distanceY = e.pageY - this.startY;
      let currentY = this.sourceY + distanceY;
      console.log(this.sourceX, this.sourceY, currentY);
      if (this.sourceHeight - distanceY >= this.minWidth) {
        this.resize(
          e,
          { x: this.sourceX, y: currentY },
          this.sourceWidth,
          this.sourceHeight - distanceY
        );
      }
    };

    function end() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
    }
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
  };

  resizeR = (e: MouseEvent) => {
    const move = (e: MouseEvent) => {
      let distanceX = e.pageX - this.startX;
      if (this.sourceWidth + distanceX >= this.minHeight) {
        this.resize(
          e,
          { x: this.sourceX, y: this.sourceY },
          this.sourceWidth + distanceX,
          this.sourceHeight
        );
      }
    };

    function end() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
    }
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
  };

  resizeB = (e: MouseEvent) => {
    const move = (e: MouseEvent) => {
      let distanceY = e.pageY - this.startY;
      if (this.sourceHeight + distanceY >= this.minWidth) {
        this.resize(
          e,
          { x: this.sourceX, y: this.sourceY },
          this.sourceWidth,
          this.sourceHeight + distanceY
        );
      }
    };

    function end() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
    }
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
  };

  resizeTL = (e: MouseEvent) => {
    const move = (e: MouseEvent) => {
      let distanceX = e.pageX - this.startX;
      let currentX = this.sourceX + distanceX;
      let distanceY = e.pageY - this.startY;
      let currentY = this.sourceY + distanceY;
      if (
        this.sourceWidth - distanceX >= this.minHeight &&
        this.sourceHeight - distanceY >= this.minWidth
      ) {
        this.resize(
          e,
          { x: currentX, y: currentY },
          this.sourceWidth - distanceX,
          this.sourceHeight - distanceY
        );
      }
    };

    function end() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
    }
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
  };

  resizeTR = (e: MouseEvent) => {
    const move = (e: MouseEvent) => {
      let distanceX = e.pageX - this.startX;
      let distanceY = e.pageY - this.startY;
      let currentY = this.sourceY + distanceY;
      if (
        this.sourceWidth + distanceX >= this.minHeight &&
        this.sourceHeight - distanceY >= this.minWidth
      ) {
        this.resize(
          e,
          { x: this.sourceX, y: currentY },
          this.sourceWidth + distanceX,
          this.sourceHeight - distanceY
        );
      }
    };

    function end() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
    }
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
  };

  resizeBR = (e: MouseEvent) => {
    const move = (e: MouseEvent) => {
      let distanceX = e.pageX - this.startX;
      let distanceY = e.pageY - this.startY;
      if (
        this.sourceWidth + distanceX >= this.minHeight &&
        this.sourceHeight + distanceY >= this.minWidth
      ) {
        this.resize(
          e,
          { x: this.sourceX, y: this.sourceY },
          this.sourceWidth + distanceX,
          this.sourceHeight + distanceY
        );
      }
    };

    function end() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
    }
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
  };

  resizeBL = (e: MouseEvent) => {
    const move = (e: MouseEvent) => {
      let distanceX = e.pageX - this.startX;
      let currentX = this.sourceX + distanceX;
      let distanceY = e.pageY - this.startY;
      if (
        this.sourceWidth - distanceX >= this.minHeight &&
        this.sourceHeight + distanceY >= this.minWidth
      ) {
        this.resize(
          e,
          { x: currentX, y: this.sourceY },
          this.sourceWidth - distanceX,
          this.sourceHeight + distanceY
        );
      }
    };

    function end() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
    }
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
  };

  initResize() {
    this.shapes = new Array(8).fill(null).map((v, i) => {
      const shape = document.createElement("div");
      shape.style.position = "absolute";
      shape.style.left = "0";
      shape.style.top = "0";
      shape.style.zIndex = "10000";
      shape.style.height = "4px";
      shape.style.width = "4px";
      shape.style.border = `1px ${this.shapeColor} solid`;
      shape.style.borderRadius = "4px";
      // 添加点击事件
      shape.addEventListener("mousedown", (e) => {
        this.startX = e.pageX;
        this.startY = e.pageY;
        this.sourceWidth = getWidth(this.elem);
        this.sourceHeight = getHeight(this.elem);
        let pos = getPosition(this.elem);
        this.sourceX = pos.x;
        this.sourceY = pos.y;
      });

      this.elem.parentNode.appendChild(shape);
      this.addCursor(shape as HTMLElement, cursors[i]);

      return shape;
    });

    this.setResize();

    // 为shape添加事件
    this.shapes[0].addEventListener("mousedown", this.resizeTL);
    this.shapes[1].addEventListener("mousedown", this.resizeT);
    this.shapes[2].addEventListener("mousedown", this.resizeTR);
    this.shapes[3].addEventListener("mousedown", this.resizeR);
    this.shapes[4].addEventListener("mousedown", this.resizeBR);
    this.shapes[5].addEventListener("mousedown", this.resizeB);
    this.shapes[6].addEventListener("mousedown", this.resizeBL);
    this.shapes[7].addEventListener("mousedown", this.resizeL);
  }

  addCursor(el: HTMLElement, cursor: string) {
    el.style.cursor = cursor;
  }

  setResize() {
    const width = getWidth(this.elem);
    const height = getHeight(this.elem);
    let pos = getPosition(this.elem);
    setPosition(this.shapes[0], { x: pos.x - 2, y: pos.y - 2 });
    setPosition(this.shapes[1], {
      x: pos.x + width / 2 - 2,
      y: pos.y - 2,
    });
    setPosition(this.shapes[2], {
      x: pos.x + width - 2,
      y: pos.y - 2,
    });
    setPosition(this.shapes[3], {
      x: pos.x + width - 2,
      y: pos.y + height / 2 - 2,
    });
    setPosition(this.shapes[4], {
      x: pos.x + width - 2,
      y: pos.y + height - 2,
    });
    setPosition(this.shapes[5], {
      x: pos.x + width / 2 - 2,
      y: pos.y + height - 2,
    });
    setPosition(this.shapes[6], {
      x: pos.x - 2,
      y: pos.y + height - 2,
    });
    setPosition(this.shapes[7], {
      x: pos.x - 2,
      y: pos.y + height / 2 - 2,
    });
  }
}
