import ResizeObserver from "resize-observer-polyfill";

export type OberverCallback = (entry: ResizeObserverEntry) => any;

class ResizeObserverDispatcher {
  private resizeObserver: ResizeObserver;
  private observerEntryMap: WeakMap<Element, Set<OberverCallback>> =
    new WeakMap();
  constructor() {
    this.resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        for (const entry of entries) {
          const setCb = this.observerEntryMap.get(entry.target);

          if (!setCb) return;
          const cloneArraySet = Array.from(setCb);
          cloneArraySet.forEach((cb) => {
            cb(entry);
          });
        }
      }
    );
  }

  observe(target: Element, callback: OberverCallback) {
    this.resizeObserver.observe(target);
    let targetSet = this.observerEntryMap.get(target);
    if (!targetSet) {
      targetSet = new Set();
      this.observerEntryMap.set(target, targetSet);
    }
    targetSet.add(callback);
  }

  unobserve(target: Element, callback?: OberverCallback) {
    if (!target) return;
    if (!callback) {
      this.resizeObserver.unobserve(target);
      this.observerEntryMap.delete(target);
    } else {
      const targetSet = this.observerEntryMap.get(target);
      if (!targetSet) return;
      targetSet.delete(callback);
      if (targetSet.size === 0) {
        this.resizeObserver.unobserve(target);
        this.observerEntryMap.delete(target);
      }
    }
  }
}

export const ResizeObserverIns = new ResizeObserverDispatcher();
