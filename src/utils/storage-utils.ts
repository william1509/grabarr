class Utils {
  static getChromeStorage = <T>(key: string): Promise<T> => {
    return new Promise((resolve) => {
      chrome.storage.session.get(key, (result: { [key: string]: T }) => {
        let data = result[key];
        if (data instanceof Map) {
          data = new Map(data) as T;
        }
        console.log(`getChromeStorage keys = ${key} data = ${JSON.stringify(data)}`)
        resolve(data);
      });
    });
  };

  static setChromeStorage = <T>(data: { [key: string]: T }): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.session.set(data, () => {
        console.log(`setChromeStorage data = ${JSON.stringify(data)}`)
        resolve();
      });
    });
  };
}

export default Utils;