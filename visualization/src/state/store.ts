import { configureStore } from '@reduxjs/toolkit';
import worldReducer from './worldSlice';
import agentReducer from './agentSlice';

export const store = configureStore({
  reducer: {
    world: worldReducer,
    agents: agentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;