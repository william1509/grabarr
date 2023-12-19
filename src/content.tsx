import React from "react";
import ReactDOM from "react-dom/client";
import MediaSelection from "./pages/media-selection/media-selection";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { MessagePayload, MessageStatus } from "./types";

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
              <MediaSelection item={message.body} />
            </ThemeProvider>
          </CacheProvider>
        </React.StrictMode>
      );
      document.body.appendChild(container);
      const response: MessagePayload = {
        type: "show_popup",
        status: MessageStatus.OK,
        body: "",
      };
      sendResponse(response);
      break;
    default:
      console.log("unknown message type", message.type);
      break;
  }
});
