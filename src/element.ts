import { appInstanceMap, CreateApp } from "./app";

// 自定义元素
class MyElement extends HTMLElement {
  // 声明需要监听的属性名，只有这些属性变化时才会触发attributeChangedCallback
  static get observedAttributes() {
    return ["name", "url"];
  }

  name: "";
  url: "";
  constructor(name: any, url: any) {
    super();
    this.name = name;
    this.url = url;
  }

  connectedCallback() {
    // 元素首次被插入到DOM时执行，此时去加载子应用的静态资源并渲染
    console.log("micro-app is connected");

    const app = new CreateApp({
      name: this.name,
      url: this.url,
      container: this,
    });
    console.log(appInstanceMap);
    appInstanceMap.set(this.name, app);
  }

  disconnectedCallback() {
    // 元素从DOM中删除时执行，此时进行一些卸载操作
    console.log("micro-app has disconnected");

    const app = appInstanceMap.get(this.name);
    app?.unmount(this.hasAttribute("destroy"));
  }

  attributeChangedCallback(attr: any, oldVal: any, newVal: any) {
    console.log("change!!!", attr, oldVal, newVal);
    // 元素属性发生变化时执行，可以获取name、url等属性的值
    // 分别记录name及url的值
    if (attr === "name" && !this.name && newVal) {
      this.name = newVal;
    } else if (attr === "url" && !this.url && newVal) {
      this.url = newVal;
    }
  }
}

/**
 * 注册元素
 * 注册后，就可以像普通元素一样使用micro-app，当micro-app元素被插入或删除DOM时即可触发相应的生命周期函数。
 */
export function defineElement() {
  // 如果已经定义过，则忽略
  if (!window.customElements.get("micro-app")) {
    window.customElements.define("micro-app", MyElement);
  }
}
