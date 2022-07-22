import { Line, Box, LineType } from './index.d';

export default class Lines {
  vLines: number[];
  vMap: Map<number, Line[]>;
  hLines: number[];
  hMap: Map<number, Line[]>;
  constructor() {
    this.vLines = [];
    this.vMap = new Map();
    this.hLines = [];
    this.hMap = new Map();
  }

  insert(line: Line) {
    switch (line.type) {
      case 'V':
        if (this.vMap.has(line.pos)) {
          (this.vMap.get(line.pos) as Line[]).push(line);
        } else {
          this.vMap.set(line.pos, [line]);
          this.vLines.push(line.pos);
        }
        break;
      case 'H':
        if (this.hMap.has(line.pos)) {
          (this.hMap.get(line.pos) as Line[]).push(line);
        } else {
          this.hMap.set(line.pos, [line]);
          this.hLines.push(line.pos);
        }
        break;
    }
  }

  remove(line: Line) {
    const vt: any = this.vMap.get(line.pos);
    const idxV = this.vLines.findIndex((i) => i === line.pos);
    const ht: any = this.hMap.get(line.pos);
    const idxH = this.hLines.findIndex((i) => i === line.pos);
    switch (line.type) {
      case 'V':
        vt.splice(
          vt.findIndex((i: any) => i.box === line.box),
          1,
        );
        if (vt.length <= 0) {
          if (idxV !== -1) {
            this.vLines.splice(idxV, 1);
          }
          this.vMap.delete(line.pos);
        }
        break;
      case 'H':
        ht.splice(
          ht.findIndex((i: any) => i.box === line.box),
          1,
        );
        if (ht.length <= 0) {
          if (idxH !== -1) {
            this.hLines.splice(idxH, 1);
          }
          this.hMap.delete(line.pos);
        }
        break;
    }
    line.instance.parentNode?.removeChild(line.instance);
  }

  search(line: Line, dis: number) {
    const vt: any = this.vMap.has(line.pos) ? this.vMap.get(line.pos) : [];
    let vtl: any = [];
    let vtr: any = [];
    const nodeV: any = {
      left: null,
      right: null,
    };
    let htl: any = [];
    let htr: any = [];
    const nodeH: any = {
      left: null,
      right: null,
    };
    const ht: any = this.hMap.has(line.pos) ? this.hMap.get(line.pos) : [];
    switch (line.type) {
      case 'V':
        // !这里遍历需要处理
        this.vLines.forEach((v) => {
          if (v < line.pos) {
            if (nodeV.left === null) nodeV.left = v;
            if (nodeV.left !== null && v > nodeV.left) {
              nodeV.left = v;
            }
          }
          if (v > line.pos) {
            if (nodeV.right === null) nodeV.right = v;
            if (nodeV.right !== null && v < nodeV.right) {
              nodeV.right = v;
            }
          }
        });
        if (nodeV.left !== null && Math.abs(line.pos - nodeV.left) <= dis) {
          vtl = this.vMap.get(nodeV.left);
        }
        if (nodeV.right !== null && Math.abs(nodeV.right - line.pos) <= dis) {
          vtr = this.vMap.get(nodeV.right);
        }

        return Array.from(new Set(vt.concat(vtl, vtr))) as any;
      case 'H':
        this.hLines.forEach((v) => {
          if (v < line.pos) {
            if (nodeH.left === null) nodeH.left = v;
            if (nodeH.left !== null && v > nodeH.left) {
              nodeH.left = v;
            }
          }
          if (v > line.pos) {
            if (nodeH.right === null) nodeH.right = v;
            if (nodeH.right !== null && v < nodeH.right) {
              nodeH.right = v;
            }
          }
        });
        if (nodeH.left !== null && Math.abs(line.pos - nodeH.left) <= dis) {
          htl = this.hMap.get(nodeH.left);
        }
        if (nodeH.right !== null && Math.abs(nodeH.right - line.pos) <= dis) {
          htr = this.hMap.get(nodeH.right);
        }
        return Array.from(new Set(ht.concat(htl, htr))) as any;
    }
  }

  disappear() {
    let t = 0;
    Array.from(this.vMap.keys()).forEach((k) => {
      this.vMap.get(k)?.forEach((line) => {
        line.instance.style.display = 'none';
        t += 1;
      });
    });
    Array.from(this.hMap.keys()).forEach((k) => {
      this.hMap.get(k)?.forEach((line) => {
        line.instance.style.display = 'none';
        t += 1;
      });
    });
  }
}
