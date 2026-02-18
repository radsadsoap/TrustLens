# Deepfake Video Detector

**AI-Based Deepfake Detection Using Hybrid Spatial-Temporal Deep Learning Framework**

A full-stack web application for detecting deepfake videos using advanced spatial and temporal analysis techniques.

## 🎯 Project Overview

This project addresses the challenge of detecting AI-generated deepfake videos through a comprehensive analysis system that examines both spatial inconsistencies within frames and temporal irregularities across video sequences.

### Problem Statement

The rapid advancement of deep learning technologies has enabled the creation of highly realistic deepfake videos. These manipulated videos pose serious threats to:

- Digital security and personal privacy
- Public trust and media authenticity
- Political systems and democratic processes
- Cybersecurity infrastructure

### Solution

A hybrid spatial-temporal detection framework that combines:

- **Spatial Analysis**: Facial feature consistency, lighting anomalies, artifact detection
- **Temporal Analysis**: Frame continuity, motion consistency, temporal artifacts
- **User-Friendly Interface**: Web-based platform accessible to non-technical users

## 🏗️ Architecture

```
demo/
├── client/          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API integration
│   │   └── assets/
│   └── package.json
│
└── server/          # FastAPI Python backend
    ├── app/
    │   ├── services/      # Business logic
    │   ├── api.py         # API routes
    │   ├── models.py      # Data models
    │   └── main.py        # Application entry
    ├── Dockerfile
    ├── docker-compose.yml
    └── requirements.txt
```

## 🚀 Tech Stack

### Frontend

- **React 19** - Modern UI framework with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TailwindCSS 4** - Utility-first CSS framework
- **React Router 7** - Client-side routing
- **Phosphor Icons** - Beautiful icon library

### Backend

- **FastAPI 0.109** - High-performance Python web framework
- **Python 3.11-slim** - Modern Python runtime
- **OpenCV 4.9** - Computer vision library for frame analysis
- **Pydantic** - Data validation and settings management
- **Uvicorn** - ASGI server
- **Docker & Docker Compose** - Containerized deployment

## 📋 Prerequisites

- **Docker & Docker Compose** (Recommended)
- OR **Node.js 18+** and **Python 3.11+** for local development

## 🎬 Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository**

```bash
cd demo
```

2. **Start Backend**

```bash
cd server
docker compose up --build
```

The backend API will be available at `http://localhost:8000`

3. **Start Frontend** (in a new terminal)

```bash
cd client
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

4. **Stop Services**

```bash
# In server directory
docker compose down
```

### Option 2: Local Development

#### Backend Setup

```bash
cd server

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Run development server
npm run dev
```

## 📖 Usage

1. **Navigate to** `http://localhost:5173`

2. **Upload a video**:
    - Click "Upload Video" button
    - Or drag and drop a video file
    - Supported formats: MP4, AVI, MOV, MKV, WebM

3. **Run analysis**:
    - Click the "Run Analysis" button in the Analysis panel
    - The system processes the video frame by frame (~30 frames)
    - Analysis typically takes 10-30 seconds depending on video length

4. **Review results**:
    - View overall detection result (Real/Fake/Suspicious)
    - Check confidence percentage
    - Explore the interactive timeline with anomaly markers
    - Click on timestamps to jump to specific suspicious frames

5. **Examine artifacts**:
    - View color-coded artifact overlays on the video player
    - Orange: Blur artifacts
    - Yellow: Edge inconsistencies
    - Purple: Face regions
    - Magenta: Lighting anomalies
    - Toggle overlays on/off with the button below the video

## � Project Flow

### End-to-End Process

