// Copyright 2021 Prescryptive Health, Inc.

import {
  CMSExperience,
  CMSExperienceEnum,
} from '../../../../../models/cms-content/experience.cms-content';
import { defaultLanguage } from '../../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../../models/ui-content';
import { loadDefaultLanguageContentIfSpecifiedAbsent } from '../../../../../utils/cms-content.helper';
import { getUIContent } from '../../../api/api-v1.get-ui-content';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { IGetCMSContentAsyncActionArgs } from '../async-actions/get-cms-content.async-action';
import { CmsGroupKey } from '../cms-group-key';
import { getCMSContentDispatch } from './get-cms-content.dispatch';
import { setCMSContentDispatch } from './set-cms-content.dispatch';

jest.mock('../../../api/api-v1.get-ui-content');
const getUIContentMock = getUIContent as jest.Mock;

jest.mock('./set-cms-content.dispatch');
const setWhatComesNextCMSContentDispatchMock =
  setCMSContentDispatch as jest.Mock;
const setGlobalCMSContentDispatchMock = setCMSContentDispatch as jest.Mock;

const setCMSContentDispatchMock = setCMSContentDispatch as jest.Mock;

jest.mock('../../../../../utils/cms-content.helper');
const loadDefaultLanguageContentIfSpecifiedAbsentMock =
  loadDefaultLanguageContentIfSpecifiedAbsent as jest.Mock;

