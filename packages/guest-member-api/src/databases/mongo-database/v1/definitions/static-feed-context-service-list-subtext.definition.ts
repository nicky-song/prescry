// Copyright 2023 Prescryptive Health, Inc.

import { IStaticFeedContextServiceItemSubText } from '@phx/common/src/models/static-feed';
import { SchemaDefinition } from 'mongoose';

export const StaticFeedContextServiceListSubTextDefinition =
  (): SchemaDefinition<IStaticFeedContextServiceItemSubText> => ({
    language: { type: String, required: true },
    markDownText: { type: String, required: true },
  });
