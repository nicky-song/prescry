// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { BaseText } from '../../text/base-text/base-text';
import { RxIdBackContent } from './rx-id-back-content';
import { rxIdBackContentStyles as styles } from './rx-id-back-content.styles';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IRxIdBackContentCmsContent } from './rx-id-back-content.cms-content';
import { LineSeparator } from '../../member/line-separator/line-separator';

jest.mock('../../member/line-separator/line-separator', () => ({
  LineSeparator: () => <div />,
}));

jest.mock('../../member/heading/heading', () => ({
  Heading: () => <div />,
}));

jest.mock('../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

const contentMock: IRxIdBackContentCmsContent = {
  memberSince: 'member-since-mock',
  myrxURL: 'myrx-url-mock',
  membersTitle: 'members-title-mock',
  membersDescription: 'members-description-mock',
  claimsTitle: 'claims-title-mock',
  claimsDescription: 'claims-description',
  sendPrescriptionsInstruction: 'send-prescriptions-instruction',
  prescryptiveAddress: 'prescryptive-address',
};

const isContentLoadingMock = false;

describe('RxIdCardContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: isContentLoadingMock,
    });
  });

  it('renders as View with expected style', () => {
    const viewStyleMock = {};
    const memberSinceMock = '07/01/2022';

    const testRenderer = renderer.create(
      <RxIdBackContent
        memberSince={memberSinceMock}
        viewStyle={viewStyleMock}
      />
    );

    const parentView = testRenderer.root.children[0] as ReactTestInstance;

    expect(parentView.type).toEqual(View);
    expect(parentView.props.style).toEqual(viewStyleMock);
  });

  it('(1st) renders header View with memberSince text + myrxURL text', () => {
    const memberSinceMock = '07/01/2022';

    const testRenderer = renderer.create(
      <RxIdBackContent memberSince={memberSinceMock} />
    );

    const parentView = testRenderer.root.children[0] as ReactTestInstance;

    const headerView = getChildren(parentView)[0];

    expect(headerView.type).toEqual(View);
    expect(headerView.props.style).toEqual(styles.headerViewStyle);

    const memberSinceText = getChildren(headerView)[0];
    const myrxURLText = getChildren(headerView)[1];

    expect(memberSinceText.type).toEqual(BaseText);
    expect(memberSinceText.props.style).toEqual(styles.memberSinceTextStyle);
    expect(memberSinceText.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(memberSinceText.props.children).toEqual(
      `${contentMock.memberSince} ${memberSinceMock}`
    );

    expect(myrxURLText.type).toEqual(BaseText);
    expect(myrxURLText.props.style).toEqual(styles.myrxURLTextStyle);
    expect(myrxURLText.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(myrxURLText.props.children).toEqual(contentMock.myrxURL);
  });

  it('(2nd) renders LineSeparator', () => {
    const memberSinceMock = '07/01/2022';

    const testRenderer = renderer.create(
      <RxIdBackContent memberSince={memberSinceMock} />
    );

    const parentView = testRenderer.root.children[0] as ReactTestInstance;

    const lineSeparator = getChildren(parentView)[1];

    expect(lineSeparator.type).toEqual(LineSeparator);
    expect(lineSeparator.props.viewStyle).toEqual(
      styles.lineSeparatorViewStyle
    );
  });

  it('(3rd) renders member title text', () => {
    const memberSinceMock = '07/01/2022';

    const testRenderer = renderer.create(
      <RxIdBackContent memberSince={memberSinceMock} />
    );

    const parentView = testRenderer.root.children[0] as ReactTestInstance;

    const memberTitleText = getChildren(parentView)[2];

    expect(memberTitleText.type).toEqual(BaseText);
    expect(memberTitleText.props.style).toEqual(styles.membersTitleTextStyle);
    expect(memberTitleText.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(memberTitleText.props.children).toEqual(contentMock.membersTitle);
  });

  it('(4th) renders member description text', () => {
    const memberSinceMock = '07/01/2022';

    const testRenderer = renderer.create(
      <RxIdBackContent memberSince={memberSinceMock} />
    );

    const parentView = testRenderer.root.children[0] as ReactTestInstance;

    const memberDescriptionText = getChildren(parentView)[3];

    expect(memberDescriptionText.type).toEqual(BaseText);
    expect(memberDescriptionText.props.style).toEqual(
      styles.membersDescriptionTextStyle
    );
    expect(memberDescriptionText.props.isSkeleton).toEqual(
      isContentLoadingMock
    );
    expect(memberDescriptionText.props.children).toEqual(
      contentMock.membersDescription
    );
  });

  it('(5th) renders claims title text', () => {
    const memberSinceMock = '07/01/2022';

    const testRenderer = renderer.create(
      <RxIdBackContent memberSince={memberSinceMock} />
    );

    const parentView = testRenderer.root.children[0] as ReactTestInstance;

    const claimsTitleText = getChildren(parentView)[4];

    expect(claimsTitleText.type).toEqual(BaseText);
    expect(claimsTitleText.props.style).toEqual(styles.claimsTitleTextStyle);
    expect(claimsTitleText.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(claimsTitleText.props.children).toEqual(contentMock.claimsTitle);
  });

  it('(6th) renders claims description text', () => {
    const memberSinceMock = '07/01/2022';

    const testRenderer = renderer.create(
      <RxIdBackContent memberSince={memberSinceMock} />
    );

    const parentView = testRenderer.root.children[0] as ReactTestInstance;

    const claimsDescriptionText = getChildren(parentView)[5];

    expect(claimsDescriptionText.type).toEqual(BaseText);
    expect(claimsDescriptionText.props.style).toEqual(
      styles.claimsDescriptionTextStyle
    );
    expect(claimsDescriptionText.props.isSkeleton).toEqual(
      isContentLoadingMock
    );
    expect(claimsDescriptionText.props.children).toEqual(
      contentMock.claimsDescription
    );
  });

  it('(7th) renders send prescription instruction text', () => {
    const memberSinceMock = '07/01/2022';

    const testRenderer = renderer.create(
      <RxIdBackContent memberSince={memberSinceMock} />
    );

    const parentView = testRenderer.root.children[0] as ReactTestInstance;

    const sendPrescriptionsInstructionText = getChildren(parentView)[6];

    expect(sendPrescriptionsInstructionText.type).toEqual(BaseText);
    expect(sendPrescriptionsInstructionText.props.style).toEqual(
      styles.sendPrescriptionsInstructionTextStyle
    );
    expect(sendPrescriptionsInstructionText.props.isSkeleton).toEqual(
      isContentLoadingMock
    );
    expect(sendPrescriptionsInstructionText.props.children).toEqual(
      contentMock.sendPrescriptionsInstruction
    );
  });

  it('(8th) renders Prescryptive address text', () => {
    const memberSinceMock = '07/01/2022';

    const testRenderer = renderer.create(
      <RxIdBackContent memberSince={memberSinceMock} />
    );

    const parentView = testRenderer.root.children[0] as ReactTestInstance;

    const prescryptiveAddressText = getChildren(parentView)[7];

    expect(prescryptiveAddressText.type).toEqual(BaseText);
    expect(prescryptiveAddressText.props.style).toEqual(
      styles.prescryptiveAddressTextStyle
    );
    expect(prescryptiveAddressText.props.isSkeleton).toEqual(
      isContentLoadingMock
    );
    expect(prescryptiveAddressText.props.children).toEqual(
      contentMock.prescryptiveAddress
    );
  });
});
