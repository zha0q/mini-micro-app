import { Bak, Rnd } from './index';
import { Layout, RndOptions, Box } from './index.d';

// 自定义元素
class MyRndElement extends HTMLElement {
  // 声明需要监听的属性名，只有这些属性变化时才会触发attributeChangedCallback
  static get observedAttributes() {
    return ['transformscale'];
  }
  private rnd: any;
  constructor() {
    super();
  }

  connectedCallback() {
    // 元素首次被插入到DOM时执行，此时去加载子应用的静态资源并渲染
    (this.parentElement as HTMLElement).dispatchEvent(
      new CustomEvent('init', {
        detail: {
          cb: (bak: Bak) => {
            console.log('init', this);
            this.rnd = new Rnd(this, bak, {
              default: {
                x: this.getAttribute('x'),
                y: this.getAttribute('y'),
                width: this.getAttribute('w'),
                height: this.getAttribute('h'),
              },
              draggable: this.getAttribute('dragable') === 'true',
              resizable: this.getAttribute('resizable') === 'true',
              color: this.getAttribute('color'),
              sensitive: this.getAttribute('sensitive'),
              nearLineDistance: this.getAttribute('nearLineDistance'),
              transformScale: this.getAttribute('transformScale'),
            } as any);
          },
        },
      }),
    );
  }

  disconnectedCallback() {
    // Rnd被删除时执行元素以及相关元素的销毁
    // 去除drag
    this.rnd.drag.remove();
    // 去除resize
    this.rnd.resize.remove();
    // 去除line
    Object.keys(this.rnd.box as Box).forEach((k) => {
      if (k === 'instance') return;
      this.rnd.bak.elem.removeChild((this.rnd.box as any)[k].instance);
    });
    this.rnd.bak.containRnd = this.rnd.bak.containRnd.filter(
      (rnd: Rnd) => rnd.elem !== this.rnd.elem,
    );
  }

  attributeChangedCallback(attr: any, oldVal: any, newVal: any) {
    // 元素属性发生变化时执行，可以获取属性的值
    if (!this.rnd) return;
    switch (attr) {
      case 'transformscale':
        this.rnd && (this.rnd.options.transformScale = newVal);
        break;
      case 'dragable':
        this.rnd.options.dragable = newVal === 'true';
        newVal === 'true' ? this.rnd.dragInit() : this.rnd.drag.remove();
        break;
      case 'resizable':
        this.rnd.options.resizable = newVal === 'true';
        newVal === 'true' ? this.rnd.resizeInit() : this.rnd.resize.remove();
        break;
    }
  }
}

// 自定义元素
class MyRndBakElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // 元素首次被插入到DOM时执行
    const bak = new Bak(this);
    this.addEventListener('init', (e: any) => {
      e.detail.cb(bak);
    });
  }

  // disconnectedCallback() {
  //   // 元素从DOM中删除时执行，此时进行一些卸载操作
  // }

  // attributeChangedCallback(attr: any, oldVal: any, newVal: any) {
  //   // 元素属性发生变化时执行，可以获取属性
  // }
}

/**
 * 注册元素
 * 注册后，就可以像普通元素一样使用micro-app，当micro-app元素被插入或删除DOM时即可触发相应的生命周期函数。
 */
export function defineElement() {
  // 如果已经定义过，则忽略
  if (!window.customElements.get('rnd-elem')) {
    window.customElements.define('rnd-elem', MyRndElement);
  }

  if (!window.customElements.get('rnd-bak')) {
    window.customElements.define('rnd-bak', MyRndBakElement);
  }
}
