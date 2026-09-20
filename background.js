/*
// Create a context menu item
chrome.contextMenus.create({
    id: "summarizer",
    title: "Summarize",
    contexts: ["selection"], // Only show for selected text
  });
  
  // Handle the click event
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "summarizer") {
      console.log("Selected text:", info.selectionText);
    }
  });
*/

// chrome.contextMenus.removeAll(() => {
//     // Create context menu
//     chrome.contextMenus.create({
//       id: "summarize",
//       title: "Summarize",
//       contexts: ["selection"], // Only show for selected text
//     });
//   });
  
//   // Listen for context menu click
//   chrome.contextMenus.onClicked.addListener((info, tab) => {
//     if (info.menuItemId === "summarize" && info.selectionText) {
//       // Send the selected text to the content script
//       chrome.tabs.sendMessage(tab.id, {
//         action: "summarize",
//         text: info.selectionText,
//       });
//     }
//   });
  


// Remove all previous context menu items when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    // Create the new "Summarize" context menu item
    chrome.contextMenus.create({
      id: "summarize",
      title: "Summarize",
      contexts: ["selection", "link"]
    });
    
    // *********for PDFs**********
    // chrome.contextMenus.create({
    //   id: "summarizePDF",
    //   title: "Summarize PDF",
    //   contexts: ["link"],
    // });

    // Create a context menu item for PDFs
    chrome.contextMenus.create({
      id: "summarizePDF",
      title: "Summarize PDF",  // The text that will appear in the context menu
      contexts: ["selection"],  // Only show when text is selected
      documentUrlPatterns: ["*://*/*.pdf"]  // Only show in PDF files
    });
    // ***************************
  });
});

 // **********PDFs************
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "summarizePDF") {
    const pdfUrl = info.linkUrl;

    chrome.tabs.sendMessage(tab.id, { action: "extractPDF", pdfUrl: pdfUrl });
  }
});
// **************************


// ********** This is add-on for JUST QnA ******************
    
// Extensions toolbar option (Chatbox opens up when click on icon) (Isn't it great?)
chrome.action.onClicked.addListener((tab) => {
  // Send a message to the content script to open the chatbox
  chrome.tabs.sendMessage(tab.id, {
    action: "openChatbox",
  });
  console.log("Successfully sent the action of Opeing Chatbox!");
});

// ************** end add-on *****************



// Handle context menu item click (when user selects text)
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "summarize" && info.selectionText) {
    // extractPageContent();
    const selectedText = info.selectionText;
    const url = tab.url;

    // Send selected text and URL to Gemini API to get summary
    getSummaryFromGemini(selectedText, url, async (summary) => {
      chrome.tabs.sendMessage(tab.id, {
        action: "summarize",
        summary: summary
      });
      // console.log('Summary sent to content script:', summary);  // Debugging line
    });
  }
});

// Handle messages from content script (for answering questions)
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "askQuestion") {
//     const { prompt, context } = message;
//     getAnswerFromGemini(prompt, context, (answer) => {
//       sendResponse({ answer: answer });
//     });
//     return true; // Indicates the response is asynchronous
//   }
// });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "askQuestion") {
//     const { prompt } = message;

//     // Get the tab URL from the sender tab
//     const tabUrl = sender.tab.url; // This gets the URL of the tab

//     // Now pass the URL as context to the getAnswerFromGemini function
//     getAnswerFromGemini(prompt, tabUrl, (answer) => {
//       sendResponse({ answer: answer });
//     });

//     return true; // Indicates the response is asynchronous
//   }
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "askQuestion") {
    const { prompt } = message;

    // Step 1: Request page content from content.js
    chrome.tabs.sendMessage(sender.tab.id, { action: "extractContent" }, (response) => {
      if (response && response.content) {
        const pageContent = response.content;

        // Step 2: Pass the extracted content as context to the Gemini API
        getAnswerFromGemini(prompt, pageContent, (answer) => {
          sendResponse({ answer: answer });
        });
      } else {
        sendResponse({ answer: "Unable to extract page content for context." });
      }
    });

    return true; // Indicates the response is asynchronous
  }
});



// Function to query Gemini API for summary
function getSummaryFromGemini(selectedText, url, callback) {
  const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY_HERE"; // Remove the key from the URL
  // Construct the prompt for summarization
  const prompt = `Summarize the content of the following text:\n\n${selectedText}\n\n`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt  
          }
        ]
      }
    ]
  };

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody)  // Send the correctly formatted body
  })
  .then(response => {
    // Check if response is successful (and prnt status also)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();  // Parse JSON response
  })
  .then(data => {
    // Access the content correctly from the response
    if (data && data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
      callback(data.candidates[0].content.parts[0].text); // Send summary to content script
    } else {
      callback("Sorry, no summary available.");
    }
  })
  .catch(error => {
    console.error("Error fetching summary from Gemini:", error);
    callback("Sorry, there was an error fetching the summary.");
  });
}

// Function to query Gemini API for an answer to a question
function getAnswerFromGemini(question, context, callback) {
  const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY_HERE"; // Remove the key from the URL

  // Prompt construction (Main)
  const prompt = `Give your whole output in InnerHTML language directly and answer this question based on given context:\n\n${question}\n\nContext: ${context}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt  
          }
        ]
      }
    ]
  };

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody)  // Send the correctly formatted body
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();  // Parse JSON response
  })
  .then(data => {
    // Access the content correctly from the response
    if (data && data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
      let responseTextans = data.candidates[0].content.parts[0].text;
      
      // **************** It's important (Great work man) *******************
      let lines = responseTextans.split('\n');
      lines =lines.slice(1,lines.length-2); // This removes the first and last lwo elements(lines)
      let strippedText= lines.join('\n');
      // console.log(strippedText); //just for debugging (Mann ki shanti k liye)
      callback(strippedText);
      // ***********************************

      // callback(data.candidates[0].content.parts[0].text); // Send answer to content script
    } else {
      callback("Sorry, no answer available.");
    }
  })
  .catch(error => {
    console.error("Error fetching answer from Gemini:", error);
    callback("Sorry, there was an error fetching the answer.");
  });
}
