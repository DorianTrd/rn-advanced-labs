import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { RobotForm } from '../components/RobotForm';
import { useRobotsStore } from '../store/robotsStore';

export default function EditRobotScreen() {
  const { id } = useLocalSearchParams();
  const robot = useRobotsStore(state => state.getById(id as string));
  const update = useRobotsStore(state => state.update);
  const robots = useRobotsStore(state => state.robots);
  const router = useRouter();

  if (!robot) return null;

  return (
    <RobotForm
      initialValues={{ ...robot }}
      mode="edit"
      isNameUnique={name => !robots.some(r => r.name === name && r.id !== robot.id)}
      onSubmit={values => {
        const success = update(robot.id, values);
        if (success) router.replace('/(main)/TP4-robots');
      }}
    />
  );
}
