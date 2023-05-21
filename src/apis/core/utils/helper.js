import { stringify } from 'qs';

export function isArray(val) {
  return typeof val === 'object' && Object.prototype.toString.call(val) === '[object Array]';
}
export function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}
export function forEach2ObjArr(target, callback) {
  if (!target) return;

  if (typeof target !== 'object') {
    target = [target];
  }

  if (isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      callback.call(null, target[i], i, target);
    }
  } else {
    for (let key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        callback.call(null, target[key], key, target);
      }
    }
  }
}
export function isDate(val) {
  return typeof val === 'object' && Object.prototype.toString.call(val) === '[object Date]';
}
export function isObject(val) {
  return val !== null && typeof val === 'object';
}

export function reqStringify(val) {
  return stringify(val, { arrayFormat: 'repeat', strictNullHandling: true });
}
