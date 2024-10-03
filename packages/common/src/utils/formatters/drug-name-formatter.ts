// Copyright 2019 Prescryptive Health, Inc.

export class DrugNameFormatter {
  public static formatNames(name = '', genericName = ''): string {
    if (!name) {
      return genericName;
    }

    if (!genericName) {
      return name;
    }

    return `${name} (${genericName})`;
  }
}
