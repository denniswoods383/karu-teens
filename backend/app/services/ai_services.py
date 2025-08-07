import openai
import requests
import json
from typing import Dict, Any, Optional
import os
from app.core.config import settings

class AIServices:
    def __init__(self):
        self.openai_api_key = settings.OPENAI_API_KEY
        self.perspective_api_key = settings.PERSPECTIVE_API_KEY
        self.weather_api_key = settings.WEATHER_API_KEY
        self.bitly_token = settings.BITLY_TOKEN
        
    async def generate_text(self, prompt: str, max_tokens: int = 150) -> Dict[str, Any]:
        """Generate text using OpenAI GPT-3.5 Turbo"""
        if not self.openai_api_key:
            return {"success": False, "error": "bruv this aint available we will have a look at it and notify you when its working"}
        try:
            openai.api_key = self.openai_api_key
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens
            )
            return {"success": True, "text": response.choices[0].message.content}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def moderate_content(self, text: str) -> Dict[str, Any]:
        """Check content toxicity using Google Perspective API"""
        if not self.perspective_api_key:
            return {"success": False, "error": "bruv this aint available we will have a look at it and notify you when its working"}
        try:
            url = f"https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key={self.perspective_api_key}"
            data = {
                'requestedAttributes': {'TOXICITY': {}},
                'comment': {'text': text}
            }
            response = requests.post(url, json=data)
            result = response.json()
            toxicity_score = result['attributeScores']['TOXICITY']['summaryScore']['value']
            return {"success": True, "toxicity_score": toxicity_score, "is_toxic": toxicity_score > 0.7}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def speech_to_text(self, audio_file) -> Dict[str, Any]:
        """Convert speech to text using Whisper"""
        if not self.openai_api_key:
            return {"success": False, "error": "bruv this aint available we will have a look at it and notify you when its working"}
        try:
            openai.api_key = self.openai_api_key
            transcript = openai.Audio.transcribe("whisper-1", audio_file)
            return {"success": True, "text": transcript.text}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def generate_image(self, prompt: str, style: str = "photographic") -> Dict[str, Any]:
        """Generate image using Stability AI v1 API"""
        if not settings.STABILITY_API_KEY:
            return {"success": False, "error": "bruv this aint available we will have a look at it and notify you when its working"}
        try:
            import base64
            
            url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image"
            headers = {
                "Authorization": f"Bearer {settings.STABILITY_API_KEY}",
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
            
            data = {
                "text_prompts": [{"text": prompt}],
                "cfg_scale": 7,
                "height": 1024,
                "width": 1024,
                "steps": 30,
                "samples": 1,
                "style_preset": style
            }
            
            response = requests.post(url, headers=headers, json=data)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('artifacts') and len(data['artifacts']) > 0:
                    image_base64 = data['artifacts'][0]['base64']
                    return {
                        "success": True, 
                        "image_data": f"data:image/png;base64,{image_base64}",
                        "message": "Image generated successfully by Scarlet Witch!"
                    }
                else:
                    return {"success": False, "error": "No image data received"}
            else:
                error_msg = response.text or f"HTTP {response.status_code}"
                return {"success": False, "error": f"Reality manipulation failed: {error_msg}"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment using Hugging Face NLP"""
        if not settings.HUGGINGFACE_TOKEN:
            return {"success": False, "error": "bruv this aint available we will have a look at it and notify you when its working"}
        try:
            url = "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest"
            headers = {"Authorization": f"Bearer {settings.HUGGINGFACE_TOKEN}"}
            response = requests.post(url, headers=headers, json={"inputs": text})
            result = response.json()
            return {"success": True, "sentiment": result[0]}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def summarize_text(self, text: str) -> Dict[str, Any]:
        """Summarize text using TLDR This API"""
        if not settings.RAPIDAPI_KEY:
            return {"success": False, "error": "bruv this aint available we will have a look at it and notify you when its working"}
        try:
            url = "https://tldrthis.p.rapidapi.com/v1/model/abstractive/summarize/"
            headers = {
                "X-RapidAPI-Key": settings.RAPIDAPI_KEY,
                "Content-Type": "application/json"
            }
            data = {"text": text, "min_length": 50, "max_length": 300}
            response = requests.post(url, headers=headers, json=data)
            result = response.json()
            return {"success": True, "summary": result.get("summary")}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def extract_keywords(self, text: str) -> Dict[str, Any]:
        """Extract keywords using RapidAPI Text Analysis"""
        if not settings.RAPIDAPI_KEY:
            return {"success": False, "error": "bruv this aint available we will have a look at it and notify you when its working"}
        try:
            url = "https://textanalysis-keyword-extraction-v1.p.rapidapi.com/keyword-extractor"
            headers = {
                "X-RapidAPI-Key": settings.RAPIDAPI_KEY,
                "Content-Type": "application/json"
            }
            response = requests.post(url, headers=headers, json={"text": text})
            result = response.json()
            return {"success": True, "keywords": result.get("keywords", [])}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def check_grammar(self, text: str) -> Dict[str, Any]:
        """Check grammar using LanguageTool"""
        try:
            url = "https://api.languagetool.org/v2/check"
            data = {"text": text, "language": "en-US"}
            response = requests.post(url, data=data)
            result = response.json()
            return {"success": True, "matches": result.get("matches", [])}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def generate_qr_code(self, text: str) -> Dict[str, Any]:
        """Generate QR code using QR Code Monkey API"""
        try:
            url = "https://api.qrserver.com/v1/create-qr-code/"
            params = {"size": "200x200", "data": text}
            response = requests.get(url, params=params)
            if response.status_code == 200:
                return {"success": True, "qr_code": response.content}
            return {"success": False, "error": "QR code generation failed"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def get_weather(self, city: str) -> Dict[str, Any]:
        """Get weather data using OpenWeatherMap"""
        if not self.weather_api_key:
            return {"success": False, "error": "bruv this aint available we will have a look at it and notify you when its working"}
        try:
            url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={self.weather_api_key}&units=metric"
            response = requests.get(url)
            result = response.json()
            return {"success": True, "weather": result}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def shorten_url(self, long_url: str) -> Dict[str, Any]:
        """Shorten URL using Bitly"""
        if not self.bitly_token:
            return {"success": False, "error": "bruv this aint available we will have a look at it and notify you when its working"}
        try:
            url = "https://api-ssl.bitly.com/v4/shorten"
            headers = {"Authorization": f"Bearer {self.bitly_token}"}
            data = {"long_url": long_url}
            response = requests.post(url, headers=headers, json=data)
            result = response.json()
            return {"success": True, "short_url": result.get("link")}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def check_password_strength(self, password: str) -> Dict[str, Any]:
        """Check if password has been pwned using Have I Been Pwned API"""
        try:
            import hashlib
            sha1_hash = hashlib.sha1(password.encode()).hexdigest().upper()
            prefix = sha1_hash[:5]
            suffix = sha1_hash[5:]
            
            url = f"https://api.pwnedpasswords.com/range/{prefix}"
            response = requests.get(url)
            
            if suffix in response.text:
                return {"success": True, "is_pwned": True, "message": "Password found in data breaches"}
            return {"success": True, "is_pwned": False, "message": "Password not found in breaches"}
        except Exception as e:
            return {"success": False, "error": str(e)}

ai_services = AIServices()