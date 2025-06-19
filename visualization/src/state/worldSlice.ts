import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WorldState {
  time: {
    hour: number;
    minute: number;
    dayProgress: number;
  };
  weather: string;
}

const initialState: WorldState = {
  time: {
    hour: 12,
    minute: 0,
    dayProgress: 0.5,
  },
  weather: 'clear',
};

export const worldSlice = createSlice({
  name: 'world',
  initialState,
  reducers: {
    updateTime: (state, action: PayloadAction<WorldState['time']>) => {
      state.time = action.payload;
    },
    updateWeather: (state, action: PayloadAction<string>) => {
      state.weather = action.payload;
    },
  },
});

export const { updateTime, updateWeather } = worldSlice.actions;
export default worldSlice.reducer;