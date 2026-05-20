import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import mealReducer from './mealSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    meals: mealReducer,
  },
});

export default store;
