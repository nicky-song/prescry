// Copyright 2021 Prescryptive Health, Inc.

import { useContext } from 'react';
import { ISessionContext, SessionContext } from './session.context';

export const useSessionContext = (): ISessionContext =>
  useContext(SessionContext);
