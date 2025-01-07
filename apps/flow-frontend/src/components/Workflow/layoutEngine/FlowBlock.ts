import { DisplayObject } from "./DisplayObject";

export class FlowBlock extends DisplayObject {
  next?: FlowBlock;
  parent?: FlowBlock;

  get id() {
    return this.flowNodeData.id;
  }

  constructor(public flowNodeData: WorkflowNode) {
    super();
  }

  setNext(block?: FlowBlock) {
    if (!block) {
      this.next = undefined;
      return this;
    }

    if (this.next) {
      block.setNext(this.next);
    }
    this.next = block;
    block.parent = this;

    return block;
  }

  break() {
    const { parent } = this;
    if (parent) {
      parent.next = this.next;
      if (this.next) {
        this.next.parent = parent;
      }
    }

    this.removeLink();
  }

  /**
   * 移除所有的链接,清除引用
   */
  removeLink() {
    this.next = undefined;
    this.parent = undefined;
  }
}
