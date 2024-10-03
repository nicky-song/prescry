// Copyright 2022 Prescryptive Health, Inc.

import { ImageInstanceNames } from '../theming/assets';
import { getResolvedImageSource, ResolvedImagesMap } from './assets.helper';

describe('getResolvedImageSource', () => {
  it('gets image source', () => {
    const expectedSourceMock = 1;
    ResolvedImagesMap.set('alertCircle', expectedSourceMock);

    expect(getResolvedImageSource('alertCircle')).toEqual(expectedSourceMock);
  });

  it('returns -1 for unknown image', () => {
    ResolvedImagesMap.set('alertCircle', 1);
    expect(getResolvedImageSource('junk' as ImageInstanceNames)).toEqual(-1);
  });
});
