// Copyright 2022 Prescryptive Health, Inc.

import { useContext } from 'react';
import { IDrawerContext, DrawerContext } from './drawer.context';

export const useDrawerContext = (): IDrawerContext => useContext(DrawerContext);
