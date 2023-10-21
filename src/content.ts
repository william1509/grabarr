console.log("ffdsfsd")

let mousePosition = {x: 0, y: 0};
document.addEventListener('mousemove', (e: MouseEvent) => {
  mousePosition.x = e.pageX;
  mousePosition.y = e.pageY;
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("Received message from background script!", message)
    switch (message.type) {
      case "show_popup":
        console.log("Received message from background script!", message);
        var div=document.createElement("div"); 
        document.body.appendChild(div); 
        div.innerText="test123";
        div.style.position = "absolute";
        div.style.left = mousePosition.x + "px";
        div.style.top = mousePosition.y - 100 + "px";
        div.style.maxWidth = "fit-content";
        sendResponse("here");
        break;
      default:
        console.log("unknown message type", message.type);
        break;
    }
  });