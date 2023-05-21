
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
let times = 0;
let currentRequestId = "";


// 日志中间件，打通全链路日志查询
export default async function requestIdMiddleware(ctx, next) {
  if (!ctx) return next();

  // 如果当前应用第一次执行，对requestId进行赋值
  if (times === 0) {
    currentRequestId = uuid();
    times++;
  }

  // request before
  if(!ctx.req.options.headers) {
    ctx.req.options.headers = {};
  }
  ctx.req.options.headers["x_request_id"] = currentRequestId;

  await next();

  // response after
  ctx.res.headers.forEach(function (val, key) {

    if (key === "x_request_id") {
      currentRequestId = val;
    }
  });
}
