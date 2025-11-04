# AI Interior Design Consultant

This is an interactive web application that allows users to reimagine their living spaces using the power of generative AI. Users can upload a photo of a room, select a new interior design style, and instantly see a photorealistic rendering of the redesigned space. The application also features an interactive chat to refine the design and a slider to compare the "before" and "after" images.

<img width="1911" height="1000" alt="ai-designer-consultant" src="https://github.com/user-attachments/assets/b5f8741b-3b32-439e-a747-151c485a81b4" />
<img width="1925" height="1004" alt="ai-designer-consultant-2" src="https://github.com/user-attachments/assets/8fc061a8-4ed8-4b73-9344-b7732e380a36" />

## Features

- **Image Upload**: Upload a JPG, PNG, or WEBP image of your room (up to 4MB).
- **Style Selection**: Choose from a carousel of popular interior design styles, including Mid-Century Modern, Scandinavian, Minimalist, and more.
- **AI-Powered Redesign**: Generates a new, high-quality image of your room transformed into the selected style using the Gemini 2.5 Flash Image model.
- **Interactive Image Comparison**: A draggable slider allows for a seamless visual comparison between the original photo and the AI-generated design.
- **Conversational Refinements**: Use the chat interface to make iterative changes to the generated image (e.g., "Make the sofa green," "Add a plant in the corner").
- **Design Assistant Chat**: Ask for design advice, furniture suggestions, or shoppable links for items that match the new style.

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI Models**: Google Gemini API
  - **`gemini-2.5-flash-image`** (also known as Nano Banana): Used for the core image generation and editing tasks.
  - **`gemini-2.5-flash`**: Powers the text-based conversational chat assistant.

## Prerequisites

To run this application, you will need:
1.  A modern web browser (e.g., Chrome, Firefox, Safari).
2.  A **Google Gemini API Key**. You can obtain one from [Google AI Studio](https://aistudio.google.com/).
3.  Node.js and npm (for the recommended local server).

## Getting Started

This application is designed to be run in an environment where the Google Gemini API key is available as an environment variable.

1.  **Set up the API Key**:
    - The application code expects the API key to be accessible via `process.env.API_KEY`.
    - Ensure this environment variable is set in your deployment or local development environment before running the app.

2.  **Run the Application Locally**:
    - This is a static web application that needs to be served by a web server to function correctly (you cannot just open `index.html` directly from your file system due to browser security policies).
    - You can use any simple local web server. Here are a couple of common examples. Run one of these commands from the project's root directory:

    **Using Node.js (Recommended for this project):**
    ```bash
    # This command uses npx, which comes with npm 5.2+
    npx serve
    ```

    **Using Python (Alternative):**
    ```bash
    # If you have Python 3 installed, this is a quick alternative
    python3 -m http.server
    ```
    - After starting the server, open your web browser and navigate to the local address it provides (e.g., `http://localhost:3000` or `http://localhost:8000`).

## Project Structure

The project is organized into several key directories and files:

```
.
├── README.md                 # Project documentation (this file)
├── index.html                # The main HTML entry point for the app
├── index.tsx                 # The main TypeScript file that renders the React app
├── metadata.json             # Application metadata
├── App.tsx                   # The root React component, managing state and orchestrating UI
├── types.ts                  # Shared TypeScript type definitions (e.g., ChatMessage)
├── constants.ts              # Application-wide constants (e.g., DESIGN_STYLES list)
├── components/               # Reusable React components
│   ├── ImageUploader.tsx     # Handles image file selection and drag-and-drop
│   ├── StyleCarousel.tsx     # Displays the selectable design styles
│   ├── ImageComparator.tsx   # The before-and-after image comparison slider
│   └── ChatInterface.tsx     # The UI for the conversational chat
└── services/                 # Modules for handling external APIs
    └── geminiService.ts      # All logic for interacting with the Google Gemini API
```

## How the Code Works

### `geminiService.ts`

This is the core of the AI functionality. It abstracts all calls to the Google Gemini API.

- **`generateStyledImage(base64Image, style)`**:
  - Takes a base64-encoded original image and a text string for the desired style.
  - Constructs a prompt for the `gemini-2.5-flash-image` model to reimagine the room.
  - Returns the newly generated image as a base64 string.

- **`refineImage(base64Image, prompt)`**:
  - This function is used for iterative edits via the chat.
  - It takes the *current* generated image and the user's text prompt (e.g., "change the curtains to blue").
  - It sends these to the `gemini-2.5-flash-image` model to get an updated image.
  - Returns the refined image as a base64 string.

- **`getChatResponse(history, newMessage, style)`**:
  - Handles non-image-editing chat queries.
  - It uses the `gemini-2.5-flash` text model.
  - A system instruction primes the model to act as a helpful interior design assistant, aware of the current design style.
  - It can generate text-based advice and placeholder shoppable links.

### `App.tsx`

This is the main component that holds the application's state, including:
- The original and generated images.
- The currently selected style.
- The chat history.
- Loading and error states.

It contains the handler functions (`handleImageUpload`, `handleStyleSelect`, `handleSendMessage`) that call the `geminiService` and update the UI accordingly. A simple heuristic in `handleSendMessage` decides whether a user's message is an image editing request or a general chat query.