import asyncio
import os
import logging
from dotenv import load_dotenv
import grpc
import websockets
import json

from agents.agent_manager import AgentManager
from grpc_client.client import SimulationClient
from websocket.server import WebSocketServer

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=getattr(logging, os.getenv('PYTHON_LOG_LEVEL', 'INFO')),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class AIOrchestrator:
    def __init__(self):
        self.simulation_client = SimulationClient(
            host=os.getenv('SIMULATION_ENGINE_HOST', 'localhost:50051')
        )
        self.agent_manager = AgentManager()
        self.websocket_server = WebSocketServer(self)
        self.running = False

    async def initialize(self):
        """Initialize the AI orchestrator"""
        logger.info("Initializing AI Orchestrator")
        
        # Connect to simulation engine
        await self.simulation_client.connect()
        
        # Get initial world state
        world_state = await self.simulation_client.get_world_state()
        
        # Initialize agents
        agent_count = int(os.getenv('INITIAL_AGENTS', '2'))
        agents = [
            ("00000000-0000-0000-0000-000000000001", "Alice"),
            ("00000000-0000-0000-0000-000000000002", "Bob")
        ]
        
        for agent_id, name in agents[:agent_count]:
            await self.agent_manager.create_agent(agent_id, name)
            
        logger.info(f"Initialized {agent_count} agents")

    async def run(self):
        """Main orchestration loop"""
        self.running = True
        
        # Start WebSocket server
        ws_task = asyncio.create_task(
            self.websocket_server.start(port=8080)
        )
        
        try:
            while self.running:
                # Get world state from simulation
                world_state = await self.simulation_client.get_world_state()
                
                # Process each agent
                for agent_id in self.agent_manager.agents:
                    try:
                        # Agent perceives world
                        perception = await self.agent_manager.perceive(
                            agent_id, world_state
                        )
                        
                        # Agent thinks
                        thoughts = await self.agent_manager.think(
                            agent_id, perception
                        )
                        
                        # Agent decides
                        action = await self.agent_manager.decide(
                            agent_id, perception, thoughts
                        )
                        
                        # Send action to simulation
                        outcome = await self.simulation_client.execute_action(
                            agent_id, action
                        )
                        
                        # Agent learns from outcome
                        await self.agent_manager.learn_from_outcome(
                            agent_id, action, outcome
                        )
                        
                        # Broadcast update to UI
                        await self.websocket_server.broadcast_agent_update(
                            agent_id, {
                                'thoughts': thoughts,
                                'action': action,
                                'outcome': outcome
                            }
                        )
                        
                    except Exception as e:
                        logger.error(f"Error processing agent {agent_id}: {e}")
                
                # Wait before next tick
                await asyncio.sleep(1.0)  # 1 second per simulation tick
                
        except KeyboardInterrupt:
            logger.info("Shutting down AI Orchestrator")
        finally:
            self.running = False
            await ws_task

async def main():
    orchestrator = AIOrchestrator()
    await orchestrator.initialize()
    await orchestrator.run()

if __name__ == "__main__":
    asyncio.run(main())