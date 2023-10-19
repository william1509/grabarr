console.log("ffdsfsd")

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("Received message from background script!", message)
    switch (message.type) {
      case "show_popup":
        console.log("Received message from background script!", message);
        var div=document.createElement("div"); 
        document.body.appendChild(div); 
        div.innerText="test123";
        sendResponse("here");
        break;
    }
  });