import { Line, Box, Layout } from "./index.d";
import Drag from "./drag";
import Lines from "./lines";
import Resize from "./resize";
import grid from "./grid.svg";
import {
  getHeight,
  getPosition,
  getWidth,
  setPosition,
  setWidth,
  setHeight,
  throttle,
  EventBus,
  observeContainWindow,
  resolveCompactionCollision,
  buildFakeItem,
  addTransition,
  removeTransition,
  setStyle,
} from "./utils";

type LineT = "vt" | "vm" | "vb" | "hl" | "hm" | "hr";

const lineT = ["vt", "vm", "vb", "hl", "hm", "hr"];

export class Bak {
  public lines: Lines;
  public mayAttachLines: any = {};
  // 不在视口内的元素集合
  public excludeWindowSet: WeakSet<HTMLElement> = new WeakSet();
  public containRnd: Rnd[] = [];
  constructor(public elem: HTMLElement) {
    this.lines = new Lines();
    // const svg = new Image(getWidth(this.elem), getHeight(this.elem));
    // svg.src = grid;
    // svg.draggable = false;
    // svg.style.userSelect = 'none';
    // this.elem.appendChild(svg);

    this.elem.style.position = "relative";

    this.elem.addEventListener("mousedown", () => {
      this.containRnd.forEach((rnd) => {
        rnd.resize?.disappear();
      });
    });
  }
}

export class Rnd {
  public drag: Drag | null = null;
  public resize: Resize | null = null;
  public box: Box | undefined;
  public rndLocation: any = {};

  public eventBus: EventBus = new EventBus();
  public fakeItem: any = null;

  constructor(
    public elem: HTMLElement,
    public bak: Bak,
    public options: {
      default: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      draggable: boolean;
      resizable: boolean;
      color?: string;
      nearLineDistance?: number;
      sensitive?: number;
    }
  ) {
    let flag = false;
    this.bak.containRnd.forEach((rnd) => {
      flag = flag || rnd.elem.id === this.elem.id;
    });
    if (flag) return;
    this.init();
  }

  init() {
    // bak进行收集
    this.bak.containRnd.push(this);

    if (!this.options.color) this.options.color = "red";
    if (!this.options.nearLineDistance) this.options.nearLineDistance = 0;
    if (!this.options.sensitive) this.options.sensitive = 0;

    // 监视元素是否在视口外并进行相应回调
    const observerContainWindow = observeContainWindow(
      () => this.bak.excludeWindowSet.add(this.elem),
      () => this.bak.excludeWindowSet.delete(this.elem)
    );
    observerContainWindow.observe(this.elem);

    //

    // 元素样式初始化
    setStyle(this.elem, {
      position: "absolute",
      left: "0",
      top: "0",
      zIndex: "100",
      transform: `translate(${this.options.default.x}px, ${this.options.default.y}px)`,
      width: `${this.options.default.width}px`,
      height: `${this.options.default.height}px`,
    });

    (this.elem as any).layout = {
      x: this.options.default.x,
      y: this.options.default.y,
    };

    // 标线初始化
    const lines = this.buildLines();
    this.addLines(lines);
    this.bak.lines.disappear();
    this.hideUserSelect();

    if (this.options.draggable) {
      this.dragInit();
    }
    if (this.options.resizable) {
      this.resizeInit();
    }

    // 元素被focus时 shape显性
    this.eventBus.on("focus", (rnd: Rnd) => {
      rnd.bak.containRnd.forEach((containedRnd) => {
        if (rnd !== containedRnd) {
          containedRnd.resize?.disappear();
        }
      });
      rnd.resize?.shapesShow();
    });

    document.addEventListener("mouseup", (e) => this.bak.lines.disappear());

    // 初始化处理碰撞
    this.fakeItem = buildFakeItem(this);
    resolveCompactionCollision(this.bak.containRnd, this);
    const fakeItemPosition = getPosition(this.fakeItem);
    setPosition(this.elem, fakeItemPosition);
    this.handleMoveLine();
    this.resize?.setResize(fakeItemPosition);
    this.bak.elem.removeChild(this.fakeItem);
    this.fakeItem = null;

    // 添加动画
    addTransition(this);
  }

