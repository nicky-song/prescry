// Copyright 2023 Prescryptive Health, Inc.

import React, { useState, useEffect, FunctionComponent } from 'react';
import {
  defaultInstallContext,
  IInstallContext,
  InstallContext,
} from './install.context';

export type InstallPromptOutcome = 'accepted' | 'dismissed';
export interface IUserChoice {
  outcome: InstallPromptOutcome;
}

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<IUserChoice>;
}

export const InstallContextProvider: FunctionComponent = ({ children }) => {
  const [context, setContext] = useState<IInstallContext>(
    defaultInstallContext
  );

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();

      const beforeInstallPromptEvent = event as BeforeInstallPromptEvent;

      setContext({
        ...context,
        installPromptEvent: beforeInstallPromptEvent,
      });
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    };
  }, []);

  return (
    <InstallContext.Provider value={context}>
      {children}
    </InstallContext.Provider>
  );
};
