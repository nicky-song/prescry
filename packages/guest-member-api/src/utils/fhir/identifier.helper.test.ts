// Copyright 2022 Prescryptive Health, Inc.

import { Identifier } from '../../models/fhir/identifier';
import { findIdentifierForCodeableConceptCode } from './identifier.helper';

describe('identifierHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findIdentifierForCodeableConceptCode', () => {
    it('returns undefined if no identifiers passed', () => {
      expect(
        findIdentifierForCodeableConceptCode(undefined, 'code')
      ).toBeUndefined();
      expect(findIdentifierForCodeableConceptCode([], 'code')).toBeUndefined();
    });

    it('returns undefined if no identifiers have codeable concepts', () => {
      const identifiersMock: Identifier[] = [
        {
          use: 'official',
          value: 'MyRx',
        },
      ];

      expect(
        findIdentifierForCodeableConceptCode(identifiersMock, 'code')
      ).toBeUndefined();
    });

    it('returns undefined if no codeable concepts have code', () => {
      const identifiersMock: Identifier[] = [
        {
          use: 'official',
          value: 'MyRx',
        },
        {
          type: {},
          value: 'no-coding',
        },
        {
          type: {
            coding: [],
          },
          value: 'empty-coding-list',
        },
        {
          type: {
            coding: [
              {
                code: 'not-the-code',
              },
              {
                code: 'not-the-code-either',
              },
            ],
          },
          value: 'coding-list-does-not-contain-code',
        },
      ];

      expect(
        findIdentifierForCodeableConceptCode(identifiersMock, 'code')
      ).toBeUndefined();
    });

    it('returns identifier matching codeable concept with code', () => {
      const theCodeMock = 'code';
      const identifierValueMock = 'coding-list-containing-code';

      const identifiersMock: Identifier[] = [
        {
          use: 'official',
          value: 'MyRx',
        },
        {
          type: {},
          value: 'no-coding',
        },
        {
          type: {
            coding: [],
          },
          value: 'empty-coding-list',
        },
        {
          type: {
            coding: [
              {
                code: 'not-the-code',
              },
              {
                code: 'not-the-code-either',
              },
            ],
          },
          value: 'coding-list-does-not-contain-code',
        },
        {
          type: {
            coding: [
              {
                code: 'not-the-code',
              },
              {
                code: 'not-the-code-either',
              },
              {
                code: theCodeMock,
              },
            ],
          },
          value: identifierValueMock,
        },
      ];

      const identifier = findIdentifierForCodeableConceptCode(
        identifiersMock,
        theCodeMock
      );
      expect(identifier?.value).toEqual(identifierValueMock);
    });
  });
});
