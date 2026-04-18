# Quickstart: AI Content Creator Tool

## 🛠️ Prerequisites
- Node.js 20+
- Docker (for local Cloud Run testing)
- Firebase CLI (`npm install -g firebase-tools`)
- Google Cloud CLI (gcloud)

## 🔑 Setup
1. **Firebase**:
   - Create a project in Firebase Console.
   - Enable Auth (Google), Firestore, and Storage.
   - Create a `.env.local` in `frontend/` with your Firebase config.
2. **Google Cloud**:
   - Enable Vertex AI API (for Gemini/Imagen).
   - Create a GCS bucket for video processing.
   - Configure Lifecycle Rule: `Age: 7` -> `Delete`.

## 🚀 Development
```bash
# Terminal 1: Backend
cd backend && npm install
npm run dev

# Terminal 2: Frontend
cd frontend && npm install
npm run dev
```

## 🚢 Deployment
1. **Backend**:
   ```bash
   gcloud builds submit --tag gcr.io/[PROJECT_ID]/creator-backend
   gcloud run deploy --image gcr.io/[PROJECT_ID]/creator-backend
   ```
2. **Frontend**:
   ```bash
   firebase deploy --only hosting
   ```
