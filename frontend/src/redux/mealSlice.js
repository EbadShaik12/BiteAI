import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  meals: [],
  workouts: [],
  analytics: {
    summary: { totalMealsLogged: 0, averageCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0 },
    weeklyBreakdown: [],
    moodAnalytics: []
  },
  loading: false,
  error: null
};

const mealSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {
    actionStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    actionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchMealsSuccess: (state, action) => {
      state.loading = false;
      state.meals = action.payload;
    },
    addMealSuccess: (state, action) => {
      state.loading = false;
      state.meals.unshift(action.payload);
    },
    fetchAnalyticsSuccess: (state, action) => {
      state.loading = false;
      state.analytics = action.payload;
    },
    fetchWorkoutsSuccess: (state, action) => {
      state.loading = false;
      state.workouts = action.payload;
    },
    addWorkoutSuccess: (state, action) => {
      state.loading = false;
      state.workouts.unshift(action.payload);
    }
  }
});

export const { 
  actionStart, 
  actionFailure, 
  fetchMealsSuccess, 
  addMealSuccess, 
  fetchAnalyticsSuccess,
  fetchWorkoutsSuccess,
  addWorkoutSuccess
} = mealSlice.actions;

export default mealSlice.reducer;
