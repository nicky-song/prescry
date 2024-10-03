// Copyright 2022 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../state/cms-content/cms-group-key';
import { pickAPharmacyCMSContentWrapper } from './pick-a-pharmacy.cms-content-wrapper';
import { IPickAPharmacyContent } from './pick-a-pharmacy.content';

jest.mock('../../../utils/content/cms-content-wrapper.helper');
const findContentValueMock = findContentValue as jest.Mock;
const getContentMock = getContent as jest.Mock;

describe('pickAPharmacyCMSContentWrapper', () => {
  it('has correct content', () => {
    const eligibilityMock = 'elegibility-label-mock';
    const pickYourPharmacyMock = 'pick-your-pharmacy-label-mock';
    const informationButtonLabelMock = 'information-button-label-mock';
    const locationMock = 'location-label-mock';
    const noPharmacyFoundMock = 'no-pharmacy-found-label-mock';
    const youPayLabelMock = 'you-pay-label-mock';
    const planPaysLabelMock = 'plan-pays-label-mock';
    const distanceLabelMock = 'distance-label-mock';
    const popUpModalTextMock = 'popup-modal-text-label-mock';
    const popUpModalLabelMock = 'popup-modal-label-mock';
    const popUpModalContentMock = 'popup-modal-content-label-mock';
    const noPharmaciesFoundErrorMessageMock =
      'no-pharmacies-found-error-message-label';
    const noPharmaciesFoundErrorMessagePluralMock =
      'no-pharmacies-found-error-message-plural-label';
    const pickYourPharmacySubTextMock = 'pick-your-pharmacy-sub-text-mock';
    const rtpbDescriptionMock = 'rtpb-description-mock';

    findContentValueMock.mockReturnValueOnce(eligibilityMock);
    findContentValueMock.mockReturnValueOnce(pickYourPharmacyMock);
    findContentValueMock.mockReturnValueOnce(informationButtonLabelMock);
    findContentValueMock.mockReturnValueOnce(locationMock);
    findContentValueMock.mockReturnValueOnce(noPharmacyFoundMock);
    findContentValueMock.mockReturnValueOnce(youPayLabelMock);
    findContentValueMock.mockReturnValueOnce(planPaysLabelMock);
    findContentValueMock.mockReturnValueOnce(distanceLabelMock);
    findContentValueMock.mockReturnValueOnce(popUpModalTextMock);
    findContentValueMock.mockReturnValueOnce(popUpModalLabelMock);
    findContentValueMock.mockReturnValueOnce(popUpModalContentMock);
    findContentValueMock.mockReturnValueOnce(noPharmaciesFoundErrorMessageMock);
    findContentValueMock.mockReturnValueOnce(
      noPharmaciesFoundErrorMessagePluralMock
    );
    findContentValueMock.mockReturnValueOnce(pickYourPharmacySubTextMock);
    findContentValueMock.mockReturnValueOnce(rtpbDescriptionMock);

    const uiContentMock: IUIContent[] = [
      {
        fieldKey: 'field-key',
        language: 'English',
        type: 'Text',
        value: 'value',
      },
    ];
    getContentMock.mockReturnValue(uiContentMock);

    const cmsContentMapMock: Map<string, IUIContentGroup> = new Map([
      [
        CmsGroupKey.pickAPharmacy,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = pickAPharmacyCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.pickAPharmacy,
      2
    );

    expect(findContentValueMock).toHaveBeenCalledTimes(15);
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      1,
      'elegibility-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      2,
      'pick-your-pharmacy-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      3,
      'information-button-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      4,
      'location-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      5,
      'no-pharmacy-found-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      6,
      'you-pay-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      7,
      'plan-pays-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      8,
      'distance-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      9,
      'popup-modal-text-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      10,
      'popup-modal-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      11,
      'popup-modal-content-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      12,
      'no-pharmacies-found-error-message-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      13,
      'no-pharmacies-found-error-message-plural-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      14,
      'pick-your-pharmacy-sub-text',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      15,
      'rtpb-description',
      uiContentMock
    );

    const expectedContent: IPickAPharmacyContent = {
      eligibility: eligibilityMock,
      pickYourPharmacy: pickYourPharmacyMock,
      informationButtonLabel: informationButtonLabelMock,
      location: locationMock,
      noPharmacyFound: noPharmacyFoundMock,
      youPayLabel: youPayLabelMock,
      planPaysLabel: planPaysLabelMock,
      distanceLabel: distanceLabelMock,
      popUpModalText: popUpModalTextMock,
      popUpModalLabel: popUpModalLabelMock,
      popUpModalContent: popUpModalContentMock,
      noPharmaciesFoundErrorMessage: noPharmaciesFoundErrorMessageMock,
      noPharmaciesFoundErrorMessagePlural:
        noPharmaciesFoundErrorMessagePluralMock,
      pickYourPharmacySubText: pickYourPharmacySubTextMock,
      rtpbDescription: rtpbDescriptionMock,
    };
    expect(result).toEqual(expectedContent);
  });
});
