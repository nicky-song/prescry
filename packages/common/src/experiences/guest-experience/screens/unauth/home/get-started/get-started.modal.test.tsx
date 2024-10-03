// Copyright 2021 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import renderer from 'react-test-renderer';
import { View } from 'react-native';
import { GetStartedModal } from './get-started.modal';
import { getStartedModalStyles } from './get-started.modal.styles';
import { SendLinkForm } from '../forms/send-link.form';
import { DialogModal } from '../../../../../../components/modal/dialog-modal/dialog-modal';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { getChildren } from '../../../../../../testing/test.helper';
import { LineSeparator } from '../../../../../../components/member/line-separator/line-separator';
import { ImageAsset } from '../../../../../../components/image-asset/image-asset';
import { ISessionContext } from '../../../../context-providers/session/session.context';
import { useSessionContext } from '../../../../context-providers/session/use-session-context.hook';
import { InlineLink } from '../../../../../../components/member/links/inline/inline.link';
import { GuestExperienceConfig } from '../../../../guest-experience-config';
import { sendRegistrationText } from '../../../../api/api-v1.send-registration-text';
import { defaultSessionState } from '../../../../state/session/session.state';
import { ErrorInternalServer } from '../../../../../../errors/error-internal-server';
import { ErrorBadRequest } from '../../../../../../errors/error-bad-request';
import { ErrorConstants } from '../../../../../../theming/constants';
import { APITypes } from '../../../../../../experiences/guest-experience/api/api-v1-helper';
import { goToUrl } from '../../../../../../utils/link.helper';
import { useContent } from '../../../../context-providers/session/ui-content-hooks/use-content';
import { uiContentMock } from '../../../../__mocks__/ui-content.mock';
import { defaultLanguage } from '../../../../../../models/language';
import { IGetStartedModalContent } from '../../../../../../models/cms-content/desktop-modal-ui-content.model';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useStateMock = useState as jest.Mock;

jest.mock('../../../../api/api-v1.send-registration-text', () => ({
  sendRegistrationText: jest.fn(() => ({
    status: 'success',
  })),
}));
const sendRegistrationTextMock = sendRegistrationText as jest.Mock;

jest.mock('../../../../guest-experience-config', () => ({
  GuestExperienceConfig: { apis: {} },
}));

jest.mock('../../../../guest-experience-logger.middleware', () => ({
  guestExperienceCustomEventLogger: jest.fn(),
  CustomAppInsightEvents: { USER_SENT_CODE: '' },
}));

jest.mock(
  '../../../../../../components/modal/dialog-modal/dialog-modal',
  () => ({
    DialogModal: () => <div />,
  })
);

