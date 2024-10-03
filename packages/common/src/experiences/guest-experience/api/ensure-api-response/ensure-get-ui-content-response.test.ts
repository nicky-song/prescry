// Copyright 2021 Prescryptive Health, Inc.

import { IUIContentResponse } from '../../../../models/api-response/ui-content-response';
import { ErrorConstants } from '../../../../theming/constants';
import { ensureGetUIContentResponse } from './ensure-get-ui-content-response';

describe('ensureUIContentResponse()', () => {
  it('should throw error if response data is null', () => {
    const mockResponseJson = null;
    expect(() => ensureGetUIContentResponse(mockResponseJson)).toThrowError(
      ErrorConstants.errorInternalServer()
    );
  });

  it('should return responseJson if group key found', () => {
    const mockResponseJson: IUIContentResponse = {
      data: [
        {
          fieldKey: 'ui-content-mock-fieldKey-1',
          groupKey: 'ui-content-mock-groupKey-1',
          value: 'ui-content-mock-value-1',
          type: 'ui-content-mock-type-1',
          language: 'ui-content-mock-language-1',
        },
        {
          fieldKey: 'ui-content-mock-fieldKey-2',
          groupKey: 'ui-content-mock-groupKey-2',
          value: 'ui-content-mock-value-2',
          type: 'ui-content-mock-type-2',
          language: 'ui-content-mock-language-2',
        },
        {
          fieldKey: 'ui-content-mock-fieldKey-3',
          groupKey: 'ui-content-mock-groupKey-3',
          value: 'ui-content-mock-value-3',
          type: 'ui-content-mock-type-3',
          language: 'ui-content-mock-language-3',
        },
      ],
      message: 'message-mock',
      status: 'status-mock',
    };
    const result = ensureGetUIContentResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });

  it('should return [] if group key not found', () => {
    const mockResponseJson = [{}];
    const result = ensureGetUIContentResponse(mockResponseJson);
    expect(result).toEqual(mockResponseJson);
  });
});
