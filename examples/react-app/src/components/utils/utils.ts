import { Rnd } from './index';
import { Box, Line } from './index.d';

export function getStyle(elem: HTMLElement, style: any) {
  return (document.defaultView as any).getComputedStyle(elem, false)[style];
}

export function setStyle(elem: HTMLElement, config: any) {
  Object.keys(config).forEach(
    (property: string) => (elem.style[property as any] = config[property]),
  );
}

export function getPosition(elem: HTMLElement) {
  if (elem.style.transform) {
    const tempPos = elem.style.transform
      .slice(10, -1)
      .split(', ')
      .map((i) => parseInt(i.slice(0, -2), 10));
    return {
      x: tempPos[0],
      y: tempPos[1],
    };
  }
  let pos = { x: 0, y: 0 };
  const transformValue = getStyle(elem, 'transform');
  if (transformValue === 'none') {
    elem.style.transform = 'translate(0, 0)';
  } else {
    const temp: any = transformValue.match(/-?\d+/g);
    pos = {
      x: parseInt(temp[4].trim(), 10),
      y: parseInt(temp[5].trim(), 10),
    };
  }
  return pos;
}

export function getWidth(elem: HTMLElement) {
  let width = null;
  const widthValue = getStyle(elem, 'width');
  width = widthValue.match(/-?\d+/g);
  return parseInt(width[0], 10);
}
export function getHeight(elem: HTMLElement) {
  let height = null;
  const heightValue = getStyle(elem, 'height');
  height = heightValue.match(/-?\d+/g);
  return parseInt(height[0], 10);
}

export function setHeight(elem: HTMLElement, height: any) {
  elem.style.height = `${height}px`;
}
export function setWidth(elem: HTMLElement, width: any) {
  elem.style.width = `${width}px`;
}

export function setPosition(elem: HTMLElement, pos: any) {
  elem.style.transform = `translate(${pos.x}px, ${pos.y}px)`;

  (elem as any).layout = {
    x: parseInt(pos.x, 10),
    y: parseInt(pos.y, 10),
  };
}

