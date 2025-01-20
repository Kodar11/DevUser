import { configureStore, combineSlices } from "@reduxjs/toolkit";
import { exampleSlice } from "./features/count/counterSlice";
import { usersApiSlice } from "./features/users/usersApiSlice";
import type { Action, ThunkAction } from "@reduxjs/toolkit";

const rootReducer = combineSlices(exampleSlice, usersApiSlice);

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(usersApiSlice.middleware), // Add RTK Query middleware
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
