const MINI_APP_ROUTE = "mini-app-route";

export const getURL = (name: string, source: string) => {
  return getRouteURL(name, source);
};

export const getRouteURL = (name: string, source: string) => {
  const url = new URL(window.location.href);
  const innerRouter = url.searchParams.get(MINI_APP_ROUTE);
  let miniURL = new URL(source);

  if (innerRouter) {
    // 获取name的路由
    const innerHref = JSON.parse(innerRouter)[name];
    miniURL = new URL(decodeURIComponent(innerHref));
  }

  return miniURL;
};

export function setRouteURL(name: string, href: string) {
  const url = new URL(window.location.href);
  const innerRouter = url.searchParams.get(MINI_APP_ROUTE);

  let innerRouterObj: { [key: string]: any } = {};

  if (!innerRouter) {
    innerRouterObj[name] = encodeURIComponent(href);
  } else {
    innerRouterObj = JSON.parse(innerRouter);
    innerRouterObj[name] = encodeURIComponent(href);
  }

  url.searchParams.set(MINI_APP_ROUTE, JSON.stringify(innerRouterObj));

  console.log(innerRouterObj);
  return url;
}

export function setRouteURLPart(options: any) {
  const { name, partName, partValue, base } = options;
  const url = new URL(window.location.href);
  const innerRouter = url.searchParams.get(MINI_APP_ROUTE);

  let innerRouterObj: { [key: string]: any } = {};
  let miniUrl = new URL(base);

  if (innerRouter) {
    // 获取该子应用部分url
    innerRouterObj = JSON.parse(innerRouter as string);
    const innerHref = decodeURIComponent(innerRouterObj[name]);
    miniUrl = new URL(innerHref);
  }

  try {
    (miniUrl as any)[partName] = partValue;
  } catch {
    (miniUrl as any)[partName] = `${base}${partValue}`;
  }
  console.log(miniUrl, partName, partValue);
  innerRouterObj[name] = encodeURIComponent(miniUrl.href);
  url.searchParams.set(MINI_APP_ROUTE, JSON.stringify(innerRouterObj));

  return url;
}

export function toAbsoluteURL(url: string, base: string) {
  let formattedURL: URL;

  try {
    formattedURL = new URL(url);
  } catch (ex) {
    formattedURL = new URL(url, base);
  }

  return formattedURL;
}
