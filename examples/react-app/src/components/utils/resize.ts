import { lines } from ".";

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

  onDrag: any = () => {};
  onResizeStop: any = () => {};

  constructor(selector: any, options?: { onDrag: any; onResizeStop: any }) {
    this.elem = selector;
    this.elem.style.cursor = "move";

    // this.onDrag = onDrag;
    // this.onResizeStop = onResizeStop;

    this.elem.addEventListener("mousedown", (e: MouseEvent) => {
      this.startX = e.pageX;
      this.startY = e.pageY;
      this.rect = this.elem.getBoundingClientRect();
      this.sourceWidth = this.getWidth();
      this.sourceHeight = this.getHeight();
      let pos = this.getPosition();
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
        this.drag(e);
        return;
      }
      this.onResizeStop(e, { x: this.sourceX, y: this.sourceY });
    });
  }

  getStyle(style: any) {
    return (document.defaultView as any).getComputedStyle(this.elem, false)[
      style
    ];
  }

  getPosition() {
    let pos = { x: 0, y: 0 };

    let transformValue = this.getStyle("transform");
    if (transformValue == "none") {
      this.elem.style["transform"] = "translate(0, 0)";
    } else {
      var temp = transformValue.match(/-?\d+/g);
      pos = {
        x: parseInt(temp[4].trim()),
        y: parseInt(temp[5].trim()),
      };
    }
    return pos;
  }
  getWidth() {
    let width = null;
    let widthValue = this.getStyle("width");
    width = widthValue.match(/-?\d+/g);
    return parseInt(width[0]);
  }
  getHeight() {
    let height = null;
    let heightValue = this.getStyle("height");
    height = heightValue.match(/-?\d+/g);
    return parseInt(height[0]);
  }

  setPosition(el: any, pos: any) {
    el.style["transform"] = "translate(" + pos.x + "px, " + pos.y + "px)";
  }
  setHeight(height: any) {
    this.elem.style["height"] = `${height}px`;
  }
  setWidth(width: any) {
    this.elem.style["width"] = `${width}px`;
  }

  resizeL(e: MouseEvent) {
    const move = (e: MouseEvent) => {
      let distanceX = e.pageX - this.startX;
      let currentX = this.sourceX + distanceX;
      if (this.sourceWidth - distanceX >= this.minHeight) {
        this.setPosition(this.elem, { x: currentX, y: this.sourceY });
        this.setWidth(this.sourceWidth - distanceX);
      }
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
        this.setPosition(this.elem, { x: this.sourceX, y: currentY });
        this.setHeight(this.sourceHeight - distanceY);
      }
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
        this.setWidth(this.sourceWidth + distanceX);
      }
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
        this.setHeight(this.sourceHeight + distanceY);
      }
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
        this.setPosition(this.elem, { x: currentX, y: currentY });
        this.setWidth(this.sourceWidth - distanceX);
        this.setHeight(this.sourceHeight - distanceY);
      }
    };

    function end() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
    }
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
  }

  drag(e: MouseEvent) {
    const move = (e: MouseEvent) => {
      let currentX = e.pageX,
        currentY = e.pageY;

      let distanceX = currentX - this.startX,
        distanceY = currentY - this.startY;

      this.setPosition(this.elem, {
        x: (this.sourceX + distanceX).toFixed(),
        y: (this.sourceY + distanceY).toFixed(),
      });
    };

    function end() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
    }
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);

    this.onDrag(e, { x: this.sourceX, y: this.sourceY });

    e.stopPropagation();
  }
}
