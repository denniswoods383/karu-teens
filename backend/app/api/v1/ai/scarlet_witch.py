#!/usr/bin/env python3
# Scarlet Witch - AI Image Generation Engine
# Powered by Karu Teens Productions

from datetime import datetime
from pathlib import Path
import requests
import os
import uuid

# Stability AI Configuration
API_KEY = "YOUR_NEW_API_KEY_HERE"  # Replace with your API key that has credits

STYLE_PRESETS = {
    "photographic": "photographic",
    "anime": "anime", 
    "digital-art": "digital-art",
    "neon-punk": "neon-punk",
    "fantasy-art": "fantasy-art",
    "pixel-art": "pixel-art",
    "isometric": "isometric",
    "low-poly": "low-poly"
}

def get_output_path():
    """Get the output directory for generated images"""
    path = Path("uploads/generated")
    path.mkdir(parents=True, exist_ok=True)
    return path

def generate_image(prompt: str, style: str = "photographic", seed: int = None, steps: int = 30):
    """
    Generate image using Stability AI API
    
    Args:
        prompt: Text description for image generation
        style: Style preset for the image
        seed: Random seed for reproducibility
        steps: Number of generation steps
    
    Returns:
        dict: Result containing success status and file info
    """
    if not API_KEY.strip():
        return {"success": False, "error": "API key not configured"}
    
    # Validate style
    if style not in STYLE_PRESETS:
        style = "photographic"
    
    # Generate seed if not provided
    if seed is None:
        seed = datetime.now().microsecond
    
    url = "https://api.stability.ai/v2beta/stable-image/generate/core"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Accept": "image/*"
    }
    
    # Generate unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    filename = f"scarlet_witch_{timestamp}_{unique_id}.png"
    
    output_path = get_output_path()
    filepath = output_path / filename
    
    files = {
        "prompt": (None, prompt),
        "output_format": (None, "png"),
        "style_preset": (None, style),
        "seed": (None, str(seed)),
        "steps": (None, str(steps))
    }
    
    try:
        response = requests.post(url, headers=headers, files=files, timeout=60)
        
        if response.status_code == 200:
            # Save the generated image
            with open(filepath, "wb") as f:
                f.write(response.content)
            
            # Return relative path for web access
            relative_path = f"/uploads/generated/{filename}"
            
            return {
                "success": True,
                "filename": filename,
                "filepath": str(filepath),
                "url": relative_path,
                "prompt": prompt,
                "style": style,
                "seed": seed,
                "timestamp": datetime.now().isoformat()
            }
        else:
            return {
                "success": False,
                "error": f"API Error: {response.status_code} - {response.text}"
            }
            
    except requests.exceptions.Timeout:
        return {"success": False, "error": "Request timeout - try again"}
    except Exception as e:
        return {"success": False, "error": f"Generation failed: {str(e)}"}

def batch_generate(prompt: str, style: str = "photographic", count: int = 4):
    """
    Generate multiple images with the same prompt
    
    Args:
        prompt: Text description
        style: Style preset
        count: Number of images to generate
    
    Returns:
        list: List of generation results
    """
    results = []
    base_seed = datetime.now().microsecond
    
    for i in range(count):
        result = generate_image(
            prompt=prompt,
            style=style,
            seed=base_seed + i,
            steps=30
        )
        results.append(result)
    
    return results

def get_available_styles():
    """Get list of available style presets"""
    return list(STYLE_PRESETS.keys())