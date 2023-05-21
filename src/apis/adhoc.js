import requestCore from "./core";

// 获取文件列表
export const getFileList = (params) => {
  return requestCore('url', { method: 'GET', params })
}