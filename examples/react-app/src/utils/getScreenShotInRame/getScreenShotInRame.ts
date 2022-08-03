import axios from "axios";
import html2canvas from "./html2canvas";

export function renderPreview(elem: HTMLElement): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const dom = document.createElement("div");

    const container = document.createElement("div");
    dom.appendChild(container);

    const rameApps = document.querySelectorAll("rame-app");

    const iframeElementWeakMap = new WeakMap();

    const { data: dom2imgSrc } = await axios.get(
      `${window.location.origin}/domtoimage.js`,
      {
        responseType: "text",
      }
    );

    console.log(dom2imgSrc);

    let iframeReadyNum = 0;

    Array.from(rameApps).forEach((rameApp, idx) => {
      const iframe = rameApp.shadowRoot?.querySelector("iframe");
      const iframeDoc = iframe?.contentDocument;
      // 复制一个保存样式的容器,用于存储iframe生成的图片
      const wrapper = document.createElement("div");
      wrapper.style.height = `${
        (rameApp.parentNode as HTMLElement)?.getClientRects()[0].height
      }px`;
      wrapper.style.width = `${
        (rameApp.parentNode as HTMLElement)?.getClientRects()[0].width
      }px`;

      if (iframe?.contentWindow) {
        // iframe引入domtoimage
        const iframeHead = iframeDoc?.getElementsByTagName("head")[0];
        const myscript = document.createElement("script");
        myscript.type = "text/javascript";
        (myscript.innerHTML as any) = dom2imgSrc;
        iframeHead?.appendChild(myscript);
        const links = iframeHead?.querySelectorAll("link");
        // 修改link
        links?.forEach((link) => {
          iframe.contentDocument?.body.appendChild(link);
          link.crossOrigin = "anonymous";
        });
        // iframe与父页面 传递消息
        const transMessage = (message: { blob: Blob; idx: number }) => {
          const { blob, idx } = message;
          const dataUrl = createObjectURL(blob);
          const img = document.createElement("img");
          img.src = dataUrl;
          iframeElementWeakMap.set(iframe, img);
          iframeReadyNum += 1;
        };
        (iframe.contentWindow as any).transMessage = transMessage;
        (iframe.contentWindow as any).polling = polling;
        // iframe进行截图并发送到父页面
        // 因为iframe是页面已经加载完成的，无法用onload判断domtoimage是否已经加载完成，所以只能设置延迟等待库的加载
        (iframe.contentWindow as any).eval(`async function foo() {
              domtoimage.toBlob(document.body.querySelector('#root'))
                .then(function (blob) {
                  window.transMessage({
                    blob: blob,
                    idx: ${idx},
                  });
                })
                .catch(function (error) {
                  window.transMessage({
                    blob: null,
                    idx: ${idx},
                  });
                })
            }
            foo();`);
      }
    });

    await polling(() => {
      console.log("polling");
      return iframeReadyNum === rameApps.length;
    });

    html2canvas(
      elem,
      {
        useCORS: true,
      },
      iframeElementWeakMap
    ).then(async (canvas: any) => {
      canvas.toBlob(async (blob: any) => {
        const filename = `${Date.now()}.png`;
        const file = new File([blob as Blob], filename, {
          type: "image/png",
        });
        const formdata = new FormData();
        formdata.append("file", file);
        const objectUrl = URL.createObjectURL(blob as Blob);
        const tmpLink = document.createElement("a");
        tmpLink.href = objectUrl;
        tmpLink.download = "123.png";

        document.body.appendChild(tmpLink); // 如果不需要显示下载链接可以不需要这行代码
        tmpLink.click();
        resolve("");
      });
    });
  });
}

function createObjectURL(blob: Blob) {
  const binaryData = [];
  binaryData.push(blob);
  return window.URL
    ? window.URL.createObjectURL(new Blob(binaryData))
    : window.webkitURL.createObjectURL(new Blob(binaryData));
}

// 轮询 函数
function polling(endJudge: any, time = 100, endTime = 5000) {
  return new Promise((resolve) => {
    const startTime = new Date().getTime();
    const pollTimer = setInterval(() => {
      const nowTime = new Date().getTime();
      if (endJudge() || nowTime - startTime > endTime) {
        clearInterval(pollTimer);
        resolve(null);
      }
    }, time);
  });
}
