// Copyright 2022 Prescryptive Health, Inc.

import { IHours } from '../../models/date-time/hours';
import dateFormatter, { IOpenStatusContent } from './date.formatter';

const formatOpenStatus = (
  now: Date,
  hours: IHours[],
  isOpenTwentyFourHours: boolean,
  openStatusContent: IOpenStatusContent
) => {
  return dateFormatter.formatOpenStatus(
    now,
    hours,
    isOpenTwentyFourHours,
    openStatusContent
  );
};

export default { formatOpenStatus };
