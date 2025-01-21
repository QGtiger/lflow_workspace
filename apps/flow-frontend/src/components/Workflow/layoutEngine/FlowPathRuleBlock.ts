import { FlowBlock } from "./FlowBlock";
import { traceBlock } from "./utils";

export class FlowPathRuleBlock extends FlowBlock {
  queryViewHeight(this: FlowBlock): number {
    if (this.viewHeight) return this.viewHeight;
    let vh = this.h + this.mb;
    if (this.next) {
      traceBlock(this.next, (block) => {
        vh += block.queryViewHeight() + block.mb;
      });
    }

    this.viewHeight = vh;
    return vh;
  }

  queryViewWidth(): number {
    if (this.viewWidth) return this.viewWidth;
    let vw = this.w;
    if (this.next) {
      traceBlock(this.next, (block) => {
        vw = Math.max(vw, block.queryViewWidth());
      });
    }

    this.viewWidth = vw;
    return vw;
  }
}
