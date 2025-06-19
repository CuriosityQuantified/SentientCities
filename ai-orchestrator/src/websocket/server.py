import asyncio
import websockets
import json
import logging
from typing import Set, Dict, Any

logger = logging.getLogger(__name__)

class WebSocketServer:
    """WebSocket server for real-time UI updates"""
    
    def __init__(self, orchestrator):
        self.orchestrator = orchestrator
        self.clients: Set[websockets.WebSocketServerProtocol] = set()
        self.subscriptions: Dict[str, Set[str]] = {}  # client_id -> agent_ids
        
    async def start(self, port: int = 8080):
        """Start the WebSocket server"""
        logger.info(f"Starting WebSocket server on port {port}")
        await websockets.serve(self.handle_client, "0.0.0.0", port)
        
    async def handle_client(self, websocket, path):
        """Handle a new client connection"""
        client_id = id(websocket)
        self.clients.add(websocket)
        self.subscriptions[client_id] = set()
        logger.info(f"Client {client_id} connected")
        
        try:
            async for message in websocket:
                await self.handle_message(websocket, message)
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            self.clients.remove(websocket)
            del self.subscriptions[client_id]
            logger.info(f"Client {client_id} disconnected")
            
    async def handle_message(self, websocket, message: str):
        """Handle incoming client message"""
        try:
            data = json.loads(message)
            msg_type = data.get('type')
            
            if msg_type == 'subscribe':
                agent_id = data.get('agent_id')
                if agent_id:
                    client_id = id(websocket)
                    self.subscriptions[client_id].add(agent_id)
                    await websocket.send(json.dumps({
                        'type': 'subscribed',
                        'agent_id': agent_id
                    }))
                    
            elif msg_type == 'get_world_state':
                world_state = await self.orchestrator.simulation_client.get_world_state()
                await websocket.send(json.dumps({
                    'type': 'world_update',
                    'data': world_state
                }))
                
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON received: {message}")
        except Exception as e:
            logger.error(f"Error handling message: {e}")
            
    async def broadcast_agent_update(self, agent_id: str, update: Dict[str, Any]):
        """Broadcast agent update to subscribed clients"""
        message = json.dumps({
            'type': 'agent_update',
            'data': {
                'agent_id': agent_id,
                **update
            }
        })
        
        # Send to all clients subscribed to this agent
        for websocket in self.clients:
            client_id = id(websocket)
            if agent_id in self.subscriptions.get(client_id, set()):
                try:
                    await websocket.send(message)
                except websockets.exceptions.ConnectionClosed:
                    pass
                    
    async def broadcast_world_update(self, world_state: Dict[str, Any]):
        """Broadcast world state update to all clients"""
        message = json.dumps({
            'type': 'world_update',
            'data': world_state
        })
        
        # Send to all connected clients
        for websocket in self.clients:
            try:
                await websocket.send(message)
            except websockets.exceptions.ConnectionClosed:
                pass