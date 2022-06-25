import loadHtml from "./source";

export default class CreateApp {
  constructor({
    name,
    url,
    container,
  }: {
    name: string;
    url: string;
    container: any;
  }) {
    this.name = name; // 应用名称
    this.url = url; // url地址
    this.container = container; // micro-app元素
    this.status = "loading";
    loadHtml(this);
  }

  name = "";
  url = "";
  container = document.createElement("div");
  status = "created"; // 组件状态，包括 created/loading/mount/unmount

  loadCount = 0;

  // 存放应用的静态资源
  source = {
    html: document.createElement("div"),
    links: new Map(), // link元素对应的静态资源
    scripts: new Map(), // script元素对应的静态资源
  };

  // 资源加载完时执行
  onLoad(htmlDom: any) {
    this.loadCount = this.loadCount ? this.loadCount + 1 : 1;

    if (this.loadCount === 2 && this.status !== "unmount") {
      this.source.html = htmlDom;
      this.mount();
    }
  }

  /**
   * 资源加载完成后进行渲染
   */
  mount() {
    const cloneHtml = this.source.html.cloneNode(true);

    const fragment = document.createDocumentFragment();
    console.log(cloneHtml);
    Array.from(cloneHtml.childNodes).forEach((node) => {
      fragment.appendChild(node);
    });

    this.container.appendChild(fragment);

    this.source.scripts.forEach((info) => {
      (0, eval)(info.code);
    });

    this.status = "mounted";
  }

  /**
   * 卸载应用
   * 执行关闭沙箱，清空缓存等操作
   */
  unmount() {}
}