  dragInit() {
    this.drag = new Drag(
      this.elem,
      this.eventBus,
      this.options.resizable,
      this.attach.bind(this)
    );
    // drag 事件
    this.eventBus.on("dragStart", () => {
      removeTransition(this);
      this.fakeItem !== null && this.bak.elem.removeChild(this.fakeItem);
      this.fakeItem = buildFakeItem(this);

      this.eventBus.dispatch("focus", [this, this]);
    });

    this.eventBus.on("drag", (e: MouseEvent) => {
      this.attach(e);
      this.handleMoveLine();
      this.resize?.setResize();

      resolveCompactionCollision(this.bak.containRnd, this);
    });

    this.eventBus.on("dragEnd", () => {
      // 处理左键之外其他鼠标点击事件的边界条件
      if (!this.fakeItem) return;
      const fakeItemPosition = getPosition(this.fakeItem);
      addTransition(this);
      setPosition(this.elem, fakeItemPosition);
      this.handleMoveLine();
      this.resize?.setResize(fakeItemPosition);
      this.bak.elem.removeChild(this.fakeItem);
      this.fakeItem = null;
    });
  }

  resizeInit() {
    this.resize = new Resize(this.elem, this.eventBus, this.options.color);
    // resize事件
    this.eventBus.on("resizeStart", () => {
      removeTransition(this);
      this.fakeItem = buildFakeItem(this);

      this.eventBus.dispatch("focus", [this, this]);
    });

    this.eventBus.on("resize", (e: MouseEvent) => {
      this.handleMoveLine();

      resolveCompactionCollision(this.bak.containRnd, this);
    });

    this.eventBus.on("resizeEnd", () => {
      const fakeItemPosition = getPosition(this.fakeItem);
      addTransition(this);
      setPosition(this.elem, fakeItemPosition);
      this.handleMoveLine();
      this.resize?.setResize(fakeItemPosition);
      this.bak.elem.removeChild(this.fakeItem);
      this.fakeItem = null;
    });
  }

  // 清除双击选中效果，增加用户体验
  hideUserSelect() {
    this.elem.style.userSelect = "none";
  }

  createXLine(pos: number) {
    const xLine = document.createElement("div");
    setStyle(xLine, {
      display: "none",
      width: "100%",
      height: "1px",
      backgroundColor: this.options.color as string,
      position: "absolute",
      top: "0",
      left: "0",
      zIndex: "1000",
    });

    setPosition(xLine, { x: 0, y: pos });
    this.bak.elem.appendChild(xLine);
    return xLine;
  }

  createYLine(pos: number) {
    const yLine = document.createElement("div");
    setStyle(yLine, {
      display: "none",
      width: "1px",
      height: "100%",
      backgroundColor: this.options.color as string,
      position: "absolute",
      top: "0",
      left: "0",
      zIndex: "1000",
    });
    setPosition(yLine, { x: pos, y: 0 });
    this.bak.elem.appendChild(yLine);
    return yLine;
  }

  buildLines(): {
    vt: Line;
    vm: Line;
    vb: Line;
    hl: Line;
    hm: Line;
    hr: Line;
  } {
    const rect = getPosition(this.elem);
    const width = getWidth(this.elem);
    const height = getHeight(this.elem);

    return {
      vt: {
        pos: rect.y,
        type: "V",
        box: null,
        instance: this.createXLine(rect.y),
      },
      vm: {
        pos: rect.y + height / 2,
        type: "V",
        box: null,
        instance: this.createXLine(rect.y + height / 2),
      },
      vb: {
        pos: rect.y + height,
        type: "V",
        box: null,
        instance: this.createXLine(rect.y + height),
      },
      hl: {
        pos: rect.x,
        type: "H",
        box: null,
        instance: this.createYLine(rect.x),
      },
      hm: {
        pos: rect.x + width / 2,
        type: "H",
        box: null,
        instance: this.createYLine(rect.x + width / 2),
      },
      hr: {
        pos: rect.x + width,
        type: "H",
        box: null,
        instance: this.createYLine(rect.x + width),
      },
    };
  }

