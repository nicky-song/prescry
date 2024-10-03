// Copyright 2022 Prescryptive Health, Inc.

import { searchBenefitCollection } from './collection.helper.js';

export const getBenefitPersonsForMemberIds = async (primaryMemberRxIds) =>
  searchBenefitCollection('Person', { uniqueId: { $in: primaryMemberRxIds } });
