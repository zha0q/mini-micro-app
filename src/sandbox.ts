import { EventCenterForMicroApp } from "./data";

export class Sandbox {
  active = false; // 运行状态
  microWindow: any = {}; // 代理对象
  injectedKey = new Set(); // 新添加属性，卸载时清空

  proxyWindow: any = null;

  releaseEffect: any = null;

  constructor(appName: string) {
    this.proxyWindow = new Proxy(this.microWindow, {
      get: (target, key) => {
        if (Reflect.has(target, key)) {
          return Reflect.get(target, key);
        }
        // 否则到window上取
        const rawValue = Reflect.get(window, key);
        // 如果值为函数，需要绑定window，比如console、alert

        if (typeof rawValue === "function") {
          const valueStr = rawValue.toString();
          // 排除构造函数
          if (
            !/^function\s+[A-Z]/.test(valueStr) &&
            !/^class\s+/.test(valueStr)
          ) {
            return rawValue.bind(window);
          }
        }
        return rawValue;
      },
      set: (target, key, value) => {
        if (this.active) {
          Reflect.set(target, key, value);

          // 记录已经添加的变量，方便后续操作
          this.injectedKey.add(key);
        }
        return true;
      },
      deleteProperty: (target, key) => {
        if (target.hasOwnProperty(key)) {
          return Reflect.deleteProperty(target, key);
        }
        return true;
      },
    });

    this.releaseEffect = effect(this.microWindow);

    this.microWindow.microApp = new EventCenterForMicroApp(appName);
  }

  start() {
    if (!this.active) {
      this.active = true;
    }
  }

  stop() {
    if (this.active) {
      this.active = false;

      // 清空变量
      this.injectedKey.forEach((key: any) => {
        Reflect.deleteProperty(this.microWindow, key);
      });
      this.injectedKey.clear();

      this.releaseEffect();

      this.microWindow.microApp.clearDataListener();
    }
  }

  bindScope(code: any) {
    (window as any).proxyWindow = this.proxyWindow;
    return `;(function(window, self){with(window){;${code}\n}}).call(window.proxyWindow, window.proxyWindow, window.proxyWindow);`;
  }
}

// 记录addEventListener、removeEventListener原生方法
const rawWindowAddEventListener = window.addEventListener;
const rawWindowRemoveEventListener = window.removeEventListener;

/**
 * 重写全局事件的监听和解绑
 * @param microWindow 原型对象
 */
export function effect(microWindow: any) {
  // 使用Map记录全局事件
  const eventListenerMap = new Map();

  // 重写addEventListener
  microWindow.addEventListener = function (
    type: any,
    listener: any,
    options: any
  ) {
    const listenerList = eventListenerMap.get(type);
    // 当前事件非第一次监听，则添加缓存
    if (listenerList) {
      listenerList.add(listener);
    } else {
      // 当前事件第一次监听，则初始化数据
      eventListenerMap.set(type, new Set([listener]));
    }
    // 执行原生监听函数
    return rawWindowAddEventListener.call(window, type, listener, options);
  };

  // 重写removeEventListener
  microWindow.removeEventListener = function (
    type: any,
    listener: any,
    options: any
  ) {
    const listenerList = eventListenerMap.get(type);
    // 从缓存中删除监听函数
    if (listenerList?.size && listenerList.has(listener)) {
      listenerList.delete(listener);
    }
    // 执行原生解绑函数
    return rawWindowRemoveEventListener.call(window, type, listener, options);
  };

  // 清空残余事件
  return () => {
    console.log("需要卸载的全局事件", eventListenerMap);
    // 清空window绑定事件
    if (eventListenerMap.size) {
      // 将残余的没有解绑的函数依次解绑
      eventListenerMap.forEach((listenerList, type) => {
        if (listenerList.size) {
          for (const listener of listenerList) {
            rawWindowRemoveEventListener.call(window, type, listener);
          }
        }
      });
      eventListenerMap.clear();
    }
  };
}
