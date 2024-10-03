// Copyright 2021 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../../models/ui-content';
import { useSessionContext } from '../../../context-providers/session/use-session-context.hook';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';
import { ISessionState } from '../../../state/session/session.state';
import {
  IUnauthHomeScreenContent,
  unauthHomeScreenContent,
} from './unauth.home.screen.content';

jest.mock('../../../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

const defaultLanguageMock = 'English';

describe('unauthHomeScreenContent', () => {
  it('should have correct content', () => {
    const homeContentMock: IUIContent[] = [
      {
        fieldKey: 'unauth-home-header',
        language: 'English',
        type: 'text',
        value: 'heading-mock',
      },
      {
        fieldKey: 't-&-c',
        language: 'English',
        type: 'text',
        value: 'tc-mock',
      },
    ];
    const uiContentGroupMock: IUIContentGroup = {
      content: homeContentMock,
      lastUpdated: 0,
      isContentLoading: false,
    };
    const uiContentMapMock = new Map([
      [CmsGroupKey.homePage, uiContentGroupMock],
    ]);
    const sessionStateMock: Partial<ISessionState> = {
      uiCMSContentMap: uiContentMapMock,
      currentLanguage: defaultLanguage,
    };
    useSessionContextMock.mockReturnValue({ sessionState: sessionStateMock });

    const expectedContent: IUnauthHomeScreenContent = {
      heading: 'heading-mock',
      drugSearchCardSubtitle: '',
      drugSearchCardTitle: '',
      drugSearchCardButtonLabel: '',
      getStarted: '',
      healthcareTechnologySectionDescription: '',
      healthcareTechnologySectionTitle: '',
      learnMore: '',
      ownPrescriptionsDescription: '',
      ownPrescriptionsTitle: '',
      prescriptionBenefitsDescription: '',
      prescriptionBenefitsTitle: '',
      privacyPolicy: '',
      secureDescription: '',
      secureTitle: '',
      shopToSaveDescription: '',
      shopToSaveTitle: '',
      termsAndConditions: 'tc-mock',
      trustedCliniciansDescription: '',
      trustedCliniciansTitle: '',
      clinicalServicesHeader: '',
      clinicalServicesDescription: '',
      clinicalServicesButton: '',
      smartPriceHeader: '',
      smartPriceDescription: '',
      smartPriceButton: '',
      clinicalServicesLearnMoreTitle: '',
      clinicalServicesBullet1: '',
      clinicalServicesBullet2: '',
      clinicalServicesBullet3: '',
      clinicalServicesIcon: 'virusSyringeIcon',
      smartPriceLearnMoreTitle: '',
      smartPriceBullet1: '',
      smartPriceBullet2: '',
      smartPriceBullet3: '',
      smartPriceIcon: 'smartpriceCardIcon',
    };

    expect(
      unauthHomeScreenContent(uiContentMapMock, defaultLanguageMock)
    ).toEqual(expectedContent);
  });
});
