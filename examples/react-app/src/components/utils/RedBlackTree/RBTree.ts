/**
 * Created by chery on 25.04.2018.
 */

 export class RedBlackTree {
    private root: TreeNodeNullable;

    constructor() {
        this.root = null;
    }

    public insert(key: number): void {
        let treeNode: TreeNode = new TreeNode(key);
        if (this.root === null) {
            this.root = treeNode;
        } else {
            let currentNode: TreeNode = this.root;
            let nextNode: TreeNodeNullable = currentNode;

            while (nextNode !== null) {
                currentNode = nextNode;
                if (currentNode.key > treeNode.key) {
                    nextNode = currentNode.left;
                } else if (currentNode.key < treeNode.key) {
                    nextNode = currentNode.right;
                } else {
                    return; // return if node with that key already exists
                }
            }

            if (currentNode.key > treeNode.key) {
                currentNode.left = treeNode;
            } else {
                currentNode.right = treeNode;
            }
            treeNode.parent = currentNode;
        }

        this.insertCase1(treeNode); // need to change root after all rotations
        while (treeNode.parent !== null) {
            treeNode = treeNode.parent;
        }
        this.root = treeNode;
    }

    public insertMany(keys: Array<number>, afterEach?: Function): void {
        keys.forEach(key => {
            this.insert(key);
            if (afterEach) {
                afterEach();
            }
        });
    }

    private find(key: number): TreeNodeNullable {
        let currentNode: TreeNodeNullable = this.root;
        while (currentNode !== null && currentNode.key !== key) {
            if (currentNode.key > key) {
                currentNode = currentNode.left;
            } else {
                currentNode = currentNode.right;
            }
        }

        return currentNode;
    }

    private sibling(treeNode: TreeNode): TreeNodeNullable {
        if (treeNode.parent === null) {
            return null;
        }

        if (treeNode === treeNode.parent.left) {
            return treeNode.parent.right;
        } else {
            return treeNode.parent.left;
        }
    }

    private replaceNode(toReplace: TreeNode, replaceBy: TreeNodeNullable): void {
        if (toReplace.parent !== null) {
            if (toReplace.parent.left === toReplace) {
                toReplace.parent.left = replaceBy;
            } else {
                toReplace.parent.right = replaceBy;
            }
        } else {
            this.root = replaceBy;
        }

        if (replaceBy !== null) {
            replaceBy.parent = toReplace.parent;
        }
    }

    public remove(key: number): void {
        let nodeToRemove: TreeNodeNullable = this.find(key);
        if (nodeToRemove === null) {
            return;
        }

        let closestValueNode: TreeNodeNullable = null;
        if (nodeToRemove.left !== null) {
            let leftSubTree: TreeNode = nodeToRemove.left;
            while (leftSubTree.right !== null) {
                leftSubTree = leftSubTree.right;
            }
            closestValueNode = leftSubTree;
        } else if (nodeToRemove.right !== null) {
            let rightSubTree: TreeNode = nodeToRemove.right;
            while (rightSubTree.left !== null) {
                rightSubTree = rightSubTree.left;
            }
            closestValueNode = rightSubTree;
        }

        if (closestValueNode !== null) {
            let temp: number = nodeToRemove.key;
            nodeToRemove.key = closestValueNode.key;
            closestValueNode.key = temp;
            nodeToRemove = closestValueNode;
        }

        let child: TreeNodeNullable = nodeToRemove.right === null ? nodeToRemove.left : nodeToRemove.right;
        if (child === null) { // just to make it a node, not null
            child = new TreeNode(null);
            child.color = TreeColors.black;
        }

        this.replaceNode(nodeToRemove, child);
        if (nodeToRemove.color === TreeColors.black) {
            if (child.color === TreeColors.red) {
                child.color = TreeColors.black;
            } else {
                this.removeCase1(child);
            }
        }

        if (child.isLeaf) {

            this.replaceNode(child, null);
        }
    }

    private removeCase1(treeNode: TreeNode): void {
        if (treeNode.parent !== null) {
            this.removeCase2(treeNode);
        }
    }

    private removeCase2(treeNode: TreeNode): void {
        let sibling: TreeNodeNullable = this.sibling(treeNode);

        if (sibling !== null && sibling.color === TreeColors.red) {
            treeNode.parent!.color = TreeColors.red;
            sibling.color = TreeColors.black;
            if (treeNode.parent!.right === treeNode) {
                this.rotateRight(<TreeNode>treeNode.parent);
            } else {
                this.rotateLeft(<TreeNode>treeNode.parent);
            }
        }
        this.removeCase3(treeNode);
    }

    private removeCase3(treeNode: TreeNode): void {
        let sibling: TreeNode = <TreeNode>this.sibling(treeNode);

        if (treeNode.parent!.color === TreeColors.red &&
            sibling.color === TreeColors.black &&
            (sibling.left === null || sibling.left!.color === TreeColors.black) &&
            (sibling.right === null || sibling.right!.color === TreeColors.black)) {
            sibling.color = TreeColors.red;
            this.removeCase1(<TreeNode>treeNode.parent);
        } else {
            this.removeCase4(treeNode);
        }
    }

    private removeCase4(treeNode: TreeNode): void {
        let sibling: TreeNode = <TreeNode>this.sibling(treeNode);

        if (treeNode.parent!.color === TreeColors.red &&
            sibling.color === TreeColors.black &&
            (sibling.left === null || sibling.left!.color === TreeColors.black) &&
            (sibling.right === null || sibling.right!.color === TreeColors.black)) {
            sibling.color = TreeColors.red;
            treeNode.parent!.color = TreeColors.black
        } else  {
            this.removeCase5(treeNode);
        }
    }

    private removeCase5(treeNode: TreeNode): void {
        let sibling: TreeNode = <TreeNode>this.sibling(treeNode);

        if (sibling.color === TreeColors.black) {
            if (treeNode === treeNode.parent!.left &&
                (sibling.right === null || sibling.right!.color === TreeColors.black) &&
                (sibling.left !== null && sibling.left.color === TreeColors.red)) {
                sibling.color = TreeColors.red;
                sibling.left!.color = TreeColors.black;
                this.rotateRight(sibling);
            } else if (treeNode === treeNode.parent!.right &&
                        (sibling.left === null || sibling.left!.color === TreeColors.black) &&
                        (sibling.right !== null && sibling.right.color === TreeColors.red)) {
                sibling.color = TreeColors.red;
                sibling.right!.color = TreeColors.black;
                this.rotateLeft(sibling);
            }
        }
        this.removeCase6(treeNode);
    }

    private removeCase6(treeNode: TreeNode): void {
        let sibling: TreeNode = <TreeNode>this.sibling(treeNode);

        sibling.color = treeNode.parent!.color;
        if (treeNode === treeNode.parent!.left) {
            sibling.right!.color = TreeColors.black;
            this.rotateLeft(<TreeNode>treeNode.parent);
        } else {
            sibling.left!.color = TreeColors.black;
            this.rotateRight(<TreeNode>treeNode.parent);
        }
    }

    public toString(): string {
        return this.print(this.root, 0);
    }

    private print(treeNode: TreeNodeNullable, n: number): string {
        let res: string = "";
        if (treeNode !== null) {
            res += this.print(treeNode.right, n + 5);
            for (let i = 0; i < n; i++) {
                res += " ";
            }
            res += (treeNode.color === TreeColors.red ? "\x1b[31m" : "") + treeNode.key.toString() + "\x1b[0m" + "\n";
            res += this.print(treeNode.left, n + 5);
        }
        return res;
    }

    private grandparent(treeNode: TreeNodeNullable): TreeNodeNullable {
        if (treeNode !== null && treeNode.parent !== null) {
            return treeNode.parent.parent; // also will return null, if parent has no parent. It's ok.
        } else {
            return null;
        }
    }

    private uncle(treeNode: TreeNodeNullable): TreeNodeNullable {
        const grandparent: TreeNodeNullable = this.grandparent(treeNode);
        if (grandparent === null) {
            return null;
        }

        if (treeNode!.parent === grandparent.left) {
            return grandparent.right;
        } else {
            return grandparent.left;
        }
    }

    private rotateLeft(treeNode: TreeNode): void {
        let pivot: TreeNodeNullable = treeNode.right;
        if (pivot === null)
            return;

        pivot.parent = treeNode.parent;
        if (treeNode.parent !== null) {
            if (treeNode.parent.left === treeNode) {
                treeNode.parent.left = pivot;
            } else {
                treeNode.parent.right = pivot;
            }
        }

        treeNode.right = pivot.left;
        if (pivot.left !== null) {
            pivot.left.parent = treeNode;
        }

        treeNode.parent = pivot;
        pivot.left = treeNode;
    }

    private rotateRight(treeNode: TreeNode): void {
        let pivot: TreeNodeNullable = treeNode.left;
        if (pivot === null)
            return;

        pivot.parent = treeNode.parent;
        if (treeNode.parent !== null) {
            if (treeNode.parent.left === treeNode) {
                treeNode.parent.left = pivot;
            } else {
                treeNode.parent.right = pivot;
            }
        }

        treeNode.left = pivot.right;
        if (pivot.right !== null) {
            pivot.right.parent = treeNode;
        }

        treeNode.parent = pivot;
        pivot.right = treeNode;
    }

    // if treeNode is in root
    private insertCase1(treeNode: TreeNode): void {
        if (treeNode.parent === null) {
            treeNode.color = TreeColors.black;
        } else {
            this.insertCase2(treeNode);
        }
    }

    // if parent of treeNode is black
    private insertCase2(treeNode: TreeNode): void {
        if (treeNode.parent!.color === TreeColors.black) {
            return;
        } else {
            this.insertCase3(treeNode);
        }
    }

    // if parent and uncle are red
    private insertCase3(treeNode: TreeNode): void {
        let uncle: TreeNodeNullable = this.uncle(treeNode);

        if (uncle !== null && uncle.color === TreeColors.red) {
            treeNode.parent!.color = TreeColors.black;
            uncle.color = TreeColors.black;

            let grandparent: TreeNode = <TreeNode>this.grandparent(treeNode);
            grandparent.color = TreeColors.red;
            this.insertCase1(grandparent);
        } else {
            this.insertCase4(treeNode);
        }
    }

    // if parent is red, but uncle is not and treeNode is the left son while parent is right son
    // or treeNode is right son and parent is left son
    private insertCase4(treeNode: TreeNode): void {
        let grandparent: TreeNode = <TreeNode>this.grandparent(treeNode);

        if (treeNode.parent!.right === treeNode && grandparent.left === treeNode.parent) {
            this.rotateLeft(<TreeNode>treeNode.parent);

            treeNode = <TreeNode>treeNode.left;
        } else if (treeNode.parent!.left === treeNode && grandparent.right === treeNode.parent) {
            this.rotateRight(<TreeNode>treeNode.parent);

            treeNode = <TreeNode>treeNode.right;
        }

        this.insertCase5(treeNode);
    }

    // last case
    private insertCase5(treeNode: TreeNode): void {
        let grandparent: TreeNode = <TreeNode>this.grandparent(treeNode);

        treeNode.parent!.color = TreeColors.black;
        grandparent.color = TreeColors.red;

        if (treeNode.parent!.left === treeNode && grandparent.left === treeNode.parent) {
            this.rotateRight(grandparent);
        } else {
            this.rotateLeft(grandparent);
        }
    }


}

type TreeNodeNullable = TreeNode | null;

class TreeNode {
    public parent: TreeNodeNullable;
    public left: TreeNodeNullable;
    public right: TreeNodeNullable;
    public color: TreeColors;
    public key: number = 0;
    public isLeaf: boolean = false;

    constructor(key: number | null) {
        this.parent = null;
        this.left = null;
        this.right = null;
        this.color = TreeColors.red;
        if (key !== null) {
            this.key = key;
        } else {
            this.isLeaf = true;
        }
    }
}

enum TreeColors {
    red,
    black
}