// Copyright 2020 Prescryptive Health, Inc.

import { SchemaDefinition } from 'mongoose';
import { IStaticFeedAudience } from '@phx/common/src/models/static-feed';

export const StaticFeedAudienceDefinition =
  (): SchemaDefinition<IStaticFeedAudience> => ({
    exclude: { type: [String], required: false },
    include: { type: [String], required: false },
  });
