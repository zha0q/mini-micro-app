import { MyAVLTree } from "./avlTree";
import { Line, Box, LineType } from "./index.d";

export default class Lines {
  vLines: MyAVLTree;
  hLines: MyAVLTree;
  lineSet: Set<Line>;
  constructor() {
    this.vLines = new MyAVLTree();
    this.hLines = new MyAVLTree();
    this.lineSet = new Set();
  }

  insert(line: Line) {
    this.lineSet.add(line);
    switch (line.type) {
      case "V": {
        const findNode = this.vLines.get(line.pos);
        if (findNode) {
          findNode.push(line);
        } else {
          this.vLines.add(line.pos, [line]);
        }
        break;
      }
      case "H": {
        const findNode = this.hLines.get(line.pos);
        if (findNode) {
          findNode.push(line);
        } else {
          this.hLines.add(line.pos, [line]);
        }
        break;
      }
    }
  }

  remove(line: Line) {
    this.lineSet.delete(line);
    switch (line.type) {
      case "V": {
        const findNode = this.vLines.get(line.pos);
        if (findNode) {
          const idx = findNode.findIndex(
            (i: any) => i.instance === line.instance
          );
          findNode.splice(idx, 1);
          if (findNode.length === 0) this.vLines.remove(line.pos);
        }
        break;
      }
      case "H": {
        const findNode = this.hLines.get(line.pos);
        if (findNode) {
          const idx = findNode.findIndex(
            (i: any) => i.instance === line.instance
          );
          findNode.splice(idx, 1);
          if (findNode.length === 0) this.hLines.remove(line.pos);
        }
        break;
      }
    }
    line.instance.parentNode?.removeChild(line.instance);
  }

  search(line: Line, dis: number) {
    const root = line.type === "V" ? this.vLines.root : this.hLines.root;
    let resPos: number = Number.MAX_SAFE_INTEGER,
      resLines: Line[] = [],
      selfLines: Line[] = [];

    // 找小于line的所有线中最接近的那条线
    const dfsL = (node: any) => {
      if (!node) return;
      // 小于等于 找左边
      if (line.pos <= node.key) {
        if (line.pos === node.key) selfLines = node.value;
        if (
          line.pos !== node.key &&
          node.key - line.pos <= dis &&
          node.key - line.pos < resPos
        ) {
          resPos = node.key - line.pos;
          resLines = node.value;
        }
        dfsL(node.left);
      }
      // 大于 找右边即可
      else if (line.pos > node.key) {
        dfsL(node.right);
      }
    };

    // 找大于line的所有线中最接近的那条线
    const dfsR = (node: any) => {
      if (!node) return;
      // 大于等于 找右边
      if (line.pos >= node.key) {
        if (line.pos === node.key) selfLines = node.value;
        if (
          line.pos !== node.key &&
          line.pos - node.key <= dis &&
          line.pos - node.key < resPos
        ) {
          resPos = line.pos - node.key;
          resLines = node.value;
        }
        dfsR(node.right);
      }
      // 大于 找右边即可
      else if (line.pos < node.key) {
        dfsL(node.left);
      }
    };

    dfsL(root);
    dfsR(root);

    console.log(root, [...resLines, ...selfLines]);
    return [...resLines, ...selfLines];
  }

  disappear() {
    for (let line of this.lineSet) {
      line.instance.style.display = "none";
    }
  }
}
