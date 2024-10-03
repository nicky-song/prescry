// Copyright 2019 Prescryptive Health, Inc.

import { IPackageType } from '../../models/package-type';
import { PackageTypeFormatter } from './package-type-formatter';

const penType: IPackageType = {
  code: 'PN',
  description: 'Pen',
};

const packageTypes: IPackageType[] = [
  { description: 'Ampule', code: 'AM' },
  { description: 'Bag', code: 'BG' },
  penType,
];

describe('PackageTypeFormatter', () => {
  it('formats type', () => {
    expect(PackageTypeFormatter.format('')).toEqual('?');
    expect(PackageTypeFormatter.format(penType.code, undefined)).toEqual(
      penType.code
    );
    expect(PackageTypeFormatter.format(penType.code, [])).toEqual(penType.code);
    expect(PackageTypeFormatter.format(penType.code, packageTypes)).toEqual(
      penType.description
    );
    expect(PackageTypeFormatter.format('XX', packageTypes)).toEqual('XX');
  });
});
