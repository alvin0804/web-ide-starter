
// 对请求参数做处理，实现 query 简化、 post 简化
export default function simplePostMiddleware(ctx, next) {
  if (!ctx) return next();
  const { req: { options = {} } = {} } = ctx;
  const { method = 'get' } = options;

  if (['post', 'put', 'patch', 'delete'].indexOf(method.toLowerCase()) === -1) {
    return next();
  }
  
  const { params = {} } = options;
  const dataType = Object.prototype.toString.call(params);
  if(dataType=== '[object Object]') {
    options.body = JSON.stringify(params);
  }

  ctx.req.options = options;
  
  return next();
}
