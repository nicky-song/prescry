// Copyright 2022 Prescryptive Health, Inc.

import { IUIContentResponse } from '../../models/api-response/ui-content-response';
import { getResolvedObjectSource } from '../assets.helper';
import { getUICMSContent } from './get-ui-cms-content';

jest.mock('../assets.helper');
const getResolvedObjectSourceMock = getResolvedObjectSource as jest.Mock;

describe('getUICMSContent', () => {
  it('calls getResolvedObjectSource', () => {
    const resolvedObjectSourceMock: IUIContentResponse[] = [
      {
        message: 'message',
        data: [
          {
            groupKey: 'group-key',
            fieldKey: 'field-key',
            language: 'language',
            type: 'type',
            value: 'value',
          },
        ],
        status: 'ok',
      },
    ];
    getResolvedObjectSourceMock.mockReturnValue(resolvedObjectSourceMock);

    const actual = getUICMSContent();

    expect(actual).toEqual(resolvedObjectSourceMock);
    expect(getResolvedObjectSourceMock).toHaveBeenCalledWith('uiCMSContent');
  });
});
