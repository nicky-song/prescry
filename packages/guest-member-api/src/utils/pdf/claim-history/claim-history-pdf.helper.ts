// Copyright 2022 Prescryptive Health, Inc.

import { IClaim } from '@phx/common/src/models/claim';

export const calculateDeductiblesTotal = (claims: IClaim[]) =>
  claims.reduce(
    (previousValue, currentValue) =>
      previousValue + currentValue.billing.deductibleApplied,
    0
  );

export const calculateMemberPaysTotal = (claims: IClaim[]) =>
  claims.reduce(
    (previousValue, currentValue) =>
      previousValue + currentValue.billing.memberPays,
    0
  );
