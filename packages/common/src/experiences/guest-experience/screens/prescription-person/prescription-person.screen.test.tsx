// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PrescriptionPersonScreen } from './prescription-person.screen';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { BaseButton } from '../../../../components/buttons/base/base.button';
import { getChildren } from '../../../../testing/test.helper';
import { prescriptionPersonScreenStyles } from './prescription-person.screen.styles';
import { ICreateAccountScreenRouteProps } from '../sign-in/create-account/create-account.screen';
import { useAccountAndFamilyContext } from '../../context-providers/account-and-family/use-account-and-family-context.hook';
import { setPrescriptionPersonSelectionDispatch } from '../../state/account-and-family/dispatch/set-prescription-person-selection.dispatch';
import { PrescriptionPersonSelection } from '../../state/account-and-family/account-and-family.state';
import { IVerifyPatientInfoScreenRouteProps } from '../verify-patient-info/verify-patient-info.screen';
import { Workflow } from '../../../../models/workflow';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock(
  '../../../../components/containers/body-content/body-content.container',
  () => ({
    BodyContentContainer: () => <div />,
  })
);

jest.mock('../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock('../../../../components/buttons/base/base.button', () => ({
  BaseButton: () => <div />,
}));

jest.mock(
  '../../context-providers/account-and-family/use-account-and-family-context.hook'
);
const useAccountAndFamilyContextMock = useAccountAndFamilyContext as jest.Mock;

jest.mock(
  '../../state/account-and-family/dispatch/set-prescription-person-selection.dispatch'
);
const setPrescriptionPersonSelectionDispatchMock =
  setPrescriptionPersonSelectionDispatch as jest.Mock;

const workflowMock: Workflow = 'prescriptionInvite';

