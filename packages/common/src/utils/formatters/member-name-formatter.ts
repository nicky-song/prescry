// Copyright 2020 Prescryptive Health, Inc.

export class MemberNameFormatter {
  public static formatName(firstName = '', lastName = ''): string {
    if (!firstName) {
      return lastName;
    }

    if (!lastName) {
      return firstName;
    }

    return `${firstName} ${lastName}`;
  }
}