```
┌───────────────┐
│  User Action  │ Upload video file (MP4, AVI, MOV, etc.)
└───────┬───────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│  Frontend (React)                           │
│  - File validation                          │
│  - POST /api/videos/upload                  │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  Backend (FastAPI)                          │
│  - Save video to /uploads directory         │
│  - Extract metadata (duration, size, etc.)  │
│  - Return video_id and metadata             │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌───────────────┐
│  User Action  │ Click "Run Analysis" button
└───────┬───────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│  Frontend (React)                           │
│  - POST /api/videos/analyze                 │
│  - Receive task_id                          │
│  - Start polling /api/analysis/{task_id}    │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  Backend (FastAPI) - Background Task        │
│  1. Frame Extraction (OpenCV)               │
│     - Extract ~30 frames evenly             │
│     - Convert to numpy arrays               │
│                                             │
│  2. Frame Analysis (6 Detection Signals)    │
│     For each frame:                         │
│     - Blur analysis (Laplacian)             │
│     - Edge detection (Canny)                │
│     - Brightness/Contrast stats             │
│     - Color histogram analysis              │
│     - Noise pattern detection               │
│     - Face detection (Haar Cascade)         │
│     - Compression artifacts (DCT)           │
│     - Calculate weighted suspicion score    │
│     - Mark suspicious if score ≥ 0.35       │
│                                             │
│  3. Artifact Localization                   │
│     For ALL frames:                         │
│     - 4x4 grid analysis                     │
│     - Face region detection                 │
│     - Contour detection                     │
│     - Store regions with type & confidence  │
│                                             │
│  4. Overall Verdict                         │
│     - FAKE if ≥40% frames suspicious        │
│     - REAL if ≤20% frames suspicious        │
│     - SUSPICIOUS if between 20-40%          │
│                                             │
│  5. Return AnalysisResult                   │
│     - Verdict and confidence                │
│     - All frames with timestamps            │
│     - Artifact regions for each frame       │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  Frontend (React) - Results Display         │
│  1. CustomVideoPlayer                       │
│     - Yellow markers on timeline (anomalies)│
│     - Canvas overlay for artifacts          │
│     - Color-coded regions (blur/edge/etc.)  │
│     - Play/Pause controls                   │
│     - Seekable progress bar                 │
│                                             │
│  2. Analysis Panel                          │
│     - Overall verdict badge                 │
│     - Confidence percentage                 │
│     - Clickable timestamp cards:            │
│       * Frame number & timestamp            │
│       * Confidence score                    │
│       * List of anomalies detected          │
│     - Click to seek video to that frame     │
│                                             │
│  3. Interactive Features                    │
│     - Click timeline marker → seek video    │
│     - Click timestamp card → seek video     │
│     - Toggle artifact overlays on/off       │
│     - View artifact legend                  │
└─────────────────────────────────────────────┘
```

### Data Flow Diagram

```
Video File → Upload API → File Storage
                            ↓
                    Video Metadata (id, duration, etc.)
                            ↓
User clicks "Run Analysis"  ↓
                            ↓
                    Analyze API → Background Task
                            ↓
                    Frame Extraction (OpenCV)
                            ↓
                    Frame Analysis (6 signals)
                            ↓
                    Artifact Detection (grid + faces)
                            ↓
                    Overall Verdict Calculation
                            ↓
                    AnalysisResult Model
                            ↓
Frontend Polling ← Task Status API
                            ↓
                    Results Display:
                    - Video Player with Overlays
                    - Interactive Timeline
                    - Clickable Timestamp Cards
```

## �🔍 Detection Features

### Enhanced Computer Vision Algorithm

### Enhanced Computer Vision Algorithm

The system uses a 6-signal detection approach with OpenCV:

1. **Blur Analysis (Laplacian Variance)**
    - Calculates image sharpness using Laplacian operator
    - Detects unnatural blur patterns typical of AI-generated faces
    - Weight: 15% of suspicion score

2. **Edge Consistency (Canny Detection)**
    - Analyzes edge density and patterns using Canny edge detection
    - Identifies manipulation artifacts and inconsistent boundaries
    - Weight: 15% of suspicion score

3. **Brightness & Contrast Analysis**
    - Examines statistical properties of pixel intensities
    - Detects lighting inconsistencies across frames
    - Weight: 10% of suspicion score

4. **Color Distribution (Histogram Analysis)**
    - Analyzes color channel distributions for anomalies
    - Detects unnatural color patterns
    - Weight: 10% of suspicion score

5. **Noise Pattern Analysis**
    - Detects high-frequency noise typical of compression/generation
    - Identifies unnatural noise patterns
    - Weight: 15% of suspicion score

6. **Face Detection (Haar Cascade)**
    - Identifies and analyzes facial regions
    - Higher weight given to face areas for manipulation detection
    - Weight: 20% of suspicion score

7. **Compression Artifacts (DCT Analysis)**
    - Analyzes encoding inconsistencies using Discrete Cosine Transform
    - Detects re-encoding artifacts typical of deepfakes
    - Weight: 15% of suspicion score

### Artifact Localization

- **Grid-based Analysis**: 4x4 grid analysis of each frame
- **Face Region Detection**: Focused analysis on detected faces
- **Contour Detection**: Identifies high-contrast suspicious regions
- **Normalized Coordinates**: Artifact regions scaled to 0-1 for consistent overlay