describe('PrescriptionPersonScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useRouteMock.mockReturnValue({
      params: {
        workflow: workflowMock,
        prescriptionId: 'prescription-id-mock',
        userExists: true,
        isAuthFlow: false,
      },
    });
    useContentMock.mockReturnValue({
      content: {
        prescriptionPersonTitle: 'prescription-person-title-mock',
        firstPersonOption: 'first-person-option-mock',
        secondPersonOption: 'second-person-option-mock',
      },
      isContentLoading: false,
    });
    useAccountAndFamilyContextMock.mockReturnValue({
      accountAndFamilyDispatch: jest.fn(),
    });
  });
  it('renders as BasicPageConnected with expected props', () => {
    const testRenderer = renderer.create(<PrescriptionPersonScreen />);

    const basicPageConntected = testRenderer.root
      .children[0] as ReactTestInstance;

    expect(basicPageConntected.type).toEqual(BasicPageConnected);
    expect(basicPageConntected.props.body.type).toEqual(BodyContentContainer);
    expect(basicPageConntected.props.showProfileAvatar).toEqual(true);
    expect(basicPageConntected.props.hideNavigationMenuButton).toEqual(false);
  });

  it('renders as BasicPageConnected body as BodyContentContainer with expected props', () => {
    const testRenderer = renderer.create(<PrescriptionPersonScreen />);

    const basicPageConntected = testRenderer.root
      .children[0] as ReactTestInstance;

    expect(basicPageConntected.type).toEqual(BasicPageConnected);
    expect(basicPageConntected.props.body.type).toEqual(BodyContentContainer);

    const prescriptionPersonScreenBody = basicPageConntected.props.body;

    expect(prescriptionPersonScreenBody.props.title).toEqual(
      'prescription-person-title-mock'
    );
    expect(prescriptionPersonScreenBody.props.isSkeleton).toEqual(false);

    const prescriptionPersonScreenBodyChildren = getChildren(
      prescriptionPersonScreenBody
    );

    expect(prescriptionPersonScreenBodyChildren).toBeDefined();
  });

  it('renders expected children in BodyContentContainer', () => {
    const testRenderer = renderer.create(<PrescriptionPersonScreen />);

    const basicPageConntected = testRenderer.root
      .children[0] as ReactTestInstance;

    const prescriptionPersonScreenBody = basicPageConntected.props.body;

    const prescriptionPersonScreenBodyChildren = getChildren(
      prescriptionPersonScreenBody
    );

    expect(prescriptionPersonScreenBodyChildren.length).toEqual(2);

    const firstBaseButton = prescriptionPersonScreenBodyChildren[0];
    const secondBaseButton = prescriptionPersonScreenBodyChildren[1];

    expect(firstBaseButton.type).toEqual(BaseButton);
    expect(secondBaseButton.type).toEqual(BaseButton);

    expect(firstBaseButton.props.viewStyle).toEqual(
      prescriptionPersonScreenStyles.buttonViewStyle
    );
    expect(firstBaseButton.props.textStyle).toEqual(
      prescriptionPersonScreenStyles.buttonTextStyle
    );
    expect(firstBaseButton.props.onPress).toEqual(expect.any(Function));
    expect(firstBaseButton.props.isSkeleton).toEqual(false);
    expect(firstBaseButton.props.children).toEqual('first-person-option-mock');

    expect(secondBaseButton.props.viewStyle).toEqual(
      prescriptionPersonScreenStyles.buttonViewStyle
    );
    expect(secondBaseButton.props.textStyle).toEqual(
      prescriptionPersonScreenStyles.buttonTextStyle
    );
    expect(secondBaseButton.props.onPress).toEqual(expect.any(Function));
    expect(secondBaseButton.props.isSkeleton).toEqual(false);
    expect(secondBaseButton.props.children).toEqual(
      'second-person-option-mock'
    );
  });

  it.each([[true], [false]])(
    'renders expected BaseButton props with useContent response (isContentLoading: %s)',
    (isContentLoadingMock: boolean) => {
      const prescriptionPersonTitleMock = 'prescription-person-title-mock';
      const firstPersonOptionMock = 'first-person-option-mock';
      const secondPersonOptionMock = 'second-person-option-mock';

      useContentMock.mockReturnValue({
        content: {
          prescriptionPersonTitle: prescriptionPersonTitleMock,
          firstPersonOption: firstPersonOptionMock,
          secondPersonOption: secondPersonOptionMock,
        },
        isContentLoading: isContentLoadingMock,
      });
      const testRenderer = renderer.create(<PrescriptionPersonScreen />);

      const basicPageConntected = testRenderer.root
        .children[0] as ReactTestInstance;

      const prescriptionPersonScreenBody = basicPageConntected.props.body;

      expect(prescriptionPersonScreenBody.props.isSkeleton).toEqual(
        isContentLoadingMock
      );

      const prescriptionPersonScreenBodyChildren = getChildren(
        prescriptionPersonScreenBody
      );

      const firstBaseButton = prescriptionPersonScreenBodyChildren[0];
      const secondBaseButton = prescriptionPersonScreenBodyChildren[1];

      expect(firstBaseButton.props.isSkeleton).toEqual(isContentLoadingMock);
      expect(firstBaseButton.props.children).toEqual(
        'first-person-option-mock'
      );
      expect(secondBaseButton.props.isSkeleton).toEqual(isContentLoadingMock);
      expect(secondBaseButton.props.children).toEqual(
        'second-person-option-mock'
      );
    }
  );

  it('navigates to CreateAccountScreen on handleFirstPersonOptionPress', () => {
    const accountAndFamilyDispatchMock = jest.fn();
    useAccountAndFamilyContextMock.mockReturnValue({
      accountAndFamilyDispatch: accountAndFamilyDispatchMock,
    });

    const screenRouteProps: ICreateAccountScreenRouteProps = {
      workflow: 'prescriptionInvite',
      prescriptionId: 'prescription-id-mock',
    };

    const testRenderer = renderer.create(<PrescriptionPersonScreen />);

    const basicPageConntected = testRenderer.root
      .children[0] as ReactTestInstance;

    const prescriptionPersonScreenBody = basicPageConntected.props.body;

    const prescriptionPersonScreenBodyChildren = getChildren(
      prescriptionPersonScreenBody
    );

    const firstBaseButton = prescriptionPersonScreenBodyChildren[0];

    firstBaseButton.props.onPress();
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'CreateAccount',
      screenRouteProps
    );

    const expectedPrescriptionPersonSelection: PrescriptionPersonSelection =
      'self';

    expect(setPrescriptionPersonSelectionDispatchMock).toHaveBeenCalledWith(
      accountAndFamilyDispatchMock,
      expectedPrescriptionPersonSelection
    );
  });

  it('calls handleSecondPersonOptionPress as expected', () => {
    const accountAndFamilyDispatchMock = jest.fn();
    useAccountAndFamilyContextMock.mockReturnValue({
      accountAndFamilyDispatch: accountAndFamilyDispatchMock,
    });

    const screenRouteProps: IVerifyPatientInfoScreenRouteProps = {
      workflow: workflowMock,
      prescriptionId: 'prescription-id-mock',
      userExists: true,
      isDependent: true,
    };

    const testRenderer = renderer.create(<PrescriptionPersonScreen />);

    const basicPageConntected = testRenderer.root
      .children[0] as ReactTestInstance;

    const prescriptionPersonScreenBody = basicPageConntected.props.body;

    const prescriptionPersonScreenBodyChildren = getChildren(
      prescriptionPersonScreenBody
    );

    const secondBaseButton = prescriptionPersonScreenBodyChildren[1];

    secondBaseButton.props.onPress();

    expect(setPrescriptionPersonSelectionDispatchMock).toHaveBeenCalledWith(
      accountAndFamilyDispatchMock,
      'other'
    );

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'VerifyPatientInfo',
      screenRouteProps
    );
  });
});
