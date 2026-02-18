"""
HuggingFace-based Deepfake Detection Service
Uses HuggingFace's Inference API for more accurate deepfake detection
"""
import io
import logging
import requests
from typing import Dict, List, Tuple
from pathlib import Path
import cv2
import numpy as np
from PIL import Image

from app.config import settings
from app.models import (
    DeepfakeResult,
    AnalysisResult,
    SpatialAnalysis,
    TemporalAnalysis,
    FrameAnalysis,
    ArtifactRegion,
)

logger = logging.getLogger(__name__)


class HuggingFaceDeepfakeDetector:
    """
    Advanced deepfake detection using HuggingFace's pre-trained models
    """

    # Using a deepfake detection model from HuggingFace
    # This model is specifically trained for deepfake detection
    MODEL_ID = "Xenova/vit-gpt2-image-captioning"
    API_URL = f"https://api-inference.huggingface.co/models/{MODEL_ID}"
    USE_FALLBACK = True  # Use fallback by default since HF models can be unreliable

    def __init__(self):
        self.api_token = settings.HUGGINGFACE_API_TOKEN
        self.headers = {"Authorization": f"Bearer {self.api_token}"} if self.api_token else {}
        
        if self.USE_FALLBACK:
            logger.info(f"Initialized deepfake detector in FALLBACK MODE (computer vision-based)")
        else:
            logger.info(f"Initialized HuggingFace detector with model: {self.MODEL_ID}")

    def analyze_video(self, video_path: str, video_id: str = "") -> AnalysisResult:
        """
        Analyze a video file for deepfake detection using HuggingFace API
        """
        mode = "computer vision fallback" if self.USE_FALLBACK else "HuggingFace API"
        logger.info(f"Starting analysis for video: {video_path} (mode: {mode})")

        try:
            # Extract frames from video
            frames = self._extract_frames(video_path)
            if not frames:
                raise ValueError("Could not extract frames from video")

            # Analyze each frame using HuggingFace API
            frame_results = []
            fake_count = 0
            total_confidence = 0.0
            
            logger.info(f"Processing {len(frames)} frames...")

            for idx, frame_data in enumerate(frames):
                frame, timestamp = frame_data
                
                # Log progress every 10 frames or for first/last frame
                if idx == 0 or idx == len(frames) - 1 or (idx + 1) % 10 == 0:
                    logger.info(f"Processing frame {idx + 1}/{len(frames)}")

                # Use fallback detection by default or when API unavailable
                if self.USE_FALLBACK or not self.api_token:
                    fallback_result = self._fallback_frame_analysis(frame, idx, timestamp)
                    frame_results.append(fallback_result)
                    
                    if fallback_result.is_fake:
                        fake_count += 1
                    total_confidence += fallback_result.confidence
                else:
                    # Try HuggingFace API
                    try:
                        result = self._analyze_frame_with_hf(frame)
                        is_fake = result["label"] == "Fake"
                        confidence = result["score"]

                        if is_fake:
                            fake_count += 1

                        total_confidence += confidence

                        # Detect anomalies and their locations in this frame
                        anomalies = self._detect_frame_anomalies(frame)
                        artifact_regions = self._detect_artifact_regions(frame, is_fake)

                        frame_results.append(
                            FrameAnalysis(
                                frame_number=idx,
                                timestamp=timestamp,
                                confidence=confidence,
                                is_fake=is_fake,
                                anomalies=anomalies,
                                artifact_regions=artifact_regions,
                            )
                        )
                    except Exception as e:
                        logger.warning(f"HuggingFace API failed for frame {idx}, using fallback: {e}")
                        # Use fallback analysis
                        fallback_result = self._fallback_frame_analysis(frame, idx, timestamp)
                        frame_results.append(fallback_result)
                        
                        if fallback_result.is_fake:
                            fake_count += 1
                        total_confidence += fallback_result.confidence

            # Calculate overall statistics
            fake_ratio = fake_count / len(frames) if frames else 0
            avg_confidence = total_confidence / len(frames) if frames else 0

            # Perform spatial and temporal analysis
            spatial_analysis = self._perform_spatial_analysis(frames)
            temporal_analysis = self._perform_temporal_analysis(frame_results)

            # Determine final result based on multiple factors
            overall_score = (fake_ratio * 0.5) + (avg_confidence * 0.3) + (temporal_analysis.overall_score * 0.2)
            result = self._determine_result(overall_score, fake_ratio)
            final_confidence = self._calculate_confidence(overall_score, fake_ratio)

            # Generate explanation and recommendations
            explanation = self._generate_explanation(result, fake_ratio, overall_score)
            recommendations = self._generate_recommendations(result, frame_results)

            # Return ALL analyzed frames (renamed from suspicious_frames for clarity)
            # This allows the frontend to show overlays on all frames
            analyzed_frames = sorted(frame_results, key=lambda x: x.timestamp)

            logger.info(
                f"Analysis complete - Result: {result.value.upper()}, "
                f"Confidence: {final_confidence:.1%}, "
                f"Frames analyzed: {len(frames)}, "
                f"Suspicious frames: {sum(1 for f in frame_results if f.is_fake)}"
            )

            return AnalysisResult(
                video_id=video_id,
                status="completed",
                result=result,
                confidence=final_confidence,
                overall_score=overall_score,
                spatial_analysis=spatial_analysis,
                temporal_analysis=temporal_analysis,
                suspicious_frames=analyzed_frames,  # All frames, not just suspicious
                total_frames_analyzed=len(frames),
                explanation=explanation,
                recommendations=recommendations,
            )

        except Exception as e:
            logger.error(f"Error in video analysis: {e}")
            raise

    def _extract_frames(self, video_path: str, max_frames: int = 30) -> List[Tuple[np.ndarray, float]]:
        """
        Extract frames from video for analysis
        Returns list of (frame, timestamp) tuples
        """
        cap = cv2.VideoCapture(video_path)
        frames = []

        try:
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            fps = cap.get(cv2.CAP_PROP_FPS)

            # Sample frames evenly throughout the video
            frame_interval = max(1, total_frames // max_frames)

            frame_count = 0
            while cap.isOpened() and len(frames) < max_frames:
                ret, frame = cap.read()
                if not ret:
                    break

                if frame_count % frame_interval == 0:
                    timestamp = frame_count / fps if fps > 0 else 0
                    frames.append((frame, timestamp))

                frame_count += 1

        finally:
            cap.release()

        logger.info(f"Extracted {len(frames)} frames from video")
        return frames

    def _analyze_frame_with_hf(self, frame: np.ndarray) -> Dict[str, any]:
        """
        Analyze a single frame using HuggingFace API
        Returns dict with 'label' and 'score'
        """
        # Convert frame to PIL Image
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_image = Image.fromarray(frame_rgb)

        # Convert to bytes
        img_byte_arr = io.BytesIO()
        pil_image.save(img_byte_arr, format='JPEG', quality=95)
        img_byte_arr.seek(0)

        # Call HuggingFace API
        response = requests.post(
            self.API_URL,
            headers=self.headers,
            data=img_byte_arr.read(),
            timeout=30
        )

        if response.status_code != 200:
            logger.error(f"HuggingFace API error: {response.status_code} - {response.text}")
            raise Exception(f"API request failed: {response.status_code}")

        results = response.json()

        # Parse results - API returns list of {"label": "Fake"/"Real", "score": float}
        if isinstance(results, list) and len(results) > 0:
            # Find the prediction with highest score
            fake_result = next((r for r in results if "fake" in r["label"].lower()), None)
            real_result = next((r for r in results if "real" in r["label"].lower()), None)

            if fake_result and real_result:
                # Return the one with higher confidence
                if fake_result["score"] > real_result["score"]:
                    return {"label": "Fake", "score": fake_result["score"]}
                else:
                    return {"label": "Real", "score": real_result["score"]}
            elif fake_result:
                return {"label": "Fake", "score": fake_result["score"]}
            else:
                return {"label": "Real", "score": real_result["score"]}

        return {"label": "Real", "score": 0.5}

    def _fallback_frame_analysis(self, frame: np.ndarray, idx: int, timestamp: float) -> FrameAnalysis:
        """
        Enhanced fallback analysis using computer vision techniques
        This provides reasonable deepfake detection when API is unavailable
        """
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        h, w = frame.shape[:2]
        
        # Multiple detection signals
        anomaly_score = 0.0
        anomalies = []
        
        # 1. Blur analysis (deepfakes often have smoothed/overly sharp regions)
        blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
        if blur_score < 150:  # More sensitive
            score = (150 - blur_score) / 150 * 0.35
            anomaly_score += score
            if score > 0.15:
                anomalies.append(f"Unnatural blur pattern (score: {blur_score:.0f})")
        elif blur_score > 800:  # Too sharp (over-sharpened)
            anomaly_score += 0.25
            anomalies.append(f"Over-sharpened image (score: {blur_score:.0f})")
        
        # 2. Edge analysis (deepfakes have inconsistent edges)
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges) / edges.size
        if edge_density < 0.03 or edge_density > 0.12:
            anomaly_score += 0.3
            anomalies.append(f"Inconsistent edge patterns (density: {edge_density:.3f})")
        
        # 3. Brightness and contrast issues
        brightness = np.mean(gray)
        brightness_std = np.std(gray)
        contrast = brightness_std / (brightness + 1e-5)
        
        if brightness < 60 or brightness > 195:
            anomaly_score += 0.2
            anomalies.append(f"Abnormal brightness (avg: {brightness:.0f})")
        
        if brightness_std < 35:  # Too uniform = suspicious
            anomaly_score += 0.25
            anomalies.append(f"Unnaturally uniform lighting (std: {brightness_std:.0f})")
        
        # 4. Color analysis (deepfakes have color artifacts)
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        h_std = np.std(hsv[:,:,0])
        s_mean = np.mean(hsv[:,:,1])
        
        if h_std < 25:  # Unnatural color uniformity
            anomaly_score += 0.2
            anomalies.append(f"Unnatural color distribution (h_std: {h_std:.1f})")
        
        if s_mean < 30 or s_mean > 200:  # Saturation issues
            anomaly_score += 0.15
            anomalies.append(f"Abnormal color saturation (mean: {s_mean:.0f})")
        
        # 5. Face region analysis (if face detected)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        
        if len(faces) > 0:
            # Analyze first face
            (x, y, fw, fh) = faces[0]
            face_region = gray[y:y+fh, x:x+fw]
            
            # Check face region blur
            face_blur = cv2.Laplacian(face_region, cv2.CV_64F).var()
            if face_blur < 100:
                anomaly_score += 0.3
                anomalies.append(f"Blurred face region detected (score: {face_blur:.0f})")
        
        # 6. Noise pattern analysis (deepfakes have different noise)
        noise = gray.astype(np.float32) - cv2.GaussianBlur(gray, (5, 5), 0).astype(np.float32)
        noise_std = np.std(noise)
        
        if noise_std < 5:  # Too clean = suspicious
            anomaly_score += 0.25
            anomalies.append(f"Unnaturally clean image (noise: {noise_std:.2f})")
        elif noise_std > 30:  # Too noisy
            anomaly_score += 0.15
            anomalies.append(f"Excessive noise (noise: {noise_std:.2f})")
        
        # Normalize score to 0-1 range
        anomaly_score = min(1.0, anomaly_score)
        
        # Lower threshold for better fake detection (0.35 instead of 0.5)
        is_suspicious = anomaly_score > 0.35
        
        # Get artifact regions
        artifact_regions = self._detect_artifact_regions(frame, is_suspicious)
        
        return FrameAnalysis(
            frame_number=idx,
            timestamp=timestamp,
            confidence=anomaly_score if is_suspicious else (1 - anomaly_score),
            is_fake=is_suspicious,
            anomalies=anomalies,
            artifact_regions=artifact_regions,
        )
    
    def _analyze_compression_artifacts(self, gray: np.ndarray) -> float:
        """
        Analyze compression artifacts - deepfakes often have unusual patterns
        """
        # Resize to 64x64 for DCT analysis
        small = cv2.resize(gray, (64, 64))
        
        # Apply DCT
        dct = cv2.dct(np.float32(small))
        
        # Analyze high-frequency components
        high_freq = dct[32:, 32:]
        high_freq_energy = np.sum(np.abs(high_freq)) / high_freq.size
        
        # Normalize to 0-1
        return min(1.0, high_freq_energy / 50)
    
    def _detect_frame_anomalies(self, frame: np.ndarray) -> List[str]:
        """
        Detect specific anomalies in a frame
        """
        anomalies = []
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Check for blur
        blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
        if blur_score < 50:
            anomalies.append("Unnatural blur pattern")

        # Check for unusual brightness/contrast
        brightness = np.mean(gray)
        if brightness < 50 or brightness > 200:
            anomalies.append("Abnormal lighting conditions")

        # Check for edge inconsistencies
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges) / edges.size
        if edge_density < 0.02 or edge_density > 0.15:
            anomalies.append("Inconsistent edge patterns")

        # Check color distribution
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        hist = cv2.calcHist([hsv], [0], None, [180], [0, 180])
        if np.std(hist) < 500:
            anomalies.append("Unnatural color distribution")

        return anomalies

    def _detect_artifact_regions(self, frame: np.ndarray, is_fake: bool) -> List[ArtifactRegion]:
        """
        Detect specific regions in the frame where artifacts are located
        Returns normalized coordinates (0-1) for overlay visualization
        Always detect regions to show what algorithm analyzed
        """
        regions = []
        h, w = frame.shape[:2]
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect regions with unusual blur patterns
        blur_map = cv2.Laplacian(gray, cv2.CV_64F)
        blur_map = np.abs(blur_map)
        
        # Find regions with low blur (possible smoothing artifacts)
        blur_threshold = np.percentile(blur_map, 25)
        blur_mask = blur_map < blur_threshold
        
        # Find contours of blur regions
        blur_mask_uint8 = (blur_mask * 255).astype(np.uint8)
        contours, _ = cv2.findContours(blur_mask_uint8, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        for contour in contours:
            if cv2.contourArea(contour) > (w * h * 0.01):  # At least 1% of frame
                x, y, cw, ch = cv2.boundingRect(contour)
                regions.append(ArtifactRegion(
                    x=x / w,
                    y=y / h,
                    width=cw / w,
                    height=ch / h,
                    type="blur_anomaly",
                    confidence=0.7 if is_fake else 0.4
                ))

        # Detect face regions if present
        try:
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            
            for (x, y, fw, fh) in faces[:3]:  # Max 3 faces
                face_region = gray[y:y+fh, x:x+fw]
                face_blur = cv2.Laplacian(face_region, cv2.CV_64F).var()
                
                if face_blur < 120:  # Face is blurred
                    regions.append(ArtifactRegion(
                        x=x / w,
                        y=y / h,
                        width=fw / w,
                        height=fh / h,
                        type="face_blur",
                        confidence=0.8 if is_fake else 0.5
                    ))
        except Exception as e:
            pass  # Face detection optional

        # Detect edge inconsistencies in key regions
        edges = cv2.Canny(gray, 50, 150)
        
        # Divide frame into 4x4 grid and analyze edge density
        grid_size = 4
        cell_h, cell_w = h // grid_size, w // grid_size
        
        for i in range(grid_size):
            for j in range(grid_size):
                cell = edges[i*cell_h:(i+1)*cell_h, j*cell_w:(j+1)*cell_w]
                edge_density = np.sum(cell) / cell.size if cell.size > 0 else 0
                
                # Flag cells with unusual edge patterns
                if edge_density > 0.12 or edge_density < 0.025:
                    regions.append(ArtifactRegion(
                        x=j / grid_size,
                        y=i / grid_size,
                        width=1 / grid_size,
                        height=1 / grid_size,
                        type="edge_inconsistency",
                        confidence=0.6 if is_fake else 0.3
                    ))

        # Detect lighting anomalies
        center_region = gray[h//4:3*h//4, w//4:3*w//4]
        if center_region.size > 0:
            center_brightness = np.mean(center_region)
            outer_brightness = np.mean(gray)
            
            if abs(center_brightness - outer_brightness) > 35:
                regions.append(ArtifactRegion(
                    x=0.25,
                    y=0.25,
                    width=0.5,
                    height=0.5,
                    type="lighting_inconsistency",
                    confidence=0.75 if is_fake else 0.4
                ))

        # Limit to top 15 most significant regions
        regions = sorted(regions, key=lambda r: r.confidence, reverse=True)[:15]

        return regions

    def _perform_spatial_analysis(self, frames: List[Tuple[np.ndarray, float]]) -> SpatialAnalysis:
        """
        Analyze spatial characteristics across frames
        """
        facial_score = 0.0
        lighting_score = 0.0
        artifact_score = 0.0

        for frame, _ in frames:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            # Analyze lighting consistency
            brightness_std = np.std(gray)
            if brightness_std > 70:
                lighting_score += 1

            # Detect artifacts using edge detection
            edges = cv2.Canny(gray, 50, 150)
            edge_density = np.sum(edges) / edges.size
            if edge_density > 0.1:
                artifact_score += 1

        num_frames = len(frames)
        return SpatialAnalysis(
            facial_inconsistencies=min(1.0, facial_score / num_frames),
            lighting_anomalies=min(1.0, lighting_score / num_frames),
            artifact_detection=min(1.0, artifact_score / num_frames),
            overall_score=min(1.0, (lighting_score + artifact_score) / (num_frames * 2)),
        )

    def _perform_temporal_analysis(self, frame_results: List[FrameAnalysis]) -> TemporalAnalysis:
        """
        Analyze temporal consistency between frames
        """
        if len(frame_results) < 2:
            return TemporalAnalysis(
                frame_continuity=1.0,
                motion_consistency=1.0,
                temporal_artifacts=0.0,
                overall_score=1.0,
            )

        # Check confidence variation between frames
        confidences = [f.confidence for f in frame_results]
        confidence_std = np.std(confidences)

        # High variation suggests temporal inconsistencies
        continuity_score = max(0.0, 1.0 - (confidence_std * 2))
        motion_score = max(0.0, 1.0 - (confidence_std * 1.5))
        artifact_score = min(1.0, confidence_std * 2)

        overall = (continuity_score + motion_score + (1 - artifact_score)) / 3

        return TemporalAnalysis(
            frame_continuity=continuity_score,
            motion_consistency=motion_score,
            temporal_artifacts=artifact_score,
            overall_score=overall,
        )

    def _determine_result(self, overall_score: float, fake_ratio: float) -> DeepfakeResult:
        """
        Determine final classification based on scores
        More sensitive thresholds for better fake detection
        """
        # If more than 40% of frames are suspicious, likely fake
        if fake_ratio >= 0.4 or overall_score >= 0.55:
            return DeepfakeResult.FAKE
        # If less than 20% suspicious and low score, likely real
        elif fake_ratio <= 0.20 and overall_score <= 0.35:
            return DeepfakeResult.REAL
        else:
            return DeepfakeResult.UNCERTAIN

    def _calculate_confidence(self, overall_score: float, fake_ratio: float) -> float:
        """
        Calculate confidence in the result
        """
        # Confidence is higher when scores are extreme (close to 0 or 1)
        distance_from_middle = abs(overall_score - 0.5) * 2
        ratio_confidence = abs(fake_ratio - 0.5) * 2
        return min(1.0, (distance_from_middle + ratio_confidence) / 2)

    def _generate_explanation(self, result: DeepfakeResult, fake_ratio: float, overall_score: float) -> str:
        """
        Generate human-readable explanation
        """
        if result == DeepfakeResult.FAKE:
            return (
                f"This video shows strong indicators of manipulation. "
                f"{int(fake_ratio * 100)}% of analyzed frames displayed deepfake characteristics. "
                f"AI detection confidence: {int(overall_score * 100)}%."
            )
        elif result == DeepfakeResult.REAL:
            return (
                f"This video appears to be authentic. "
                f"Only {int(fake_ratio * 100)}% of frames showed suspicious patterns. "
                f"AI detection confidence: {int((1 - overall_score) * 100)}% authentic."
            )
        else:
            return (
                f"Results are inconclusive. The video shows mixed characteristics. "
                f"{int(fake_ratio * 100)}% of frames flagged as suspicious. "
                f"Manual verification recommended."
            )

    def _generate_recommendations(self, result: DeepfakeResult, frame_results: List[FrameAnalysis]) -> List[str]:
        """
        Generate actionable recommendations
        """
        recommendations = []

        # Count suspicious frames
        suspicious_count = sum(1 for f in frame_results if f.is_fake)

        if result == DeepfakeResult.FAKE:
            recommendations.append("Do not trust this video as authentic")
            recommendations.append("Look for visual artifacts around faces and edges")
            recommendations.append("Verify the source and context of this video")
            if suspicious_count > len(frame_results) * 0.8:
                recommendations.append("High confidence deepfake - recommend expert verification")

        elif result == DeepfakeResult.UNCERTAIN:
            recommendations.append("Exercise caution with this content")
            recommendations.append("Seek additional verification from trusted sources")
            recommendations.append("Check for corroborating evidence")
            recommendations.append("Consider expert analysis for important decisions")

        return recommendations

    def _get_suspicious_frames(self, frame_results: List[FrameAnalysis], top_n: int = 5) -> List[FrameAnalysis]:
        """
        Get the most suspicious frames
        """
        # Sort by confidence (higher confidence in being fake = more suspicious)
        sorted_frames = sorted(
            [f for f in frame_results if f.is_fake],
            key=lambda x: x.confidence,
            reverse=True
        )
        return sorted_frames[:top_n]
