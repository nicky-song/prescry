// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { ContactInfoPanel } from '../../../../../../components/member/panels/contact-info/contact-info.panel';
import { FaxPanel } from '../../../../../../components/member/panels/fax/fax.panel';
import { PaperClaimsPanel } from '../../../../../../components/member/panels/paper-claims/paper-claims.panel';
import { SectionView } from '../../../../../../components/primitives/section-view';
import { ICommunicationContent } from '../../../../../../models/cms-content/communication.content';
import { IPlanMemberSupportContent } from '../../../../../../models/cms-content/plan-member-support.content';
import { useConfigContext } from '../../../../context-providers/config/use-config-context.hook';
import { useContent } from '../../../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { planMemberSupportSectionStyles } from './plan-member-support.section.styles';

export const PlanMemberSupportSection = (): ReactElement => {
  const planMemberSupportGroupKey = CmsGroupKey.planMemberSupport;
  const { content: planMemberSupportContent } =
    useContent<IPlanMemberSupportContent>(planMemberSupportGroupKey, 2);

  const { configState } = useConfigContext();
  const { memberSupportEmail } = configState;

  const groupKey = CmsGroupKey.communication;
  const { content: communicationContent, isContentLoading } =
    useContent<ICommunicationContent>(
      groupKey,
      2,
      undefined,
      true
    );

  const contactInfoPanel =
    communicationContent && !isContentLoading ? (
      <ContactInfoPanel
        title={planMemberSupportContent.title}
        email={memberSupportEmail}
        phoneNumber={communicationContent?.supportPBMPhone}
      />
    ) : null;

  return (
    <SectionView testID='PlanMemberSupportSection'>
      {contactInfoPanel}
      <PaperClaimsPanel
        viewStyle={planMemberSupportSectionStyles.panelViewStyle}
      />
      <FaxPanel viewStyle={planMemberSupportSectionStyles.panelViewStyle} />
    </SectionView>
  );
};
