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
- eval 执行
  直接调用时使用本地作用域，间接调用`(0, eval)`其工作在全局作用域之下
  eval 缺点：慢，因为调用了 js 解释器、第三方代码可以看到 eval 调用时的作用域，相似的`window.Function`就不容易被攻击
  `with(expression){ statement }`绑定命名空间 using namespace;容易造成编译器难以查找变量

9. 样式隔离

- 我们上面提到过，style 元素插入到文档后会创建 css 样式表，但有些 style 元素(比如动态创建的 style)在执行样式隔离时还没插入到文档中，此时样式表还没生成。所以我们需要创建一个模版 style 元素，它用于处理这种特殊情况，模版 style 只作为格式化工具，不会对页面产生影响。

- 还有一种情况需要特殊处理：style 元素被插入到文档中后再添加样式内容。这种情况常见于开发环境，通过 style-loader 插件创建的 style 元素。对于这种情况可以通过 MutationObserver 监听 style 元素的变化，当 style 插入新的样式时再进行隔离处理。

- bug：之前捕捉不到 style link，修改为 prod 环境才有 style link
- bug：属性选择器不生效

  ```javascript
  if (key !== "value") hostPatchProp(el, key, null, props[key]);

  isOn(key); // => 匹配是否为 监听器。。（一堆特判）

  patchDOMProp;

  el[key] = value;
  ```

  结束后进入 CustomElement 的 connectedCallback

  大概是 vue 将 name、url 处理为了 property 元素对象属性，而非 attribute 元素标签属性

10. 数据传递

    - 使用发布订阅模式，分为总处理中心、基座处理中心、microApp 处理中心
    - 基座和 microApp 处理为 eventCenter 的封装
    - 基座向组件传递数据的方式为属性分配
    - 属性分配与响应式：数据更新后 attribute 更新，触发
    - 基座向组件传递数据需要 响应式数据 延时赋值，因为初始化时 microApp 的事件中心还没有初始化，发送数据没有用。

11. 待解决的问题：

- 路由
  无法在 window 上直接监听到路由变化，应该是 react-router 重写了 Location 绑到了 window 上
  浏览器原生只实现了 onpopstate 的监听，意思只有当浏览器的前进后退，或者时间编程的方式 history.go()，history.back()，history.forward() 才会触发 popstate 事件，而 history.pushState, history.replaceState 没有事件触发。现在我们来重写这两个方法 让他们能触发对应的事件。
  navigate(-1)// PopStateEvent
  pushState 不经过 history

  reactRouter 在初始化的时候在 History 保存了 window.history 的地址，所以后面即使绑定了作用域为为 window.proxyWindow，也无法拦截路由导航。。
  解决：增加由基座下发的 BASEROUTE

  history 只会在初始化的时候被 Proxy 捕捉到，后面切换路由捕捉不到

  实际开发中，我们几乎不会使用无 URL 变化的 pushState。这是因为我们通常希望把页面状态暴露给用户，以便用户能看到（了解当前状态），能输入（影响当前状态）

  路由状态是切换页面的副作用？？？

- 资源路径补全（现在只有 images)

12. bug

- microapp 加载内容管理时抛出错误：eval 执行的时候抛出
```html
<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"/><link rel=\"icon\" href=\"/favicon.ico\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><meta name=\"theme-color\" content=\"#000000\"/><meta name=\"description\" content=\"Web site created using create-react-app\"/><link rel=\"apple-touch-icon\" href=\"/logo192.png\"/><link rel=\"manifest\" href=\"/manifest.json\"/><title>React App</title><script defer=\"defer\" src=\"/static/js/main.bdd29dcd.js\"></script><link href=\"/static/css/main.1e2ec299.css\" rel=\"stylesheet\"></head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id=\"root\"></div></body></html>"
```

**替换资源问题**
图片和字体：小一些的使用 url-loader 打包成 base64,大一些的使用 file-loader，用 `config.module.rule(images).options({limit: 4096})`

- 之前配置 prod 环境时 css 资源加载有问题？？？突然好了
- Home scroll 变大变小？？？？

13. 路由

- 使用 iframe 代理 window 中的 api 来控制路由，根据 HTML 的规范 这个 URL 用了 `about:blank` 一定保证保证同域，也不会发生资源加载，但是会发生关联的 和 这个 iframe 中关联的 history 不能被操作，这个时候路由的变换只能变成 hash 模式。当然也可`src=origin`，但很明显会浪费资源
- 路由不仅要代理 history 还要代理 location,哈希路由初始化时就要用到location
- microApp中的location没有进行沙箱代理
- rameapp可以设置路由是否同步，意味着浏览器的刷新前进后退都可以作用到子应用上
- rameapp 同步模式：先获取url的该子应用的查询参数，将其格式`encodeURIComponent`后的参数传入进去再设置url并用pushState修改这样就不会触发路由修改。`url.searchParams`
- rameapp 异步模式：将href存在storage里面，这样就不会响应路由变化了


14. TODO：子应用保活模式
    TODO：弹窗渲染到主应用---shadowDOM？）

15. bug: 拦截location之后，处理完子路由加入到参数中后replace会触发路由变化，这个时候就需要代理set

16. bug: hash路由现在的问题，现在可以子应用来触发其自身路由变化同时改变路由，但是路由的变化不能反映到子应用变化，？可以通过创建空iframe的window，将其绑定到？？？
？通过绑定window.location当hashchange出发的时候》？

17. bug: 使用history路由但是却没有调用pushstate，原因---react-router库会在初始化时调用history.has(pushstate)，如果无的话就设置href来代替其，所以要重写has方法