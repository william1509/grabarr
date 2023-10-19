import browser from "webextension-polyfill";

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
      console.log("get_connection", connection);
      sendResponse(connection);
      break;
    case "set_connection":
      chrome.storage.sync.set({ "credentials": message.body }, () => {
        console.log('User Preferences Updated:', message.body);
      });
      connection = message.body;
      sendResponse(connection);
      break;
    default:
      console.log("unknown message type", message.type);
  }
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "test") {
    if (info.selectionText === "" || connection.jellyseerrAddress === "" || connection.jellyseerrKey === "") {
      return;
    }
    const params = {
      query: info.selectionText || '',
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
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          if (tabs.length > 0 && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { type: "show_popup", body: response }, (response) => {
              console.log("Received response from content script", response);
            });          
          }
        });
        
      }
    }).catch((err) => {
      console.log(err);
     
    });
  }
});
