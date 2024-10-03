// Copyright 2021 Prescryptive Health, Inc.

import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { Heading } from '../../../../../components/member/heading/heading';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { Workflow } from '../../../../../models/workflow';
import { IReduxContext } from '../../../context-providers/redux/redux.context';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { sendOneTimeVerificationCodeAsyncAction } from '../../../state/drug-search/async-actions/send-one-time-verification-code.async-action';
import { CreateAccountBody } from './create-account.body';
import {
  CreateAccountErrorType,
  CreateAccountScreen,
  ICreateAccountScreenRouteProps,
} from './create-account.screen';
import { createAccountScreenStyles } from './create-account.screen.styles';
import { phoneNumberLoginNavigateDispatch } from '../../../store/navigation/dispatch/sign-in/phone-number-login-navigate.dispatch';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { getChildren } from '../../../../../testing/test.helper';
import { InlineLink } from '../../../../../components/member/links/inline/inline.link';
import { ITestContainer } from '../../../../../testing/test.container';
import {
  createMemberAccountAsyncAction,
  ICreateMemberAccountAsyncActionArgs,
} from '../../../store/create-account/async-actions/create-member-account.async-action';
import { MarkdownText } from '../../../../../components/text/markdown-text/markdown-text';
import { IGuestExperienceConfig } from '../../../guest-experience-config';
import { RootState } from '../../../store/root-reducer';
import {
  differenceInYear,
  UTCDate,
} from '../../../../../utils/date-time-helper';
import {
  createAccountDeviceTokenAsyncAction,
  ICreateAccountDeviceTokenAsyncActionArgs,
} from '../../../store/create-account/async-actions/create-account-with-device-token.async-action';
import { getNewDate } from '../../../../../utils/date-time/get-new-date';
import { SmsNotSupportedError } from '../../../../../errors/sms-not-supported.error';
import dateFormatter from '../../../../../utils/formatters/date.formatter';
import { useNavigation, useRoute } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { callPhoneNumber } from '../../../../../utils/link.helper';
import { verifyPrescriptionAsyncAction } from '../../../store/create-account/async-actions/verify-prescription.async-action';
import { shallow } from 'enzyme';
import { ErrorUserDataMismatch } from '../../../../../errors/error-data-mismatch-create-account';
import { navigationBackEnabled } from '../../../../../utils/navigation-back-enabled.helper';
import { ErrorActivationRecordMismatch } from '../../../../../errors/error-activation-record-mismatch';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { useAccountAndFamilyContext } from '../../../context-providers/account-and-family/use-account-and-family-context.hook';
import { PrescriptionPersonSelection } from '../../../state/account-and-family/account-and-family.state';
import { ISignUpContent } from '../../../../../models/cms-content/sign-up.ui-content';
import { ICommunicationContent } from '../../../../../models/cms-content/communication.content';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useRef: jest.fn(),
  useEffect: jest.fn(),
}));
const useStateMock = useState as jest.Mock;
const useRefMock = useRef as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

jest.mock('../../../../../utils/date-time-helper');
const UTCDateMock = UTCDate as jest.Mock;
const differenceInYearMock = differenceInYear as jest.Mock;

jest.mock(
  '../../../context-providers/account-and-family/use-account-and-family-context.hook'
);
const useAccountAndFamilyContextMock = useAccountAndFamilyContext as jest.Mock;