  addLines(lines: {
    vt: Line;
    vm: Line;
    vb: Line;
    hl: Line;
    hm: Line;
    hr: Line;
  }) {
    this.box = {
      ...lines,
      instance: this.elem,
    };
    for (const line in lines) {
      (lines as any)[line].pos = parseInt((lines as any)[line].pos);
      (lines as any)[line].box = this.box;
      this.bak.lines.insert((lines as any)[line]);
    }
  }

  // 处理resize以及drag时 的 标线
  handleMoveLine() {
    // 所有寻找到的标线
    let searchLines: Line[] = [];
    // 清除之前的线
    lineT.forEach((l) => {
      this.bak.lines.remove((this.box as any)[l]);
    });
    // this.bak.lines.disappear();

    const lines = this.buildLines();
    lineT.forEach((l) => {
      const nearLines = this.bak.lines.search(
        (this.box as any)[l],
        this.options.nearLineDistance as number
      );
      searchLines.push(...nearLines);
      this.bak.mayAttachLines[l] = nearLines;
    });
    searchLines = searchLines.filter((i) => i !== void 0);
    this.addLines(lines);
  }

  attach(e: MouseEvent) {
    const showLines = (tLines: Line[]) => {
      tLines.forEach((line) => {
        if (line) line.instance.style.display = "block";
      });
    };

    const sensitive = this.options.sensitive ? this.options.sensitive : 6;
    const curPos = getPosition(this.elem);
    let curLineH: any = null,
      curLineV: any = null,
      nearLineH: any = null,
      nearLineV: any = null;

    // 遍历所有line寻找到可能要进行吸附的一条水平线和一条垂直线
    lineT.forEach((l) => {
      const curLine = (this.box as any)[l];
      // 过滤掉不在视口中的元素
      this.bak.mayAttachLines[l] = this.bak.mayAttachLines[l]?.filter(
        (line: Line) =>
          !this.bak.excludeWindowSet.has(line.box?.instance as HTMLElement)
      );
      const nearLine = this.bak.mayAttachLines[l]?.length
        ? this.bak.mayAttachLines[l].reduce(
            (pre: any, cur: any) =>
              Math.abs(pre.pos - curLine.pos) < Math.abs(cur.pos - curLine.pos)
                ? pre
                : cur
            // 找出最接近的一条 这里之前写成两个一样的对比，所以出现了 会同时出现两条线的情况
          )
        : null;
      if (nearLine) {
        switch (curLine.type) {
          case "H":
            if (
              !curLineH ||
              Math.abs(nearLine.pos - curLine.pos) <
                Math.abs(nearLineH.pos - curLineH.pos)
            ) {
              curLineH = curLine;
              nearLineH = nearLine;
            }
            break;
          case "V":
            if (
              !curLineV ||
              Math.abs(nearLine.pos - curLine.pos) <
                Math.abs(nearLineV.pos - curLineV.pos)
            ) {
              curLineV = curLine;
              nearLineV = nearLine;
            }
            break;
        }
      }
    });

    // 先将所有line隐藏，然后再判断是否要显示线
    this.bak.lines.disappear();
    if (
      (!nearLineH && !nearLineV) ||
      (nearLineH && nearLineH.pos - curLineH.pos >= sensitive) ||
      (nearLineV && nearLineV.pos - curLineV.pos >= sensitive)
    ) {
      return;
    }
    showLines([nearLineH ?? undefined, nearLineV ?? undefined]);

    // 触发attach事件，交由drag组件进行是否贴合的判断
    this.eventBus.dispatch("attach", [
      "attach",
      {
        nearLineH: nearLineH?.pos,
        curLineH: curLineH?.pos,
        diffH: curLineH?.pos - curPos.x,
        nearLineV: nearLineV?.pos,
        curLineV: curLineV?.pos,
        diffV: curLineV?.pos - curPos.y,
      },
      sensitive,
      () => {
        this.handleMoveLine();
        this.resize?.setResize();
        this.bak.lines.disappear();
      },
    ]);
  }
}
