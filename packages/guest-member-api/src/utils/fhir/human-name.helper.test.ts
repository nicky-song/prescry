// Copyright 2022 Prescryptive Health, Inc.

import { IHumanName } from '../../models/fhir/human-name';
import { NameUse } from '../../models/fhir/types';
import {
  buildFirstName,
  buildLastName,
  getHumanName,
  matchFirstName,
  splitFirstName,
} from './human-name.helper';

describe('humanNameHelper', () => {
  const officialUse: NameUse = 'official';
  const usualUse: NameUse = 'usual';

  const officialNameMock: IHumanName = {
    use: 'official',
    given: ['official-first', 'official-middle'],
    family: 'official-family',
  };

  const unspecifiedUseNameMock: IHumanName = {
    given: ['unspecified-first', 'unspecified-middle'],
    family: 'unspecified-family',
  };

  const usualNameMock: IHumanName = {
    use: 'usual',
    given: ['usual-first', 'usual-middle'],
    family: 'usual-family',
  };

  const maidenNameMock: IHumanName = {
    use: 'maiden',
    given: ['maiden-first', 'maiden-middle'],
    family: 'maiden-family',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getHumanName', () => {
    it.each([
      [undefined, officialUse, undefined],
      [[], officialUse, undefined],
      [[usualNameMock, maidenNameMock], officialUse, undefined],
      [
        [usualNameMock, maidenNameMock, officialNameMock],
        officialUse,
        officialNameMock,
      ],
      [
        [usualNameMock, maidenNameMock, unspecifiedUseNameMock],
        officialUse,
        unspecifiedUseNameMock,
      ],
      [
        [usualNameMock, maidenNameMock, officialNameMock],
        usualUse,
        usualNameMock,
      ],
    ])(
      'gets name (names: %p, use: %p)',
      (
        namesMock: IHumanName[] | undefined,
        nameUseMock: NameUse,
        expectedName: IHumanName | undefined
      ) => {
        expect(getHumanName(namesMock, nameUseMock)).toEqual(expectedName);
      }
    );
  });

  describe('buildFirstName', () => {
    it.each([
      [undefined, ''],
      [{}, ''],
      [{ family: 'family' }, ''],
      [{ given: [] }, ''],
      [{ given: ['first'] }, 'first'],
      [{ given: ['first', 'middle'] }, 'first middle'],
      [{ given: ['first', 'middle', 'third'] }, 'first middle third'],
    ])(
      'builds first name (humanName: %p)',
      (humanNameMock: IHumanName | undefined, expected: string) => {
        expect(buildFirstName(humanNameMock)).toEqual(expected);
      }
    );
  });

  describe('splitFirstName', () => {
    it.each([
      [undefined, []],
      ['', []],
      ['  ', []],
      ['first', ['first']],
      ['first middle', ['first', 'middle']],
      ['  first  middle  third  ', ['first', 'middle', 'third']],
    ])(
      'splits first name (firstName: %p)',
      (firstNameMock: undefined | string, expected: string[]) => {
        expect(splitFirstName(firstNameMock)).toEqual(expected);
      }
    );
  });

  describe('buildLastName', () => {
    it.each([
      [undefined, ''],
      [{}, ''],
      [{ given: ['first', 'middle', 'third'] }, ''],
      [{ family: 'family' }, 'family'],
    ])(
      'builds last name (humanName: %p)',
      (humanNameMock: IHumanName | undefined, expected: string) => {
        expect(buildLastName(humanNameMock)).toEqual(expected);
      }
    );
  });

  describe('matchFirstName', () => {
    it('returns undefined if first name does not match', () => {
      const firstNameMock = 'NOT-DIAN';

      const humanNameMock: IHumanName[] = [{ family: 'ALAM', given: ['DIAN'] }];

      const result = matchFirstName(firstNameMock, humanNameMock);

      const expected = undefined;

      expect(result).toEqual(expected);
    });

    it('returns patient name if first name match', () => {
      const firstNameMock = 'DIAN';

      const humanNameMock: IHumanName[] = [
        { family: 'ALAM', given: [firstNameMock] },
      ];

      const result = matchFirstName(firstNameMock, humanNameMock);

      const expected = humanNameMock[0];

      expect(result).toEqual(expected);
    });

    it('returns patient name if first name with spaces match', () => {
      const firstNameMock = 'DIAN YULIANI';

      const humanNameMock: IHumanName[] = [
        { family: 'ALAM', given: [firstNameMock] },
      ];

      const result = matchFirstName(firstNameMock, humanNameMock);

      const expected = humanNameMock[0];

      expect(result).toEqual(expected);
    });
  });
});
