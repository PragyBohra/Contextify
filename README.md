# Contextify

> An AI-powered Chrome extension that summarizes selected webpage content and lets you ask context-aware questions about the current page.

## ✨ Features

- **Selected-text summarization** — Select text on a webpage, right-click, and choose **Summarize**.
- **Context-aware Q&A** — Open the Contextify chatbox and ask questions about the current webpage.
- **Automatic webpage context extraction** — Extracts visible webpage text using `document.body.innerText` and uses it as context for questions.
- **PDF text extraction** — Uses PDF.js to extract text from PDF documents.
- **Gemini-powered responses** — Uses the Gemini API for summarization and question answering.
- **In-page chatbox** — Displays summaries and answers directly inside the current webpage.
- **Draggable and resizable UI** — Move and resize the Contextify chatbox.
- **Keyboard support** — Press `Enter` to send and `Shift + Enter` for a new line.
- **Loading animation** — Shows a loading indicator while waiting for an AI response.

---

## 🧠 How It Works

### 1. Summarize Selected Text

When text is selected on a webpage, Contextify provides a **Summarize** option through the browser context menu.

The selected text is sent from the extension's background service worker to the Gemini API. The generated summary is then displayed inside the Contextify chatbox.

```text
Select Text
     ↓
Right Click → Summarize
     ↓
Background Service Worker
     ↓
Gemini API
     ↓
Generated Summary
     ↓
Contextify Chatbox
```

### 2. Ask Questions About the Current Webpage

When a question is submitted through the Contextify chatbox:

1. Contextify requests the current page content from the content script.
2. The content script extracts visible text using `document.body.innerText`.
3. The extracted content is used as context.
4. The question and webpage context are sent to the Gemini API.
5. The generated response is displayed inside the chatbox.

```text
Current Webpage
      ↓
Content Extraction
      ↓
Question + Page Context
      ↓
Gemini API
      ↓
AI Response
      ↓
Contextify Chatbox
```

### 3. PDF Text Extraction

Contextify includes PDF.js and its worker file for PDF processing.

The extension loads the PDF, iterates through its pages, extracts the text from each page, and combines the extracted text for further processing.

---

## 🛠️ Tech Stack

- **JavaScript**
- **Chrome Extensions Manifest V3**
- **Chrome Extension APIs**
  - Context Menus
  - Active Tab
  - Runtime Messaging
  - Extension Action
- **Gemini API**
- **PDF.js**
- **HTML / CSS**
- **Inter Font**

---

## 📁 Project Structure

```text
Contextify/
│
├── icons/
│   ├── 16.png
│   ├── 48.png
│   ├── 128.png
│   └── ...
│
├── pdfjs/
│   ├── pdf.js
│   └── pdf.worker.js
│
├── styles/
│   └── chatbox.css
│
├── background.js
├── content.js
├── image.svg
└── manifest.json
```

### Main Files

| File | Purpose |
|------|---------|
| `manifest.json` | Chrome extension configuration, permissions, service worker, content scripts, styles, icons, and PDF.js worker resource. |
| `background.js` | Handles context-menu actions, extension-button clicks, messaging, and Gemini API requests. |
| `content.js` | Handles the in-page chatbox, webpage/PDF text extraction, user questions, and response display. |
| `styles/chatbox.css` | Contains styles for the chatbox, inputs, buttons, and loading animation. |
| `pdfjs/pdf.js` | Bundled PDF.js library used for PDF processing. |
| `pdfjs/pdf.worker.js` | PDF.js worker used during PDF processing. |

---


## 👨‍💻 Author

**Pragy Bohra**

B.Tech Electrical Engineering — IIT Mandi

GitHub: [@PragyBohra](https://github.com/PragyBohra)
