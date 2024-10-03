// Copyright 2022 Prescryptive Health, Inc.

import { devices } from '@playwright/test';

const deviceName = 'Pixel 5';
export const browserContextOptions = { ...devices[deviceName] };
