# 📇 scan2contact

**SmartScan Contacts** — A web app that extracts contact details from images using OCR and converts them into structured digital contacts.

---

## 🔧 Setup Instructions

### 1. Environment Variables

You need to provide an OCR API key for the app to function:

#### Option A: Export via shell

`export OCR_SPACE_API_KEY="your_api_key_here"`

Option B: Use a .env file

Create a .env file in the root directory and add:

`OCR_SPACE_API_KEY=your_api_key_here`

2. Firebase Configuration

Update the Firebase-related environment variables as per the credentials provided. You can place them in the same lib/firebase.t file.
🚀 Getting Started

Install dependencies and start the development server:

`npm install       # Install all dependencies`

`npm run dev       # Start the development server`

Open your browser and navigate to:

http://localhost:3000/
