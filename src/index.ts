import { defineElement } from "./element";

import { EventCenterForBaseApp } from "./data";

const BaseAppData = new EventCenterForBaseApp();

const MiniMicroApp = {
  start() {
    defineElement();
  },
};

// 记录原生方法
const rawSetAttribute = Element.prototype.setAttribute;

// 重写setAttribute
Element.prototype.setAttribute = function setAttribute(
  key: string,
  value: any
) {
  // 目标为micro-app标签且属性名称为data时进行处理
  if (/^micro-app/i.test(this.tagName) && key === "data") {
    if (toString.call(value) === "[object Object]") {
      // 克隆一个新的对象
      const cloneValue: any = {};
      Object.getOwnPropertyNames(value).forEach((propertyKey) => {
        // 过滤vue框架注入的数据
        if (
          !(typeof propertyKey === "string" && propertyKey.indexOf("__") === 0)
        ) {
          cloneValue[propertyKey] = value[propertyKey];
        }
      });
      // 发送数据
      console.log(cloneValue);
      BaseAppData.setData(this.getAttribute("app-name"), cloneValue);
    }
  } else {
    rawSetAttribute.call(this, key, value);
  }
};

export default MiniMicroApp;
