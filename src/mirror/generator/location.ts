import { getURL, setRouteURL, setRouteURLPart, toAbsoluteURL } from "./utils";

const PART_OF_URL = [
  "href",
  "origin",
  "protocol",
  "host",
  "hostname",
  "port",
  "pathname",
  "search",
  "hash",
  "username",
  "password",
];

export default class LocationGenerator {
  private sandbox: any;
  private name: any;
  private src: any;
  private routeSyncMode: any;

  constructor(options: any) {
    this.sandbox = options.sandbox;
    this.name = options.name;
    this.src = options.src;
    this.routeSyncMode = options.routeSyncMode;
  }

  public run() {
    const { sandbox, name, src, routeSyncMode } = this;
    sandbox.microWindow.LOCATION_PROXY = new Proxy({} as any, {
      get: (obj, prop: any) => {
        const innerURL: any = getURL(name, src);

        if (typeof prop === "string" && PART_OF_URL.includes(prop)) {
          return innerURL[prop];
        }

        // 判断是否为hash路由下组建的初始化触发的replace
        // 是的话设置一下hash触发setter进行子应用路由初始化
        let flag = false;
        if (prop === "replace" && !flag) {
          console.log("first replace");
          flag = true;
          return () =>
            Reflect.set(sandbox.microWindow.LOCATION_PROXY, "hash", "");
        }

        switch (prop) {
          case "replace":
          case "assign":
            return function (url: string) {
              const absoluteURL = toAbsoluteURL(url, src);
              const newURL = setRouteURL(name, absoluteURL.href);
              console.log(location, prop, newURL.href);

              return (location as any)[prop as string](newURL.href);
            };
          case "reload":
            return location.reload.bind(location);
          default:
        }
        return obj[prop];
      },

      set: (obj, prop, value) => {
        // hash模式时会通过修改hash然后replace来修改路由
        if (prop === "hash") {
          console.log(name);
          // 传入的是对象，要把参数名附上
          const newURL = setRouteURLPart({
            name,
            partName: prop,
            partValue: value,
            base: src,
          });

          history.pushState({}, "", newURL.href);

          const newEvent = new HashChangeEvent("hashchange");
          sandbox.microWindow.dispatchEvent(newEvent);

          return true;
        }
        console.log("#213123321312");
        return obj[prop];
      },
    });
  }
}
