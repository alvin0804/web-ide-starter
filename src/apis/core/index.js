import compose from "./compose";
import requestIdMiddleware from "./middlewares/requestId";
import fetchMiddleware from "./middlewares/fetch";
import simpleGet from "./middlewares/simpleGet";
import simplePost from "./middlewares/simplePost";

export default function request(url, options) {
  const obj = {
    req: { url, options: { url, ...options } },
    res: null,
  };

  // jsonMiddleware, 
  const middlewares = [requestIdMiddleware, simpleGet, simplePost, fetchMiddleware];

  return new Promise((resolve, reject) => {
    compose(middlewares)(obj).then(() => {
      const responseStream = obj.res;
      resolve(responseStream.json());
    }).catch(reject)
  })
}
