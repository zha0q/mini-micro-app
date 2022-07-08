import loadHtml from "./source";
import { effect, Sandbox } from "./mirror/sandbox";

export class CreateApp {
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

    this.sandbox = new Sandbox(this.name, url);
  }

  name = "";
  url = "";
  container = document.createElement("div");
  status = "created"; // 组件状态，包括 created/loading/mount/unmount
  sandbox: any = null;

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
    Array.from(cloneHtml.childNodes).forEach((node) => {
      fragment.appendChild(node);
    });

    this.container.appendChild(fragment);

    this.sandbox.start();
    // 这里绑定window不明
    this.source.scripts.forEach((info) => {
      (0, eval)(this.sandbox.bindScope(info.code));
    });
    // 当前script未运行完成？部分节点未挂载，所以要setTimeout
    // TODO: 资源地址补全不完善

    this.status = "mounted";
  }

  /**
   * 卸载应用
   * 执行关闭沙箱，清空缓存等操作
   * @param destory 是否完全销毁，删除缓存资源
   */
  unmount(destroy: boolean) {
    // 更新状态
    this.status = "unmount";
    // 清空容器
    this.container = document.createElement("div");
    if (destroy) {
      console.log("unmount!!", this.name);
      appInstanceMap.delete(this.name);
    }

    this.sandbox.stop();
  }
}

export class appInstanceMap {
  static mp: Map<string, CreateApp> = new Map();
  static set(name: string, app: CreateApp) {
    this.mp.set(name, app);
  }
  static get(name: string) {
    return this.mp.get(name);
  }
  static delete(name: string) {
    return this.mp.delete(name);
  }
}
