import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { updateAgent, addAgentAction, addAgentMemory } from '../state/agentSlice';
import { updateTime } from '../state/worldSlice';

interface WebSocketHook {
  worldState: any;
  connected: boolean;
  error: string | null;
}

export const useWebSocket = (): WebSocketHook => {
  const [worldState, setWorldState] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const dispatch = useDispatch();
  
  const connect = useCallback(() => {
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8080';
    const websocket = new WebSocket(wsUrl);
    
    websocket.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      setError(null);
      
      // Subscribe to both agents
      websocket.send(JSON.stringify({ type: 'subscribe', agent_id: 'agent_001' }));
      websocket.send(JSON.stringify({ type: 'subscribe', agent_id: 'agent_002' }));
      
      // Request initial world state
      websocket.send(JSON.stringify({ type: 'get_world_state' }));
    };
    
    websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === 'world_update') {
          setWorldState(message.data);
          
          // Update Redux store
          if (message.data.time) {
            dispatch(updateTime({
              hour: message.data.time.hour,
              minute: message.data.time.minute,
              dayProgress: message.data.time.day_cycle,
            }));
          }
        } else if (message.type === 'agent_update') {
          const { agent_id, thoughts, action, outcome } = message.data;
          
          // Update agent state
          dispatch(updateAgent({
            agentId: agent_id,
            data: {
              currentThought: thoughts,
            },
          }));
          
          // Add action to history
          if (action) {
            dispatch(addAgentAction({
              agentId: agent_id,
              action: {
                type: action.action,
                target: action.target_appearance || action.target || '',
                timestamp: Date.now() / 1000,
              },
            }));
          }
          
          // Add memory if there's a discovery
          if (outcome?.discovery) {
            dispatch(addAgentMemory({
              agentId: agent_id,
              memory: {
                type: 'discovery',
                content: outcome.discovery,
                timestamp: Date.now() / 1000,
              },
            }));
          }
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };
    
    websocket.onerror = (err) => {
      console.error('WebSocket error:', err);
      setError('WebSocket connection error');
    };
    
    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
      
      // Reconnect after 3 seconds
      setTimeout(connect, 3000);
    };
    
    setWs(websocket);
    
    return () => {
      websocket.close();
    };
  }, [dispatch]);
  
  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);
  
  return { worldState, connected, error };
};