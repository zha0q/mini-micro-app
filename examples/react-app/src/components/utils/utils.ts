export function getStyle(elem: HTMLElement, style: any) {
  return (document.defaultView as any).getComputedStyle(elem, false)[style];
}

export function getPosition(elem: HTMLElement) {
  let pos = { x: 0, y: 0 };

  let transformValue = getStyle(elem, "transform");
  if (transformValue == "none") {
    elem.style["transform"] = "translate(0, 0)";
  } else {
    const temp: any = transformValue.match(/-?\d+/g);
    pos = {
      x: parseInt(temp[4].trim()),
      y: parseInt(temp[5].trim()),
    };
  }
  return pos;
}

export function getWidth(elem: HTMLElement) {
  let width = null;
  let widthValue = getStyle(elem, "width");
  width = widthValue.match(/-?\d+/g);
  return parseInt(width[0]);
}
export function getHeight(elem: HTMLElement) {
  let height = null;
  let heightValue = getStyle(elem, "height");
  height = heightValue.match(/-?\d+/g);
  return parseInt(height[0]);
}

export function setHeight(elem: HTMLElement, height: any) {
  elem.style["height"] = `${height}px`;
}
export function setWidth(elem: HTMLElement, width: any) {
  elem.style["width"] = `${width}px`;
}

export function setPosition(elem: HTMLElement, pos: any) {
  elem.style["transform"] = "translate(" + pos.x + "px, " + pos.y + "px)";
}

export function throttle(func: any, delay: number) {
  let last = 0;
  return (...ctx: any) => {
    console.log(ctx);
    var now = Date.now();
    if (now >= delay + last) {
      console.log(now, delay, last);
      func.call(...ctx);
      last = now;
    }
  };
}

export class EventBus {
  public listener: Map<string, any[]> = new Map();
  /**
   * on
   */
  public on(ev: string, fn: any) {
    if (this.listener.has(ev)) {
      const fnArray = this.listener.get(ev) as any;
      this.listener.set(ev, fnArray?.concat([fn]));
    } else {
      this.listener.set(ev, [fn]);
    }
  }

  /**
   * dispatch
   */
  public dispatch = (ev: string, args: any) => {
    this.listener.get(ev)?.forEach((fn) => {
      fn.call(this, ...args);
    });
  };
}
