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
  throttle,
} from './utils';

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

  remove: any;

  // throttleSetPosition = throttle(setPosition, 1000);

  constructor(
    selector: any,
    public eventBus: EventBus,
    public attach: any,
    public rnd: Rnd,
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
      'attach',
      (type: any, pos: any, sensitive: any, cb: any) => {
        this.type = type;
        this.attachPos = pos;
        this.sensitive = sensitive;
        this.attachCallback = cb;
      },
    );
  }

  setDrag() {
    let throttleCalculateSpeed: (
      this: this,
      distanceX: number,
      distanceY: number,
    ) => number;

    // 拖动速度的计算值
    let speed = 20;

    const start = (e: MouseEvent) => {
      this.startX = e.pageX;
      this.startY = e.pageY;
      this.sourceWidth = getWidth(this.elem);
      this.sourceHeight = getHeight(this.elem);
      const pos = getPosition(this.elem);
      this.sourceX = pos.x;
      this.sourceY = pos.y;

      let preX = 0;
      let preY = 0;

      // 根据单位时间（200ms）内的移动距离来计算光标移动速度，以此作为用户是否想要进行吸附的判断
      throttleCalculateSpeed = throttle(
        (distanceX: number, distanceY: number) => {
          const speed: number = Math.max(
            Math.abs(distanceX - preX),
            Math.abs(distanceY - preY),
          );
          preX = distanceX;
          preY = distanceY;
          return speed;
        },
        200,
      );

      this.eventBus.dispatch('dragStart', []);

      document.addEventListener('contextmenu', end);
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', end);

      e.stopPropagation();
    };

    this.elem.addEventListener('mousedown', start);

    this.remove = () => {
      document.removeEventListener('mousedown', start);
    };

    const move = (e: MouseEvent) => {
      const currentX = e.pageX;
      const currentY = e.pageY;

      const distanceX =
        (currentX - this.startX) / (this.rnd.options.transformScale as number);
      const distanceY =
        (currentY - this.startY) / (this.rnd.options.transformScale as number);

      speed =
        (throttleCalculateSpeed as any)(this, distanceX, distanceY) ?? speed;

      // 判断是否有需要进行吸附的水平线或垂直线
      if (
        speed >= 20 ||
        !this.type ||
        (this.attachPos.diffH !== null &&
          Math.abs(
            this.sourceX +
              this.attachPos.diffH +
              distanceX -
              this.attachPos.nearLineH,
          ) > this.sensitive) ||
        (this.attachPos.diffV !== null &&
          Math.abs(
            this.sourceY +
              this.attachPos.diffV +
              distanceY -
              this.attachPos.nearLineV,
          ) > this.sensitive)
      ) {
        setPosition(this.elem, {
          x: (this.sourceX + distanceX).toFixed(),
          y: (this.sourceY + distanceY).toFixed(),
        });
        this.eventBus.dispatch('drag', [e]);
      } else {
        setPosition(this.elem, {
          x: this.attachPos.nearLineH
            ? this.attachPos.nearLineH - this.attachPos.diffH
            : (this.sourceX + distanceX).toFixed(),
          y: this.attachPos.nearLineV
            ? this.attachPos.nearLineV - this.attachPos.diffV
            : (this.sourceY + distanceY).toFixed(),
        });
        this.attachCallback();
        this.type = null;
        this.eventBus.dispatch('drag', [e]);
      }

      // 通知 Rnd 拖拽
    };

    const end = () => {
      this.eventBus.dispatch('dragEnd', []);
      document.removeEventListener('contextmenu', end);
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', end);
    };
  }

  addCursor() {
    this.elem.style.cursor = 'move';
  }
}
