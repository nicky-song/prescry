// Copyright 2018 Prescryptive Health, Inc.

import { useState, useEffect } from 'react';

export const useInterval = <TArgs = undefined>(
  callback: (args: TArgs) => void,
  live: boolean,
  delay: number,
  parameters?: TArgs
): void => {
  const [intervalId, setIntervalId] = useState<number>();

  useEffect(() => {
    if (!live) {
      if (intervalId) {
        clearInterval(intervalId);
      }
      return;
    }
    const id = setInterval(callback, delay, parameters ?? {});
    setIntervalId(id);
    return () => {
      clearInterval(id);
      setIntervalId(0);
    };
  }, [delay, live, callback]);
};
