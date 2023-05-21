
const externalStorage = window.localStorage;

export function saveStorageData(key: string, data: any) {
 externalStorage.setItem(key, JSON.stringify(data || {})); 
}

export function getStoreageData(key: string) {
  const data = JSON.parse( externalStorage.getItem(key) || JSON.stringify("{}") )
  return data;
}