// Copyright 2019 Prescryptive Health, Inc.

import { IPackageType } from '../../models/package-type';

export class PackageTypeFormatter {
  public static format(
    typeCode: string,
    packageTypes?: IPackageType[]
  ): string {
    if (!typeCode) {
      return '?';
    }

    const packageType = PackageTypeFormatter.getPackageType(
      typeCode,
      packageTypes
    );

    return packageType ? packageType.description : typeCode;
  }

  private static getPackageType(
    typeCode: string,
    packageTypes: IPackageType[] = []
  ): IPackageType | undefined {
    return packageTypes.find((packageType) => packageType.code === typeCode);
  }
}
