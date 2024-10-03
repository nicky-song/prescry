// Copyright 2021 Prescryptive Health, Inc.

import { useContext } from 'react';
import { IMediaQueryContext, MediaQueryContext } from './media-query.context';

export const useMediaQueryContext = (): IMediaQueryContext =>
  useContext<IMediaQueryContext>(MediaQueryContext);
