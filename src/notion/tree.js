// Given a Notion page ID, builds a tree of all descendant blocks and their relationships (parent, children, siblings).

const notion = require('./client');
const api = require('./api');

class Tree {
    constructor(pageId) {
        this.pageId = pageId;
        this.root = new Node({ id: pageId, type: 'page'});
        this.mapById = new Map();
        this.mapById.set(pageId, this.root);
    }

    async buildTree(node = this.root) {
        const childrenBlocks = await api.getAllChildren(node.id);
        for (const block of childrenBlocks) {
            const childNode = new Node(block);
            node.addChild(childNode);
            this.mapById.set(childNode.id, childNode);
            await this.buildTree(childNode); // Recursively build the tree for all descendant nodes
        }
    }

    print(node = this.root, indent = 0, recursive = true) {
        const indentStr = ' '.repeat(indent);

        // Join all rich_text fragments if more than one, and handle both plain text and links
        var content = '';
        if (node.content) {
            for (const rt of node.content.rich_text) {
                content += JSON.stringify(rt[rt.type]);
            }
        }
        content = content || 'undefined'; // Handle case where content is null or empty

        // Print line
        console.log(`${indentStr}${node.type}  ${content}  (id: ${node.id})`);

        // Continue recursively printing children
        if (!recursive) return;
        for (const child of node.children) {
            this.print(child, indent + 2, recursive);
        }
    }
}


class Node {
    constructor(block, parent = null) {
        this.id = block?.id ?? null;
        this.type = block?.type ?? "page";
        this.content = block?.[this.type] ?? null; // e.g. if type is "paragraph", content will be block.paragraph
        this.parent = parent;
        this.children = [];
        this.previousSibling = null;
        this.nextSibling = null;
        this.raw = block ?? null;
    }

    addChild(childNode) {
        if (this.children.length > 0) {
            const previousSibling = this.children[this.children.length - 1];
            previousSibling.nextSibling = childNode;
            childNode.previousSibling = previousSibling;
        }
        childNode.parent = this;
        this.children.push(childNode);
    }

    getParent() {
        return this.parent;
    }

    getPreviousSibling() {
        return this.previousSibling;
    }

    getNextSibling() {
        return this.nextSibling;
    }

    getChildren() {
        return this.children;
    }
}

module.exports = Tree;