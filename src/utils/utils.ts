import { MessagePayload, MessageStatus } from "../types";

class Utils {
  static getChromeStorage = <T>(key: string): Promise<T> => {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result: { [key: string]: T }) => {
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
      chrome.storage.local.set(data, () => {
        console.log(`setChromeStorage data = ${JSON.stringify(data)}`)
        resolve();
      });
    });
  };

  static sendRuntimeMessage = (request: MessagePayload) => {
    return new Promise<MessagePayload>((resolve, reject) => {
      chrome.runtime.sendMessage(request, (response: MessagePayload) => {
        if (response.status === MessageStatus.OK) {
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  };

  static sendTabMessage = (request: MessagePayload) => {
    return new Promise<MessagePayload>((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
            if (response.status === MessageStatus.OK) {
              resolve(response);
            } else {
              reject(response);
            }
          });
        }
      });
    });
  };
}

export default Utils;