### Results Include

- Overall verdict (Real/Fake/Suspicious)
- Confidence percentage
- Frame-by-frame analysis with timestamps
- Interactive timeline with anomaly markers
- Clickable timestamp cards showing:
    - Exact timestamp and frame number
    - Confidence score for that frame
    - List of detected anomalies
- Color-coded artifact overlays on video player
- Toggle-able visualization of detected regions

## 📡 API Documentation

Once the backend is running, visit:

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

### Key Endpoints

**Upload Video**

```http
POST /api/upload
Content-Type: multipart/form-data

file: <video_file>
```

**Get Analysis Result**

```http
GET /api/analysis/{video_id}
```

**Health Check**

```http
GET /health
```

## 🔧 Configuration

### Backend (.env)

```env
HOST=0.0.0.0
PORT=8000
DEBUG=True
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
MAX_UPLOAD_SIZE_MB=100
ALLOWED_VIDEO_EXTENSIONS=.mp4,.avi,.mov,.mkv,.webm
FRAME_SAMPLE_RATE=5
MIN_CONFIDENCE_THRESHOLD=0.7
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api
```

## 🐳 Docker Commands

```bash
# Build and start
docker compose up --build

# Run in background
docker compose up -d --build

# View logs
docker compose logs -f

# Stop containers
docker compose stop

# Remove containers and volumes
docker compose down -v

# Rebuild without cache
docker compose build --no-cache
```

## 📁 Project Structure Details

### Client Structure

```
client/src/
├── components/
│   ├── Header.tsx              # Navigation header
│   ├── Player.tsx              # Video upload component
│   ├── CustomVideoPlayer.tsx   # Custom player with timeline & overlays
│   ├── Analysis.tsx            # Results display with clickable timeline
│   └── DocsNav.tsx             # Documentation navigation
├── pages/
│   ├── Upload.tsx              # Main upload page with player integration
│   └── Docs.tsx                # Documentation page
├── services/
│   └── api.ts                  # API client service
└── App.tsx                     # Main app component
```

### Server Structure

```
server/app/
├── services/
│   ├── video_service.py          # Video processing & storage
│   └── huggingface_detector.py   # Enhanced CV detection algorithm
├── api.py                       # API routes & background tasks
├── models.py                    # Pydantic models (VideoUpload, AnalysisResult, etc.)
├── config.py                    # Configuration settings
└── main.py                      # FastAPI app entry point
```

## 🔮 Future Enhancements

- [ ] Real AI model integration (ResNeXt-LSTM)
- [ ] GPU acceleration support
- [ ] Audio deepfake detection
- [ ] Real-time streaming analysis
- [ ] User authentication system
- [ ] Database integration (PostgreSQL)
- [ ] Result history and analytics
- [ ] Batch video processing
- [ ] API rate limiting
- [ ] Advanced visualization dashboard
- [ ] Mobile responsive improvements
- [ ] Progressive Web App (PWA)

## 🧪 Development

### Running Tests

```bash
# Backend tests (when implemented)
cd server
pytest

# Frontend tests
cd client
npm test
```

### Code Quality

```bash
# Backend linting
cd server
flake8 app/
black app/

# Frontend linting
cd client
npm run lint
```

## 🚨 Troubleshooting

### Backend won't start

- Check if port 8000 is available
- Verify Docker is running
- Check logs: `docker compose logs backend`

### Frontend can't connect to backend

- Verify backend is running on port 8000
- Check CORS settings in backend `.env`
- Ensure `VITE_API_URL` in frontend `.env` is correct

### Upload fails

- Check file size (max 100MB by default)
- Verify file format is supported
- Check backend logs for errors

### Video analysis stuck

- Refresh the page
- Try uploading again
- Check backend container logs

## 📝 Notes

**Important**: The current detection system uses a simulation algorithm for demonstration purposes. For production use:

1. Integrate actual pre-trained AI models (ResNeXt-LSTM)
2. Use external deepfake detection APIs
3. Implement proper database for result storage
4. Add authentication and authorization
5. Implement rate limiting and caching

## 👥 Contributing

This is an academic project. For collaboration inquiries, please contact the project maintainer.

## 📄 License

[Specify your license here]

## 🙏 Acknowledgments

- FastAPI and React communities
- OpenCV contributors
- Deepfake detection research community
- Academic advisors and mentors

---

**Developed as part of academic research on AI-Based Deepfake Detection**
