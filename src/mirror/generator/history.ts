import { getURL, setRouteURL, setRouteURLPart, toAbsoluteURL } from "./utils";

const PART_OF_URL = [];

export default class HistoryGenerator {
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
    sandbox.microWindow.HISTORY_PROXY = new Proxy({} as any, {
      get: (obj, prop) => {
        console.log(prop);
        switch (prop) {
          case "replaceState":
          case "pushState":
            return function (state: any, title: string, url: string) {
              if (url) {
                const absoluteURL = toAbsoluteURL(url, src);
                const newURL = setRouteURL(name, absoluteURL.href);

                if (location.href !== newURL.href) {
                  history[prop](state, title, newURL.href);
                }
              } else {
                return (history as any)[prop as string](state, title);
              }
            };
          case "back":
          case "go":
          case "forward":
            console.log((history as any)[prop]);
            return (history as any)[prop].bind(history);
        }
        return obj[prop];
      },

      set: (obj, prop, value) => {
        console.log("set", prop);
        obj[prop] = value;
        return true;
      },
      has: (obj, prop) => {
        return prop in history;
      },
    });
  }
}
