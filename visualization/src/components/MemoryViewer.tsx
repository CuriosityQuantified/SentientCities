import React from 'react';

interface Memory {
  type: string;
  content: string;
  timestamp: number;
}

interface MemoryViewerProps {
  memories: Memory[];
  agentId: string;
}

export const MemoryViewer: React.FC<MemoryViewerProps> = ({ memories }) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };
  
  return (
    <div className="memory-viewer">
      {memories.length === 0 ? (
        <p>No memories yet...</p>
      ) : (
        memories.map((memory, index) => (
          <div key={index} className="memory-item">
            <div className="memory-item-type">{memory.type}</div>
            <div className="memory-item-content">{memory.content}</div>
            <div className="memory-item-time">{formatTime(memory.timestamp)}</div>
          </div>
        ))
      )}
    </div>
  );
};