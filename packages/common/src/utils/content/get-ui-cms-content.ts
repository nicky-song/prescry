// Copyright 2021 Prescryptive Health, Inc.

import { getResolvedObjectSource } from '../assets.helper';
import { IUIContentResponse } from './ui-cms-content';

export const getUICMSContent = (): IUIContentResponse[] => {
  return getResolvedObjectSource('uiCMSContent') as IUIContentResponse[];
};
