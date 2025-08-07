from fastapi import WebSocket, WebSocketDisconnect, Depends
from typing import Dict, Set
import json
from ....models.user import User

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, WebSocket] = {}
        self.online_users: Set[int] = set()

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        self.online_users.add(user_id)
        
        # Notify others that user is online
        await self.broadcast_user_status(user_id, "user_online")

    def disconnect(self, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        if user_id in self.online_users:
            self.online_users.remove(user_id)

    async def send_personal_message(self, message: str, user_id: int):
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            await websocket.send_text(message)

    async def broadcast_user_status(self, user_id: int, status: str):
        message = json.dumps({
            "type": status,
            "data": {"user_id": user_id}
        })
        
        for connection_user_id, websocket in self.active_connections.items():
            if connection_user_id != user_id:
                try:
                    await websocket.send_text(message)
                except:
                    pass

    async def send_message_notification(self, sender_id: int, receiver_id: int, message_data: dict):
        message = json.dumps({
            "type": "new_message",
            "data": message_data
        })
        
        # Send to receiver
        if receiver_id in self.active_connections:
            try:
                await self.active_connections[receiver_id].send_text(message)
            except:
                pass

    async def send_typing_status(self, sender_id: int, receiver_id: int, is_typing: bool):
        message = json.dumps({
            "type": "typing_start" if is_typing else "typing_stop",
            "data": {"user_id": sender_id}
        })
        
        if receiver_id in self.active_connections:
            try:
                await self.active_connections[receiver_id].send_text(message)
            except:
                pass

    async def send_read_receipt(self, reader_id: int, sender_id: int, message_id: int):
        message = json.dumps({
            "type": "message_read",
            "data": {
                "message_id": message_id,
                "reader_id": reader_id
            }
        })
        
        if sender_id in self.active_connections:
            try:
                await self.active_connections[sender_id].send_text(message)
            except:
                pass

manager = ConnectionManager()

async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "typing_start":
                await manager.send_typing_status(user_id, message["data"]["receiver_id"], True)
            elif message["type"] == "typing_stop":
                await manager.send_typing_status(user_id, message["data"]["receiver_id"], False)
                
    except WebSocketDisconnect:
        manager.disconnect(user_id)
        await manager.broadcast_user_status(user_id, "user_offline")