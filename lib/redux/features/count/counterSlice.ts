import { PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '@/lib/redux/createAppSlice';

interface ExampleState {
  value: number;
}

const initialState: ExampleState = {
  value: 0, // Initial count value
};

export const exampleSlice = createAppSlice({
  name: 'example',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1; // Increment the count
    },
    decrement: (state) => {
      state.value -= 1; // Decrement the count
    },
    setValue: (state, action: PayloadAction<number>) => {
      state.value = action.payload; // Set the count to a specific value
    },
  },
  selectors: {
    selectCount: (example) => example.value, // Selector for accessing count value
  },
});

export const { increment, decrement, setValue } = exampleSlice.actions;
export const { selectCount } = exampleSlice.selectors;

export default exampleSlice.reducer;
