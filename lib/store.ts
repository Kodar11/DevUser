import { configureStore,combineSlices } from '@reduxjs/toolkit';
import { exampleSlice } from './features/count/counterSlice';
import { quotesApiSlice } from "./features/quotes/quotesAppSlice";
import type { Action, ThunkAction } from "@reduxjs/toolkit";


const rootReducer = combineSlices(exampleSlice,quotesApiSlice)

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(quotesApiSlice.middleware);
    },
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof makeStore>;

export type AppDispatch = AppStore["dispatch"];


export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;

