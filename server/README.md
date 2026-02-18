# Deepfake Video Detector - Backend API

## AI-Based Deepfake Detection Using Hybrid Spatial-Temporal Deep Learning Framework

This is the FastAPI backend server for the Deepfake Video Detector project.

## Features

- **Video Upload API**: Upload videos for deepfake analysis
- **Spatial Analysis**: Detects facial inconsistencies, lighting anomalies, and artifacts
- **Temporal Analysis**: Analyzes frame-to-frame consistency and temporal patterns
- **Real-time Status**: Track analysis progress and retrieve results
- **RESTful API**: Clean, documented API endpoints
- **Docker Support**: Containerized deployment with Docker Compose

## Tech Stack

- **FastAPI**: Modern Python web framework
- **OpenCV**: Video processing and frame extraction
- **Pydantic**: Data validation and settings management
- **Uvicorn**: ASGI server
- **Docker**: Containerization

## Prerequisites

- Docker and Docker Compose
- OR Python 3.11+ (for local development)

## Quick Start with Docker

### 1. Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration (optional)
```

### 2. Build and Run

```bash
# Build and start the container
docker compose up --build

# Or run in detached mode
docker compose up --build -d
```

The API will be available at `http://localhost:8000`

### 3. Stop and Remove Container

```bash
# Stop and remove containers
docker compose down

# Stop and remove containers with volumes
docker compose down -v
```

## Local Development (Without Docker)

### 1. Create Virtual Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Create .env File

```bash
cp .env.example .env
```

### 4. Run Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## API Endpoints

### Upload Video

```http
POST /api/upload
Content-Type: multipart/form-data

file: <video_file>
```

Response:

```json
{
    "message": "Video uploaded successfully. Analysis in progress.",
    "video_id": "uuid-here",
    "filename": "video.mp4",
    "size_mb": 15.2
}
```

### Get Analysis Result

```http
GET /api/analysis/{video_id}
```

Response:

```json
{
  "video_id": "uuid-here",
  "status": "completed",
  "result": "fake",
  "confidence": 0.87,
  "overall_score": 0.75,
  "spatial_analysis": {
    "facial_inconsistencies": 0.78,
    "lighting_anomalies": 0.65,
    "artifact_detection": 0.82,
    "overall_score": 0.75
  },
  "temporal_analysis": {
    "frame_continuity": 0.71,
    "motion_consistency": 0.79,
    "temporal_artifacts": 0.75,
    "overall_score": 0.75
  },
  "suspicious_frames": [...],
  "total_frames_analyzed": 60,
  "processing_time_seconds": 12.5,
  "analyzed_at": "2026-02-17T10:30:00",
  "explanation": "Analysis indicates...",
  "recommendations": [...]
}
```

### Health Check

```http
GET /health
```

## Project Structure

```
server/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── models.py            # Pydantic models
│   ├── api.py               # API routes
│   └── services/
│       ├── __init__.py
│       ├── video_service.py       # Video upload/management
│       └── deepfake_detector.py   # Deepfake detection logic
├── uploads/                 # Uploaded videos (created automatically)
├── logs/                    # Application logs
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .env.example
└── README.md
```

## Configuration

Key environment variables in `.env`:

```env
# Server
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Upload limits
MAX_UPLOAD_SIZE_MB=100
ALLOWED_VIDEO_EXTENSIONS=.mp4,.avi,.mov,.mkv,.webm

# Analysis settings
FRAME_SAMPLE_RATE=5
MIN_CONFIDENCE_THRESHOLD=0.7
```

## Detection Algorithm

The current implementation uses a **hybrid spatial-temporal analysis**:

### Spatial Analysis

- Facial feature consistency
- Lighting and shadow anomalies
- Compression artifacts
- Frame quality metrics

### Temporal Analysis

- Frame-to-frame continuity
- Motion consistency
- Temporal artifact detection
- Sequence pattern analysis

**Note**: This is a simulated detection system for demonstration. In production, integrate with:

- Pre-trained ResNeXt-LSTM models
- External deepfake detection APIs (Sensity, Deepware)
- Custom trained models on deepfake datasets

## Future Enhancements

- [ ] Real AI model integration (ResNeXt-LSTM)
- [ ] Audio deepfake detection
- [ ] Real-time streaming analysis
- [ ] Database integration (PostgreSQL)
- [ ] Redis caching for results
- [ ] Celery for distributed task processing
- [ ] Authentication and rate limiting
- [ ] Batch video processing
- [ ] Detailed frame-by-frame visualization

## Docker Commands Reference

```bash
# Build
docker compose build

# Start services
docker compose up

# Start in background
docker compose up -d

# View logs
docker compose logs -f

# Restart services
docker compose restart

# Stop services
docker compose stop

# Remove containers, networks, volumes
docker compose down -v

# Execute commands in container
docker compose exec backend bash
```

## Troubleshooting

### Port already in use

```bash
# Change PORT in .env file or docker-compose.yml
```

### Permission denied (uploads folder)

```bash
# Create folders manually
mkdir uploads temp logs
chmod 755 uploads temp logs
```

### Container won't start

```bash
# Check logs
docker compose logs backend

# Rebuild from scratch
docker compose down -v
docker compose build --no-cache
docker compose up
```

## Contributing

This project is part of an academic research on deepfake detection. For collaboration or questions, please refer to the project documentation.

## License

[Specify your license]

## Acknowledgments

- FastAPI framework
- OpenCV community
- Deepfake detection research community

---

**Note**: This is a demonstration/research system. For production use, implement proper AI models, security measures, and scalability features.
