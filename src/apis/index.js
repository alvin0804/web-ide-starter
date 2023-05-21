import requestCore from "./core";


// -----------------------------------------------------------------
let apis = {};
export function buildApi() {
  // 获取所有文件模块
  const files = import.meta.globEager('./modules/*.(js|ts)')
  const modules = {}
  for (const key in files) {
      // 截取文件名
      // 将 '-' 转换成驼峰命名
      const currentKey = key.replace(/(\.\/modules\/|\.(js|ts))/g, "").replace(/-(\w)/g, function upper(all,letter){
        return letter.toUpperCase();
      });
      modules[currentKey] = files[key].default
  }
  // Object.keys(modules).forEach(item => {
  //     modules[item]['namespaced'] = true
  // })


  // 构建请求链路
  apis = {};
  for(const moduleKey in modules) {
    const currentModule = modules[moduleKey] || {};

    const currentApis = {};

    for(const apiKey in currentModule) {
      const item = currentModule[apiKey] || {};
      currentApis[apiKey] = (params = {}) => {
        return requestCore(item.url, { method: item.method, params });
      }
    }

    apis[moduleKey] = currentApis;
  }

  console.log("apis: ", apis);

  return apis;
}
export function getApi() {
  return apis;
}
