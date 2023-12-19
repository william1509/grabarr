import { MediaRequest } from "./schemas";
import { FormFields, MediaRepository, MediaResult, MessagePayload, MessageStatus, SearchResult } from "./types";
import Utils from "./utils/storage-utils";

let connection: FormFields = {
  jellyseerrAddress: "",
  jellyseerrKey: "",
};

chrome.contextMenus.removeAll();
chrome.contextMenus.create({
  title: "Search",
  id: "search",
  contexts: ["selection"],
});
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId == "search") {
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
    };
    const response = await fetch(`${connection.jellyseerrAddress}/api/v1/search?` + new URLSearchParams(params), {
      method: "GET",
      headers: headers(),
    });

    console.log(`Sent request to ${connection.jellyseerrAddress}/api/v1/search?` + new URLSearchParams(params));
    if (!response.ok) {
      console.log("Looks like there was a problem. Status Code: " + response.status);
    } else {
      const data: SearchResult = await response.json();
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, { type: "show_popup", body: data }, (response) => {});
        }
      });
    }
  }
});

const headers = () => {
  return {
    "X-Api-Key": `${connection.jellyseerrKey}`,
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "application/json;charset=UTF-8",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "no-cors",
    "Sec-Fetch-Site": "same-origin",
  };
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "get_connection": {
      const response: MessagePayload = {
        type: "get_connection",
        status: MessageStatus.OK,
        body: connection,
      };
      sendResponse(response);
      break;
    }
    case "status": {
      getStatus(sendResponse);
      return true;
    }

    case "set_connection": {
      setConnection(message.body, sendResponse);
      return true;
    }

    case "request": {
      sendRequest(message.body, sendResponse);
      return true;
    }

    case "sync": {
      synchronize(sendResponse);
      return true;
    }

    case "get_media_availability": {
      getMediaAvailability(sendResponse);
      return true;
    }

    default:
      console.log("unknown message type", message.type);7
  }
});

const getMediaAvailability = async (sendResponse: (response?: MessagePayload) => void) => {
  const availability = await Utils.getChromeStorage<[number, number][]>("availability");
  let payload: MessagePayload = {
    type: "get_media_availability",
    status: MessageStatus.OK,
    body: availability,
  };
  sendResponse(payload);
};

const getStatus = async (sendResponse: (response?: MessagePayload) => void) => {
  const response = await fetch(`${connection.jellyseerrAddress}/api/v1/status`, {
    method: "GET",
    headers: headers(),
  });
  let payload: MessagePayload = {
    type: "status",
    status: MessageStatus.OK,
    body: connection,
  };
  if (!response.ok) {
    payload.status = MessageStatus.ERROR;
    console.log(`Looks like there was a problem. Status Code:  ${response.status}`);
  }
  sendResponse(payload);
};

const sendRequest = async (info: MediaResult, sendResponse: (response?: MessagePayload) => void) => {
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
    userId: 0,
  };

  // fetch(`${connection.jellyseerrAddress}/api/v1/request`, {
  const response: Response = await fetch(`https://8078026c-8a0d-4d65-975b-6340f2aae1cb.mock.pstmn.io/api/v1/request`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: headers(),
  });
  console.log(`Sent request to ${connection.jellyseerrAddress}/api/v1/request`);
  if (!response.ok) {
    console.log(`Looks like there was a problem. Status Code: ${response.status}`);
  } else {
    const data: MediaRequest = await response.json();
    let payload: MessagePayload = {
      type: "request",
      status: MessageStatus.OK,
      body: data,
    };
    sendResponse(payload);
    
  }
};

const synchronize = async (sendResponse: (response?: MessagePayload) => void) => {
  const availability: Map<number, number> = await Utils.getChromeStorage<Map<number, number>>("availability") ?? new Map();
  const pagingOffset: number = await Utils.getChromeStorage<number>("offset") ?? 0;

  if (pagingOffset !== 0 && availability.size === pagingOffset) {
    console.log("No need to sync: ", availability);
    sendResponse({
      type: "sync",
      status: MessageStatus.OK,
      body: availability,
    });
    return;
  }
  const params = {
    take: "9999",
    filter: "all",
    sort: "added",
    skip: pagingOffset.toString() || "0",
  };
  const url = `${connection.jellyseerrAddress}/api/v1/media?` + new URLSearchParams(params);
  const response = await fetch(url, {
    method: "GET",
    headers: headers(),
  });
  console.log("Sent request to " + url);
  if (!response.ok) {
    console.log("Looks like there was a problem. Status Code: " + response.status);
    sendResponse({
      type: "sync",
      status: MessageStatus.ERROR,
      body: null,
    });
  } else {
    const data: MediaRepository = await response.json();
    const newOffset = data.results.length + pagingOffset;

    if (newOffset === pagingOffset) {
      console.log("No new media found");
      sendResponse({
        type: "sync",
        status: MessageStatus.OK,
        body: data,
      });
      return;
    }

    const mappedMedia = new Map<number, number>(data.results.map((obj) => [obj.tmdbId!, obj.status!]));
    const newAvailability = new Map([...availability, ...mappedMedia]);
    await Utils.setChromeStorage({ availability: [...newAvailability] });
    await Utils.setChromeStorage({ offset: newOffset });

    sendResponse({
      type: "sync",
      status: MessageStatus.OK,
      body: data,
    });
  }
};

const setConnection = async (conn: FormFields, sendResponse: (response?: MessagePayload) => void) => {
  connection = conn;
  await Utils.setChromeStorage({ credentials: connection });
  getStatus(sendResponse);
};

const initialize = async () => {
  const credentials = await Utils.getChromeStorage<FormFields>("credentials");
  if (credentials) {
    connection = credentials;
    synchronize((response) => {});
  }
};

initialize();
