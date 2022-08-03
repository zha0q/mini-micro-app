import { Rnd } from './index';
import {
  getWidth,
  getHeight,
  getStyle,
  getPosition,
  setHeight,
  setPosition,
  setWidth,
  EventBus,
  setStyle,
} from './utils';

type Options = {
  clientX: number;
  clientY: number;
  sourceWidth: number;
  sourceHeight: number;
};

const cursors = [
  'nw-resize',
  'n-resize',
  'ne-resize',
  'e-resize',
  'se-resize',
  's-resize',
  'sw-resize',
  'w-resize',
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

  remove = () => {
    this.shapes.forEach((shape: HTMLElement) => {
      this.rnd.bak.elem.removeChild(shape);
    });
  };

  constructor(selector: any, public eventBus: EventBus, public rnd: Rnd) {
    this.elem = selector;

    this.init();
  }

  init() {
    this.initResize();
  }

  resize(e: MouseEvent, pos: any, width: number, height: number) {
    setPosition(this.elem, { x: pos.x, y: pos.y });
    setWidth(this.elem, width);
    setHeight(this.elem, height);

    this.setResize();

    this.eventBus.dispatch('resize', [e]);
  }

  resizeL = (e: MouseEvent) => {
    const move = (e: MouseEvent) => {
      const distanceX = e.pageX - this.startX;
      const currentX = this.sourceX + distanceX;
      if (this.sourceWidth - distanceX >= this.minHeight) {
        this.resize(
          e,
          { x: currentX, y: this.sourceY },
          this.sourceWidth - distanceX,
          this.sourceHeight,
        );
      }
    };

    const end = () => {
      this.eventBus.dispatch('resizeEnd', []);
      document.removeEventListener('contextmenu', end);
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', end);
    };
    document.addEventListener('contextmenu', end);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', end);
  };

  resizeT = (e: MouseEvent) => {
    const move = (e: any) => {
      const distanceY =
        (e.pageY - this.startY) / (this.rnd.options.transformScale as number);
      const currentY = this.sourceY + distanceY;
      if (this.sourceHeight - distanceY >= this.minWidth) {
        this.resize(
          e,
          { x: this.sourceX, y: currentY },
          this.sourceWidth,
          this.sourceHeight - distanceY,
        );
      }
    };

    const end = () => {
      this.eventBus.dispatch('resizeEnd', []);
      document.removeEventListener('contextmenu', end);
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', end);
    };
    document.addEventListener('contextmenu', end);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', end);
  };

  resizeR = (e: MouseEvent) => {
    const move = (e: MouseEvent) => {
      const distanceX =
        (e.pageX - this.startX) / (this.rnd.options.transformScale as number);
      if (this.sourceWidth + distanceX >= this.minHeight) {
        this.resize(
          e,
          { x: this.sourceX, y: this.sourceY },
          this.sourceWidth + distanceX,
          this.sourceHeight,
        );
      }
    };

    const end = () => {
      this.eventBus.dispatch('resizeEnd', []);
      document.removeEventListener('contextmenu', end);
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', end);
    };
    document.addEventListener('contextmenu', end);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', end);
  };

  resizeB = (e: MouseEvent) => {
    const move = (e: MouseEvent) => {
      const distanceY =
        (e.pageY - this.startY) / (this.rnd.options.transformScale as number);
      if (this.sourceHeight + distanceY >= this.minWidth) {
        this.resize(
          e,
          { x: this.sourceX, y: this.sourceY },
          this.sourceWidth,
          this.sourceHeight + distanceY,
        );
      }
    };

    const end = () => {
      this.eventBus.dispatch('resizeEnd', []);
      document.removeEventListener('contextmenu', end);
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', end);
    };
    document.addEventListener('contextmenu', end);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', end);
  };

  resizeTL = (e: MouseEvent) => {
    const move = (e: MouseEvent) => {
      const distanceX = e.pageX - this.startX;
      const currentX = this.sourceX + distanceX;
      const distanceY =
        (e.pageY - this.startY) / (this.rnd.options.transformScale as number);
      const currentY = this.sourceY + distanceY;
      if (
        this.sourceWidth - distanceX >= this.minHeight &&
        this.sourceHeight - distanceY >= this.minWidth
      ) {
        this.resize(
          e,
          { x: currentX, y: currentY },
          this.sourceWidth - distanceX,
          this.sourceHeight - distanceY,
        );
      }
    };

    const end = () => {
      this.eventBus.dispatch('resizeEnd', []);
      document.removeEventListener('contextmenu', end);
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', end);
    };
    document.addEventListener('contextmenu', end);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', end);
  };

  resizeTR = (e: MouseEvent) => {
    const move = (e: MouseEvent) => {
      const distanceX = e.pageX - this.startX;
      const distanceY =
        (e.pageY - this.startY) / (this.rnd.options.transformScale as number);
      const currentY = this.sourceY + distanceY;
      if (
        this.sourceWidth + distanceX >= this.minHeight &&
        this.sourceHeight - distanceY >= this.minWidth
      ) {
        this.resize(
          e,
          { x: this.sourceX, y: currentY },
          this.sourceWidth + distanceX,
          this.sourceHeight - distanceY,
        );
      }
    };

    const end = () => {
      this.eventBus.dispatch('resizeEnd', []);
      document.removeEventListener('contextmenu', end);
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', end);
    };
    document.addEventListener('contextmenu', end);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', end);
  };

  resizeBR = (e: MouseEvent) => {
    const move = (e: MouseEvent) => {
      const distanceX =
        (e.pageX - this.startX) / (this.rnd.options.transformScale as number);
      const distanceY =
        (e.pageY - this.startY) / (this.rnd.options.transformScale as number);
      if (
        this.sourceWidth + distanceX >= this.minHeight &&
        this.sourceHeight + distanceY >= this.minWidth
      ) {
        this.resize(
          e,
          { x: this.sourceX, y: this.sourceY },
          this.sourceWidth + distanceX,
          this.sourceHeight + distanceY,
        );
      }
    };

    const end = () => {
      this.eventBus.dispatch('resizeEnd', []);
      document.removeEventListener('contextmenu', end);
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', end);
    };
    document.addEventListener('contextmenu', end);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', end);
  };

  resizeBL = (e: MouseEvent) => {
    const move = (e: MouseEvent) => {
      const distanceX = e.pageX - this.startX;
      const currentX = this.sourceX + distanceX;
      const distanceY = e.pageY - this.startY;
      if (
        this.sourceWidth - distanceX >= this.minHeight &&
        this.sourceHeight + distanceY >= this.minWidth
      ) {
        this.resize(
          e,
          { x: currentX, y: this.sourceY },
          this.sourceWidth - distanceX,
          this.sourceHeight + distanceY,
        );
      }
    };

    const end = () => {
      this.eventBus.dispatch('resizeEnd', []);

      document.removeEventListener('contextmenu', end);
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', end);
    };
    document.addEventListener('contextmenu', end);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', end);
  };

  initResize() {
    const addCursor = (el: HTMLElement, cursor: string) => {
      el.style.cursor = cursor;
    };

    this.shapes = new Array(8).fill(null).map((v, i) => {
      const shape = document.createElement('div');
      setStyle(shape, {
        position: 'absolute',
        left: '0',
        top: '0',
        zIndex: '100',
        height: '4px',
        width: '4px',
        border: `1px ${this.rnd.options.color} solid`,
        borderRadius: '4px',
      });

      // 添加点击事件
      shape.addEventListener('mousedown', (e) => {
        this.startX = e.pageX;
        this.startY = e.pageY;
        this.sourceWidth = getWidth(this.elem);
        this.sourceHeight = getHeight(this.elem);
        const pos = getPosition(this.elem);
        this.sourceX = pos.x;
        this.sourceY = pos.y;

        this.eventBus.dispatch('resizeStart', []);
      });

      this.elem.parentNode.appendChild(shape);
      addCursor(shape as HTMLElement, cursors[i]);

      return shape;
    });

    this.setResize();
    this.disappear();

    // 为shape添加事件
    this.shapes[0].addEventListener('mousedown', this.resizeTL);
    this.shapes[1].addEventListener('mousedown', this.resizeT);
    this.shapes[2].addEventListener('mousedown', this.resizeTR);
    this.shapes[3].addEventListener('mousedown', this.resizeR);
    this.shapes[4].addEventListener('mousedown', this.resizeBR);
    this.shapes[5].addEventListener('mousedown', this.resizeB);
    this.shapes[6].addEventListener('mousedown', this.resizeBL);
    this.shapes[7].addEventListener('mousedown', this.resizeL);
  }

  setResize(incomingPosition?: { x: number; y: number }) {
    const width = getWidth(this.elem);
    const height = getHeight(this.elem);
    const pos = incomingPosition ?? getPosition(this.elem);

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

  shapesShow() {
    this.shapes.forEach((shape: HTMLElement) => {
      shape.style.display = 'block';
    });
  }

  disappear() {
    this.shapes.forEach((shape: HTMLElement) => {
      shape.style.display = 'none';
    });
  }
}
