// Copyright 2021 Prescryptive Health, Inc.

import { ApiResponseHelper } from './api-response-helper';

const statusText = 'Nope!;';
const responseMock = {
  json: jest.fn(),
  statusText,
};

describe('ApiResponseHelper', () => {
  it('retrieves statusText if no error property or object', async () => {
    responseMock.json.mockResolvedValue({});

    const errorMessage = await ApiResponseHelper.getErrorMessageFromResponse(
      // @ts-ignore
      responseMock
    );
    expect(errorMessage).toEqual(statusText);
  });

  it('retrieves message from error object', async () => {
    const errorObject = {
      message: 'message',
    };
    responseMock.json.mockResolvedValue({ error: errorObject });

    const errorMessage = await ApiResponseHelper.getErrorMessageFromResponse(
      // @ts-ignore
      responseMock
    );
    expect(errorMessage).toEqual(errorObject.message);
  });

  it('retrieves message directly from response object', async () => {
    const message = 'message';
    responseMock.json.mockResolvedValue({ message });

    const errorMessage = await ApiResponseHelper.getErrorMessageFromResponse(
      // @ts-ignore
      responseMock
    );
    expect(errorMessage).toEqual(message);
  });
});
