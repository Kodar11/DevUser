import {  PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '@/lib/createAppSlice';

interface ExampleState {
  value: number;
}

const initialState: ExampleState = {
  value: 0,
};

export const exampleSlice = createAppSlice({
  name: 'example',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    setValue: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
  selectors: {
    selectCount: (example) => example.value,
  },
});

export const { increment, decrement, setValue } = exampleSlice.actions;

export const { selectCount } = exampleSlice.selectors;

export default exampleSlice.reducer;
