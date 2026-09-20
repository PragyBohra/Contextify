chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // console.log('Message received in content.js:', message); // Debugging line
  if (message.action === "summarize" && message.summary) {
    // Call showChatbox function to display the chatbox with summary
    showChatbox(message.summary); // This will open the chatbox with the summary
  }
});

// // Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openChatbox") {
    // const defaultText = "Ask anything about the current page!";
    sendResponse({ content: "It came here" });  // just my style of checking
    showChatbox("");
  }
});

// ***************This is added for extracting page content*************
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extractContent") {
    // Respond with the extracted page content
    sendResponse({ content: extractPageContent() });
  }

});



// ************ I was trying to imlement MathJax library but was unsuccessful in doing so *************
// function loadMathJax() {
//   // Create the script element to load MathJax
//   const script = document.createElement("script");

//   script.src = chrome.runtime.getURL("mathjax/es5/tex-mml-chtml.js");  // Path to the local MathJax file
//   script.async = true;
//   document.head.appendChild(script);
//   script.onload = () => {
//     console.log("MathJax script loaded successfully");
//   };
// }
// **************************************************************

// ***************************** PDFs *****************************
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extractPDF") {
    const pdfUrl = message.pdfUrl;

    // Dynamically load PDF.js
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("pdfjs/pdf.js"); // Path to pdf.js in your extension
    document.head.appendChild(script);

    // Once PDF.js is loaded, set the worker path and process the PDF
    script.onload = function () {
      // Set the worker path after pdf.js is loaded
      pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL("pdfjs/pdf.worker.js");

      // Now we can call your extractTextFromPDF function
      extractTextFromPDF(pdfUrl).then((pdfText) => {
        if (pdfText) {
          // Optionally summarize extracted text here
          chrome.runtime.sendMessage({
            action: "summarize",
            summary: pdfText,
          });
        } else {
          console.error("Failed to extract text from the PDF.");
        }
      });
    };
  }
});
// **********************************************************


// Function to extract visible page content
function extractPageContent() {
  return document.body.innerText; // Extracts all visible text from the page
}
//**************************END*****************************


// ***************************** Want to get text from PDFs also *****************************
async function extractTextFromPDF(url) {
  try {
    const pdf = await pdfjsLib.getDocument(url).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }
    return fullText;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return null;
  }
}
// **********************************************************








// // Function to show the chatbox with the explanation
// function showChatbox(selectedText) {
//   // Inject Google Fonts if not already injected
//   injectGoogleFont();

//   // **** Trying to add MathJax for displaying mathematical equations like fire. (Thank me later)
//   // const script = document.createElement('script');
//   // script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML';
//   // document.head.appendChild(script);
//   // loadMathJax();
//   // *************************

//   // Remove any existing chatbox
//   const existingChatbox = document.getElementById("chatbox-container");
//   if (existingChatbox) existingChatbox.remove();

//   // Create the chatbox container
//   const chatbox = document.createElement("div");
//   chatbox.id = "chatbox-container";
//   chatbox.innerHTML = `
//     <div id="chatbox-header">
//       <span>Contextify</span>
//       <button id="chatbox-close">✖</button>
//     </div>
//     <div id="chatbox-body">
//       <p>${selectedText}</p> <!-- This will show the formatted text -->
//     </div>
//     <textarea id="chatbox-input" placeholder="Ask"></textarea>
//     <button id="chatbox-send">Send</button>
//   `;

//   // Style the chatbox (near selection)
//   const range = window.getSelection().getRangeAt(0).getBoundingClientRect();
//   if (range) {
//     chatbox.style.position = "absolute";
//     chatbox.style.left = `${range.left + window.scrollX}px`;
//     chatbox.style.top = `${range.bottom + window.scrollY + 10}px`;

//     // Append the chatbox to the body
//     document.body.appendChild(chatbox);

//     // Make the chatbox draggable
//     dragElement(chatbox);

//     // Close the chatbox when clicking outside
//     const closeChatbox = () => {
//       const chatbox = document.getElementById("chatbox-container");
//       if (chatbox) chatbox.remove();
//       document.removeEventListener("click", closeChatbox);
//     };

