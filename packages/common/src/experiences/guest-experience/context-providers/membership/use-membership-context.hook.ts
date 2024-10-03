// Copyright 2021 Prescryptive Health, Inc.

import { useContext } from 'react';
import { IMembershipContext, MembershipContext } from './membership.context';

export const useMembershipContext = (): IMembershipContext =>
  useContext(MembershipContext);
