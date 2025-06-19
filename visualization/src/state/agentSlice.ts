import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AgentState {
  [agentId: string]: {
    name: string;
    position: [number, number, number];
    needs: {
      hunger: number;
      thirst: number;
      energy: number;
    };
    currentThought: string;
    recentActions: Array<{
      type: string;
      target: string;
      timestamp: number;
    }>;
    memories: Array<{
      type: string;
      content: string;
      timestamp: number;
    }>;
  };
}

const initialState: AgentState = {};

export const agentSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    updateAgent: (state, action: PayloadAction<{ agentId: string; data: Partial<AgentState[string]> }>) => {
      const { agentId, data } = action.payload;
      if (!state[agentId]) {
        state[agentId] = {
          name: '',
          position: [0, 0, 0],
          needs: { hunger: 75, thirst: 75, energy: 90 },
          currentThought: '',
          recentActions: [],
          memories: [],
        };
      }
      state[agentId] = { ...state[agentId], ...data };
    },
    addAgentAction: (state, action: PayloadAction<{ agentId: string; action: AgentState[string]['recentActions'][0] }>) => {
      const { agentId, action: newAction } = action.payload;
      if (state[agentId]) {
        state[agentId].recentActions.unshift(newAction);
        state[agentId].recentActions = state[agentId].recentActions.slice(0, 10);
      }
    },
    addAgentMemory: (state, action: PayloadAction<{ agentId: string; memory: AgentState[string]['memories'][0] }>) => {
      const { agentId, memory } = action.payload;
      if (state[agentId]) {
        state[agentId].memories.unshift(memory);
        state[agentId].memories = state[agentId].memories.slice(0, 50);
      }
    },
  },
});

export const { updateAgent, addAgentAction, addAgentMemory } = agentSlice.actions;
export default agentSlice.reducer;