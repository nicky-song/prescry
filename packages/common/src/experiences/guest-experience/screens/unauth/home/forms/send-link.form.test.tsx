// Copyright 2021 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import renderer from 'react-test-renderer';
import { SendLinkForm } from './send-link.form';
import { View, ViewStyle } from 'react-native';
import { sendLinkFormStyles } from './send-link.form.styles';
import { PhoneMaskInput } from '../../../../../../components/inputs/masked/phone/phone.mask.input';
import { BaseButton } from '../../../../../../components/buttons/base/base.button';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { getChildren } from '../../../../../../testing/test.helper';
import { InlineLink } from '../../../../../../components/member/links/inline/inline.link';
import { ISessionContext } from '../../../../context-providers/session/session.context';
import { useSessionContext } from '../../../../context-providers/session/use-session-context.hook';
import { defaultSessionState } from '../../../../state/session/session.state';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));

jest.mock(
  '../../../../../../components/inputs/masked/phone/phone.mask.input',
  () => ({
    PhoneMaskInput: () => <div />,
  })
);

jest.mock('../../../../../../components/primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

jest.mock('../../../../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

const sendLinkLabelMock = 'send-link-label-mock';
const resendLinkLabelMock = 'resend-link-label-mock';
const getLinkLabelMock = 'get-link-label-mock';

describe('SendLinkForm', () => {
  const phoneNumber = '';
  const setPhoneNumber = jest.fn();
  beforeEach(() => {
    useStateMock.mockReset();
    useStateMock.mockReturnValue([phoneNumber, setPhoneNumber]);
    useEffectMock.mockReset();
    useEffectMock.mockImplementation((f) => f);
    const sesssionContextMock: ISessionContext = {
      sessionDispatch: jest.fn(),
      sessionState: defaultSessionState,
    };
    useSessionContextMock.mockReturnValue(sesssionContextMock);
  });

  it('should have phone input form when text has not been sent', () => {
    const customViewStyle: ViewStyle = { width: 1 };
    const testRenderer = renderer.create(
      <SendLinkForm
        textSent={false}
        viewStyle={customViewStyle}
        sendLinkLabel={sendLinkLabelMock}
      />
    );

    const form = testRenderer.root.findAllByType(View, {
      deep: false,
    })[0];

    expect(form.props.style).toEqual([
      sendLinkFormStyles.containerViewStyle,
      customViewStyle,
    ]);

    const formChildren = getChildren(form);
    expect(formChildren.length).toEqual(2);

    const phoneInput = formChildren[0];
    expect(phoneInput.type).toEqual(PhoneMaskInput);
    expect(phoneInput.props.phoneNumber).toEqual(phoneNumber);
    expect(phoneInput.props.viewStyle).toEqual(
      sendLinkFormStyles.phoneInputViewStyle
    );

    const sendButton = formChildren[1];
    expect(sendButton.type).toEqual(BaseButton);
    expect(sendButton.props.disabled).toEqual(true);
    expect(sendButton.props.onPress).toEqual(expect.any(Function));
    expect(sendButton.props.viewStyle).toEqual(
      sendLinkFormStyles.sendLinkButtonViewStyle
    );
    expect(sendButton.props.children).toEqual(sendLinkLabelMock);
  });

  it('should have Didnt get a link? message when text has been sent', () => {
    const testRenderer = renderer.create(
      <SendLinkForm
        textSent={true}
        getLinkLabel={getLinkLabelMock}
        resendLinkLabel={resendLinkLabelMock}
      />
    );
    const text = testRenderer.root.findAllByType(BaseText, {
      deep: false,
    })[0];

    expect(text.props.style).toEqual(sendLinkFormStyles.getALinkTextStyle);
    expect(getChildren(text).length).toEqual(3);

    const labelContent = getChildren(text)[0];
    expect(labelContent).toEqual(getLinkLabelMock);

    const spacer = getChildren(text)[1];
    expect(spacer).toEqual(' ');

    const resendLink = getChildren(text)[2];
    expect(resendLink.type).toEqual(InlineLink);
    expect(resendLink.props.onPress).toEqual(expect.any(Function));
    expect(resendLink.props.children).toEqual(resendLinkLabelMock);
  });

  it('onSendRegistrationTextRequest is called with expected args', () => {
    const mockonSendRegistrationTextRequest = jest.fn();
    const mockPhoneNumber = '1234567890';
    useStateMock.mockReturnValue([mockPhoneNumber, setPhoneNumber]);
    const testRenderer = renderer.create(
      <SendLinkForm
        textSent={false}
        onSendRegistrationTextRequest={mockonSendRegistrationTextRequest}
      />
    );
    const form = testRenderer.root.findAllByType(View, {
      deep: false,
    })[0];

    form.props.children[1].props.onPress();
    expect(mockonSendRegistrationTextRequest).toHaveBeenCalledWith(
      mockPhoneNumber
    );
  });

  it('onPhoneNumberChange is called with expected args', () => {
    const mockonSendRegistrationTextRequest = jest.fn();
    const mockPhoneNumber = '1234567890';
    const mockInputNumber = '3455';
    useStateMock.mockReturnValue([mockPhoneNumber, setPhoneNumber]);
    const testRenderer = renderer.create(
      <SendLinkForm
        textSent={false}
        onSendRegistrationTextRequest={mockonSendRegistrationTextRequest}
      />
    );
    const form = testRenderer.root.findAllByType(View, {
      deep: false,
    })[0];

    expect(form.props.children[0].props.phoneNumber).toEqual(mockPhoneNumber);
    form.props.children[0].props.onPhoneNumberChange(mockInputNumber);
    expect(setPhoneNumber).toHaveBeenCalledWith(mockInputNumber);
  });

  it('use useEffect and calls setPhoneNumber as expected', () => {
    const mockPhoneNumber = '1234567890';
    const mockSetPhoneNumber = jest.fn();
    const mockUserNumber = '222';
    useStateMock.mockReturnValue([mockPhoneNumber, mockSetPhoneNumber]);
    renderer.create(
      <SendLinkForm textSent={false} userNumber={mockUserNumber} />
    );

    expect(useEffectMock).toHaveBeenCalledTimes(1);
    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();
    expect(mockSetPhoneNumber).toHaveBeenLastCalledWith(mockUserNumber);
  });

  it('should render skeleton when isSkeleton is true', () => {
    const customViewStyle: ViewStyle = { width: 1 };
    const testRenderer = renderer.create(
      <SendLinkForm
        textSent={false}
        viewStyle={customViewStyle}
        isSkeleton={true}
      />
    );

    const form = testRenderer.root.findAllByType(View, {
      deep: false,
    })[0];

    const formChildren = getChildren(form);

    const sendButton = formChildren[1];
    expect(sendButton.type).toEqual(BaseButton);
    expect(sendButton.props.isSkeleton).toEqual(true);
  });

  it('should render skeleton when text has been sent and isSkeleton ', () => {
    const testRenderer = renderer.create(
      <SendLinkForm textSent={true} isSkeleton={true} />
    );
    const text = testRenderer.root.findAllByType(BaseText, {
      deep: false,
    })[0];

    expect(text.props.isSkeleton).toEqual(true);
  });
});