jest.mock('../../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('../../../../../components/text/markdown-text/markdown-text', () => ({
  MarkdownText: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('../../../../../components/member/links/inline/inline.link', () => ({
  InlineLink: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock(
  '../../../store/navigation/dispatch/sign-in/phone-number-login-navigate.dispatch'
);
const phoneLoginNavigateDispatchMock =
  phoneNumberLoginNavigateDispatch as jest.Mock;

jest.mock(
  '../../../store/create-account/async-actions/create-account-with-device-token.async-action'
);
const createAccountDeviceTokenAsyncActionMock =
  createAccountDeviceTokenAsyncAction as jest.Mock;

jest.mock(
  '../../../state/drug-search/async-actions/send-one-time-verification-code.async-action'
);
const sendOneTimeVerificationCodeAsyncActionMock =
  sendOneTimeVerificationCodeAsyncAction as jest.Mock;

jest.mock(
  '../../../store/create-account/async-actions/create-member-account.async-action'
);
const createMemberAccountAsyncActionMock =
  createMemberAccountAsyncAction as jest.Mock;

jest.mock('../../../../../utils/formatters/date.formatter', () => ({
  firefoxCompatibleDateFormat: jest.fn(),
}));
const firefoxCompatibleDateFormatMock =
  dateFormatter.firefoxCompatibleDateFormat as jest.Mock;

jest.mock('./create-account.body', () => ({
  CreateAccountBody: () => <div />,
}));

jest.mock('../../../../../utils/link.helper');
const callPhoneNumberMock = callPhoneNumber as jest.Mock;

jest.mock('../../../../../utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

const defaultReduxState: Partial<RootState> = {
  config: { childMemberAgeLimit: 13 } as IGuestExperienceConfig,
};

const getReduxStateMock = jest.fn();

jest.mock(
  '../../../store/create-account/async-actions/verify-prescription.async-action'
);
const verifyPrescriptionAsyncActionMock =
  verifyPrescriptionAsyncAction as jest.Mock;

jest.mock('../../../../../utils/navigation-back-enabled.helper');
const navigationBackEnabledMock = navigationBackEnabled as jest.Mock;

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('../../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

const unknownErrorTypePrefix = 'unknown-error-type-mock';

const uiContentMock: Partial<ISignUpContent> = {
  accountNotFoundError: 'account-not-found-error-mock',
  haveAccountHelpText: 'have-account-help-text-mock',
  smsNotSupported: 'sms-not-supported-mock',
  dataMismatchError: 'data-mismatch-error-mock',
  activationPersonMismatchError: 'activation-person-mismatch-error-mock',
  emailErrorMessage: 'email-error-message-mock',
  createAccountHeader: 'create-account-header-mock',
  pbmMemberInstructions: 'pbm-member-instructions-mock',
  createAccountInstructions: 'create-account-instructions-mock',
  continueButton: 'continue-button-mock',
  unknownErrorType: unknownErrorTypePrefix + '{errorType}',
  prescriptionPersonTitle: 'prescription-person-title',
  prescriptionPersonInstructions: 'prescription-person-instructions',
};

const communicationUIContentMock: Partial<ICommunicationContent> = {
  supportCashPhone: 'support-cash-phone-mock',
  supportPBMPhone: 'support-pbm-phone-mock',
};

const isDependentMock = false;
const setAcceptedAttestAuthorizationMock = jest.fn();

describe('CreateAccountScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const reduxContextMock: IReduxContext = {
      dispatch: jest.fn(),
      getState: jest.fn().mockReturnValue(defaultReduxState),
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    differenceInYearMock.mockReturnValue(70);
    const nowMock = new Date();
    getNewDateMock.mockReturnValue(nowMock);
    stateReset({});
    getReduxStateMock.mockReturnValue({ features: {} });

    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useRouteMock.mockReturnValue({ params: {} });
    navigationBackEnabledMock.mockReturnValue(true);
    useContentMock.mockReturnValueOnce({
      content: uiContentMock,
      isContentLoading: false,
    });
    useContentMock.mockReturnValueOnce({
      content: communicationUIContentMock,
      isContentLoading: false,
    });
    useAccountAndFamilyContextMock.mockReturnValue({
      accountAndFamilyState: { prescriptionPersonSelection: 'self' },
    });
  });

  it.each([
    [undefined, undefined],
    ['123.456.7890', 'noAccountWithUs'],
    ['123.456.7890', 'userDataMismatch'],
  ])(
    'initializes state (initial phone number: %p; errorType: %p)',
    (
      initialPhoneNumberMock: undefined | string,
      errorType: undefined | string
    ) => {
      useRouteMock.mockReturnValue({
        params: {
          workflow: 'startSaving',
          phoneNumber: initialPhoneNumberMock,
          errorType: errorType as CreateAccountErrorType,
          isDependent: isDependentMock,
        },
      });
      renderer.create(<CreateAccountScreen />);

      expect(useStateMock).toHaveBeenCalledTimes(10);
      expect(useStateMock).toHaveBeenNthCalledWith(1, '');
      expect(useStateMock).toHaveBeenNthCalledWith(2, '');
      expect(useStateMock).toHaveBeenNthCalledWith(3, '');
      expect(useStateMock).toHaveBeenNthCalledWith(
        4,
        initialPhoneNumberMock ?? ''
      );
      expect(useStateMock).toHaveBeenNthCalledWith(5, '');
      expect(useStateMock).toHaveBeenNthCalledWith(6, '');
      expect(useStateMock).toHaveBeenNthCalledWith(
        7,
        !!initialPhoneNumberMock && errorType === 'noAccountWithUs'
      );
      expect(useStateMock).toHaveBeenNthCalledWith(8, '');
      expect(useStateMock).toHaveBeenNthCalledWith(9, false);
    }
  );

  it('has expected number of effect handlers', () => {
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'startSaving',
      },
    });
    renderer.create(<CreateAccountScreen />);

    expect(useEffectMock).toHaveBeenCalledTimes(2);
  });

  it('has expected number of references', () => {
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'startSaving',
      },
    });
    renderer.create(<CreateAccountScreen />);

    expect(useRefMock).toHaveBeenCalledTimes(2);
  });

  it.each([
    [undefined, ''],
    ['noAccountWithUs', uiContentMock.noAccountError],
    ['userDataMismatch', uiContentMock.dataMismatchError],
    ['junk', `${unknownErrorTypePrefix}junk`],
  ])(
    'sets account error if error type (%p) passed as prop',
    (
      errorTypeMock: undefined | string,
      expectedErrorMessage: undefined | string
    ) => {
      const setAccountErrorMock = jest.fn();
      stateReset({ accountErrorCall: ['', setAccountErrorMock] });
      useRouteMock.mockReturnValue({
        params: {
          workflow: 'startSaving',
          errorType: errorTypeMock as CreateAccountErrorType,
        },
      });
      renderer.create(<CreateAccountScreen />);

      expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), [
        errorTypeMock,
      ]);

      const effectHandler = useEffectMock.mock.calls[0][0];
      effectHandler();

      expect(setAccountErrorMock).toHaveBeenCalledWith(expectedErrorMessage);
    }
  );

  it.each([[''], ['error']])(
    'scrolls to error message when error exists (accountError: %p)',
    (accountErrorMock: string) => {
      stateReset({
        accountErrorCall: [accountErrorMock, jest.fn()],
      });

      useRefMock.mockReset();

      const scrollToMock = jest.fn();
      useRefMock.mockReturnValueOnce({ current: { scrollTo: scrollToMock } });

      const measureMock = jest.fn();
      useRefMock.mockReturnValueOnce({ current: { measure: measureMock } });

      useRouteMock.mockReturnValue({
        params: {
          workflow: 'startSaving',
        },
      });
      shallow(<CreateAccountScreen />);

      expect(useEffectMock).toHaveBeenNthCalledWith(2, expect.any(Function), [
        accountErrorMock,
      ]);

      const effectHandler = useEffectMock.mock.calls[1][0];
      effectHandler();

      if (accountErrorMock) {
        expect(measureMock).toHaveBeenCalledWith(expect.any(Function));

        const measureHandler = measureMock.mock.calls[0][0];
        const yMock = 5;
        measureHandler(undefined, yMock);

        expect(scrollToMock).toHaveBeenCalledWith(yMock);
      } else {
        expect(measureMock).not.toHaveBeenCalled();
      }
    }
  );

  it.each([
    [undefined, undefined, false, undefined, 'startSaving' as Workflow],
    [
      '1111111111',
      'noAccountWithUs',
      true,
      'self' as PrescriptionPersonSelection,
      'prescriptionInvite' as Workflow,
    ],
    [
      '1111111111',
      'userDataMismatch',
      false,
      'other' as PrescriptionPersonSelection,
      'prescriptionInvite' as Workflow,
    ],
    [
      '1111111111',
      'userDataMismatch',
      false,
      'other' as PrescriptionPersonSelection,
      'pbmActivate' as Workflow,
    ],
  ])(
    'should have correct structure (initialPhoneNumber: %p)',
    (
      initialPhoneNumberMock: undefined | string,
      errorType: undefined | string,
      expectedNoAccountExistsFlow: boolean,
      prescriptionPersonSelection: PrescriptionPersonSelection | undefined,
      thisWorkflowMock: Workflow
    ) => {
      useAccountAndFamilyContextMock.mockReturnValue({
        accountAndFamilyState: { prescriptionPersonSelection },
      });
      useRouteMock.mockReturnValue({
        params: {
          workflow: thisWorkflowMock,
          phoneNumber: initialPhoneNumberMock,
          errorType: errorType as CreateAccountErrorType,
          isDependent: isDependentMock,
        },
      });
      const testRenderer = renderer.create(<CreateAccountScreen />);

      const isPrescriptionDependent =
        thisWorkflowMock === 'prescriptionInvite' &&
        prescriptionPersonSelection === 'other';

      const isPBMActivate = thisWorkflowMock === 'pbmActivate';

      const expectedTitle = isPrescriptionDependent
        ? uiContentMock.prescriptionPersonTitle
        : uiContentMock.createAccountHeader;

      const expectedInstructions = isPrescriptionDependent
        ? uiContentMock.prescriptionPersonInstructions
        : isPBMActivate
        ? uiContentMock.pbmMemberInstructions
        : uiContentMock.createAccountInstructions;

      const createAccountPage =
        testRenderer.root.findByType(BasicPageConnected);
      expect(createAccountPage.props.showProfileAvatar).toEqual(false);
      expect(createAccountPage.props.hideApplicationHeader).toEqual(false);
      expect(createAccountPage.props.hideNavigationMenuButton).toEqual(true);
      expect(createAccountPage.props.bodyViewStyle).toEqual(
        createAccountScreenStyles.bodyViewStyle
      );
      expect(createAccountPage.props.translateContent).toEqual(true);

      const bodyContentContainer = createAccountPage.props.body;
      expect(bodyContentContainer.type).toEqual(BodyContentContainer);
      expect(bodyContentContainer.props).toHaveProperty('testID');
      expect(bodyContentContainer.props.testID).toEqual(
        'createAccountScreenBodyContentContainer'
      );

      const createAccountScreenHeader = bodyContentContainer.props.children[0];
      expect(createAccountScreenHeader.type).toEqual(View);

      const createAccountHeading = createAccountScreenHeader.props.children[0];
      expect(createAccountHeading.type).toEqual(Heading);
      expect(createAccountHeading.props.level).toEqual(1);
      expect(createAccountHeading.props.textStyle).toEqual(
        createAccountScreenStyles.headingTextStyle
      );
      expect(createAccountHeading.props.children).toEqual(expectedTitle);

      const createAccountInstructions =
        createAccountScreenHeader.props.children[1];
      expect(createAccountInstructions.props.children).toEqual(
        expectedInstructions
      );

      const createAccountBody = bodyContentContainer.props.children[1];
      expect(createAccountBody.type).toEqual(CreateAccountBody);
      expect(createAccountBody.props.noAccountExistFlow).toEqual(
        expectedNoAccountExistsFlow
      );
      expect(createAccountBody.props.initialPhoneNumber).toEqual(
        initialPhoneNumberMock ?? ''
      );
      expect(createAccountBody.props.onAttestAuthorizationToggle).toEqual(
        expect.any(Function)
      );

      createAccountBody.props.onAttestAuthorizationToggle(true);

      expect(setAcceptedAttestAuthorizationMock).toHaveBeenCalledTimes(1);
      expect(setAcceptedAttestAuthorizationMock).toHaveBeenNthCalledWith(
        1,
        true
      );

      expect(createAccountBody.props.isDependent).toEqual(isDependentMock);
      const continueButton = bodyContentContainer.props.children[2];
      expect(continueButton.props.disabled).toEqual(true);
      expect(continueButton.props.children).toEqual(
        uiContentMock.continueButton
      );
      expect(continueButton.props.testID).toEqual(
        'createAccountScreenContinueButton'
      );
    }
  );

  it('should show pbmMemberInstructions when workflow is pbmActivate', () => {
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'pbmActivate',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyContentContainer = createAccountPage.props.body;

    const createAccountScreenHeader = bodyContentContainer.props.children[0];

    const createAccountInstructions =
      createAccountScreenHeader.props.children[1];
    expect(createAccountInstructions.props.children).toEqual(
      uiContentMock.pbmMemberInstructions
    );
  });
  it('should show pbmMemberInstructions when workflow is register', () => {
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'register',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyContentContainer = createAccountPage.props.body;

    const createAccountScreenHeader = bodyContentContainer.props.children[0];

    const createAccountInstructions =
      createAccountScreenHeader.props.children[1];
    expect(createAccountInstructions.props.children).toEqual(
      uiContentMock.pbmMemberInstructions
    );
  });
  it.each([[''], ['noAccountWithUs'], ['userDataMismatch']])(
    'renders error (accountError=%p)',
    (accountErrorMock: string) => {
      stateReset({
        accountErrorCall: [accountErrorMock, jest.fn()],
      });
      useRouteMock.mockReturnValue({
        params: {
          workflow: 'startSaving',
          errorType: accountErrorMock as CreateAccountErrorType,
        },
      });
      const testRenderer = renderer.create(<CreateAccountScreen />);

      const page = testRenderer.root.findByType(BasicPageConnected);
      const bodyRenderer = renderer.create(page.props.body);

      const headingView = bodyRenderer.root.findByProps({
        testID: 'createAccountScreenHeader',
      });
      const markdownText = getChildren(headingView)[2];

      if (accountErrorMock) {
        expect(markdownText.type).toEqual(MarkdownText);
        expect(markdownText.props.textStyle).toEqual(
          createAccountScreenStyles.errorTextStyle
        );
        expect(markdownText.props.color).toEqual(
          createAccountScreenStyles.errorColorTextStyle.color
        );
        expect(markdownText.props.onLinkPress).toEqual(expect.any(Function));
        expect(markdownText.props.children).toEqual(accountErrorMock);
        expect(markdownText.props.isSkeleton).toEqual(false);
        expect(markdownText.props.testID).toEqual(
          'createAccountScreenAccountError'
        );
      } else {
        expect(markdownText).toBeNull();
      }
    }
  );

  it.each([
    ['prescriptionTransfer', 'support-cash-phone-mock', false],
    ['startSaving', 'support-cash-phone-mock', false],
    ['pbmActivate', 'support-pbm-phone-mock', false],
    ['prescriptionInvite', 'support-cash-phone-mock', false],
    ['pbmActivate', 'support-pbm-phone-mock', true],
    ['prescriptionInvite', 'support-cash-phone-mock', true],
    ['register', 'support-pbm-phone-mock', true],
  ])(
    'Handles "Contact us" link press (workflow : %p)',
    async (
      workflowValue: string,
      expectedContent: string,
      isCommunicationContentLoading: boolean
    ) => {
      stateReset({
        accountErrorCall: ['error', jest.fn()],
      });

      useRouteMock.mockReturnValue({
        params: {
          workflow: workflowValue,
        },
      });
      useContentMock.mockReset();
      useContentMock.mockReturnValueOnce({
        content: uiContentMock,
        isContentLoading: false,
      });
      useContentMock.mockReturnValueOnce({
        content: communicationUIContentMock,
        isContentLoading: isCommunicationContentLoading,
      });
      const testRenderer = renderer.create(<CreateAccountScreen />);

      const page = testRenderer.root.findByType(BasicPageConnected);
      const bodyRenderer = renderer.create(page.props.body);
      const markdownText = bodyRenderer.root.findByType(MarkdownText);

      const linkPressResult = await markdownText.props.onLinkPress();

      if (isCommunicationContentLoading) {
        expect(callPhoneNumberMock).toHaveBeenCalledTimes(0);
        expect(linkPressResult).toEqual(true);
      } else {
        expect(callPhoneNumberMock).toHaveBeenCalledTimes(1);
        expect(callPhoneNumberMock).toHaveBeenCalledWith(expectedContent);
        expect(linkPressResult).toEqual(false);
      }
    }
  );

  it('shows PBM phone number when "member support" link is pressed irrespective of workflow type ', async () => {
    stateReset({
      accountErrorCall: ['error', jest.fn()],
    });

    useRouteMock.mockReturnValue({
      params: {
        workflow: 'prescriptionInvite',
      },
    });
    useContentMock.mockReturnValue({
      content: communicationUIContentMock,
      isContentLoading: false,
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);

    const page = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(page.props.body);
    const markdownText = bodyRenderer.root.findByType(MarkdownText);
    await markdownText.props.onLinkPress('#memberSupport');

    expect(callPhoneNumberMock).toHaveBeenCalledWith(
      communicationUIContentMock.supportPBMPhone
    );
  });

  it.each([
    [undefined, undefined],
    ['1234567890', 'noAccountWithUs'],
    ['1234567890', 'userDataMismatch'],
  ])(
    'renders "Already have an account" container (phone number: %p)',
    (passedPhoneNumber: string | undefined, errorType: string | undefined) => {
      useRouteMock.mockReturnValue({
        params: {
          workflow: 'prescriptionTransfer',
          phoneNumber: passedPhoneNumber,
          errorType: errorType as CreateAccountErrorType,
        },
      });
      const testRenderer = renderer.create(<CreateAccountScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyRenderer = renderer.create(basicPage.props.body);
      const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
      const haveAccountContainer = getChildren(bodyContainer)[3];

      if (passedPhoneNumber && errorType === 'noAccountWithUs') {
        expect(haveAccountContainer).toBeNull();
      } else {
        expect(haveAccountContainer.type).toEqual(View);
        expect(haveAccountContainer.props.style).toEqual(
          createAccountScreenStyles.haveAccountViewStyle
        );
        expect(getChildren(haveAccountContainer).length).toEqual(2);
      }
    }
  );

  it('renders "Already have an account" text', () => {
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'prescriptionTransfer',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const haveAccountContainer = getChildren(bodyContainer)[3];
    const haveAccountText = getChildren(haveAccountContainer)[0];

    expect(haveAccountText.type).toEqual(BaseText);
    expect(haveAccountText.props.style).toEqual(
      createAccountScreenStyles.haveAccountTextStyle
    );
    expect(haveAccountText.props.isSkeleton).toEqual(false);
    expect(haveAccountText.props.children).toEqual([
      uiContentMock.haveAccountHelpText,
      ' ',
    ]);
  });

  it('renders "Already have an account" Sign-in link', () => {
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'prescriptionTransfer',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const haveAccountContainer = getChildren(bodyContainer)[3];
    const signInLink = getChildren(haveAccountContainer)[1];

    expect(signInLink.type).toEqual(InlineLink);
    expect(signInLink.props.onPress).toEqual(expect.any(Function));
    expect(signInLink.props.children).toEqual(uiContentMock.signIn);
    expect(signInLink.props.textStyle).toEqual(
      createAccountScreenStyles.haveAccountTextStyle
    );
    expect(signInLink.props.testID).toEqual('createAccountScreenSignInLink');
  });

  it('navigates to sign in when sign in link pressed', () => {
    const workflowMock: Workflow = 'startSaving';

    const reduxDispatchMock = jest.fn();
    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: jest.fn().mockReturnValue(defaultReduxState),
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'startSaving',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const signInLink = bodyRenderer.root.findByType(InlineLink);

    signInLink.props.onPress();

    expect(phoneLoginNavigateDispatchMock).toBeCalledWith(
      rootStackNavigationMock,
      workflowMock,
      undefined,
      undefined
    );
  });

  it('navigates to sign in with prescriptionId when sign in link pressed and passed prescriptionId', () => {
    const workflowMock: Workflow = 'prescriptionInvite';

    const reduxDispatchMock = jest.fn();
    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: jest.fn().mockReturnValue(defaultReduxState),
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    useRouteMock.mockReturnValue({
      params: {
        workflow: workflowMock,
        prescriptionId: 'test-prescription-id',
      },
    });

    const testRenderer = renderer.create(<CreateAccountScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const signInLink = bodyRenderer.root.findByType(InlineLink);

    signInLink.props.onPress();

    expect(phoneLoginNavigateDispatchMock).toBeCalledWith(
      rootStackNavigationMock,
      workflowMock,
      'test-prescription-id',
      undefined
    );
  });

  it('disable navigation back button in prescriptionInvite or register flow', () => {
    const workflowMock: Workflow = 'prescriptionInvite';

    const reduxDispatchMock = jest.fn();
    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: jest.fn().mockReturnValue(defaultReduxState),
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    navigationBackEnabledMock.mockReturnValue(false);

    useRouteMock.mockReturnValue({
      params: {
        workflow: workflowMock,
        prescriptionId: 'test-prescription-id',
      },
    });

    const testRenderer = renderer.create(<CreateAccountScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const signInLink = bodyRenderer.root.findByType(InlineLink);

    signInLink.props.onPress();

    expect(navigationBackEnabledMock).toHaveBeenCalledWith(workflowMock);
    expect(basicPage.props.navigateBack).toEqual(undefined);
  });

  it('enable navigation back button if flow is not prescriptionInvite or register', () => {
    const workflowMock: Workflow = 'startSaving';

    const reduxDispatchMock = jest.fn();
    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: jest.fn().mockReturnValue(defaultReduxState),
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    useRouteMock.mockReturnValue({
      params: {
        workflow: workflowMock,
      },
    });

    const testRenderer = renderer.create(<CreateAccountScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const signInLink = bodyRenderer.root.findByType(InlineLink);

    signInLink.props.onPress();

    expect(navigationBackEnabledMock).toHaveBeenCalledWith(workflowMock);
    expect(basicPage.props.navigateBack).toBeDefined();
  });

  it('should update first name when changed', () => {
    const setFirstNameMock = jest.fn();

    stateReset({ firstNameCall: ['Test1', setFirstNameMock] });
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'startSaving',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = createAccountPage.props.body;
    const createAccountBody = bodyContentContainer.props.children[1];

    createAccountBody.props.onFirstNameChange('Test2');
    expect(setFirstNameMock).toBeCalledTimes(1);
    expect(setFirstNameMock).toBeCalledWith('Test2');
  });

  it('should not update first name when not changed', () => {
    const setFirstNameMock = jest.fn();
    stateReset({ firstNameCall: ['Test1', setFirstNameMock] });
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'startSaving',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = createAccountPage.props.body;
    const createAccountBody = bodyContentContainer.props.children[1];

    createAccountBody.props.onFirstNameChange('Test1');
    expect(setFirstNameMock).not.toBeCalled();
  });

  it('should update last name when changed', () => {
    const setLastNameMock = jest.fn();

    stateReset({ lastNameCall: ['Test1', setLastNameMock] });
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'startSaving',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = createAccountPage.props.body;
    const createAccountBody = bodyContentContainer.props.children[1];

    createAccountBody.props.onLastNameChange('Test2');
    expect(setLastNameMock).toBeCalledTimes(1);
    expect(setLastNameMock).toBeCalledWith('Test2');
  });

  it('should not update last name when not changed', () => {
    const setLastNameMock = jest.fn();

    stateReset({ lastNameCall: ['Test1', setLastNameMock] });
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'startSaving',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = createAccountPage.props.body;
    const createAccountBody = bodyContentContainer.props.children[1];

    createAccountBody.props.onLastNameChange('Test1');
    expect(setLastNameMock).not.toBeCalled();
  });

  it('should update email when changed', () => {
    const setEmailAddressMock = jest.fn();
    stateReset({
      emailAddressCall: ['example@example.com', setEmailAddressMock],
    });
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'startSaving',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = createAccountPage.props.body;
    const createAccountBody = bodyContentContainer.props.children[1];

    createAccountBody.props.onEmailAddressChange('example@gmail.com');
    expect(setEmailAddressMock).toBeCalledTimes(1);
    expect(setEmailAddressMock).toBeCalledWith('example@gmail.com');
  });

  it('should not update email when not changed', () => {
    const setEmailAddressMock = jest.fn();
    stateReset({
      emailAddressCall: ['example@example.com', setEmailAddressMock],
    });
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'startSaving',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = createAccountPage.props.body;
    const createAccountBody = bodyContentContainer.props.children[1];

    createAccountBody.props.onEmailAddressChange('example@example.com');
    expect(setEmailAddressMock).not.toBeCalled();
  });

  it('should update phone number when changed', () => {
    const setPhoneNumberMock = jest.fn();
    stateReset({ phoneNumberCall: ['1112223333', setPhoneNumberMock] });
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'startSaving',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = createAccountPage.props.body;
    const createAccountBody = bodyContentContainer.props.children[1];

    createAccountBody.props.onPhoneNumberChange('1112223344');
    expect(setPhoneNumberMock).toBeCalledTimes(1);
    expect(setPhoneNumberMock).toBeCalledWith('1112223344');
  });

  it('should not update phone number when not changed', () => {
    const setPhoneNumberMock = jest.fn();
    stateReset({ phoneNumberCall: ['1112223333', setPhoneNumberMock] });
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'startSaving',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = createAccountPage.props.body;
    const createAccountBody = bodyContentContainer.props.children[1];

    createAccountBody.props.onPhoneNumberChange('1112223333');
    expect(setPhoneNumberMock).not.toBeCalled();
  });

  it('should update date of birth when changed', () => {
    const setDateOfBirthMock = jest.fn();
    stateReset({ dateOfBirthCall: ['January-01-1999', setDateOfBirthMock] });
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'startSaving',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = createAccountPage.props.body;
    const createAccountBody = bodyContentContainer.props.children[1];

    createAccountBody.props.onDateOfBirthChange('January-01-1998');
    expect(setDateOfBirthMock).toBeCalledTimes(1);
    expect(setDateOfBirthMock).toBeCalledWith('January-01-1998');
  });

  it('should not update date of birth when not changed', () => {
    const setDateOfBirthMock = jest.fn();
    const setShowMemberAgeNotMetErrorMock = jest.fn();

    stateReset({ dateOfBirthCall: ['January-01-1999', setDateOfBirthMock] });
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'startSaving',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = createAccountPage.props.body;
    const createAccountBody = bodyContentContainer.props.children[1];

    createAccountBody.props.onDateOfBirthChange('January-01-1999');
    expect(setDateOfBirthMock).not.toBeCalled();
    expect(setShowMemberAgeNotMetErrorMock).not.toBeCalled();
  });
  it('should calculate age and update when date of birth is changed and valid', () => {
    const setShowMemberAgeNotMetErrorMock = jest.fn();
    firefoxCompatibleDateFormatMock.mockReturnValue('2020-01-01T08:00:00.0');
    differenceInYearMock.mockReturnValueOnce(3);
    stateReset({
      dateOfBirthCall: ['January-01-1999', jest.fn()],
      showMemberAgeNotMetErrorCall: [false, setShowMemberAgeNotMetErrorMock],
    });
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'startSaving',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = createAccountPage.props.body;
    const createAccountBody = bodyContentContainer.props.children[1];

    createAccountBody.props.onDateOfBirthChange('January-01-2020');
    expect(firefoxCompatibleDateFormatMock).toHaveBeenCalledWith(
      'January-01-2020'
    );
    expect(UTCDateMock).toHaveBeenNthCalledWith(
      2,
      firefoxCompatibleDateFormatMock('January-01-2020')
    );
    expect(setShowMemberAgeNotMetErrorMock).toBeCalledTimes(1);
    expect(setShowMemberAgeNotMetErrorMock).toBeCalledWith(true);
  });

  it('should update terms and conditions acceptance when changed', () => {
    const setAcceptedTermsAndConditionsMock = jest.fn();
    stateReset({
      acceptedTermsAndConditionsCall: [
        false,
        setAcceptedTermsAndConditionsMock,
      ],
    });
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'startSaving',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = createAccountPage.props.body;
    const createAccountBody = bodyContentContainer.props.children[1];

    createAccountBody.props.onTermsAndConditionsToggle(true);
    expect(setAcceptedTermsAndConditionsMock).toBeCalledTimes(1);
    expect(setAcceptedTermsAndConditionsMock).toBeCalledWith(true);
  });

  it('should not update terms and conditions acceptance when not changed', () => {
    const setAcceptedTermsAndConditionsMock = jest.fn();
    stateReset({
      acceptedTermsAndConditionsCall: [true, setAcceptedTermsAndConditionsMock],
    });
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'startSaving',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = createAccountPage.props.body;
    const createAccountBody = bodyContentContainer.props.children[1];

    createAccountBody.props.onTermsAndConditionsToggle(true);
    expect(setAcceptedTermsAndConditionsMock).not.toBeCalled();
  });

  it.each([
    [
      '',
      'Last',
      'example@gmail.com',
      '',
      '111222333',
      'January-01-1930',
      true,
      false,
    ],
    [
      'First',
      '',
      'example@gmail.com',
      '',
      '111222333',
      'January-01-1930',
      true,
      false,
    ],
    ['First', 'Last', '', '', '111222333', 'January-01-1930', true, false],
    ['First', 'Last', 'xxx', '', '111222333', 'January-01-1930', true, false],
    [
      'First',
      'Last',
      'example@gmail.com',
      '',
      '',
      'January-01-1930',
      true,
      false,
    ],
    [
      'First',
      'Last',
      'example@gmail.com',
      '1',
      '',
      'January-01-1930',
      true,
      false,
    ],
    [
      'First',
      'Last',
      'example@gmail.com',
      '111222333',
      '',
      'January-01-1930',
      true,
      false,
    ],
    [
      'First',
      'Last',
      'example@gmail.com',
      '',
      '1',
      'January-01-1930',
      true,
      false,
    ],
    [
      'First',
      'Last',
      'example@gmail.com',
      '',
      '111222333',
      'January-01-1930',
      true,
      false,
    ],
    ['First', 'Last', 'example@gmail.com', '', '111222333', '', true, false],
    [
      'First',
      'Last',
      'example@gmail.com',
      '',
      '111222333',
      'January-01-1930',
      false,
      false,
    ],
    [
      'First',
      'Last',
      'example@gmail.com',
      '1112223333',
      '',
      'January-01-1930',
      true,
      true,
    ],
    [
      'First',
      'Last',
      'example@gmail.com',
      '',
      '1112223333',
      'January-01-1930',
      true,
      true,
    ],
  ])(
    'enables continue button if all fields are filled (firstName: %p, lastName: %p, email: %p, initialPhoneNumber: %p, phoneNumber: %p, dob: %p, terms: %p)',
    (
      firstNameMock: string,
      lastNameMock: string,
      emailAddressMock: string,
      initialPhoneNumberMock: string,
      phoneNumberMock: string,
      dateOfBirthMock: string,
      acceptedTermsAndConditionsMock: boolean,
      isEnabledExpected: boolean
    ) => {
      UTCDateMock.mockReturnValueOnce(1635959195).mockReturnValue(-1262304000);
      stateReset({
        firstNameCall: [firstNameMock, jest.fn()],
        lastNameCall: [lastNameMock, jest.fn()],
        emailAddressCall: [emailAddressMock, jest.fn()],
        phoneNumberCall: [phoneNumberMock, jest.fn()],
        dateOfBirthCall: [dateOfBirthMock, jest.fn()],
        acceptedTermsAndConditionsCall: [
          acceptedTermsAndConditionsMock,
          jest.fn(),
        ],
      });
      useRouteMock.mockReturnValue({
        params: {
          workflow: 'startSaving',
          phoneNumber: initialPhoneNumberMock,
        },
      });
      const testRenderer = renderer.create(<CreateAccountScreen />);
      const createAccountPage =
        testRenderer.root.findByType(BasicPageConnected);
      const bodyContentContainer = createAccountPage.props.body;
      const continueButton = bodyContentContainer.props.children[2];

      expect(continueButton.props.disabled).toEqual(!isEnabledExpected);
      expect(continueButton.props.isSkeleton).toEqual(false);
    }
  );

  it.each([
    ['', true],
    ['member-id', false],
  ])(
    'enables continue button if all fields are filled (pbmActivate workflow; memberId: %p)',
    (memberIdMock: string, isDisabledExpected: boolean) => {
      stateReset({
        firstNameCall: ['First', jest.fn()],
        lastNameCall: ['Last', jest.fn()],
        emailAddressCall: ['example@gmail.com', jest.fn()],
        phoneNumberCall: ['1112223333', jest.fn()],
        dateOfBirthCall: ['January-01-1930', jest.fn()],
        pbmMemberIdCall: [memberIdMock, jest.fn()],
        acceptedTermsAndConditionsCall: [true, jest.fn()],
      });
      useRouteMock.mockReturnValue({
        params: {
          workflow: 'pbmActivate',
        },
      });
      const testRenderer = renderer.create(<CreateAccountScreen />);
      const createAccountPage =
        testRenderer.root.findByType(BasicPageConnected);
      const bodyContentContainer = createAccountPage.props.body;
      const continueButton = bodyContentContainer.props.children[2];

      expect(continueButton.props.disabled).toEqual(isDisabledExpected);
      expect(continueButton.props.isSkeleton).toEqual(false);
    }
  );

  it('requests create account device token when continue button is pressed (initial phone number)', async () => {
    const firstNameMock = 'first-name';
    const lastNameMock = 'last-name';
    const emailMock = 'test@test.com';
    const dateOfBirthMock = 'January-01-2000';
    const memberIdMock = 'member-id';
    const initialPhoneNumberMock = '1234567890';

    const setAccountErrorMock = jest.fn();
    stateReset({
      firstNameCall: [firstNameMock, jest.fn()],
      lastNameCall: [lastNameMock, jest.fn()],
      emailAddressCall: [emailMock, jest.fn()],
      dateOfBirthCall: [dateOfBirthMock, jest.fn()],
      pbmMemberIdCall: [memberIdMock, jest.fn()],
      accountErrorCall: ['', setAccountErrorMock],
    });

    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn().mockReturnValue(defaultReduxState);
    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const workflowMock: Workflow = 'pbmActivate';
    useRouteMock.mockReturnValue({
      params: {
        workflow: workflowMock,
        phoneNumber: initialPhoneNumberMock,
        errorType: 'noAccountWithUs',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyContentContainer = createAccountPage.props.body;
    const continueButton = bodyContentContainer.props.children[2];

    await continueButton.props.onPress();

    const expectedArgs: ICreateAccountDeviceTokenAsyncActionArgs = {
      account: {
        dateOfBirth: dateOfBirthMock,
        firstName: firstNameMock,
        lastName: lastNameMock,
        primaryMemberRxId: memberIdMock,
        accountRecoveryEmail: emailMock,
      },
      workflow: workflowMock,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };
    expect(createAccountDeviceTokenAsyncActionMock).toHaveBeenCalledWith(
      expectedArgs
    );
  });

  it('requests create account device token with prescriptionid when continue button is pressed (initial phone number) for prescription flow', async () => {
    const firstNameMock = 'first-name';
    const lastNameMock = 'last-name';
    const emailMock = 'test@test.com';
    const dateOfBirthMock = 'January-01-2000';
    const memberIdMock = 'member-id';
    const initialPhoneNumberMock = '1234567890';
    const prescriptionIdMock = 'prescription-id';
    const setAccountErrorMock = jest.fn();

    stateReset({
      firstNameCall: [firstNameMock, jest.fn()],
      lastNameCall: [lastNameMock, jest.fn()],
      emailAddressCall: [emailMock, jest.fn()],
      dateOfBirthCall: [dateOfBirthMock, jest.fn()],
      pbmMemberIdCall: [memberIdMock, jest.fn()],
      accountErrorCall: ['', setAccountErrorMock],
    });

    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn().mockReturnValue(defaultReduxState);
    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const workflowMock: Workflow = 'pbmActivate';

    useRouteMock.mockReturnValueOnce({
      params: {
        workflow: workflowMock,
        phoneNumber: initialPhoneNumberMock,
        errorType: 'noAccountWithUs',
        prescriptionId: prescriptionIdMock,
      },
    });

    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyContentContainer = createAccountPage.props.body;
    const continueButton = bodyContentContainer.props.children[2];

    await continueButton.props.onPress();

    const expectedArgs: ICreateAccountDeviceTokenAsyncActionArgs = {
      account: {
        dateOfBirth: dateOfBirthMock,
        firstName: firstNameMock,
        lastName: lastNameMock,
        primaryMemberRxId: memberIdMock,
        accountRecoveryEmail: emailMock,
        prescriptionId: prescriptionIdMock,
      },
      workflow: workflowMock,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };
    expect(createAccountDeviceTokenAsyncActionMock).toHaveBeenCalledWith(
      expectedArgs
    );
  });

  it('requests create account device token with prescriptionid when continue button is pressed (initial phone number) for prescription flow', async () => {
    const firstNameMock = 'first-name';
    const lastNameMock = 'last-name';
    const emailMock = 'test@test.com';
    const dateOfBirthMock = 'January-01-2000';
    const memberIdMock = 'member-id';
    const initialPhoneNumberMock = '1234567890';
    const prescriptionIdMock = 'prescription-id';
    const setAccountErrorMock = jest.fn();
    stateReset({
      firstNameCall: [firstNameMock, jest.fn()],
      lastNameCall: [lastNameMock, jest.fn()],
      emailAddressCall: [emailMock, jest.fn()],
      dateOfBirthCall: [dateOfBirthMock, jest.fn()],
      pbmMemberIdCall: [memberIdMock, jest.fn()],
      accountErrorCall: ['', setAccountErrorMock],
    });

    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn().mockReturnValue(defaultReduxState);
    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const workflowMock: Workflow = 'pbmActivate';

    useRouteMock.mockReturnValueOnce({
      params: {
        workflow: workflowMock,
        phoneNumber: initialPhoneNumberMock,
        errorType: 'noAccountWithUs',
        prescriptionId: prescriptionIdMock,
      },
    });

    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyContentContainer = createAccountPage.props.body;
    const continueButton = bodyContentContainer.props.children[2];

    await continueButton.props.onPress();

    const expectedArgs: ICreateAccountDeviceTokenAsyncActionArgs = {
      account: {
        dateOfBirth: dateOfBirthMock,
        firstName: firstNameMock,
        lastName: lastNameMock,
        primaryMemberRxId: memberIdMock,
        accountRecoveryEmail: emailMock,
        prescriptionId: prescriptionIdMock,
      },
      workflow: workflowMock,
      navigation: rootStackNavigationMock,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
    };
    expect(createAccountDeviceTokenAsyncActionMock).toHaveBeenCalledWith(
      expectedArgs
    );
  });

  it('requests create account device token with prescriptionid when continue button is pressed (initial phone number) for prescription flow', async () => {
    const firstNameMock = 'first-name';
    const lastNameMock = 'last-name';
    const emailMock = 'test@test.com';
    const dateOfBirthMock = 'January-01-2000';
    const memberIdMock = 'member-id';
    const initialPhoneNumberMock = '1234567890';
    const prescriptionIdMock = 'prescription-id';
    const setAccountErrorMock = jest.fn();
    stateReset({
      firstNameCall: [firstNameMock, jest.fn()],
      lastNameCall: [lastNameMock, jest.fn()],
      emailAddressCall: [emailMock, jest.fn()],
      dateOfBirthCall: [dateOfBirthMock, jest.fn()],
      pbmMemberIdCall: [memberIdMock, jest.fn()],
      accountErrorCall: ['', setAccountErrorMock],
    });

    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn().mockReturnValue(defaultReduxState);
    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const workflowMock: Workflow = 'pbmActivate';
    useRouteMock.mockReturnValueOnce({
      params: {
        workflow: workflowMock,
        phoneNumber: initialPhoneNumberMock,
        errorType: 'noAccountWithUs',
        prescriptionId: prescriptionIdMock,
      } as ICreateAccountScreenRouteProps,
    });

    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyContentContainer = createAccountPage.props.body;
    const continueButton = bodyContentContainer.props.children[2];

    await continueButton.props.onPress();

    const expectedArgs: ICreateAccountDeviceTokenAsyncActionArgs = {
      account: {
        dateOfBirth: dateOfBirthMock,
        firstName: firstNameMock,
        lastName: lastNameMock,
        primaryMemberRxId: memberIdMock,
        accountRecoveryEmail: emailMock,
        prescriptionId: prescriptionIdMock,
      },
      workflow: workflowMock,
      navigation: rootStackNavigationMock,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
    };
    expect(createAccountDeviceTokenAsyncActionMock).toHaveBeenCalledWith(
      expectedArgs
    );
  });

  it('indicates account error if create account device token request fails (initial phone number)', async () => {
    const setAccountErrorMock = jest.fn();
    stateReset({
      accountErrorCall: ['', setAccountErrorMock],
    });

    createAccountDeviceTokenAsyncActionMock.mockImplementation(() => {
      throw new Error('Not today!');
    });
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'pbmActivate',
        phoneNumber: '1234567890',
        errorType: 'noAccountWithUs',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyContentContainer = createAccountPage.props.body;
    const continueButton = bodyContentContainer.props.children[2];

    await continueButton.props.onPress();

    expect(setAccountErrorMock).toHaveBeenCalledWith(
      uiContentMock.accountNotFoundError
    );
  });

  it.each([[undefined], [true]])(
    'requests member account create when continue button is pressed (pbmActivate workflow) (isBLockchain: %p)',
    async (isBlockchainMock?: boolean) => {
      const firstNameMock = 'first-name';
      const lastNameMock = 'last-name';
      const emailMock = 'test@test.com';
      const dateOfBirthMock = 'January-01-2000';
      const memberIdMock = 'member-id';
      const phoneNumberMock = '1234567890';
      const areTermsAcceptedMock = true;

      const setAccountErrorMock = jest.fn();
      stateReset({
        firstNameCall: [firstNameMock, jest.fn()],
        lastNameCall: [lastNameMock, jest.fn()],
        emailAddressCall: [emailMock, jest.fn()],
        phoneNumberCall: [phoneNumberMock, jest.fn()],
        dateOfBirthCall: [dateOfBirthMock, jest.fn()],
        pbmMemberIdCall: [memberIdMock, jest.fn()],
        acceptedTermsAndConditionsCall: [areTermsAcceptedMock, jest.fn()],
        accountErrorCall: ['', setAccountErrorMock],
      });

      const reduxDispatchMock = jest.fn();
      const reduxGetStateMock = jest.fn().mockReturnValue(defaultReduxState);
      const reduxContextMock: IReduxContext = {
        dispatch: reduxDispatchMock,
        getState: reduxGetStateMock,
      };
      useReduxContextMock.mockReturnValue(reduxContextMock);

      useNavigationMock.mockReturnValue(rootStackNavigationMock);
      useRouteMock.mockReturnValue({
        params: {
          workflow: 'pbmActivate',
          blockchain: isBlockchainMock,
        },
      });
      const testRenderer = renderer.create(<CreateAccountScreen />);
      const createAccountPage =
        testRenderer.root.findByType(BasicPageConnected);

      const bodyContentContainer = createAccountPage.props.body;
      const continueButton = bodyContentContainer.props.children[2];

      await continueButton.props.onPress();

      const expectedArgs: ICreateMemberAccountAsyncActionArgs = {
        account: {
          dateOfBirth: dateOfBirthMock,
          email: emailMock,
          firstName: firstNameMock,
          lastName: lastNameMock,
          phoneNumber: phoneNumberMock,
          primaryMemberRxId: memberIdMock,
          isTermAccepted: areTermsAcceptedMock,
          isBlockchain: isBlockchainMock,
        },
        reduxDispatch: reduxDispatchMock,
        reduxGetState: reduxGetStateMock,
        navigation: rootStackNavigationMock,
      };
      expect(createMemberAccountAsyncActionMock).toHaveBeenCalledWith(
        expectedArgs
      );
    }
  );

  it.each([
    [new SmsNotSupportedError(), uiContentMock.smsNotSupported],
    [new Error('nope'), uiContentMock.accountNotFoundError],
    [new ErrorUserDataMismatch('error'), uiContentMock.dataMismatchError],
    [
      new ErrorActivationRecordMismatch('error'),
      uiContentMock.activationPersonMismatchError,
    ],
  ])(
    'indicates account error if member account create request fails (pbmActivate workflow; error: %p)',
    async (errorMock: Error, expectedErrorMessage?: string) => {
      const setAccountErrorMock = jest.fn();
      stateReset({
        accountErrorCall: ['', setAccountErrorMock],
      });

      createMemberAccountAsyncActionMock.mockImplementation(() => {
        throw errorMock;
      });
      useRouteMock.mockReturnValue({
        params: {
          workflow: 'pbmActivate',
        },
      });
      const testRenderer = renderer.create(<CreateAccountScreen />);
      const createAccountPage =
        testRenderer.root.findByType(BasicPageConnected);

      const bodyContentContainer = createAccountPage.props.body;
      const continueButton = bodyContentContainer.props.children[2];

      await continueButton.props.onPress();

      expect(setAccountErrorMock).toBeCalledWith(expectedErrorMessage);
    }
  );

  it('requests one-time verification code send when continue button is pressed (not pbmActivate workflow)', () => {
    const setAccountErrorMock = jest.fn();
    stateReset({
      firstNameCall: ['first-name', jest.fn()],
      lastNameCall: ['last-name', jest.fn()],
      emailAddressCall: ['test@test.com', jest.fn()],
      phoneNumberCall: ['1111111111', jest.fn()],
      dateOfBirthCall: ['January-01-2000', jest.fn()],
      acceptedTermsAndConditionsCall: [false, jest.fn()],
      accountErrorCall: ['', setAccountErrorMock],
    });
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'startSaving',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyContentContainer = createAccountPage.props.body;
    const continueButton = bodyContentContainer.props.children[2];

    continueButton.props.onPress();

    expect(sendOneTimeVerificationCodeAsyncActionMock).toBeCalledTimes(1);
  });

  it('indicates account error if one-time verification code send request fails (not pbmActivate workflow)', () => {
    const setAccountErrorMock = jest.fn();
    stateReset({
      accountErrorCall: ['', setAccountErrorMock],
    });

    sendOneTimeVerificationCodeAsyncActionMock.mockImplementation(() => {
      throw new Error('Not on my watch!');
    });
    useRouteMock.mockReturnValue({
      params: {
        workflow: 'startSaving',
      },
    });
    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyContentContainer = createAccountPage.props.body;
    const continueButton = bodyContentContainer.props.children[2];

    continueButton.props.onPress();

    expect(setAccountErrorMock).toHaveBeenCalledWith(
      uiContentMock.smsNotSupported
    );
  });

  it.each([[undefined], [true]])(
    'should call verifyPrescriptionAsyncAction when workflow is prescriptionInvite',
    (isBlockchainMock?: boolean) => {
      const setAccountErrorMock = jest.fn();
      stateReset({
        firstNameCall: ['first-name', jest.fn()],
        lastNameCall: ['last-name', jest.fn()],
        emailAddressCall: ['test@test.com', jest.fn()],
        dateOfBirthCall: ['January-01-2000', jest.fn()],
        acceptedTermsAndConditionsCall: [true, jest.fn()],
        accountErrorCall: ['', setAccountErrorMock],
      });
      const reduxDispatchMock = jest.fn();
      const reduxGetStateMock = jest.fn().mockReturnValue(defaultReduxState);
      const reduxContextMock: IReduxContext = {
        dispatch: reduxDispatchMock,
        getState: reduxGetStateMock,
      };
      useReduxContextMock.mockReturnValue(reduxContextMock);

      useRouteMock.mockReturnValue({
        params: {
          workflow: 'prescriptionInvite',
          blockchain: isBlockchainMock,
        },
      });

      const testRenderer = renderer.create(<CreateAccountScreen />);
      const createAccountPage =
        testRenderer.root.findByType(BasicPageConnected);

      const bodyContentContainer = createAccountPage.props.body;
      const continueButton = bodyContentContainer.props.children[2];

      continueButton.props.onPress();

      expect(verifyPrescriptionAsyncActionMock).toHaveBeenCalledWith({
        account: {
          dateOfBirth: 'January-01-2000',
          email: 'test@test.com',
          firstName: 'first-name',
          lastName: 'last-name',
          isTermAccepted: true,
        },
        reduxDispatch: reduxDispatchMock,
        reduxGetState: reduxGetStateMock,
        workflow: 'prescriptionInvite',
        navigation: rootStackNavigationMock,
        blockchain: isBlockchainMock,
      });
    }
  );

  it('should show error mismatch error when  workflow is prescriptionInvite and verifyPrescriptionAsyncAction throws error', () => {
    const setAccountErrorMock = jest.fn();
    stateReset({
      firstNameCall: ['first-name', jest.fn()],
      lastNameCall: ['last-name', jest.fn()],
      emailAddressCall: ['test@test.com', jest.fn()],
      dateOfBirthCall: ['January-01-2000', jest.fn()],
      acceptedTermsAndConditionsCall: [true, jest.fn()],
      accountErrorCall: ['', setAccountErrorMock],
    });
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn().mockReturnValue(defaultReduxState);
    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    const errorMock = new ErrorUserDataMismatch('bad request');
    verifyPrescriptionAsyncActionMock.mockImplementationOnce(() => {
      throw errorMock;
    });

    useRouteMock.mockReturnValue({
      params: {
        workflow: 'prescriptionInvite',
      },
    });

    const testRenderer = renderer.create(<CreateAccountScreen />);
    const createAccountPage = testRenderer.root.findByType(BasicPageConnected);

    const bodyContentContainer = createAccountPage.props.body;
    const continueButton = bodyContentContainer.props.children[2];

    continueButton.props.onPress();

    expect(verifyPrescriptionAsyncActionMock).toHaveBeenCalledWith({
      account: {
        dateOfBirth: 'January-01-2000',
        email: 'test@test.com',
        firstName: 'first-name',
        lastName: 'last-name',
        isTermAccepted: true,
      },
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
      workflow: 'prescriptionInvite',
    });
    expect(setAccountErrorMock).toHaveBeenCalledWith(
      uiContentMock.dataMismatchError
    );
  });
});

interface IStateCalls {
  firstNameCall: [string, jest.Mock];
  lastNameCall: [string, jest.Mock];
  emailAddressCall: [string, jest.Mock];
  phoneNumberCall: [string, jest.Mock];
  dateOfBirthCall: [string, jest.Mock];
  pbmMemberIdCall: [string, jest.Mock];
  acceptedTermsAndConditionsCall: [boolean, jest.Mock];
  showAccountNotFoundErrorCall: [boolean, jest.Mock];
  accountErrorCall: [string, jest.Mock];
  showMemberAgeNotMetErrorCall: [boolean, jest.Mock];
  acceptedAttestAuthorization: [boolean, jest.Mock];
}

const stateReset = ({
  firstNameCall = ['', jest.fn()],
  lastNameCall = ['', jest.fn()],
  emailAddressCall = ['', jest.fn()],
  phoneNumberCall = ['', jest.fn()],
  dateOfBirthCall = ['', jest.fn()],
  pbmMemberIdCall = ['', jest.fn()],
  acceptedTermsAndConditionsCall = [false, jest.fn()],
  accountErrorCall: showAccountNotFoundErrorCall = ['', jest.fn()],
  showMemberAgeNotMetErrorCall = [false, jest.fn()],
  acceptedAttestAuthorization = [false, setAcceptedAttestAuthorizationMock],
}: Partial<IStateCalls>): void => {
  useStateMock.mockReset();
  useStateMock.mockReturnValueOnce(firstNameCall);
  useStateMock.mockReturnValueOnce(lastNameCall);
  useStateMock.mockReturnValueOnce(emailAddressCall);
  useStateMock.mockReturnValueOnce(phoneNumberCall);
  useStateMock.mockReturnValueOnce(dateOfBirthCall);
  useStateMock.mockReturnValueOnce(pbmMemberIdCall);
  useStateMock.mockReturnValueOnce(acceptedTermsAndConditionsCall);
  useStateMock.mockReturnValueOnce(showAccountNotFoundErrorCall);
  useStateMock.mockReturnValueOnce(showMemberAgeNotMetErrorCall);
  useStateMock.mockReturnValueOnce(acceptedAttestAuthorization);
};
