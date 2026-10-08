export class LazyLoader {
  private observer: IntersectionObserver;

  constructor(rootMargin = "200px") {
    this.observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        const cb = this.callbacks.get(el);
        cb?.(el);
        this.unobserve(el);
      }
    }, { rootMargin });
  }

  private callbacks = new WeakMap<Element, (el: HTMLElement) => void>();

  observe(el: HTMLElement, onVisible: (el: HTMLElement) => void): void {
    this.callbacks.set(el, onVisible);
    this.observer.observe(el);
  }

  unobserve(el: Element): void {
    this.observer.unobserve(el);
    this.callbacks.delete(el);
  }

  static loadImage = (el: HTMLElement): void => {
    const img = el as HTMLImageElement;
    if (img.dataset.src) img.src = img.dataset.src;
  };

  disconnect(): void { this.observer.disconnect(); }
}

export const lazyLoader = new LazyLoader();