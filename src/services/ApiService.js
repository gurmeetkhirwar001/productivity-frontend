import { BaseService2 } from "./BaseService";

const ApiService = {
  fetchData(param) {
    return new Promise((resolve, reject) => {
      BaseService2(param)
        .then((response) => {
          resolve(response);
        })
        .catch((errors) => {
          reject(errors);
        });
    });
  },
};

export default ApiService;
