/**
 * 获取静态资源
 * @param {string} url 静态资源地址
 */
export function fetchSource(url: string) {
  console.log("here, url: ", url);
  if (url[0] !== "h") {
    url = "http://localhost:3000" + url;
  } else {
    url.replace("http://localhost:8080", "http://localhost:3000");
  }
  return fetch(url).then((res) => {
    return res.text();
  });
}
