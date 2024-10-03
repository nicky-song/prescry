// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ContactInfoPanel } from '../../../../../../components/member/panels/contact-info/contact-info.panel';
import { FaxPanel } from '../../../../../../components/member/panels/fax/fax.panel';
import { PaperClaimsPanel } from '../../../../../../components/member/panels/paper-claims/paper-claims.panel';
import { SectionView } from '../../../../../../components/primitives/section-view';
import { ICommunicationContent } from '../../../../../../models/cms-content/communication.content';
import { IPlanMemberSupportContent } from '../../../../../../models/cms-content/plan-member-support.content';
import { getChildren } from '../../../../../../testing/test.helper';
import { IConfigContext } from '../../../../context-providers/config/config.context';
import { useConfigContext } from '../../../../context-providers/config/use-config-context.hook';
import { useContent } from '../../../../context-providers/session/ui-content-hooks/use-content';
import {
  GuestExperienceConfig,
  IGuestExperienceConfig,
} from '../../../../guest-experience-config';
import { PlanMemberSupportSection } from './plan-member-support.section';
import { planMemberSupportSectionStyles } from './plan-member-support.section.styles';

jest.mock('../../../../context-providers/config/use-config-context.hook');
const useConfigContextMock = useConfigContext as jest.Mock;

jest.mock(
  '../../../../../../components/member/panels/contact-info/contact-info.panel',
  () => ({
    ContactInfoPanel: () => <div />,
  })
);

jest.mock(
  '../../../../../../components/member/panels/paper-claims/paper-claims.panel',
  () => ({
    PaperClaimsPanel: () => <div />,
  })
);

jest.mock('../../../../../../components/member/panels/fax/fax.panel', () => ({
  FaxPanel: () => <div />,
}));

jest.mock('../../../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

const planMemberSupportContentMock: IPlanMemberSupportContent = {
  title: 'title',
};

const uiContentMock: Partial<ICommunicationContent> = {
  supportPBMPhone: 'support-pbm-phone',
};

describe('PlanMemberSupportSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const configContextMock: IConfigContext = {
      configState: GuestExperienceConfig,
    };
    useConfigContextMock.mockReturnValue(configContextMock);
    useContentMock.mockReturnValueOnce({
      content: planMemberSupportContentMock,
      isContentLoading: false,
    });
    useContentMock.mockReturnValueOnce({
      content: uiContentMock,
      isContentLoading: false,
    });
  });

  it('renders as Section', () => {
    const testRenderer = renderer.create(<PlanMemberSupportSection />);

    const section = testRenderer.root.children[0] as ReactTestInstance;

    expect(section.type).toEqual(SectionView);
    expect(section.props.testID).toEqual('PlanMemberSupportSection');
    expect(getChildren(section).length).toEqual(3);
  });

  it('render Contact Info panel', () => {
    const memberSupportEmailMock = 'member-support-email';
    const configStateMock: IGuestExperienceConfig = {
      ...GuestExperienceConfig,
      memberSupportEmail: memberSupportEmailMock,
    };
    const configContextMock: IConfigContext = {
      configState: configStateMock,
    };
    useConfigContextMock.mockReturnValue(configContextMock);

    const testRenderer = renderer.create(<PlanMemberSupportSection />);

    const section = testRenderer.root.findByProps({
      testID: 'PlanMemberSupportSection',
    });
    const contactInfoPanel = getChildren(section)[0];

    expect(contactInfoPanel.type).toEqual(ContactInfoPanel);
    expect(contactInfoPanel.props.title).toEqual(
      planMemberSupportContentMock.title
    );
    expect(contactInfoPanel.props.email).toEqual(memberSupportEmailMock);
    expect(contactInfoPanel.props.phoneNumber).toEqual(
      uiContentMock.supportPBMPhone
    );
  });

  it('renders Contact Info Panel as null when isContentLoading', () => {
    useContentMock.mockReset();
    useContentMock.mockReturnValue({
      content: uiContentMock,
      isContentLoading: true,
    });
    const memberSupportEmailMock = 'member-support-email';
    const configStateMock: IGuestExperienceConfig = {
      ...GuestExperienceConfig,
      memberSupportEmail: memberSupportEmailMock,
    };
    const configContextMock: IConfigContext = {
      configState: configStateMock,
    };
    useConfigContextMock.mockReturnValue(configContextMock);

    const testRenderer = renderer.create(<PlanMemberSupportSection />);

    const section = testRenderer.root.findByProps({
      testID: 'PlanMemberSupportSection',
    });
    const contactInfoPanel = getChildren(section)[0];

    expect(contactInfoPanel).toBeNull();
  });

  it('renders Paper Claims panel', () => {
    const testRenderer = renderer.create(<PlanMemberSupportSection />);

    const section = testRenderer.root.findByProps({
      testID: 'PlanMemberSupportSection',
    });
    const paperClaimsPanel = getChildren(section)[1];

    expect(paperClaimsPanel.type).toEqual(PaperClaimsPanel);
    expect(paperClaimsPanel.props.viewStyle).toEqual(
      planMemberSupportSectionStyles.panelViewStyle
    );
  });

  it('renders FAX panel', () => {
    const testRenderer = renderer.create(<PlanMemberSupportSection />);

    const section = testRenderer.root.findByProps({
      testID: 'PlanMemberSupportSection',
    });
    const faxPanel = getChildren(section)[2];

    expect(faxPanel.type).toEqual(FaxPanel);
    expect(faxPanel.props.viewStyle).toEqual(
      planMemberSupportSectionStyles.panelViewStyle
    );
  });
});
