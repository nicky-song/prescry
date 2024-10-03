// Copyright 2022 Prescryptive Health, Inc.

import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { usePbmProfileCobrandingContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-pbm-profile-cobranding-content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { ICobrandingContent } from '../../../models/cms-content/co-branding.ui-content';
import { useContactDoctorContainerCobrandingContentHelper } from './contact-doctor-container.cobranding-content-helper';
import { IContactDoctorContainerContent } from './contact-doctor-container.content';

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-pbm-profile-cobranding-content'
);
const usePbmProfileCobrandingContentMock =
  usePbmProfileCobrandingContent as jest.Mock;

const contentMock: IContactDoctorContainerContent = {
  switchYourMedsTitle: 'switch-your-meds-title-mock',
  switchYourMedsDescription: 'switch-your-meds-description-mock',
  callNowButtonLabel: 'call-now-button-label-mock',
};

const isContentLoadingMock = false;

const pbmProfileCobrandingContentMock: Partial<ICobrandingContent> = {
  switchYourMedsCallButtonLabel:
    'switch-your-meds-call-button-label-cobranding-mock',
  switchYourMedsDescription: 'switch-your-meds-description-cobranding-mock',
  switchYourMedsProviderName: 'switch-your-meds-provider-name-cobranding-mock',
  switchYourMedsPhoneNumber: 'switch-your-meds-phone-number-cobranding-mock',
};

describe('contactDoctorContainerCobrandingContentHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: isContentLoadingMock,
    });

    usePbmProfileCobrandingContentMock.mockReturnValue({});
  });
  it('calls useContent with recommendedAlternatives group key', () => {
    useContactDoctorContainerCobrandingContentHelper();

    expect(useContentMock).toHaveBeenCalledTimes(1);
    expect(useContentMock).toHaveBeenNthCalledWith(
      1,
      CmsGroupKey.contactDoctor,
      2
    );
  });

  it('calls usePbmProfileCobrandingContentMock', () => {
    useContactDoctorContainerCobrandingContentHelper();

    expect(usePbmProfileCobrandingContentMock).toHaveBeenCalledTimes(1);
    expect(usePbmProfileCobrandingContentMock).toHaveBeenNthCalledWith(1);
  });

  it('returns content, isContentLoading, and isCobranding as expected (default)', () => {
    const contactDoctorContainerCobrandingContent =
      useContactDoctorContainerCobrandingContentHelper();

    expect(contactDoctorContainerCobrandingContent.content).toEqual(
      contentMock
    );
    expect(contactDoctorContainerCobrandingContent.isContentLoading).toEqual(
      isContentLoadingMock
    );
    expect(contactDoctorContainerCobrandingContent.isCobranding).toEqual(false);
  });

  it('returns content, isContentLoading, and isCobranding as expected (cobranding)', () => {
    usePbmProfileCobrandingContentMock.mockReturnValue(
      pbmProfileCobrandingContentMock
    );

    const contactDoctorContainerCobrandingContent =
      useContactDoctorContainerCobrandingContentHelper();

    expect(contactDoctorContainerCobrandingContent.content).toEqual({
      ...contentMock,
      switchYourMedsProviderName:
        pbmProfileCobrandingContentMock.switchYourMedsProviderName,
      switchYourMedsPhoneNumber:
        pbmProfileCobrandingContentMock.switchYourMedsPhoneNumber,
      callNowButtonLabel:
        pbmProfileCobrandingContentMock.switchYourMedsCallButtonLabel,
      switchYourMedsDescription:
        pbmProfileCobrandingContentMock.switchYourMedsDescription,
    });
    expect(contactDoctorContainerCobrandingContent.isContentLoading).toEqual(
      isContentLoadingMock
    );
    expect(contactDoctorContainerCobrandingContent.isCobranding).toEqual(true);
  });
});
