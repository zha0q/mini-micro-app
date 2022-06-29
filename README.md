##### micro-app

1. 渲染流程

   - fetch html
   - 获取 dom，解析并循环递归处理
   - 处理顺序 script link style 是否有自元素
   - 循环结束，执行元素隔离
   - 对提取的 css 内容进行样式隔离，将隔离后的 css 作为 style 元素插入 micro-app 中
   - 执行插件系统处理 js 文件，创建沙箱，记录全局副作用函数，代理 document、window 事件，将 js 放入沙箱运行

2. 元素隔离 MicroApp 模拟实现了 shadowDom 类似的功能，我们拦截了底层原型链上元素的方法，保证子应用只能对自己内部的元素进行操作，每个子应用都有自己的元素作用域。

3. 插件系统：对传入静态资源进行初步处理并调用相应插件，让插件进行进一步修改

4. js 沙箱通过 proxy 代理子应用全局对象，防止应用之间全局变量冲突

5. 预加载 基于 requestIdleCallback 实现，在浏览器空闲时间加载应用的静态资源，在应用真正被渲染时直接从缓存中获取资源并渲染

6. 数据通信 我们重写了 micro-app 元素原型链上**属性设置**的方法，在 micro-app 元素设置对象属性时将传递的值保存到数据中心并监听属性变化，通过数据中心将值分发给子应用。**（发布订阅）**

```

```

// TODO 7. 资源地址补全
微前端中经常出现资源丢失的现象，原因是基座应用将子应用的资源加载到自己的页面渲染，如果子应用的静态资源地址是相对地址，浏览器会以基座应用所在域名地址补全静态资源，从而导致资源丢失。
资源地址补全就是将子应用静态资源的相对地址补全为绝对地址，保证地址指向正确的资源路径，这种操作类似于 webpack 在运行时设置 publicPath。

- 元素属性：link、img、iframe、script、a
- css 规则：background、font、content

8. 沙箱

- 解决问题：1.全局变量冲突 2.全局监听事件解绑
  JS 沙箱的核心在于修改 js 作用域和重写 window

9. 样式隔离

- 我们上面提到过，style 元素插入到文档后会创建 css 样式表，但有些 style 元素(比如动态创建的 style)在执行样式隔离时还没插入到文档中，此时样式表还没生成。所以我们需要创建一个模版 style 元素，它用于处理这种特殊情况，模版 style 只作为格式化工具，不会对页面产生影响。

- 还有一种情况需要特殊处理：style 元素被插入到文档中后再添加样式内容。这种情况常见于开发环境，通过 style-loader 插件创建的 style 元素。对于这种情况可以通过 MutationObserver 监听 style 元素的变化，当 style 插入新的样式时再进行隔离处理。

- bug：之前捕捉不到 style link，修改为 prod 环境才有 style link
- bug：属性选择器不生效
  ```javascript
  if (key !== "value") hostPatchProp(el, key, null, props[key]);

  isOn(key) // => 匹配是否为 监听器。。（一堆特判断）

  patchDOMProp

  el[key] = value
  ```
