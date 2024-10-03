// Copyright 2022 Prescryptive Health, Inc.

import { defaultLanguage } from '../../../../models/language';
import { IUIContent, IUIContentGroup } from '../../../../models/ui-content';
import {
  findContentValue,
  getContent,
} from '../../../../utils/content/cms-content-wrapper.helper';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { claimHistoryScreenCMSContentWrapper } from './claim-history.screen.cms-content-wrapper';
import { IClaimHistoryScreenContent } from './claim-history.screen.content';

jest.mock('../../../../utils/content/cms-content-wrapper.helper');
const getContentMock = getContent as jest.Mock;
const findContentValueMock = findContentValue as jest.Mock;

describe('claimHistoryScreenCMSContentWrapper', () => {
  it('has correct content when field keys exist', () => {
    const titleMock = 'title';
    const emptyClaimTextMock = 'emptyClaimText';
    const emptyClaimHeadingMock = 'emptyClaimHeading';
    const emptyClaimsWithPrescriptionTextMock =
      'emptyClaimsWithPrescriptionText';
    const medicineCabinetButtonLabelMock = 'medicineCabinetButtonLabel';
    const loadingClaimsTextMock = 'loadingClaimsTextMock';
    const downloadButtonLabelMock = 'downloadButtonLabelMock';

    findContentValueMock.mockReturnValueOnce(titleMock);
    findContentValueMock.mockReturnValueOnce(emptyClaimTextMock);
    findContentValueMock.mockReturnValueOnce(emptyClaimHeadingMock);
    findContentValueMock.mockReturnValueOnce(
      emptyClaimsWithPrescriptionTextMock
    );
    findContentValueMock.mockReturnValueOnce(medicineCabinetButtonLabelMock);
    findContentValueMock.mockReturnValueOnce(loadingClaimsTextMock);
    findContentValueMock.mockReturnValueOnce(downloadButtonLabelMock);

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
        CmsGroupKey.claimHistoryScreen,
        {
          content: uiContentMock,
          lastUpdated: 0,
          isContentLoading: false,
        },
      ],
    ]);

    const result = claimHistoryScreenCMSContentWrapper(
      defaultLanguage,
      cmsContentMapMock
    );

    expect(getContentMock).toHaveBeenCalledWith(
      defaultLanguage,
      cmsContentMapMock,
      CmsGroupKey.claimHistoryScreen,
      2
    );

    expect(findContentValueMock).toHaveBeenCalledTimes(7);
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      1,
      'title',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      2,
      'empty-claims-text',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      3,
      'empty-claims-heading',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      4,
      'empty-claims-with-prescription-text',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      5,
      'medicine-cabinet-button-label',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      6,
      'loading-claims-text',
      uiContentMock
    );
    expect(findContentValueMock).toHaveBeenNthCalledWith(
      7,
      'download-button-label',
      uiContentMock
    );

    const expectedContent: IClaimHistoryScreenContent = {
      title: titleMock,
      emptyClaimsText: emptyClaimTextMock,
      emptyClaimsHeading: emptyClaimHeadingMock,
      emptyClaimsWithPrescriptionText: emptyClaimsWithPrescriptionTextMock,
      medicineCabinetButtonLabel: medicineCabinetButtonLabelMock,
      loadingClaimsText: loadingClaimsTextMock,
      downloadButtonLabel: downloadButtonLabelMock,
    };
    expect(result).toEqual(expectedContent);
  });
});
