import { Line, Box } from "./index.d";
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
} from "./utils";

type LineT = "vt" | "vm" | "vb" | "hl" | "hm" | "hr";

const lineT = ["vt", "vm", "vb", "hl", "hm", "hr"];

export class Bak {
  public lines: Lines;
  public mayAttachLines: any = {};
  constructor(public elem: HTMLElement) {
    this.lines = new Lines();
    const svg = new Image(getWidth(this.elem), getHeight(this.elem));
    svg.src = grid;
    this.elem.appendChild(svg);

    this.elem.style.position = "relative";
  }
}

export class Rnd {
  public drag: Drag | null = null;
  public resize: Resize | null = null;
  public box: Box | undefined;
  public rndLocation: any = {};

  public eventBus: EventBus = new EventBus();

  constructor(
    public elem: HTMLElement,
    public bak: Bak,
    public options: {
      draggable: boolean;
      resizable: boolean;
      color?: string;
      nearLineDistance?: number;
      sensitive?: number;
    }
  ) {
    this.init();
  }

  init() {
    if (!this.options.color) this.options.color = "red";
    if (!this.options.nearLineDistance) this.options.nearLineDistance = 0;
    if (!this.options.sensitive) this.options.sensitive = 0;

    this.resize = new Resize(this.elem, this.eventBus, this.options.color);
    this.drag = new Drag(
      this.elem,
      this.eventBus,
      this.options.resizable,
      this.attach.bind(this)
    );

    this.elem.style.position = "absolute";
    this.elem.style.left = "0";
    this.elem.style.top = "0";
    this.elem.style.zIndex = "100";

    const lines = this.buildLines();
    this.addLines(lines);
    const t: any = [];
    this.bak.lines.disappear();
    this.hideUserSelect();

    this.eventBus.on("drag", (e: MouseEvent) => {
      this.attach(e);
    });
    this.eventBus.on("resize", (e: MouseEvent) => {
      this.handleMoveLine();
    });

    document.addEventListener("mouseup", (e) => this.bak.lines.disappear());
  }

  // 清除双击选中效果，增加用户体验
  hideUserSelect() {
    this.elem.style.userSelect = "none";
  }

  createXLine(pos: number) {
    const xLine = document.createElement("div");
    const rect = this.bak.elem.getBoundingClientRect();
    xLine.style.display = "none";
    xLine.style.width = "100%";
    xLine.style.height = "1px";
    xLine.style.backgroundColor = this.options.color as string;
    xLine.style.position = "absolute";
    xLine.style.top = "0";
    xLine.style.left = "0";
    xLine.style.zIndex = "1000";
    setPosition(xLine, { x: 0, y: pos });
    this.bak.elem.appendChild(xLine);
    return xLine;
  }

  createYLine(pos: number) {
    const yLine = document.createElement("div");
    const rect = this.bak.elem.getBoundingClientRect();
    yLine.style.display = "none";
    yLine.style.width = "1px";
    yLine.style.height = "100%";
    yLine.style.backgroundColor = this.options.color as string;
    yLine.style.position = "absolute";
    yLine.style.top = "0";
    yLine.style.left = "0";
    yLine.style.zIndex = "1000";
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

  showLines(tLines: Line[]) {
    tLines.forEach((line) => {
      line.instance.style.display = "block";
    });
  }

  attach(e: MouseEvent) {
    const sensitive = this.options.sensitive ? this.options.sensitive : 6;
    const curPos = getPosition(this.elem);
    lineT.forEach((l) => {
      const curLine = (this.box as any)[l];
      const nearLine =
        this.bak.mayAttachLines[l] && this.bak.mayAttachLines[l].length
          ? this.bak.mayAttachLines[l].reduce((pre: any, cur: any) =>
              Math.min(
                // 这里之前写成两个一样的对比，所以出现了 会同时出现两条线的情况
                Math.abs(pre.pos - curLine.pos),
                Math.abs(cur.pos - curLine.pos)
              )
            )
          : null;

      if (!nearLine || nearLine.pos - curLine.pos >= sensitive) return;
      this.bak.lines.disappear();

      this.showLines([nearLine]);

      switch (nearLine.type) {
        case "H":
          console.log(curPos.x, curLine, curLine.pos - curPos.x);
          this.eventBus.dispatch("attach", [
            "H",
            {
              nearLine: nearLine.pos,
              curLine: curLine.pos,
              diff: curLine.pos - curPos.x,
            },
            sensitive,
            () => {
              this.handleMoveLine();
              this.resize?.setResize();
            },
          ]);
          break;
        case "V":
          this.eventBus.dispatch("attach", [
            "V",
            {
              curLine: curLine.pos,
              nearLine: nearLine.pos,
              diff: curLine.pos - curPos.y,
            },
            sensitive,
            () => {
              this.handleMoveLine();
              this.resize?.setResize();
            },
          ]);
          break;
      }
    });

    this.resize?.setResize();
    this.handleMoveLine();
  }
}
