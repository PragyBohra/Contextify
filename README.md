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

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/PragyBohra/Contextify.git
cd Contextify
```

### 2. Configure the Gemini API

Contextify requires a Gemini API key for AI-powered summarization and question answering.

Create your own Gemini API key using:

**[Google AI Studio — Get Gemini API Key](https://aistudio.google.com/app/apikey)**

Configure the key locally in `background.js`.

> **⚠️ Security Warning:** Never commit your real Gemini API key to GitHub.

For a production-ready implementation, Gemini API requests should be handled through a secure backend or proxy instead of exposing a long-lived API key in a client-side Chrome extension.

For more information:

**[Gemini API Documentation](https://ai.google.dev/gemini-api/docs)**

**[Gemini API Key Documentation](https://ai.google.dev/gemini-api/docs/api-key)**

### 3. Load the Extension in Chrome

1. Open Chrome.
2. Go to `chrome://extensions/`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the cloned `Contextify` folder.

The extension should now appear in your Chrome extensions list.

---

## ▶️ Usage

### Summarize Selected Text

1. Open a webpage.
2. Select the text you want to summarize.
3. Right-click the selected text.
4. Select **Summarize**.
5. View the generated summary in the Contextify chatbox.

### Ask a Question About a Webpage

1. Open a webpage.
2. Click the Contextify extension icon.
3. Type your question.
4. Press **Enter** or click **Send**.
5. Contextify extracts the webpage text and uses it as context.
6. View the generated answer in the chatbox.

### Chatbox Controls

- Drag the chatbox using its header.
- Resize the chatbox using its resize functionality.
- Press `Enter` to send a question.
- Press `Shift + Enter` to create a new line.
- Click `✖` to close the chatbox.

---

## 📄 PDF Support

Contextify uses **PDF.js** to extract text from PDF documents.

The project includes:

```text
pdfjs/
├── pdf.js
└── pdf.worker.js
```

The PDF processing flow loads the document, extracts text page-by-page, and combines the extracted text.

---

## 🔐 Security

**Never upload a real Gemini API key to a public GitHub repository.**

API keys should be treated as sensitive credentials.

If a key has previously been committed to Git history or exposed elsewhere:

1. Revoke or disable the exposed key.
2. Generate a new key.
3. Update the local application.
4. Verify that the new key is not present in the repository.
5. Check API usage for unexpected activity.

For production deployment, Gemini API requests should be moved behind a secure server-side component rather than embedding a secret directly in the extension.

---

## ⚠️ Current Limitations

- Webpage context is currently extracted using `document.body.innerText`.
- AI responses depend on the configured Gemini API.
- Very large webpages may result in large amounts of context being sent to the API.
- PDF processing relies on PDF.js and is intended for text extraction.
- The current project is a client-side Chrome extension and does not include a backend.
- The current PDF context-menu/extraction flow should be tested against the specific PDF URLs intended to be supported.

---

## 🔮 Future Improvements

- [ ] Add a secure backend for Gemini API requests.
- [ ] Add chunking for very long webpages.
- [ ] Add conversation history.
- [ ] Add summary modes such as TL;DR, key points, and detailed summaries.
- [ ] Improve PDF handling.
- [ ] Add support for additional document types.
- [ ] Add a settings page.
- [ ] Improve error handling and user feedback.
- [ ] Clean up unused experimental code.
- [ ] Consolidate duplicate helper functions.
- [ ] Add Chrome Web Store support.

---

## 👨‍💻 Author

**Pragy Bohra**

B.Tech Electrical Engineering — IIT Mandi

GitHub: [@PragyBohra](https://github.com/PragyBohra)

---

## 📄 License

This project currently does not specify a separate project license.

The bundled PDF.js files retain their respective Mozilla Foundation licensing information.