//     // Close button functionality
//     document.getElementById("chatbox-close").addEventListener("click", closeChatbox);

//     // Close the chatbox if the user clicks outside of it
//     setTimeout(() => {
//       document.addEventListener("click", (event) => {
//         if (!chatbox.contains(event.target)) {
//           closeChatbox();
//         }
//       });
//     }, 0);

//     // Prevent clicks inside the chatbox from closing it
//     chatbox.addEventListener("click", (event) => {
//       event.stopPropagation();
//     });

//     // Add functionality to the send button
//     document.getElementById("chatbox-send").addEventListener("click", async () => {
//       const userInput = document.getElementById("chatbox-input").value.trim();
//       if (userInput) {
//         const body = document.getElementById("chatbox-body");
//         const questionElement = document.createElement("p");
//         questionElement.textContent = `\n\nQ: ${userInput}\n`;
//         body.appendChild(questionElement);
//         body.scrollTop = body.scrollHeight;


//         const thinkingElement = document.createElement("div");
//         thinkingElement.id = "thinking-animation";
//         thinkingElement.innerHTML = `
//           <span class="dot"></span>
//           <span class="dot"></span>
//           <span class="dot"></span>
//         `;
//         body.appendChild(thinkingElement);
//         body.scrollTop = body.scrollHeight;


//         // Send the user query to the background script
//         chrome.runtime.sendMessage({
//           action: "askQuestion",
//           prompt: userInput,
//           context: selectedText, // Pass the context to the background script
//         }, (response) => {
//           // Display the question and answer in the chatbox
//           // const body = document.getElementById("chatbox-body");
//           // const questionElement = document.createElement("p");
//           // questionElement.textContent = `\n\nQ: ${userInput}\n`;
//           thinkingElement.remove();
//           const answerElement = document.createElement("p");
//           answerElement.innerHTML = `A: ${response.answer}\n`;
//           // Trigger MathJax to render the LaTeX content
//           // MathJax.Hub.Queue(["Typeset", MathJax.Hub, answerElement]);
//           // MathJax.Hub.Queue(["Typeset", MathJax.Hub, document.getElementById("chatbox-body")]);
//           // body.appendChild(questionElement);
//           body.appendChild(answerElement);
//           body.scrollTop = body.scrollHeight; // Scroll to the bottom
//           setTimeout(() => {
//             if (window.MathJax) {
//               MathJax.Hub.Queue(["Typeset", MathJax.Hub, document.getElementById("chatbox-body")]);
//             }
//           }, 100);
//         });

//         // Clear the input box after sending
//         document.getElementById("chatbox-input").value = "";
//       }
//     });
//   }
// }

