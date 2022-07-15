import { Line, Box, LineType } from "./index.d";

export default class Lines {
  vLines: number[];
  vMap: Map<number, Line[]>;
  hLines: number[];
  hMap: Map<number, Line[]>;
  constructor() {
    this.vLines = new Array();
    this.vMap = new Map();
    this.hLines = new Array();
    this.hMap = new Map();
  }

  insert(line: Line) {
    switch (line.type) {
      case "V":
        if (this.vMap.has(line.pos)) {
          (this.vMap.get(line.pos) as Line[]).push(line);
        } else {
          this.vMap.set(line.pos, [line]);
          this.vLines.push(line.pos);
        }
        break;
      case "H":
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
    switch (line.type) {
      case "V":
        const vt: any = this.vMap.get(line.pos);
        vt.splice(
          vt.findIndex((i: any) => i.box === line.box),
          1
        );
        if (vt.length === 0) {
          this.vLines.splice(this.vLines.findIndex((i: any) => i === line.pos));
          this.vMap.delete(line.pos);
        }
        break;
      case "H":
        const ht: any = this.hMap.get(line.pos);
        ht.splice(
          ht.findIndex((i: any) => i.box === line.box),
          1
        );
        if (ht.length === 0) {
          this.hLines.splice(this.hLines.findIndex((i: any) => i === line.pos));
          this.hMap.delete(line.pos);
        }
        break;
    }
    line.instance.parentNode?.removeChild(line.instance);
  }

  search(line: Line, dis: number) {
    switch (line.type) {
      case "V":
        const vt: any = this.vMap.has(line.pos) ? this.vMap.get(line.pos) : [];
        let vtl: any = [];
        let vtr: any = [];
        const nodeV: any = {
          left: null,
          right: null,
        };
        this.vLines.forEach((v) => {
          if (v < line.pos) {
            nodeV.left = v;
          } else if (v > line.pos) {
            nodeV.right = v;
          }
        });
        if (nodeV.left && Math.abs(line.pos - nodeV.left) <= dis) {
          vtl = this.vMap.get(nodeV.left);
        }
        if (nodeV.right && Math.abs(line.pos - nodeV.right) <= dis) {
          vtr = this.vMap.get(nodeV.right);
        }
        return vt.concat(vtl, vtr);
      case "H":
        const ht: any = this.hMap.has(line.pos) ? this.hMap.get(line.pos) : [];
        let htl: any = [];
        let htr: any = [];
        const nodeH: any = {
          left: null,
          right: null,
        };
        this.hLines.forEach((v) => {
          if (v < line.pos) {
            nodeH.left = v;
          } else if (v > line.pos) {
            nodeH.right = v;
          }
        });
        if (nodeH.left && Math.abs(line.pos - nodeH.left) <= dis) {
          htl = this.hMap.get(nodeH.left);
        }
        if (nodeH.right && Math.abs(line.pos - nodeH.right) <= dis) {
          htr = this.hMap.get(nodeH.right);
        }
        return ht.concat(htl, htr);
    }
  }

  disappear() {
    Array.from(this.vMap.keys()).forEach((k) => {
      this.vMap.get(k)?.forEach((line) => {
        line.instance.style.display = "none";
      });
    });
    Array.from(this.hMap.keys()).forEach((k) => {
      this.hMap.get(k)?.forEach((line) => {
        line.instance.style.display = "none";
      });
    });
  }
}
