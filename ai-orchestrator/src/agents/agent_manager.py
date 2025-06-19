from typing import Dict, List, Optional
import logging
from .cognitive_agent import BlankSlateCognitiveAgent

logger = logging.getLogger(__name__)

class AgentManager:
    """Manages all cognitive agents in the simulation"""
    
    def __init__(self):
        self.agents: Dict[str, BlankSlateCognitiveAgent] = {}
        
    async def create_agent(self, agent_id: str, name: str) -> BlankSlateCognitiveAgent:
        """Create a new cognitive agent"""
        agent = BlankSlateCognitiveAgent(agent_id, name)
        self.agents[agent_id] = agent
        logger.info(f"Created agent: {name} ({agent_id})")
        return agent
        
    async def perceive(self, agent_id: str, world_state: Dict) -> Dict:
        """Have an agent perceive the world"""
        agent = self.agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
        return await agent.perceive(world_state)
        
    async def think(self, agent_id: str, perception: Dict) -> str:
        """Have an agent think about their perception"""
        agent = self.agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
        return await agent.think(perception)
        
    async def decide(self, agent_id: str, perception: Dict, thoughts: str) -> Dict:
        """Have an agent decide on an action"""
        agent = self.agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
        return await agent.decide(perception, thoughts)
        
    async def learn_from_outcome(self, agent_id: str, action: Dict, outcome: Dict):
        """Have an agent learn from action outcome"""
        agent = self.agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
        await agent.learn_from_outcome(action, outcome)
        
    def get_agent(self, agent_id: str) -> Optional[BlankSlateCognitiveAgent]:
        """Get a specific agent"""
        return self.agents.get(agent_id)
        
    def get_all_agents(self) -> List[BlankSlateCognitiveAgent]:
        """Get all agents"""
        return list(self.agents.values())