jest.mock('../../../../../../components/primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

jest.mock('../../../../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock('../../../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock('../../../../../../utils/link.helper');
const gotToUrlMock = goToUrl as jest.Mock;

const fetchCMSContentMock = jest.fn();

describe('GetStartedModal', () => {
  beforeEach(() => {
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([
      { errorStatus: false, errorMessage: '' },
      jest.fn(),
    ]);
    useStateMock.mockReturnValueOnce(['', jest.fn()]);

    const sessionContextMock: ISessionContext = {
      sessionDispatch: jest.fn(),
      sessionState: defaultSessionState,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);

    useContentMock.mockReturnValue({
      content: uiContentMock,
      isContentLoading: false,
      fetchCMSContent: fetchCMSContentMock,
    });
  });

  it('should have DialogModal as root component with expected properties', () => {
    const showMock = false;
    const onHideMock = jest.fn();
    const textSentMock = false;
    const onTextSentMock = jest.fn();
    const testRenderer = renderer.create(
      <GetStartedModal
        show={showMock}
        onHide={onHideMock}
        textSent={textSentMock}
        onTextSent={onTextSentMock}
        path=''
      />
    );
    const modal = testRenderer.root.findByType(DialogModal);
    expect(modal.props.isOpen).toEqual(showMock);
    expect(modal.props.onClose).toEqual(expect.any(Function));
    expect(modal.props.viewStyle).toEqual(
      getStartedModalStyles.pageModalViewStyle
    );
  });

  it('useEffects are called with the correct parameters', () => {
    renderer.create(<GetStartedModal path='' />);
    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), [
      'English',
    ]);
  });

  it('should have proper header', () => {
    const contentMock: Partial<IGetStartedModalContent> = {
      getStarted: 'get-started',
    };
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: false,
    });

    const testRenderer = renderer.create(<GetStartedModal path='' />);

    const modal = testRenderer.root.findByType(DialogModal);
    const header = modal.props.header;

    expect(header.type).toEqual(BaseText);
    expect(header.props.testID).toEqual('getStartedModalLongTitle');
    expect(header.props.style).toEqual(getStartedModalStyles.headingTextStyle);
    expect(header.props.children).toEqual(contentMock.getStarted);
  });

  it.each([[undefined], [true]])(
    'should have proper body (textSent %p)',
    (textSentMock?: boolean) => {
      const contentMock: Partial<IGetStartedModalContent> = {
        enterMobile: 'enter-mobile',
        myrxMobileExperience: 'myrx-mobile-experience',
        yourNumberIsLogin: 'your-number-is-login',
        sentMessage: 'sent-message-mock',
      };
      useContentMock.mockReturnValue({
        content: contentMock,
        isContentLoading: false,
      });

      const testRenderer = renderer.create(
        <GetStartedModal path='' textSent={textSentMock} />
      );
      const modal = testRenderer.root.findByType(DialogModal);
      const body = modal.props.body;
      expect(body.type).toEqual(View);

      const initialParagraphContainer = getChildren(body)[0];
      expect(initialParagraphContainer.type).toEqual(View);
      expect(getChildren(initialParagraphContainer).length).toEqual(2);

      const enterMobileParagraph = getChildren(initialParagraphContainer)[0];
      expect(enterMobileParagraph.type).toEqual(BaseText);
      expect(enterMobileParagraph.props.style).toEqual(
        getStartedModalStyles.paragraphTextStyle
      );

      if (textSentMock) {
        expect(getChildren(enterMobileParagraph).length).toEqual(5);
        const sentMessageText = getChildren(enterMobileParagraph)[0];
        expect(sentMessageText).toEqual(contentMock.sentMessage);
        expect(getChildren(enterMobileParagraph)[1]).toEqual(' ');
      } else {
        expect(getChildren(enterMobileParagraph).length).toEqual(3);
        const enterMobileText = getChildren(enterMobileParagraph)[0];
        expect(enterMobileText.type).toEqual(BaseText);
        expect(enterMobileText.props.inheritStyle).toEqual(true);
        expect(enterMobileText.props.style).toEqual(
          getStartedModalStyles.strongTextStyle
        );
        expect(enterMobileText.props.children).toEqual(contentMock.enterMobile);

        expect(getChildren(enterMobileParagraph)[1]).toEqual(' ');
        const myRxMobilExperienceContent = getChildren(enterMobileParagraph)[2];
        expect(myRxMobilExperienceContent).toEqual(
          contentMock.myrxMobileExperience
        );

        const yourNumberIsLoginText = getChildren(initialParagraphContainer)[1];
        expect(yourNumberIsLoginText.type).toEqual(BaseText);
        expect(yourNumberIsLoginText.props.style).toEqual(
          getStartedModalStyles.paragraphTextStyle
        );
        expect(yourNumberIsLoginText.props.children).toEqual(
          contentMock.yourNumberIsLogin
        );
      }

      const error = getChildren(body)[2];
      expect(error.type).toEqual(View);
      expect(error.props.children).toBeNull();
    }
  );

  it('renders send link form', () => {
    const isTextSentMock = true;

    const testRenderer = renderer.create(
      <GetStartedModal textSent={isTextSentMock} path='' />
    );
    const modal = testRenderer.root.findByType(DialogModal);
    const body = modal.props.body;

    const form = getChildren(body)[1];

    expect(form.type).toEqual(SendLinkForm);
    expect(form.props.onSendRegistrationTextRequest).toEqual(
      expect.any(Function)
    );
    expect(form.props.textSent).toEqual(isTextSentMock);
    expect(form.props.viewStyle).toEqual(getStartedModalStyles.formViewStyle);
  });

  it('calls onTextSent ', async () => {
    useStateMock.mockReset();
    const setErrorMock = jest.fn();
    const setPhoneMock = jest.fn();
    useStateMock.mockReturnValueOnce([
      { errorStatus: false, errorMessage: '' },
      setErrorMock,
    ]);
    useStateMock.mockReturnValueOnce(['', setPhoneMock]);
    const userNumber = '12345678';
    const showMock = true;
    const onHideMock = jest.fn();
    const textSentMock = false;
    const onTextSentMock = jest.fn();
    const pathMock = 'path';

    const testRenderer = renderer.create(
      <GetStartedModal
        show={showMock}
        onHide={onHideMock}
        textSent={textSentMock}
        onTextSent={onTextSentMock}
        path={pathMock}
      />
    );

    const modal = testRenderer.root.findByType(DialogModal);
    const body = modal.props.body;
    const form = getChildren(body)[1];

    await form.props.onSendRegistrationTextRequest(userNumber);

    expect(sendRegistrationTextMock).toHaveBeenCalledWith(
      GuestExperienceConfig.apis.guestExperienceApi,
      userNumber,
      defaultSessionState.currentLanguage,
      pathMock
    );

    expect(setPhoneMock).toHaveBeenCalledWith(userNumber);
    expect(setErrorMock).toHaveBeenCalledWith({
      errorStatus: false,
      errorMessage: '',
    });
    expect(onTextSentMock).toHaveBeenCalledWith(true);
  });

  it('shows invalid number error on calls to onTextSent with BadRequest raised', async () => {
    const contentMock: Partial<IGetStartedModalContent> = {
      smsErrorInvalidNumber: 'sms-error-invalid-number',
    };
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: false,
    });

    useStateMock.mockReset();
    const setErrorMock = jest.fn();
    const setPhoneMock = jest.fn();
    useStateMock.mockReturnValueOnce([
      { errorStatus: false, errorMessage: '' },
      setErrorMock,
    ]);
    useStateMock.mockReturnValueOnce(['', setPhoneMock]);
    const userNumber = '12345678';
    const showMock = true;
    const onHideMock = jest.fn();
    const textSentMock = false;
    const onTextSentMock = jest.fn();
    const pathMock = 'path';
    sendRegistrationTextMock.mockImplementationOnce(() => {
      throw new ErrorBadRequest(ErrorConstants.errorBadRequest);
    });
    const testRenderer = renderer.create(
      <GetStartedModal
        show={showMock}
        onHide={onHideMock}
        textSent={textSentMock}
        onTextSent={onTextSentMock}
        path={pathMock}
      />
    );

    const modal = testRenderer.root.findByType(DialogModal);
    const body = modal.props.body;
    const form = getChildren(body)[1];

    await form.props.onSendRegistrationTextRequest(userNumber);

    expect(sendRegistrationTextMock).toHaveBeenCalledWith(
      GuestExperienceConfig.apis.guestExperienceApi,
      userNumber,
      defaultSessionState.currentLanguage,
      pathMock
    );

    expect(setPhoneMock).toHaveBeenCalledTimes(0);
    expect(setErrorMock).toHaveBeenCalledWith({
      errorMessage: contentMock.smsErrorInvalidNumber,
      errorStatus: true,
    });
    expect(onTextSentMock).toHaveBeenCalledTimes(0);
  });

  it('shows service unavailable error on calls to onTextSent with ErrorInternalServer raised', async () => {
    const contentMock: Partial<IGetStartedModalContent> = {
      smsErrorSeriviceUnavailable: 'sms-error-service-unavailable',
    };
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: false,
    });

    useStateMock.mockReset();
    const setErrorMock = jest.fn();
    const setPhoneMock = jest.fn();
    useStateMock.mockReturnValueOnce([
      { errorStatus: false, errorMessage: '' },
      setErrorMock,
    ]);
    useStateMock.mockReturnValueOnce(['', setPhoneMock]);
    const userNumber = '12345678';
    const showMock = true;
    const onHideMock = jest.fn();
    const textSentMock = false;
    const onTextSentMock = jest.fn();
    const pathMock = 'path';
    sendRegistrationTextMock.mockImplementation(() => {
      throw new ErrorInternalServer(
        ErrorConstants.errorInternalServer(),
        APITypes.SEND_REGISTRATION_TEXT
      );
    });

    const testRenderer = renderer.create(
      <GetStartedModal
        show={showMock}
        onHide={onHideMock}
        textSent={textSentMock}
        onTextSent={onTextSentMock}
        path={pathMock}
      />
    );

    const modal = testRenderer.root.findByType(DialogModal);
    const body = modal.props.body;
    const form = getChildren(body)[1];

    await form.props.onSendRegistrationTextRequest(userNumber);

    expect(sendRegistrationTextMock).toHaveBeenCalledWith(
      GuestExperienceConfig.apis.guestExperienceApi,
      userNumber,
      defaultSessionState.currentLanguage,
      pathMock
    );

    expect(setPhoneMock).toHaveBeenCalledTimes(0);
    expect(setErrorMock).toHaveBeenCalledWith({
      errorMessage: contentMock.smsErrorSeriviceUnavailable,
      errorStatus: true,
    });
    expect(onTextSentMock).toHaveBeenCalledTimes(0);
  });

  it('renders "Have questions" paragraph', async () => {
    const contentMock: Partial<IGetStartedModalContent> = {
      haveQuestions: 'have-questions',
      email: 'email',
    };
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: false,
    });

    const testRenderer = renderer.create(<GetStartedModal path='' />);
    const modal = testRenderer.root.findByType(DialogModal);
    const body = modal.props.body;

    const haveQuestionsParagraph = getChildren(body)[3];
    expect(haveQuestionsParagraph.type).toEqual(BaseText);
    expect(haveQuestionsParagraph.props.style).toEqual(
      getStartedModalStyles.haveQuestionsParagraphTextStyle
    );

    const paragraphChildren = getChildren(haveQuestionsParagraph);
    expect(paragraphChildren.length).toEqual(3);

    const haveQuestionsContent = paragraphChildren[0];
    expect(haveQuestionsContent).toEqual(contentMock.haveQuestions);

    expect(paragraphChildren[1]).toEqual(' ');

    const link = paragraphChildren[2];
    expect(link.type).toEqual(InlineLink);
    expect(link.props.onPress).toEqual(expect.any(Function));
    expect(link.props.children).toEqual(contentMock.email);

    await link.props.onPress();

    expect(gotToUrlMock).toHaveBeenCalledWith(`mailto:${contentMock.email}`);
  });

  it('renders footer container', () => {
    const testRenderer = renderer.create(<GetStartedModal path='' />);

    const modal = testRenderer.root.findByType(DialogModal);
    const footerContainer = modal.props.footer;

    expect(footerContainer.type).toEqual(View);
    expect(footerContainer.props.style).toEqual(
      getStartedModalStyles.footerViewStyle
    );
    expect(footerContainer.props.testID).toEqual('getStartedModalFooter');
    expect(getChildren(footerContainer).length).toEqual(2);
  });

  it('renders footer line separator', () => {
    const testRenderer = renderer.create(<GetStartedModal path='' />);

    const modal = testRenderer.root.findByType(DialogModal);
    const footerContainer = modal.props.footer;
    const lineSeparator = getChildren(footerContainer)[0];

    expect(lineSeparator.type).toEqual(LineSeparator);
    expect(lineSeparator.props.viewStyle).toEqual(
      getStartedModalStyles.lineSeparatorViewStyle
    );
  });

  it('renders footer image', () => {
    const testRenderer = renderer.create(<GetStartedModal path='' />);

    const modal = testRenderer.root.findByType(DialogModal);
    const footerContainer = modal.props.footer;
    const imageAsset = getChildren(footerContainer)[1];

    expect(imageAsset.type).toEqual(ImageAsset);
    expect(imageAsset.props.name).toEqual('poweredByPrescryptivePurple120');
    expect(imageAsset.props.resizeMode).toEqual('contain');
    expect(imageAsset.props.style).toEqual(
      getStartedModalStyles.footerImageStyle
    );
  });

  it('should render skeleton when isContentLoading is true', () => {
    const contentMock: Partial<IGetStartedModalContent> = {
      getStarted: 'get-started',
    };
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: true,
    });

    const testRenderer = renderer.create(<GetStartedModal path='' />);

    const modal = testRenderer.root.findByType(DialogModal);
    const header = modal.props.header;

    expect(header.type).toEqual(BaseText);
    expect(header.props.isSkeleton).toEqual(true);

    const body = modal.props.body;
    expect(body.type).toEqual(View);

    const initialParagraphContainer = getChildren(body)[0];

    const enterMobileParagraph = getChildren(initialParagraphContainer)[0];
    expect(enterMobileParagraph.type).toEqual(BaseText);
    expect(enterMobileParagraph.props.isSkeleton).toEqual(true);

    const enterMobileText = getChildren(enterMobileParagraph)[0];
    expect(enterMobileText.type).toEqual(BaseText);
    expect(enterMobileText.props.isSkeleton).toEqual(true);

    const yourNumberIsLoginText = getChildren(initialParagraphContainer)[1];
    expect(yourNumberIsLoginText.type).toEqual(BaseText);
    expect(enterMobileText.props.isSkeleton).toEqual(true);
  });

  it('call Strapi API to get content when language changes', () => {
    const contentMock: Partial<IGetStartedModalContent> = {
      getStarted: 'get-started',
    };
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: false,
      fetchCMSContent: fetchCMSContentMock,
    });

    renderer.create(<GetStartedModal path='' />);

    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    expect(fetchCMSContentMock).toHaveBeenCalledWith(defaultLanguage);
  });
});
