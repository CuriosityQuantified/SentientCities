import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { NeedsDisplay } from './NeedsDisplay';
import { MemoryViewer } from './MemoryViewer';

interface AgentPanelProps {
  agentId: string;
}

export const AgentPanel: React.FC<AgentPanelProps> = ({ agentId }) => {
  const agent = useSelector((state: RootState) => state.agents[agentId]);
  
  if (!agent) return null;
  
  return (
    <div className="agent-panel">
      <h2>{agent.name}</h2>
      
      <div className="section">
        <h3>Needs</h3>
        <NeedsDisplay needs={agent.needs} />
      </div>
      
      <div className="section">
        <h3>Current Thoughts</h3>
        <div className="thought-bubble">
          {agent.currentThought || "..."}
        </div>
      </div>
      
      <div className="section">
        <h3>Recent Actions</h3>
        <ul className="action-list">
          {agent.recentActions?.map((action, i) => (
            <li key={i}>{action.type}: {action.target}</li>
          ))}
        </ul>
      </div>
      
      <div className="section">
        <h3>Memory</h3>
        <MemoryViewer 
          memories={agent.memories} 
          agentId={agentId} 
        />
      </div>
    </div>
  );
};