// Copyright 2022 Prescryptive Health, Inc.

import { useEffect, useState } from 'react';
import { defaultLanguage } from '../../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../../models/ui-content';
import { IOrderConfirmationScreenContent } from '../../../screens/order-confirmation-screen/order-confirmation.screen.content';
import {
  getCMSContent,
  IGetCMSContent,
} from '../../../../../utils/cms-content.helper';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { defaultSessionState } from '../../../state/session/session.state';
import { IReduxContext } from '../../redux/redux.context';
import { useReduxContext } from '../../redux/use-redux-context.hook';
import { ISessionContext } from '../session.context';
import { useSessionContext } from '../use-session-context.hook';
import { useContent } from './use-content';
import { ICobrandingContent } from '../../../../../models/cms-content/co-branding.ui-content';
import { getNewDate } from '../../../../../utils/date-time/get-new-date';
import { IConfigContext } from '../../config/config.context';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { useConfigContext } from '../../config/use-config-context.hook';
import { CMSExperienceEnum } from '../../../../../models/cms-content/experience.cms-content';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useStateMock = useState as jest.Mock;

jest.mock('../use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock('../../config/use-config-context.hook');
const useConfigContextMock = useConfigContext as jest.Mock;

jest.mock('../../redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../../../../utils/cms-content.helper');

const getCMSContentMock = getCMSContent as jest.Mock;

jest.mock('.../../../../../utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

const nowMock = new Date();

const cmsContentMapMock: Map<string, IUIContentGroup> = new Map([
  [
    CmsGroupKey.orderConfirmation,
    {
      content: [
        {
          fieldKey: 'offer-delivery-info-title',
          language: 'English',
          type: 'text',
          value: 'offer-delivery-info-title-mock',
        },
      ],
      lastUpdated: nowMock.getTime(),
      isContentLoading: false,
    },
  ],
]);

interface IStateCalls {
  isContentLoading: [boolean, jest.Mock];
}

function stateReset({
  isContentLoading = [false, jest.fn()],
}: Partial<IStateCalls>) {
  useStateMock.mockReset();

  useStateMock.mockReturnValueOnce(isContentLoading);
}

const reduxDispatchMock = jest.fn();
const reduxGetStateMock = jest.fn();
const sessionDispatchMock = jest.fn();

const sessionContextMock: ISessionContext = {
  sessionState: {
    ...defaultSessionState,
    uiCMSContentMap: cmsContentMapMock,
  },
  sessionDispatch: sessionDispatchMock,
};

describe('useContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    stateReset({});

    const contextMock: IConfigContext = {
      configState: { ...GuestExperienceConfig, cmsRefreshInterval: 10000 },
    };
    useConfigContextMock.mockReturnValue(contextMock);

    useSessionContextMock.mockReturnValue(sessionContextMock);

    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
  });

  it('have correct content', () => {
    const uiContentMock: IUIContent = {
      fieldKey: 'offer-delivery-info-title',
      language: 'English',
      type: 'text',
      value: 'offer-delivery-info-title-mock',
    };
    const uiContentGroupMock: IUIContentGroup = {
      content: [uiContentMock],
      lastUpdated: 0,
      isContentLoading: false,
    };

    const sessionContextMock: ISessionContext = {
      sessionState: {
        ...defaultSessionState,
        uiCMSContentMap: new Map([
          [CmsGroupKey.orderConfirmation, uiContentGroupMock],
        ]),
        currentLanguage: defaultLanguage,
      },
      sessionDispatch: sessionDispatchMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    const expectedContent: IOrderConfirmationScreenContent = {
      orderConfirmationTitleText: '',
      orderConfirmationConfirmationText: '',
      orderConfirmationEligibilityText: '',
      offerDeliveryInfoTitle: 'offer-delivery-info-title-mock',
      offerDeliveryInfoDescription: '',
      pickUpHeading: '',
      pickUpPreamble: '',
      whatIsNextHeader: '',
      whatIsNextInstructions: '',
      orderSectionHeader: '',
      summaryTitle: '',
      summaryOrderDate: '',
      summaryOrderNumber: '',
      summaryPlanPays: '',
      summaryYouPay: '',
      pickUpOpen24Hours: '',
      pickUpOpen: '',
      pickUpClosed: '',
      pickUpOpensAt: '',
      pickUpClosesAt: '',
      prescriberInfoTitle: '',
      insuranceCardNoticeText: '',
      estimatedPriceNoticeText: '',
    };
    expect(
      useContent<IOrderConfirmationScreenContent>(CmsGroupKey.orderConfirmation)
    ).toEqual({
      content: expectedContent,
      isContentLoading: false,
      fetchCMSContent: expect.any(Function),
    });
  });

  it('have correct content when isCobranding is true', () => {
    const coBrandIdMock = 'broker-transcarent';

    const uiContentMock: IUIContent = {
      fieldKey: 'logo',
      language: 'English',
      type: 'asset',
      value: 'logo-url-mock',
    };
    const uiContentGroupMock: IUIContentGroup = {
      content: [uiContentMock],
      lastUpdated: 0,
      isContentLoading: false,
    };

    const sessionContextMock: ISessionContext = {
      sessionState: {
        ...defaultSessionState,
        uiCMSContentMap: new Map([[coBrandIdMock, uiContentGroupMock]]),
        currentLanguage: defaultLanguage,
      },
      sessionDispatch: sessionDispatchMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    const expectedContent: ICobrandingContent = {
      logo: 'logo-url-mock',
      interstitialContent: '',
      idCardLogo: '',
      idCardHeaderColor: '',
      recommendedAltsSlideUpModalContent: '',
      recommendedAltsSlideUpModalHeading: '',
      switchYourMedsCallButtonLabel: '',
      switchYourMedsDescription: '',
      switchYourMedsProviderName: '',
      switchYourMedsPhoneNumber: '',
    };
    expect(
      useContent<ICobrandingContent>(
        coBrandIdMock,
        1,
        CMSExperienceEnum.MYRX_COBRANDING
      )
    ).toEqual({
      content: expectedContent,
      isContentLoading: false,
      fetchCMSContent: expect.any(Function),
    });
  });

  it.each([
    [
      false,
      {
        content: [],
        lastUpdated: 0,
        isContentLoading: false,
      },
    ],
    [true, undefined],
  ])(
    'lazy load order confirmation content when isContentLoading is %p',
    async (
      isContentLoadingMock: boolean,
      uiContentGroupMock: IUIContentGroup | undefined
    ) => {
      const nowMock = new Date();
      getNewDateMock.mockReturnValue(nowMock);

      const sessionContextMock: ISessionContext = {
        sessionState: {
          ...defaultSessionState,
          uiCMSContentMap: new Map(
            uiContentGroupMock
              ? [
                  [
                    CmsGroupKey.orderConfirmation,
                    {
                      ...uiContentGroupMock,
                      isContentLoading: isContentLoadingMock,
                    },
                  ],
                ]
              : []
          ),
          currentLanguage: defaultLanguage,
        },
        sessionDispatch: sessionDispatchMock,
      };
      useSessionContextMock.mockReturnValue(sessionContextMock);

      const expectedContent: IOrderConfirmationScreenContent = {
        orderConfirmationTitleText: '',
        orderConfirmationConfirmationText: '',
        orderConfirmationEligibilityText: '',
        offerDeliveryInfoTitle: isContentLoadingMock
          ? 'offer-delivery-info-title-mock'
          : '',
        offerDeliveryInfoDescription: '',
        pickUpHeading: '',
        pickUpPreamble: '',
        whatIsNextHeader: '',
        whatIsNextInstructions: '',
        orderSectionHeader: '',
        summaryTitle: '',
        summaryOrderDate: '',
        summaryOrderNumber: '',
        summaryPlanPays: '',
        summaryYouPay: '',
        pickUpOpen24Hours: '',
        pickUpOpen: '',
        pickUpClosed: '',
        pickUpOpensAt: '',
        pickUpClosesAt: '',
        prescriberInfoTitle: '',
        insuranceCardNoticeText: '',
        estimatedPriceNoticeText: '',
      };
      expect(
        useContent<IOrderConfirmationScreenContent>(
          CmsGroupKey.orderConfirmation
        )
      ).toEqual({
        content: uiContentGroupMock
          ? expectedContent
          : { ...expectedContent, offerDeliveryInfoTitle: '' },
        isContentLoading: isContentLoadingMock,
        fetchCMSContent: expect.any(Function),
      });

      const effectHandler = useEffectMock.mock.calls[0][0];
      await effectHandler();

      const expectedCmsContentMapMock: Map<string, IUIContentGroup> = new Map([
        [
          CmsGroupKey.orderConfirmation,
          {
            content: isContentLoadingMock
              ? [
                  {
                    fieldKey: 'offer-delivery-info-title',
                    language: 'English',
                    type: 'text',
                    value: 'offer-delivery-info-title-mock',
                  },
                ]
              : [],
            lastUpdated: 0,
            isContentLoading: isContentLoadingMock,
          },
        ],
      ]);

      const expectedCmsRefreshInterval = 10000;

      const expectedArgs: IGetCMSContent = {
        reduxDispatch: reduxDispatchMock,
        reduxGetState: reduxGetStateMock,
        sessionDispatch: sessionDispatchMock,
        language: defaultLanguage,
        groupKey: CmsGroupKey.orderConfirmation,
        uiCMSContentMap: uiContentGroupMock
          ? expectedCmsContentMapMock
          : new Map(),
        cmsRefreshInterval: expectedCmsRefreshInterval,
      };

      expect(getCMSContentMock).toHaveBeenCalledWith(expectedArgs);
    }
  );

  it('lazy load content when lastUpdated is expired', async () => {
    const nowMock = new Date();
    getNewDateMock.mockReturnValue(nowMock);

    const uiContentGroupMock = {
      content: [
        {
          fieldKey: 'offer-delivery-info-title',
          language: 'English',
          type: 'text',
          value: 'offer-delivery-info-title-mock',
        },
      ],
      lastUpdated: 1,
      isContentLoading: false,
    };

    const sessionContextMock: ISessionContext = {
      sessionState: {
        ...defaultSessionState,
        uiCMSContentMap: new Map([
          [
            CmsGroupKey.orderConfirmation,
            {
              ...uiContentGroupMock,
              isContentLoading: false,
            },
          ],
        ]),
        currentLanguage: defaultLanguage,
      },
      sessionDispatch: sessionDispatchMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    const expectedContent: IOrderConfirmationScreenContent = {
      orderConfirmationTitleText: '',
      orderConfirmationConfirmationText: '',
      orderConfirmationEligibilityText: '',
      offerDeliveryInfoTitle: 'offer-delivery-info-title-mock',
      offerDeliveryInfoDescription: '',
      pickUpHeading: '',
      pickUpPreamble: '',
      whatIsNextHeader: '',
      whatIsNextInstructions: '',
      orderSectionHeader: '',
      summaryTitle: '',
      summaryOrderDate: '',
      summaryOrderNumber: '',
      summaryPlanPays: '',
      summaryYouPay: '',
      pickUpOpen24Hours: '',
      pickUpOpen: '',
      pickUpClosed: '',
      pickUpOpensAt: '',
      pickUpClosesAt: '',
      prescriberInfoTitle: '',
      insuranceCardNoticeText: '',
      estimatedPriceNoticeText: '',
    };
    expect(
      useContent<IOrderConfirmationScreenContent>(CmsGroupKey.orderConfirmation)
    ).toEqual({
      content: expectedContent,
      isContentLoading: false,
      fetchCMSContent: expect.any(Function),
    });

    const effectHandler = useEffectMock.mock.calls[0][0];
    await effectHandler();

    const expectedCmsContentMapMock: Map<string, IUIContentGroup> = new Map([
      [
        CmsGroupKey.orderConfirmation,
        {
          content: [
            {
              fieldKey: 'offer-delivery-info-title',
              language: 'English',
              type: 'text',
              value: 'offer-delivery-info-title-mock',
            },
          ],
          lastUpdated: 1,
          isContentLoading: false,
        },
      ],
    ]);

    const expectedCmsRefreshInterval = 10000;

    const expectedArgs: IGetCMSContent = {
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      sessionDispatch: sessionDispatchMock,
      language: defaultLanguage,
      groupKey: CmsGroupKey.orderConfirmation,
      uiCMSContentMap: uiContentGroupMock
        ? expectedCmsContentMapMock
        : new Map(),
      cmsRefreshInterval: expectedCmsRefreshInterval,
    };

    expect(getCMSContentMock).toHaveBeenCalledWith(expectedArgs);
  });

  it('does not fetch CMS content if empty group key passed', async () => {
    getNewDateMock.mockReturnValue(nowMock);

    useContent('', 1, CMSExperienceEnum.MYRX_COBRANDING);

    const effectHandler = useEffectMock.mock.calls[0][0];
    await effectHandler();

    expect(getCMSContentMock).not.toHaveBeenCalled();
  });
});
