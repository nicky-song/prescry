// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { DrugNameText } from './drug-name-text';
import { ProtectedBaseText } from '../protected-base-text/protected-base-text';

const testExpected = (
  drugNameMock: string,
  inputMock: string,
  expectedBefore: string,
  expectedBold: string,
  expectedAfter: string
) => {
  const testRenderer = renderer.create(
    <DrugNameText
      drugName={drugNameMock}
      input={inputMock}
    />
  );
    
  const drugNameTexts = testRenderer.root.findAllByType(ProtectedBaseText);
  expect(drugNameTexts.length).toEqual(3);
  expect(drugNameTexts[0].props.children).toEqual(expectedBefore);
  expect(drugNameTexts[1].props.weight).toEqual('bold');
  expect(drugNameTexts[1].props.children).toEqual(expectedBold);
  expect(drugNameTexts[2].props.children).toEqual(expectedAfter);
};

describe('DrugNameText', () => {
  it('renders correctly with middle input', () => {
    const drugNameMock = 'abcde';
    const inputMock = 'bcd';
    const expectedBefore = 'a';
    const expectedBold = 'bcd';
    const expectedAfter = 'e';

    testExpected(
      drugNameMock,
      inputMock,
      expectedBefore,
      expectedBold,
      expectedAfter
    );
  });

  it('renders correctly with beginning input', () => {
    const drugNameMock = 'abcde';
    const inputMock = 'abc';
    const expectedBefore = '';
    const expectedBold = 'abc';
    const expectedAfter = 'de';

    testExpected(
      drugNameMock,
      inputMock,
      expectedBefore,
      expectedBold,
      expectedAfter
    );
  });

  it('renders correctly with end input', () => {
    const drugNameMock = 'abcde';
    const inputMock = 'cde';
    const expectedBefore = 'ab';
    const expectedBold = 'cde';
    const expectedAfter = '';

    testExpected(
      drugNameMock,
      inputMock,
      expectedBefore,
      expectedBold,
      expectedAfter
    );
  });

  it('renders correctly with empty input', () => {
    const drugNameMock = 'abcde';
    const inputMock = '';
    const expectedBold = '';
    const expectedBefore = 'abcde';
    const expectedAfter = '';

    testExpected(
      drugNameMock,
      inputMock,
      expectedBefore,
      expectedBold,
      expectedAfter
    );
  });

  it('renders correctly with unmatching input', () => {
    const drugNameMock = 'abcde';
    const inputMock = 'fghij';
    const expectedBefore = 'abcde';
    const expectedBold = '';
    const expectedAfter = '';

    testExpected(
      drugNameMock,
      inputMock,
      expectedBefore,
      expectedBold,
      expectedAfter
    );
  });

  it('renders correctly with unmatching case', () => {
    const drugNameMock = 'abcde';
    const inputMock = 'ABCDE';
    const expectedBefore = '';
    const expectedBold = 'abcde';
    const expectedAfter = '';

    testExpected(
      drugNameMock,
      inputMock,
      expectedBefore,
      expectedBold,
      expectedAfter
    );
  });
});
