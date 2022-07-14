import { Line, Box } from "./index.d";
import Drag from "./drag";
import Lines from "./lines";
import Resize from "./resize";
import grid from "./grid.svg";
import { getHeight, getWidth, setPosition, throttle } from "./utils";

type LineT = "vt" | "vm" | "vb" | "hl" | "hm" | "hr";

const lineT = ["vt", "vm", "vb", "hl", "hm", "hr"];

export class Bak {
  public lines: Lines;
  public showLines: Line[] = [];
  constructor(public elem: HTMLElement) {
    this.lines = new Lines();
    const svg = new Image(getWidth(this.elem), getHeight(this.elem));
    svg.src = grid;
    this.elem.appendChild(svg);
  }
}

export class Rndd {
  public drag: Drag | null = null;
  public resize: Resize | null = null;
  public box: Box | undefined;
  public rndLocation: any = {};

  //   public lines: Lines = ;
  constructor(
    public elem: HTMLElement,
    public bak: Bak,
    public options: {
      dragable: boolean;
      resizable: boolean;
    }
  ) {
    this.init();
  }

  init() {
    this.drag = new Drag(
      this.elem,
      (...v: any) => {
        this.handleMove();
      },
      this.options.resizable
    );
    this.resize = new Resize(this.elem);

    this.elem.style.position = "absolute";
    this.elem.style.left = "0";
    this.elem.style.top = "0";
    this.elem.style.zIndex = "100";

    const lines = this.buildLines();
    this.addLines(lines);
    const t: any = [];
    this.bak.lines.vLines.preOrderTraverse((v) => t.push(v));
    console.log(t, this.bak.lines.vMap);
    this.bak.lines.disappear();
    this.hideUserSelect();
  }

  // 清除双击选中效果，增加用户体验
  hideUserSelect() {
    this.elem.style.userSelect = "none";
  }

  createXLine(pos: number) {
    const xLine = document.createElement("div");
    const rect = this.bak.elem.getBoundingClientRect();
    xLine.style.width = "100%";
    xLine.style.height = "1px";
    xLine.style.backgroundColor = "#59c7f9";
    xLine.style.position = "absolute";
    xLine.style.top = `0`;
    xLine.style.left = "0";
    xLine.style.zIndex = "1000";
    setPosition(xLine, { x: 0, y: pos - rect.y });
    this.bak.elem.parentNode?.appendChild(xLine);
    return xLine;
  }

  createYLine(pos: number) {
    const yLine = document.createElement("div");
    const rect = this.bak.elem.getBoundingClientRect();
    yLine.style.width = "1px";
    yLine.style.height = "100%";
    yLine.style.backgroundColor = "#59c7f9";
    yLine.style.position = "absolute";
    yLine.style.top = "0";
    yLine.style.left = "0";
    yLine.style.zIndex = "1000";
    setPosition(yLine, { x: pos - rect.x, y: 0 });
    this.bak.elem.parentNode?.appendChild(yLine);
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
    const rect = this.elem.getBoundingClientRect();
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
    console.log(lines);
    for (const line in lines) {
      (lines as any)[line].pos = parseInt((lines as any)[line].pos);
      (lines as any)[line].box = this.box;
      this.bak.lines.insert((lines as any)[line]);
    }
  }

  // 处理resize以及drag时 的 标线
  handleMove() {
    // 所有寻找到的标线
    let searchLines: Line[] = [];
    // 清除之前的线
    lineT.forEach((l) => {
      this.bak.lines.remove((this.box as any)[l]);
    });
    this.bak.lines.disappear();

    const lines = this.buildLines();
    lineT.forEach((l) => {
      searchLines.push(...this.bak.lines.search((this.box as any)[l], 100));
    });
    searchLines = searchLines.filter((i) => i !== void 0);
    this.addLines(lines);
    this.showLines(searchLines);
  }

  showLines(tLines: Line[]) {
    tLines.forEach((line) => {
      line.instance.style.display = "block";
    });
    this.bak.showLines.push(...tLines);
    let t: any = [];
    this.bak.lines.vLines.preOrderTraverse((v) => t.push(v));
    console.log(t, this.bak.lines.vMap);
  }
}
