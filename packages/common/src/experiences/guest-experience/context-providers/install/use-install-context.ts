// Copyright 2023 Prescryptive Health, Inc.

import { useContext } from 'react';
import { IInstallContext, InstallContext } from './install.context';

export const useInstallContext = (): IInstallContext =>
  useContext<IInstallContext>(InstallContext);