describe('getCMSContentDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getUIContentMock.mockResolvedValue([]);
  });

  it('makes API request with language defined', async () => {
    const configMock = GuestExperienceConfig;

    const reduxGetStateMock = jest.fn().mockReturnValue({ config: configMock });

    const groupKeyMock = CmsGroupKey.orderConfirmation;

    const uiCMSContentMap: Map<string, IUIContentGroup> = new Map([
      [
        groupKeyMock,
        {
          content: [],
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const argsMock: IGetCMSContentAsyncActionArgs = {
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      sessionDispatch: jest.fn(),
      groupKey: groupKeyMock,
      uiCMSContentMap,
    };

    await getCMSContentDispatch(argsMock);

    expect(getUIContentMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      undefined,
      undefined,
      groupKeyMock,
      uiCMSContentMap,
      undefined
    );
  });

  it('makes API request without language defined', async () => {
    const configMock = GuestExperienceConfig;

    const reduxGetStateMock = jest.fn().mockReturnValue({ config: configMock });

    const groupKeyMock = CmsGroupKey.orderConfirmation;

    const uiCMSContentMap: Map<string, IUIContentGroup> = new Map([
      [
        groupKeyMock,
        {
          content: [],
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const argsMock: IGetCMSContentAsyncActionArgs = {
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      sessionDispatch: jest.fn(),
      groupKey: groupKeyMock,
      uiCMSContentMap,
    };

    await getCMSContentDispatch(argsMock);

    expect(getUIContentMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      undefined,
      undefined,
      groupKeyMock,
      uiCMSContentMap,
      undefined
    );
  });

  it('dispatches set global cms content', async () => {
    const uiContentForGlobalGroupKeyMock: IUIContent[] = [
      {
        fieldKey: 'learn-more',
        language: 'English',
        value: 'learn-more-text-mock',
        type: 'text',
      },
      {
        fieldKey: 'privacy-policy',
        language: 'English',
        value: 'privacy-policy-text-mock',
        type: 'text',
      },
      {
        fieldKey: 'support-cash-phone',
        language: 'English',
        value: 'support-cash-phone-mock',
        type: 'text',
      },
      {
        fieldKey: 'support-linked-text',
        language: 'English',
        value: 'support-linked-text-mock',
        type: 'text',
      },
      {
        fieldKey: 'support-pbm-phone',
        language: 'English',
        value: 'support-pbm-phone-text-mock',
        type: 'text',
      },
      {
        fieldKey: 'support-unlinked-text',
        language: 'English',
        value: 'support-unlinked-text-mock',
        type: 'text',
      },
      {
        fieldKey: 't-&-c',
        language: 'English',
        value: 'terms-and-conditions-text-mock',
        type: 'text',
      },
    ];

    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ config: GuestExperienceConfig });

    const sessionDispatchMock = jest.fn();

    getUIContentMock.mockResolvedValue(uiContentForGlobalGroupKeyMock);

    const groupKeyMock = CmsGroupKey.global;

    const uiContentGroupMock = {
      content: [],
      lastUpdated: 0,
      isContentLoading: true,
    };

    const uiCMSContentMapMock: Map<string, IUIContentGroup> = new Map([
      [groupKeyMock, uiContentGroupMock],
    ]);

    const argsMock: IGetCMSContentAsyncActionArgs = {
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      sessionDispatch: sessionDispatchMock,
      groupKey: groupKeyMock,
      uiCMSContentMap: uiCMSContentMapMock,
    };

    await getCMSContentDispatch(argsMock);

    expect(setGlobalCMSContentDispatchMock).toHaveBeenCalledWith(
      sessionDispatchMock,
      groupKeyMock,
      uiContentGroupMock
    );
  });

  it('dispatches set what comes next cms content', async () => {
    const uiContentForWhatComesNextGroupKeyMock: IUIContent[] = [
      {
        fieldKey: 'what-comes-next-another-pharmacy',
        language: 'English',
        type: 'text',
        value: 'what-comes-next-another-pharmacy-mock',
      },
      {
        fieldKey: 'what-comes-next-another-pharmacy-subtitle',
        language: 'English',
        type: 'text',
        value: 'what-comes-next-another-pharmacy-subtitle-mock',
      },
      {
        fieldKey: 'what-comes-next-new-prescription',
        language: 'English',
        type: 'text',
        value: 'what-comes-next-new-prescription-mock',
      },
      {
        fieldKey: 'what-comes-next-new-prescription-subtitle',
        language: 'English',
        type: 'text',
        value: 'what-comes-next-new-prescription-subtitle-mock',
      },
      {
        fieldKey: 'prescription-at-this-pharmacy-instructions-text',
        language: 'English',
        type: 'text',
        value: 'prescription-at-this-pharmacy-instructions-text-mock',
      },
      {
        fieldKey: 'prescription-at-this-pharmacy-heading-text',
        language: 'English',
        type: 'text',
        value: 'prescription-at-this-pharmacy-heading-text-mock',
      },
      {
        fieldKey: 'prescription-at-this-pharmacy-unauth-information-text',
        language: 'English',
        type: 'text',
        value: 'prescription-at-this-pharmacy-unauth-information-text-mock',
      },
      {
        fieldKey: 'prescription-at-this-pharmacy-signup-text',
        language: 'English',
        type: 'text',
        value: 'prescription-at-this-pharmacy-signup-text-mock',
      },
    ];

    const reduxGetStateMock = jest
      .fn()
      .mockReturnValue({ config: GuestExperienceConfig });

    const sessionDispatchMock = jest.fn();

    getUIContentMock.mockResolvedValue(uiContentForWhatComesNextGroupKeyMock);

    const groupKeyMock = CmsGroupKey.whatComesNext;

    const uiContentGroupMock = {
      content: [],
      lastUpdated: 0,
      isContentLoading: true,
    };

    const uiCMSContentMapMock: Map<string, IUIContentGroup> = new Map([
      [groupKeyMock, uiContentGroupMock],
    ]);

    const argsMock: IGetCMSContentAsyncActionArgs = {
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      sessionDispatch: sessionDispatchMock,
      groupKey: groupKeyMock,
      uiCMSContentMap: uiCMSContentMapMock,
    };

    await getCMSContentDispatch(argsMock);

    expect(setWhatComesNextCMSContentDispatchMock).toHaveBeenCalledWith(
      sessionDispatchMock,
      groupKeyMock,
      uiContentGroupMock
    );
  });

  it('clone ui content map when uiCMSContentMap is defined', async () => {
    const configMock = GuestExperienceConfig;

    const reduxGetStateMock = jest.fn().mockReturnValue({ config: configMock });

    const groupKeyMock = CmsGroupKey.orderConfirmation;

    const uiCMSContentMap: Map<string, IUIContentGroup> = new Map([
      [
        groupKeyMock,
        {
          content: [
            {
              fieldKey: 'prescription-at-this-pharmacy-signup-text',
              language: 'English',
              type: 'text',
              value: 'prescription-at-this-pharmacy-signup-text-mock',
            },
          ],
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const argsMock: IGetCMSContentAsyncActionArgs = {
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      sessionDispatch: jest.fn(),
      groupKey: groupKeyMock,
      uiCMSContentMap,
    };

    getUIContentMock.mockResolvedValue(uiCMSContentMap);

    await getCMSContentDispatch(argsMock);

    expect(setCMSContentDispatchMock).toHaveBeenCalledTimes(2);

    expect(getUIContentMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      undefined,
      undefined,
      groupKeyMock,
      uiCMSContentMap,
      undefined
    );
  });

  it('makes API request with experience defined', async () => {
    const configMock = GuestExperienceConfig;

    const reduxGetStateMock = jest.fn().mockReturnValue({ config: configMock });

    const groupKeyMock = CmsGroupKey.orderConfirmation;

    const uiCMSContentMap: Map<string, IUIContentGroup> = new Map([
      [
        groupKeyMock,
        {
          content: [],
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const experienceMock: CMSExperience = CMSExperienceEnum.MYRX_COBRANDING;

    const argsMock: IGetCMSContentAsyncActionArgs = {
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      sessionDispatch: jest.fn(),
      groupKey: groupKeyMock,
      uiCMSContentMap,
      experience: experienceMock,
    };

    await getCMSContentDispatch(argsMock);

    expect(getUIContentMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      undefined,
      undefined,
      groupKeyMock,
      uiCMSContentMap,
      experienceMock
    );
  });

  it('gets default language content for cobranding experience', async () => {
    getUIContentMock.mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    } as unknown as Map<string, IUIContentGroup>);
    const configMock = GuestExperienceConfig;

    const reduxGetStateMock = jest.fn().mockReturnValue({ config: configMock });

    const groupKeyMock = CmsGroupKey.orderConfirmation;

    const uiCMSContentMap: Map<string, IUIContentGroup> = new Map([
      [
        groupKeyMock,
        {
          content: [],
          lastUpdated: 0,
          isContentLoading: true,
        },
      ],
    ]);

    const experienceMock: CMSExperience = CMSExperienceEnum.MYRX_COBRANDING;
    const reduxDispatchMock = jest.fn();
    const sessionDispatchMock = jest.fn();

    const argsMock: IGetCMSContentAsyncActionArgs = {
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      sessionDispatch: sessionDispatchMock,
      groupKey: groupKeyMock,
      uiCMSContentMap,
      experience: experienceMock,
    };

    await getCMSContentDispatch(argsMock);

    expect(getUIContentMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      undefined,
      undefined,
      groupKeyMock,
      uiCMSContentMap,
      experienceMock
    );
    expect(
      loadDefaultLanguageContentIfSpecifiedAbsentMock
    ).toHaveBeenCalledWith(
      reduxDispatchMock,
      reduxGetStateMock,
      sessionDispatchMock,
      {
        reduxDispatch: reduxDispatchMock,
        reduxGetState: reduxGetStateMock,
        sessionDispatch: sessionDispatchMock,
        version: undefined,
        language: undefined,
        groupKey: groupKeyMock,
        uiCMSContentMap,
        experience: experienceMock,
        cmsRefreshInterval: undefined,
      },
      defaultLanguage,
      groupKeyMock,
      uiCMSContentMap,
      experienceMock
    );
  });

  it('call setCMSContentDispatch if any exception occurs', async () => {
    const configMock = GuestExperienceConfig;

    const reduxGetStateMock = jest.fn().mockReturnValue({ config: configMock });

    const groupKeyMock = CmsGroupKey.orderConfirmation;

    const uiContentMock: IUIContentGroup = {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    };

    const uiCMSContentMap: Map<string, IUIContentGroup> = new Map([
      [groupKeyMock, uiContentMock],
    ]);

    const sessionDispatchMock = jest.fn();

    const argsMock: IGetCMSContentAsyncActionArgs = {
      reduxDispatch: jest.fn(),
      reduxGetState: reduxGetStateMock,
      sessionDispatch: sessionDispatchMock,
      groupKey: groupKeyMock,
      uiCMSContentMap,
    };

    getUIContentMock.mockImplementation(() => {
      throw new Error();
    });

    await getCMSContentDispatch(argsMock);

    expect(getUIContentMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      undefined,
      undefined,
      groupKeyMock,
      uiCMSContentMap,
      undefined
    );

    expect(setCMSContentDispatchMock).toHaveBeenCalledTimes(2);

    expect(setCMSContentDispatchMock).toHaveBeenNthCalledWith(
      2,
      sessionDispatchMock,
      CmsGroupKey.orderConfirmation,
      uiContentMock
    );
  });
});
