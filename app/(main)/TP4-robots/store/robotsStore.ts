import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RobotType } from '../validation/robotSchema';

export type Robot = {
  id: string;
  name: string;
  label: string;
  year: number;
  type: RobotType;
};

export type RobotInput = Omit<Robot, 'id'>;

interface RobotsState {
  robots: Robot[];
  selectedId?: string;
  create: (input: RobotInput) => boolean;
  update: (id: string, input: RobotInput) => boolean;
  remove: (id: string) => void;
  getById: (id: string) => Robot | undefined;
}

const zustandAsyncStorage: import('zustand/middleware').PersistStorage<RobotsState> = {
  getItem: async (name) => {
    const value = await AsyncStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name);
  },
};

export const useRobotsStore = create<RobotsState>()(
  persist(
    (set, get) => ({
      robots: [],
      selectedId: undefined,
      create: (input) => {
        const robots = get().robots;
        if (robots.some(r => r.name === input.name)) return false;
        const newRobot: Robot = { id: uuid.v4() as string, ...input };
        set({ robots: [...robots, newRobot] });
        return true;
      },
      update: (id, input) => {
        const robots = get().robots;
        if (robots.some(r => r.name === input.name && r.id !== id)) return false;
        set({ robots: robots.map(r => r.id === id ? { ...r, ...input } : r) });
        return true;
      },
      remove: (id) => {
        set(state => ({ robots: state.robots.filter(r => r.id !== id) }));
      },
      getById: (id) => {
        return get().robots.find(r => r.id === id);
      },
    }),
    {
      name: 'robots-storage',
      storage: zustandAsyncStorage,
    }
  )
);
