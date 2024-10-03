// Copyright 2021 Prescryptive Health, Inc.

import { useContext } from 'react';
import { IAppointmentsListContext, AppointmentsListContext } from './appointments-list.context';

export const useAppointmentsListContext = (): IAppointmentsListContext =>
  useContext(AppointmentsListContext);
