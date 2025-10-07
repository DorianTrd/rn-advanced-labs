import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import uuid from 'react-native-uuid';
import { RobotType } from '../../validation/robotSchema';

export type Robot = {
  id: string;
  name: string;
  label: string;
  year: number;
  type: RobotType;
};

interface RobotsState {
  items: Robot[];
  saving: boolean;
  error?: string;
}

const initialState: RobotsState = {
  items: [],
  saving: false,
  error: undefined,
};

export const saveRobotAsync = createAsyncThunk<
  void,
  { id?: string; data: Omit<Robot, 'id'> },
  { rejectValue: string }
>('robots/saveRobotAsync', async (args, { dispatch, rejectWithValue }) => {
  try {
    await new Promise((res) => setTimeout(res, 500));
    if (args.id) {
      dispatch(updateRobot({ id: args.id, changes: args.data }));
    } else {
      dispatch(createRobot(args.data));
    }
  } catch (e) {
    return rejectWithValue('save failed');
  }
});

const robotsSlice = createSlice({
  name: 'robots',
  initialState,
  reducers: {
    createRobot: (state, action: PayloadAction<Omit<Robot, 'id'>>) => {
      // Validation: all fields must be present
      const { name, label, year, type } = action.payload;
      if (!name || !label || !year || !type) return;
      if (state.items.some(r => r.name === action.payload.name)) return;
      state.items.push({ ...action.payload, id: uuid.v4() as string });
    },
    updateRobot: (state, action: PayloadAction<{ id: string; changes: Omit<Robot, 'id'> }>) => {
      const idx = state.items.findIndex(r => r.id === action.payload.id);
      if (idx === -1) return;
      const { name, label, year, type } = action.payload.changes;
      if (!name || !label || !year || !type) return;
      if (
        state.items.some(
          r => r.name === action.payload.changes.name && r.id !== action.payload.id
        )
      )
        return;
      state.items[idx] = { ...state.items[idx], ...action.payload.changes };
    },
    deleteRobot: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(r => r.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveRobotAsync.pending, (state) => {
        state.saving = true;
        state.error = undefined;
      })
      .addCase(saveRobotAsync.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(saveRobotAsync.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Unknown error';
      });
  },
});

export const { createRobot, updateRobot, deleteRobot } = robotsSlice.actions;
export default robotsSlice.reducer;