export function throttle(func: any, delay: number): any {
  let last = 0;
  return (...ctx: any) => {
    const now = Date.now();
    if (now >= delay + last) {
      last = now;
      return func.call(...ctx);
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

// 判断该线的宿主元素是否在视口之内
export function observeContainWindow(cb1: any, cb2: any): IntersectionObserver {
  return new IntersectionObserver((entries) => {
    if (entries[0].intersectionRatio <= 0) cb1();
    else cb2();
  });
}

export function buildFakeItem(rnd: Rnd) {
  const fakeItem = document.createElement('div');
  const layout = correctBounds(
    {
      ...getPosition(rnd.elem),
      w: getWidth(rnd.elem),
      h: getHeight(rnd.elem),
    },
    rnd,
  );
  setStyle(fakeItem, {
    width: `${layout.w}px`,
    height: `${layout.h}px`,
    position: 'absolute',
    left: rnd.elem.style.left,
    top: rnd.elem.style.top,
    backgroundColor: rnd.options.color as string,
    opacity: '30%',
  });
  setPosition(fakeItem, layout);
  rnd.bak.elem.appendChild(fakeItem);
  return fakeItem;
}

// 用来调整fakeItem位置和尺寸，如果普通item直接setPosition就可以，因为不会涉及到尺寸更改
export function adjustFakeItem(fakeItem: HTMLElement, rnd: Rnd) {
  const pos = getPosition(rnd.elem);
  const rect = rnd.elem.getBoundingClientRect();
  const layout = correctBounds(
    {
      ...pos,
      w: rect.width,
      h: rect.height,
    },
    rnd,
  );
  fakeItem.style.width = `${layout.w}px`;
  fakeItem.style.height = `${layout.h}px`;
  setPosition(fakeItem, layout);
}

export function resolveCompactionCollision(containRnds: Rnd[], rnd: Rnd) {
  adjustFakeItem(rnd.fakeItem, rnd);
  const collided = containRnds
    .map((containRnd) => collides(rnd.fakeItem, containRnd.elem) === 'N')
    .includes(false);
  if (collided) {
    resolveCollision(containRnds, rnd.fakeItem, rnd);
  }
}

export function resolveCollision(
  containRnds: Rnd[],
  item: HTMLElement,
  draggingRnd: Rnd,
) {
  let hasD = false;
  let hasU = false;
  let lowestPoint = Number.MIN_SAFE_INTEGER;
  const lowerRnds: Rnd[] = [];
  containRnds.forEach((containRnd) => {
    if (containRnd === draggingRnd) return;
    const collided = collides(item, containRnd.elem);
    if (collided === 'D') hasD = true;
    else if (collided === 'U') {
      lowerRnds.push(containRnd);
      hasU = true;
    } else return;
    lowestPoint = Math.max(
      lowestPoint,
      (containRnd.elem as any).layout.y + getHeight(containRnd.elem) + 1,
    );
  });
  // 只要有更高的元素，item就必须被撞下去
  if (hasD) {
    setPosition(item, { x: (item as any).layout.x, y: lowestPoint });
    resolveCollision(containRnds, item, draggingRnd);
  }
  // 只有当没有比当前item更高的元素的时候，低位元素才会被撞下去下降
  else if (hasU) {
    lowerRnds.forEach((rnd) => {
      const toBeChangePosition = {
        x: (rnd.elem as any).layout.x,
        y: (item as any).layout.y + getHeight(item),
      };
      setPosition(rnd.elem, toBeChangePosition);
      rnd.handleMoveLine();
      rnd.resize?.setResize(toBeChangePosition);
      resolveCollision(containRnds, rnd.elem, draggingRnd);

      rnd.elem.dispatchEvent(
        new CustomEvent('onLayoutChange', {
          detail: {
            e: null,
            ...toBeChangePosition,
            w: getWidth(rnd.elem),
            h: getHeight(rnd.elem),
          },
        }),
      );
    });
  }
}

export function collides(item1: HTMLElement, item2: HTMLElement) {
  if (item1 === item2) return 'N'; // same element
  const l1 = item1.getBoundingClientRect();
  const l2 = item2.getBoundingClientRect();

  if ((item1 as any).layout.x + l1.width <= (item2 as any).layout.x) return 'N'; // l1 is left of l2
  if ((item1 as any).layout.x >= (item2 as any).layout.x + l2.width) return 'N'; // l1 is right of l2
  if ((item1 as any).layout.y + l1.height <= (item2 as any).layout.y)
    return 'N'; // l1 is above l2
  if ((item1 as any).layout.y >= (item2 as any).layout.y + l2.height)
    return 'N'; // l1 is below l2
  if ((item1 as any).layout.y >= (item2 as any).layout.y) return 'D';
  return 'U'; // boxes overlap
}

function correctBounds(layout: any, rnd: Rnd): any {
  const l = layout;
  const bounds = rnd.bak.elem.getBoundingClientRect();
  // 右侧溢出处理
  if (l.x + l.w > bounds.width) {
    l.x = bounds.width - l.w;
  }
  // 左侧溢出处理
  if (l.x < 0) {
    l.x = 0;
    // l.w = bounds.width;
  }
  l.y = Math.max(l.y, 0);
  return l;
}

export function addTransition(rnd: Rnd) {
  setStyle(rnd.elem, {
    transition: 'transform 200ms linear',
    willChange: 'transform',
  });
  rnd.resize?.shapes.forEach((shape: HTMLElement) => {
    setStyle(shape, {
      transition: 'transform 200ms linear',
      willChange: 'transform',
    });
  });
}

export function removeTransition(rnd: Rnd) {
  setStyle(rnd.elem, {
    transition: 'none',
    willChange: 'transform',
  });
  rnd.resize?.shapes.forEach((shape: HTMLElement) => {
    setStyle(shape, {
      transition: 'none',
    });
  });
}
