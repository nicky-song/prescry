// Copyright 2020 Prescryptive Health, Inc.

import { useNavigation, useRoute } from '@react-navigation/native';
import React, { ReactElement, useEffect } from 'react';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { PersonalInfoExpanderConnected } from '../../../components/member/personal-info-expander/personal-info-expander.connected';
import { TestResultConnected } from '../../../components/member/test-result/test-result.connected';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { useUrl } from '../../../hooks/use-url';
import { popToTop } from '../navigation/navigation.helper';
import {
  PastProceduresStackNavigationProp,
  TestResultNavigationProp,
  TestResultScreenRouteProp,
} from '../navigation/stack-navigators/past-procedures/past-procedures.stack-navigator';
import { navigatePastProceduresListDispatch } from '../store/navigation/dispatch/navigate-past-procedures-list.dispatch';
import { testResultScreenStyles } from './test-result.screen.styles';

export interface ITestResultScreenDataProps {
  serviceType?: string;
  serviceDescription?: string;
  orderNumber?: string;
}

export interface ITestResultScreenDispatchProps {
  getTestResult: (
    navigation: PastProceduresStackNavigationProp,
    orderNumber: string
  ) => void;
}

export interface ITestResultScreenRouteProp {
  orderNumber: string;
  backToList?: boolean;
}

export const TestResultScreen = (
  props: ITestResultScreenDispatchProps & ITestResultScreenDataProps
): ReactElement => {
  const navigation = useNavigation<TestResultNavigationProp>();
  const { params } = useRoute<TestResultScreenRouteProp>();
  const { orderNumber, backToList } = params;

  const update = !!orderNumber || !!props.orderNumber;
  useUrl(
    update ? `/results/test/${orderNumber ?? props.orderNumber}` : undefined
  );

  useEffect(() => {
    props.getTestResult(navigation, orderNumber);
  }, []);

  const body = (
    <BodyContentContainer
      title={props.serviceDescription}
      translateTitle={false}
    >
      <PersonalInfoExpanderConnected
        viewStyle={testResultScreenStyles.expanderViewStyle}
      />
      <TestResultConnected viewStyle={testResultScreenStyles.bodyViewStyle} />
    </BodyContentContainer>
  );

  const handleNavigateBack = () => {
    if (backToList) {
      popToTop(navigation);
      navigatePastProceduresListDispatch(navigation, true);
    } else {
      navigation.goBack();
    }
  };

  return (
    <BasicPageConnected
      body={body}
      navigateBack={handleNavigateBack}
      showProfileAvatar={true}
      translateContent={true}
    />
  );
};
