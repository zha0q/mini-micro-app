import {
  getWidth,
  getHeight,
  getStyle,
  getPosition,
  setHeight,
  setPosition,
  setWidth,
} from "./utils";

export default class Resize {
  elem: any = null;

  startX = 0;
  startY = 0;
  sourceX = 0;
  sourceY = 0;
  sourceHeight = 0;
  sourceWidth = 0;
  rect: any = null;
  sensitive = 10;

  minWidth = 10;
  minHeight = 10;

  onResizeStop: any = () => {};

  constructor(selector: any, public onResize: any) {
    this.elem = selector;
    this.elem.style.cursor = "move";

    this.init();
  }

  init() {
    this.setResize();
    this.addCursor();
  }

  resizeL(e: MouseEvent) {
    const move = (e: MouseEvent) => {
      let distanceX = e.pageX - this.startX;
      let currentX = this.sourceX + distanceX;
      if (this.sourceWidth - distanceX >= this.minHeight) {
        setPosition(this.elem, { x: currentX, y: this.sourceY });
        setWidth(this.elem, this.sourceWidth - distanceX);
      }

      this.onResize({
        clientX: this.rect.x,
        clientY: this.rect.y,
        sourceWidth: this.sourceWidth,
        sourceHeight: this.sourceHeight,
      });
    };

    function end() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
    }
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
  }

  resizeT(e: MouseEvent) {
    const move = (e: any) => {
      let distanceY = e.pageY - this.startY;
      let currentY = this.sourceY + distanceY;
      if (this.sourceHeight - distanceY >= this.minWidth) {
        setPosition(this.elem, { x: this.sourceX, y: currentY });
        setHeight(this.elem, this.sourceHeight - distanceY);
      }

      this.onResize({
        clientX: this.rect.x,
        clientY: this.rect.y,
        sourceWidth: this.sourceWidth,
        sourceHeight: this.sourceHeight,
      });
    };

    function end() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
    }
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
  }

  resizeR(e: MouseEvent) {
    const move = (e: MouseEvent) => {
      let distanceX = e.pageX - this.startX;
      if (this.sourceWidth + distanceX >= this.minHeight) {
        setWidth(this.elem, this.sourceWidth + distanceX);
      }

      this.onResize({
        clientX: this.rect.x,
        clientY: this.rect.y,
        sourceWidth: this.sourceWidth,
        sourceHeight: this.sourceHeight,
      });
    };

    function end() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
    }
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
  }

  resizeB(e: MouseEvent) {
    const move = (e: MouseEvent) => {
      let distanceY = e.pageY - this.startY;
      if (this.sourceHeight + distanceY >= this.minWidth) {
        setHeight(this.elem, this.sourceHeight + distanceY);
      }

      this.onResize({
        clientX: this.rect.x,
        clientY: this.rect.y,
        sourceWidth: this.sourceWidth,
        sourceHeight: this.sourceHeight,
      });
    };

    function end() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
    }
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
  }

  resizeTL(e: MouseEvent) {
    const move = (e: MouseEvent) => {
      let distanceX = e.pageX - this.startX;
      let currentX = this.sourceX + distanceX;
      let distanceY = e.pageY - this.startY;
      let currentY = this.sourceY + distanceY;
      if (
        this.sourceWidth - distanceX >= this.minHeight &&
        this.sourceHeight - distanceY >= this.minWidth
      ) {
        setPosition(this.elem, { x: currentX, y: currentY });
        setWidth(this.elem, this.sourceWidth - distanceX);
        setHeight(this.elem, this.sourceHeight - distanceY);
      }

      this.onResize({
        clientX: this.rect.x,
        clientY: this.rect.y,
        sourceWidth: this.sourceWidth,
        sourceHeight: this.sourceHeight,
      });
    };

    function end() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
    }
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
  }

  setResize() {
    this.elem.addEventListener("mousedown", (e: MouseEvent) => {
      this.startX = e.pageX;
      this.startY = e.pageY;
      this.rect = this.elem.getBoundingClientRect();
      this.sourceWidth = getWidth(this.elem);
      this.sourceHeight = getHeight(this.elem);
      let pos = getPosition(this.elem);
      this.sourceX = pos.x;
      this.sourceY = pos.y;

      if (Math.abs(this.startX - this.rect.x - this.sourceWidth) <= 6) {
        if (Math.abs(this.startY - this.rect.y) <= 6) {
          this.resizeT(e);
        }
        if (Math.abs(this.startY - this.rect.y - this.sourceHeight) <= 6) {
          this.resizeB(e);
        }
        this.resizeR(e);
      } else if (Math.abs(this.startX - this.rect.x) <= 6) {
        if (Math.abs(this.startY - this.rect.y) <= 6) {
          this.resizeTL(e);
        } else if (
          Math.abs(this.startY - this.rect.y - this.sourceHeight) <= 6
        ) {
          this.resizeL(e);
          this.resizeB(e);
        } else {
          this.resizeL(e);
        }
      } else if (Math.abs(this.startY - this.rect.y) <= 6) {
        this.resizeT(e);
      } else if (Math.abs(this.startY - this.rect.y - this.sourceHeight) <= 6) {
        this.resizeB(e);
      } else {
        return;
      }
      this.onResizeStop(e, { x: this.sourceX, y: this.sourceY });
    });
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
        Math.abs(movePos.startX - movePos.rect.x - movePos.sourceWidth) <= 6
      ) {
        if (Math.abs(movePos.startY - movePos.rect.y) <= 6) {
          this.elem.style.cursor = "ne-resize";
        } else if (
          Math.abs(movePos.startY - movePos.rect.y - movePos.sourceHeight) <= 6
        ) {
          this.elem.style.cursor = "se-resize";
        } else {
          this.elem.style.cursor = "e-resize";
        }
      } else if (Math.abs(movePos.startX - movePos.rect.x) <= 6) {
        if (Math.abs(movePos.startY - movePos.rect.y) <= 6) {
          this.elem.style.cursor = "nw-resize";
        } else if (
          Math.abs(movePos.startY - movePos.rect.y - movePos.sourceHeight) <= 6
        ) {
          this.elem.style.cursor = "sw-resize";
        } else {
          this.elem.style.cursor = "w-resize";
        }
      } else if (Math.abs(movePos.startY - movePos.rect.y) <= 6) {
        this.elem.style.cursor = "n-resize";
      } else if (
        Math.abs(movePos.startY - movePos.rect.y - movePos.sourceHeight) <= 6
      ) {
        this.elem.style.cursor = "s-resize";
      } else {
        return;
      }
    });
  }
}