// Function to show the chatbox with the explanation
function showChatbox(selectedText) {
  // Inject Google Fonts if not already injected
  injectGoogleFont();

  // Remove any existing chatbox
  const existingChatbox = document.getElementById("chatbox-container");
  if (existingChatbox) existingChatbox.remove();

  // Create the chatbox container
  const chatbox = document.createElement("div");
  chatbox.id = "chatbox-container";
  chatbox.innerHTML = `
    <div id="chatbox-header">
      <span>Contextify</span>
      <button id="chatbox-close">✖</button>
    </div>
    <div id="chatbox-body">
      <p>${selectedText}</p> <!-- This will show the formatted text -->
    </div>
    <textarea id="chatbox-input" placeholder="Ask"></textarea>
    <button id="chatbox-send">Send</button>
  `;

  // Style the chatbox (fixed on screen)
  chatbox.style.position = "fixed"; // Changed to fixed position
  chatbox.style.right = "20px"; // Fixed position from right
  chatbox.style.bottom = "20px"; // Fixed position from bottom
  chatbox.style.zIndex = "10000"; // Ensures it's on top of other elements
  // ********Constraint sizes*************
  chatbox.style.minWidth = "300px";  // Minimum width
  chatbox.style.minHeight = "270px"; // Minimum height
  chatbox.style.maxWidth = "600px";  // Maximum width
  chatbox.style.maxHeight = "540px"; // Maximum height
  // ************************************
  // Append the chatbox to the body
  document.body.appendChild(chatbox);


// ****************** Resizing functionality *******************
  // Create a resize handle (two slant lines)
  const resizeHandle = document.createElement("div");
  resizeHandle.id = "chatbox-resize-handle";
  // chatbox.appendChild(resizeHandle);

  let isResizing = false;

  resizeHandle.addEventListener("mousedown", (event) => {
    isResizing = true;
    const initialWidth = chatbox.offsetWidth;
    const initialHeight = chatbox.offsetHeight;
    const aspectRatio = initialWidth / initialHeight;
    const startX = event.clientX;
    const startY = event.clientY;

    const onMouseMove = (event) => {
      if (!isResizing) return;

      const deltaX = event.clientX - startX;
      const newWidth = Math.min(
        Math.max(initialWidth + deltaX, parseInt(chatbox.style.minWidth)),
        parseInt(chatbox.style.maxWidth)
      );
      const newHeight = newWidth / aspectRatio;

      if (
        newHeight >= parseInt(chatbox.style.minHeight) &&
        newHeight <= parseInt(chatbox.style.maxHeight)
      ) {
        chatbox.style.width = `${newWidth}px`;
        chatbox.style.height = `${newHeight}px`;
      }
    };

    const onMouseUp = () => {
      isResizing = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });
  // *************************************************













  // Make the chatbox draggable
  dragElement(chatbox);

  // Close button functionality
  document.getElementById("chatbox-close").addEventListener("click", () => {
    chatbox.remove();
  });

  // Add functionality to the send button and Enter key
  const sendButton = document.getElementById("chatbox-send");
  const inputField = document.getElementById("chatbox-input");

  const sendPrompt = async () => {
    const userInput = inputField.value.trim();
    if (userInput) {
      const body = document.getElementById("chatbox-body");
      const questionElement = document.createElement("p");
      questionElement.textContent = `\n\nQ: ${userInput}\n`;
      body.appendChild(questionElement);
      body.scrollTop = body.scrollHeight;

      const thinkingElement = document.createElement("div");
      thinkingElement.id = "thinking-animation";
      thinkingElement.innerHTML = `
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      `;
      body.appendChild(thinkingElement);
      body.scrollTop = body.scrollHeight;

      // Send the user query to the background script
      chrome.runtime.sendMessage(
        {
          action: "askQuestion",
          prompt: userInput,
          context: selectedText, // Pass the context to the background script
        },
        (response) => {
          thinkingElement.remove();
          const answerElement = document.createElement("p");
          answerElement.innerHTML = `A: ${response.answer}\n`;
          body.appendChild(answerElement);
          body.scrollTop = body.scrollHeight;

          // Trigger MathJax to render the LaTeX content
          setTimeout(() => {
            if (window.MathJax) {
              MathJax.Hub.Queue(["Typeset", MathJax.Hub, document.getElementById("chatbox-body")]);
            }
          }, 100);
        }
      );

      // Clear the input box after sending
      inputField.value = "";
    }
  };

  // Attach the send functionality to the send button
  sendButton.addEventListener("click", sendPrompt);

  // Attach the send functionality to the Enter key
  inputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        // Allow new line when Shift+Enter is pressed
        return;
      }

      event.preventDefault();
      sendPrompt();
    }
  });
}

// Function to make the chatbox draggable
function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  const header = elmnt.querySelector("#chatbox-header");
  if (header) {
    header.onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}




// Listen for messages from the background script (displaying summary or answer)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // console.log('Message by Bhavik Ostwal in content.js:', message); // Debugging line
  if (message.action === "summarize" && message.summary) {
    const body = document.getElementById("chatbox-body");
    body.innerHTML = `<p>${message.summary}</p>`; // Insert summary content
    body.scrollTop = body.scrollHeight; // Scroll to the bottom
  }
});

// Function to inject Google Fonts (Inter) into the webpage
function injectGoogleFont() {
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link); // Append the link to the head of the page
}

// Function to make the chatbox draggable
function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  const header = elmnt.querySelector("#chatbox-header");
  if (header) {
    header.onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
