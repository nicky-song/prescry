// Copyright 2023 Prescryptive Health, Inc.

import { createContext } from 'react';
import { BeforeInstallPromptEvent } from './install.context-provider';

export interface IInstallContext {
  readonly installPromptEvent?: BeforeInstallPromptEvent;
}

export const defaultInstallContext: IInstallContext = {};

export const InstallContext = createContext<IInstallContext>(
  defaultInstallContext
);
