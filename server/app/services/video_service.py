from fastapi import UploadFile
from app.config import settings
import aiofiles
import os
from pathlib import Path


class VideoService:
    def __init__(self):
        self.upload_dir = "uploads"
        self.max_size_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        self.allowed_extensions = settings.allowed_extensions_list
    
    def validate_video(self, file: UploadFile) -> None:
        """Validate uploaded video file."""
        # Check extension
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in self.allowed_extensions:
            raise ValueError(
                f"Invalid file type. Allowed types: {', '.join(self.allowed_extensions)}"
            )
        
        # Note: Size validation happens during upload
        return True
    
    async def save_video(self, file: UploadFile, video_id: str) -> str:
        """Save uploaded video file."""
        file_ext = Path(file.filename).suffix.lower()
        filename = f"{video_id}{file_ext}"
        file_path = os.path.join(self.upload_dir, filename)
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            
            # Check size
            if len(content) > self.max_size_bytes:
                raise ValueError(
                    f"File too large. Maximum size: {settings.MAX_UPLOAD_SIZE_MB}MB"
                )
            
            await out_file.write(content)
        
        return file_path
    
    def delete_video(self, video_id: str) -> bool:
        """Delete video file."""
        try:
            for ext in self.allowed_extensions:
                file_path = os.path.join(self.upload_dir, f"{video_id}{ext}")
                if os.path.exists(file_path):
                    os.remove(file_path)
                    return True
            return False
        except Exception:
            return False
