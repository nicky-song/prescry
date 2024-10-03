// Copyright 2022 Prescryptive Health, Inc.

import { useContent } from '../../../../context-providers/session/ui-content-hooks/use-content';
import { usePbmProfileCobrandingContent } from '../../../../context-providers/session/ui-content-hooks/use-pbm-profile-cobranding-content';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { useSwitchYourMedicationSlideUpModalCobrandingContentHelper } from './switch-your-medication.slide-up-modal.cobranding-content-helper';
import { ISwitchYourMedicationSlideUpModalContent } from './switch-your-medication.slide-up-modal.content';

jest.mock('../../../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock(
  '../../../../context-providers/session/ui-content-hooks/use-pbm-profile-cobranding-content'
);
const usePbmProfileCobrandingContentMock =
  usePbmProfileCobrandingContent as jest.Mock;

describe('useSwitchYourMedicationSlideUpModalCobrandingContentHelper', () => {
  const switchYourMedicationSlideUpModalContentMock: ISwitchYourMedicationSlideUpModalContent =
    {
      heading: 'heading-mock',
      description: 'description-mock',
      genericsHeading: 'generics-heading-mock',
      genericsDescription: 'generics-description-mock',
      therapeuticAlternativesHeading: 'therapeutic-alternatives-heading-mock',
      therapeuticAlternativesDescription:
        'therapeutic-alternatives-description-mock',
      discretionaryAlternativesHeading:
        'discretionary-alternatives-heading-mock',
      discretionaryAlternativesDescription:
        'discretionary-alternatives-description-mock',
    };

  const isSwitchYourMedicationSlideUpModalContentLoadingMock = false;

  const pbmProfileCobrandingContentMock = {
    recommendedAltsSlideUpModalHeading:
      'recommended-alts-slide-up-modal-heading=mock',
    recommendedAltsSlideUpModalContent:
      'recommended-alts-slide-up-modal-content-mock',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({
      content: switchYourMedicationSlideUpModalContentMock,
      isContentLoading: isSwitchYourMedicationSlideUpModalContentLoadingMock,
    });

    usePbmProfileCobrandingContentMock.mockReturnValue(
      pbmProfileCobrandingContentMock
    );
  });

  it('it calls the content methods as expected', () => {
    useSwitchYourMedicationSlideUpModalCobrandingContentHelper();

    expect(useContentMock).toHaveBeenCalledTimes(1);
    expect(useContentMock).toHaveBeenNthCalledWith(
      1,
      CmsGroupKey.switchYourMedicationSlideUpModal,
      2
    );

    expect(usePbmProfileCobrandingContentMock).toHaveBeenCalledTimes(1);
    expect(usePbmProfileCobrandingContentMock).toHaveBeenNthCalledWith(1);
  });

  it('returns default content if not cobranding', () => {
    usePbmProfileCobrandingContentMock.mockReturnValue({});

    const content =
      useSwitchYourMedicationSlideUpModalCobrandingContentHelper();

    expect(content).toEqual({
      content: switchYourMedicationSlideUpModalContentMock,
      isContentLoading: isSwitchYourMedicationSlideUpModalContentLoadingMock,
      isCobranding: false,
    });
  });

  it('returns default with cobranding content if cobranding', () => {
    const content =
      useSwitchYourMedicationSlideUpModalCobrandingContentHelper();

    expect(content).toEqual({
      content: {
        ...switchYourMedicationSlideUpModalContentMock,
        heading:
          pbmProfileCobrandingContentMock.recommendedAltsSlideUpModalHeading,
        description:
          pbmProfileCobrandingContentMock.recommendedAltsSlideUpModalContent,
      },
      isContentLoading: isSwitchYourMedicationSlideUpModalContentLoadingMock,
      isCobranding: true,
    });
  });
});
