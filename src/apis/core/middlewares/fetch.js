import deepMerge from "../utils/deepmerge";

export default async function fetchMiddleware(ctx, next) {
  if (!ctx) return next();

  const defaultOptions = {
    credentials: "same-origin",
    method: "GET", // 默认为get请求
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };

  const { options = {}, url = "" } = ctx.req;
  const fetchOptions = deepMerge(defaultOptions, options);
  
  const res = await fetch(url, fetchOptions);

  ctx.res = res;
  await next();
}
