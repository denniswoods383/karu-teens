from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import List, Dict
import json
from ....core.security import verify_token
from ....core.websocket_manager import notification_manager

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: str, user_id: int):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections.values():
            await connection.send_text(message)

manager = ConnectionManager()

@router.websocket("/ws/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str):
    # Verify token
    payload = verify_token(token)
    if not payload:
        await websocket.close(code=4001)
        return
    
    user_id = int(payload.get("sub"))
    await manager.connect(websocket, user_id)
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            if message_data["type"] == "chat":
                # Handle chat messages
                await manager.send_personal_message(
                    json.dumps({
                        "type": "chat",
                        "message": message_data["message"],
                        "from_user": user_id
                    }),
                    message_data["to_user"]
                )
            elif message_data["type"] == "notification":
                # Handle notifications
                await manager.broadcast(json.dumps({
                    "type": "notification",
                    "message": message_data["message"]
                }))
                
    except WebSocketDisconnect:
        manager.disconnect(user_id)

@router.websocket("/notifications/{token}")
async def notification_websocket(websocket: WebSocket, token: str):
    payload = verify_token(token)
    if not payload:
        await websocket.close(code=4001)
        return
    
    user_id = int(payload.get("sub"))
    await notification_manager.connect(websocket, user_id)
    
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        notification_manager.disconnect(websocket, user_id)