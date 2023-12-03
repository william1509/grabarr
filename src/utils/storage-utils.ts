class Utils {
  static getChromeStorage = (keys: string[]): Promise<{ [key: string]: any }> => {
    return new Promise((resolve) => {
      chrome.storage.sync.get(keys, (result) => {
        console.log(`getChromeStorage keys = ${JSON.stringify(keys)} data = ${JSON.stringify(result)}`)
        resolve(result);
      });
    });
  };

  static setChromeStorage = (data: { [key: string]: any }): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.sync.set(data, () => {
        console.log(`setChromeStorage data = ${JSON.stringify(data)}`)
        resolve();
      });
    });
  };
}

export default Utils;