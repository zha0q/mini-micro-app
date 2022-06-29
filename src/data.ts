import { appInstanceMap } from "./app";

class EventCenter {
  eventList = new Map();
  on(name: string, f: void) {
    const eventInfo = this.eventList.get(name) || {
      data: "",
      callback: new Set(),
    };
    if (!this.eventList.get(name)) {
      this.eventList.set(name, eventInfo);
    }
    eventInfo.callback.add(f);
  }

  off(name: string, f?: void | undefined) {
    const eventInfo = this.eventList.get(name);
    if (eventInfo) {
      if (f === void 0) {
        eventInfo.callback.delete(f);
      } else {
        eventInfo.callback = new Set();
      }
    }
  }

  dispatch(name: string, data: any) {
    const eventInfo = this.eventList.get(name);
    if (eventInfo && eventInfo.data !== data) {
      eventInfo.data = data;
      eventInfo.callback.forEach((cb: any) => {
        cb(data);
      });
    }
  }
}

const eventCenter = new EventCenter();

/* 格式化事件名称，保证基座应用和子应用的绑定通信
 * @param appName 应用名称
 * @param fromBaseApp 是否从基座应用发送数据
 */
function formatEventName(appName: string | null, fromBaseApp: any) {
  if (typeof appName !== "string" || !appName) return "";
  return fromBaseApp
    ? `__from_base_app_${appName}__`
    : `__from_micro_app_${appName}__`;
}

export class EventCenterForBaseApp {
  setData(appName: string | null, data: any) {
    eventCenter.dispatch(formatEventName(appName, true), data);
  }
  clearDataListener(appName: any) {
    eventCenter.off(formatEventName(appName, false));
  }
}

export class EventCenterForMicroApp {
  appName: string | null = "";
  constructor(appName: string | null) {
    this.appName = appName;
  }
  addDataListener(f: void) {
    eventCenter.on(formatEventName(this.appName, true), f);
  }
  removeDataListener(f: void) {
    eventCenter.off(formatEventName(this.appName, true), f);
  }
  dispatch(data: any) {
    const app = appInstanceMap.get(this.appName as string);
    if (app?.container) {
      const event = new CustomEvent("datachange", {
        detail: data,
      });
      app.container.dispatchEvent(event);
    }
  }
  clearDataListener() {
    eventCenter.off(formatEventName(this.appName, true));
  }
}
