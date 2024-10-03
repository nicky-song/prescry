// Copyright 2022 Prescryptive Health, Inc.

import { useEffect, useRef } from 'react';

export const useIsMounted = () => {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
};
