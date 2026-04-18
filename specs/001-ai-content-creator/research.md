# Research: AI Content Creator Tool

## Decision 1: Media Lifecycle Management
**Decision**: Use **Google Cloud Storage (GCS) Lifecycle Rules** for auto-deletion.
**Rationale**: Native GCS TTL is more cost-effective and reliable than running scheduled Firebase Functions scripts to loop through files. Since the backend interacts with GCS URLs for FFmpeg, we can set a `Delete` action with `Age: 7` on the storage bucket.
**Alternatives considered**: Firebase Functions (rejected due to execution overhead/potential timeouts for large buckets).

## Decision 2: FFmpeg Deployment Architecture
**Decision**: **Cloud Run with Custom Dockerfile (Ubuntu 22.04 base)**.
**Rationale**: ffmpeg requires substantial memory (4GB+) and CPU (4 vCPUs) for 1080p composition. Cloud Run's concurrency model (1 request per instance) is ideal for isolating heavy jobs. Ubuntu base allows simple `apt-get install ffmpeg` and Python/Whisper installation.
**Alternatives considered**: GCF (rejected due to limited environment customization and lower timeouts).

## Decision 3: AI Fallback Logic
**Decision**: **Tiered Service Wrappers** (Gemini -> OpenAI).
**Rationale**: Every asset requirement will be wrapped in a coordinator service. If Gemini Imagen quota is hit (HTTP 429), it immediately attempts DALL-E 3. If Veo 2 times out (3 min), it triggers a static image generation with Ken Burns effect.
**Alternatives considered**: Single-provider focus (rejected due to reliability requirements).

## Decision 4: Local Draft Persistence
**Decision**: **Zustand `persist` middleware with `localStorage`**.
**Rationale**: High-reliability "Dark Mode" requires resuming even after network loss. `persist` handles the serialization automatically. Syncing to Firestore happens proactively after each step completion to allow cross-device resume.
**Alternatives considered**: Hand-rolled IndexedDB (rejected for over-complexity).

## Decision 5: Arabic Dialect Support (Egyptian/Cairo)
**Decision**: **Google Cloud TTS `ar-XA-Wavenet-B/D` with SSML `<prosody>` hacks**.
**Rationale**: Wavenet-B/D are high-fidelity. While they are Standard Arabic, providing a "Hook" in Egyptian dialect via SSML tags for emphasis and slightly higher pitch (prosody) mimics natural commercial narration better.
**Alternatives considered**: ElevenLabs (rejected for personal use cost optimization).
