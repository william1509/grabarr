import browser from "webextension-polyfill";
import { MediaRequest } from "./schemas";
import { FormFields, MediaResult, MessagePayload, MessageStatus, SearchResult } from "./types";


chrome.contextMenus.removeAll();
chrome.contextMenus.create({
  title: "first",
  id: "test",
  contexts: ["selection"],
});

let connection: FormFields = {
  jellyseerrAddress: "",
  jellyseerrKey: "",
};

chrome.storage.sync.get("credentials", (data) => {
  console.log("Initial data loaded", data)
  connection = data["credentials"];
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.type) {
    case "get_connection":
      var response: MessagePayload = {
        type: "get_connection",
        status: MessageStatus.OK,
        body: connection,
      }      
      sendResponse(response);
      break;
    case "set_connection":
      chrome.storage.sync.set({ "credentials": message.body }, () => {
        console.log('User Preferences Updated:', message.body);
      });
      connection = message.body;
      var response: MessagePayload = {
        type: "set_connection",
        status: MessageStatus.OK,
        body: connection,
      }
      sendResponse(response);
      break;
    case "request":
      const info: MediaResult = message.body;
      const body = {
        mediaType: info.mediaType,
        mediaId: info.id,
        tvdbId: 0,
        seasons: [],
        is4k: false,
        serverId: 0,
        profileId: 0,
        rootFolder: "",
        languageProfileId: 0,
        userId: 0
      }
      fetch(`${connection.jellyseerrAddress}/api/v1/request?`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'X-Api-Key': `${connection.jellyseerrKey}`,
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json;charset=UTF-8',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'no-cors',
          'Sec-Fetch-Site': 'same-origin'
        },
      })
      .then((response: Response) => {
        console.log("Sent request to " + `${connection.jellyseerrAddress}/api/v1/request?`)
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' + response.status);
        } else {
          response.json().then((data: MediaRequest) => {
            var response: MessagePayload = {
              type: "request",
              status: MessageStatus.OK,
              body: data,
            }
            sendResponse(response);
          });
        }
      }).catch((err) => {
        console.log(err);
      });
    default:
      console.log("unknown message type", message.type);
  }
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "test") {
    if (info.selectionText === "" || connection.jellyseerrAddress === "" || connection.jellyseerrKey === "") {
      return;
    }
    if (!info.selectionText?.trim()) {
      return;
    }
    const params = {
      query: info.selectionText?.trim().split(" ").join("+"),
      page: "1",
      language: "en",
    }
    fetch(`${connection.jellyseerrAddress}/api/v1/search?` + new URLSearchParams(params), {
      method: 'GET',
      headers: {
        'X-Api-Key': `${connection.jellyseerrKey}`,
        'Accept': 'application/json, text/plain, */*',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'same-origin'
      },
    })
    .then((response) => {
      console.log("Sent request to " + `${connection.jellyseerrAddress}/api/v1/search?` + new URLSearchParams(params))
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
      } else {
        response.json().then((data: SearchResult) => {
          chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs.length > 0 && tabs[0].id) {
              chrome.tabs.sendMessage(tabs[0].id, { type: "show_popup", body: data }, (response) => {
                console.log(response);
              });          
            }
          });
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  }
});
