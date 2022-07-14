import { RedBlackNode } from "./RedBlackTree/Node";
import RedBlackTree from "./RedBlackTree/RedBlackTree";

import { Line, Box, LineType } from "./index.d";

export default class Lines {
  vLines: RedBlackTree<number>;
  vMap: Map<number, Line[]>;
  hLines: RedBlackTree<number>;
  hMap: Map<number, Line[]>;
  constructor() {
    this.vLines = new RedBlackTree();
    this.vMap = new Map();
    this.hLines = new RedBlackTree();
    this.hMap = new Map();
  }

  insert(line: Line) {
    switch (line.type) {
      case "V":
        if (this.vMap.has(line.pos)) {
          (this.vMap.get(line.pos) as Line[]).push(line);
        } else {
          this.vMap.set(line.pos, [line]);
          this.vLines.insert(line.pos);
        }
        break;
      case "H":
        if (this.hMap.has(line.pos)) {
          (this.hMap.get(line.pos) as Line[]).push(line);
        } else {
          this.hMap.set(line.pos, [line]);
          this.hLines.insert(line.pos);
        }
        break;
    }
  }

  remove(line: Line) {
    switch (line.type) {
      case "V":
        const vt: any = this.vMap.get(line.pos);
        const idx = vt.findIndex((i: any) => i.box === line.box);
        vt.splice(idx, 1);
        console.log(vt);
        if (vt.length === 0) {
          this.vLines.remove(line.pos);
          this.vMap.delete(line.pos);
        }
        break;
      case "H":
        const ht: any = this.hMap.get(line.pos);
        ht.splice(
          ht.findIndex((i: any) => i.pos === line.pos),
          1
        );
        if (ht.length === 0) {
          this.hLines.remove(line.pos);
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
        this.vLines.inOrderTraverse((v) => {
          if (v < line.pos) {
            nodeV.left = v;
          } else if (v > line.pos) {
            nodeV.right = v;
          }
        });
        if (nodeV.left && line.pos - nodeV.left <= dis) {
          vtl = this.vMap.get(nodeV.left);
        }
        if (nodeV.right && nodeV.right - line.pos <= dis) {
          vtr = this.vMap.get(nodeV.right);
        }
        // console.log(vt, vtl, vtr, nodeV, this.vMap, this.vLines);
        return vt.concat(vtl, vtr);
      case "H":
        const ht: any = this.hMap.has(line.pos) ? this.hMap.get(line.pos) : [];
        let htl: any = [];
        let htr: any = [];
        const nodeH: any = {
          left: null,
          right: null,
        };
        this.hLines.inOrderTraverse((v) => {
          if (v < line.pos) {
            nodeH.left = v;
          } else if (v > line.pos) {
            nodeH.right = v;
          }
        });
        // console.log(nodeH, this.hMap, this.hLines);
        if (nodeH.left && line.pos - nodeH.left <= dis) {
          htl = this.hMap.get(nodeH.left);
        }
        if (nodeH.right && nodeH.right - line.pos <= dis) {
          htr = this.hMap.get(nodeH.right);
        }
        // console.log(htl, htr);
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
