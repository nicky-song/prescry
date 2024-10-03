// Copyright 2022 Prescryptive Health, Inc.

import { ICobrandingContent } from '../../../../../models/cms-content/co-branding.ui-content';
import { IContentWithIsLoading } from '../../../../../models/cms-content/content-with-isloading.model';
import { CMSExperienceEnum } from '../../../../../models/cms-content/experience.cms-content';
import { useCobrandingContent } from './use-cobranding-content';
import { useContent } from './use-content';

jest.mock('./use-content');
const useContentMock = useContent as jest.Mock;

describe('useCobrandingContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({ content: {} });
  });

  it.each([
    [undefined, ''],
    ['HMA01', 'co-branding-HMA01'],
  ])(
    'gets co-branding content for rxGroup %p',
    (rxGroupMock: undefined | string, expectedGroupKey: string) => {
      useCobrandingContent(rxGroupMock);

      expect(useContentMock).toHaveBeenNthCalledWith(
        1,
        expectedGroupKey,
        undefined,
        CMSExperienceEnum.MYRX_COBRANDING
      );
    }
  );

  it.each([
    [undefined, ''],
    ['TRN01', 'co-branding-TRN01'],
  ])(
    'gets co-branding content for brokerAssociation %p',
    (brokerAssociationMock: undefined | string, expectedGroupKey: string) => {
      useCobrandingContent(undefined, brokerAssociationMock);

      expect(useContentMock).toHaveBeenNthCalledWith(
        2,
        expectedGroupKey,
        undefined,
        CMSExperienceEnum.MYRX_COBRANDING
      );
    }
  );

  it.each([
    [undefined, undefined, {}],
    [{}, {}, {}],
    [{ logo: '' }, { logo: '' }, {}],
    [
      { logo: 'rx-group-logo' },
      { logo: 'broker-association-logo' },
      { logo: 'rx-group-logo' },
    ],
    [
      { logo: '', idCardLogo: 'rx-group-id-card-logo' },
      { logo: 'broker-association-logo' },
      { logo: '', idCardLogo: 'rx-group-id-card-logo' },
    ],
    [
      {},
      { logo: 'broker-association-logo' },
      { logo: 'broker-association-logo' },
    ],
    [
      { logo: '' },
      { logo: 'broker-association-logo' },
      { logo: 'broker-association-logo' },
    ],
  ])(
    'returns co-branding content (rxGroupContent: %p, brokerAssociationContent: %p)',
    (
      rxGroupContentMock: ICobrandingContent | undefined,
      brokerAssociationContentMock: ICobrandingContent | undefined,
      expectedContent: ICobrandingContent
    ) => {
      const rxGroupContentWithIsLoadingMock: IContentWithIsLoading<
        ICobrandingContent | undefined
      > = {
        isContentLoading: false,
        content: rxGroupContentMock,
        fetchCMSContent: jest.fn(),
      };
      useContentMock.mockReturnValueOnce(rxGroupContentWithIsLoadingMock);

      const brokerAssociationContentWithIsLoadingMock: IContentWithIsLoading<
        ICobrandingContent | undefined
      > = {
        isContentLoading: false,
        content: brokerAssociationContentMock,
        fetchCMSContent: jest.fn(),
      };
      useContentMock.mockReturnValueOnce(
        brokerAssociationContentWithIsLoadingMock
      );

      const cobrandingContent = useCobrandingContent('cobranding-id');

      expect(cobrandingContent).toEqual(expectedContent);
    }
  );

  it('returns no cobranding content if content is undefined', () => {
    useContentMock.mockReturnValue(undefined);

    const cobrandingContent = useCobrandingContent('cobranding-id');

    expect(cobrandingContent).toEqual({});
  });
});
