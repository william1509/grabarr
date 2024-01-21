import React from "react";
import ReactDOM from "react-dom/client";
import MediaSelection from "./pages/media-selection/media-selection";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { MessagePayload, MessageStatus } from "./types";
import Utils from "./utils/utils";
import ConnectionError from "./pages/connection-error/connection-error";

let mousePosition = { x: 0, y: 0 };
document.addEventListener("mousemove", (e: MouseEvent) => {
  mousePosition.x = e.pageX;
  mousePosition.y = e.pageY;
});

const handleClickOutside = (event: MouseEvent, element: Node) => {
  const isClickInsidePopup = element.contains(event.target as Node);

  if (element === undefined || !document.body.contains(element)) {
    return;
  }

  // If the click is outside the popup, hide it
  if (!isClickInsidePopup) {
    document.body.removeChild(element);
  }
};

const getComponent = (response: MessagePayload) => {
  console.log(response)
  switch (response.status) {
    case MessageStatus.OK:
      return <MediaSelection item={response.body} />;
    case MessageStatus.ERROR:
      return <ConnectionError />;
  }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.type) {
    case "show_popup":
      const container = document.createElement("div");
      const emotionRoot = document.createElement("style");

      const shadow = container.attachShadow({ mode: "open" });
      console.log("shadow", shadow);
      const newElem = document.createElement("div");
      newElem.id = "media-selection";
      newElem.style.position = "absolute";
      newElem.style.left = mousePosition.x + "px";
      newElem.style.top = mousePosition.y - 100 + "px";
      newElem.style.maxWidth = "fit-content";

      const cache = createCache({
        key: "css",
        prepend: true,
        container: emotionRoot,
      });

      shadow.appendChild(newElem);
      shadow.appendChild(emotionRoot);
      document.addEventListener("mousedown", (event) =>
        handleClickOutside(event, container)
      );

      ReactDOM.createRoot(newElem).render(
        <React.StrictMode>
          <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {getComponent(message)}
            </ThemeProvider>
          </CacheProvider>
        </React.StrictMode>
      );
      document.body.appendChild(container);
      break;
    default:
      console.log("unknown message type", message.type);
      break;
  }
});
