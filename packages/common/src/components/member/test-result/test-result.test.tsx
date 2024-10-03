// Copyright 2020 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ITestResultDataProps, TestResult } from './test-result';
import { MarkdownText } from '../../text/markdown-text/markdown-text';
import { IAddress } from '../../../utils/formatters/address.formatter';
import { TestDiagnosis } from '../test-diagnosis/test-diagnosis';
import { testResultContent } from './test-result.content';
import { ITestContainer } from '../../../testing/test.container';
import { testResultStyles } from './test-result.styles';
import { getChildren } from '../../../testing/test.helper';
import { BaseText } from '../../text/base-text/base-text';
import { LineSeparator } from '../line-separator/line-separator';
import { useReduxContext } from '../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook';
import { IReduxContext } from '../../../experiences/guest-experience/context-providers/redux/redux.context';
import { base64StringToBlob } from '../../../utils/test-results/test-results.helper';
import { testResultPdfMock } from '../../../experiences/guest-experience/__mocks__/test-result-pdf.mock';
import { goToUrl } from '../../../utils/link.helper';
import { ProtectedView } from '../../containers/protected-view/protected-view';
import { TranslatableBaseText } from '../../text/translated-base-text/translatable-base-text';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { ToolButton } from '../../buttons/tool.button/tool.button';

jest.mock('../../text/markdown-text/markdown-text', () => ({
  MarkdownText: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock('../../buttons/tool.button/tool.button', () => ({
  ToolButton: () => <div />,
}));

jest.mock('../test-diagnosis/test-diagnosis', () => ({
  TestDiagnosis: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook'
);
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../../utils/test-results/test-results.helper');
const base64StringToBlobMock = base64StringToBlob as jest.Mock;

jest.mock('../../../utils/link.helper');
const goToUrlMock = goToUrl as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));

const useStateMock = useState as jest.Mock;

interface IStateCalls {
  showSpinner: [boolean, jest.Mock];
  downloadPdf: [boolean, jest.Mock];
}

function stateReset({
  showSpinner = [false, jest.fn()],
  downloadPdf = [false, jest.fn()],
}: Partial<IStateCalls>) {
  useStateMock.mockReset();

  useStateMock.mockReturnValueOnce(showSpinner);
  useStateMock.mockReturnValueOnce(downloadPdf);
}

const testDate = 'appointment-date';
const testTime = 'appointment-time';

const mockTestResult = {
  date: testDate,
  time: testTime,
  productOrServiceId: 'some-id',
  providerName: 'Test Provider Name',
  providerAddress: {
    address1: '111 E 1st St.',
    address2: '#954',
    city: 'Minneapolis',
    state: 'MN',
    zip: '56804',
  },
};

const mockFactSheets = [
  '[Fact sheet for patients](https://www.fda.gov/media/141569/download)',
  '[Learn more about COVID-19](https://www.cdc.gov/coronavirus/2019-ncov/index.html)',
];

const mockTestResultDataProps: ITestResultDataProps = {
  isTestFeatureFlag: false,
  testResult: mockTestResult,
};

enum ViewComponents {
  diagnosis,
  instructions,
  providerInformation,
  viewPdf,
  moreInfo,
  disclaimers,
}

describe('TestResult', () => {
  const reduxDispatchMock = jest.fn();
  const reduxGetStateMock = jest.fn().mockReturnValue({ features: {} });
  const reduxContextMock: IReduxContext = {
    dispatch: reduxDispatchMock,
    getState: reduxGetStateMock,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useReduxContextMock.mockReturnValue(reduxContextMock);
    stateReset({});
  });

  it('renders in View', () => {
    const customViewStyle: ViewStyle = { backgroundColor: 'blue' };
    const testRenderer = renderer.create(
      <TestResult {...mockTestResultDataProps} viewStyle={customViewStyle} />
    );

    const view = testRenderer.root.findByType(View);

    expect(view.props.style).toEqual(customViewStyle);

    expect(getChildren(view).length).toEqual(5);
  });

  it('renders TestDiagnosis component with expected properties when color given', () => {
    const mockColor = 'color';
    const mockValueMyRx = 'POSITIVE';

    const testRenderer = renderer.create(
      <TestResult
        {...mockTestResultDataProps}
        testResult={{
          ...mockTestResult,
          date: testDate,
          time: testTime,
          colorMyRx: mockColor,
          valueMyRx: mockValueMyRx,
        }}
      />
    );

    const testDiagnosis = testRenderer.root.findByType(TestDiagnosis);

    expect(testDiagnosis.props.colorMyRx).toEqual(mockColor);
    expect(testDiagnosis.props.diagnosisHeader).toEqual(
      testResultContent.diagnosisHeader
    );
    expect(testDiagnosis.props.diagnosisValue).toEqual(`**${mockValueMyRx}**`);
    expect(testDiagnosis.props.testDateHeader).toEqual(
      testResultContent.testDateHeader
    );
    expect(testDiagnosis.props.testResultDate).toEqual(testDate);
    expect(testDiagnosis.props.testResultTime).toEqual(testTime);
  });

  it('renders TestDiagnosis component with expected properties when textColor given', () => {
    const mockColor = 'color';
    const mockTextColor = 'text-color';
    const mockValueMyRx = 'POSITIVE';

    const testRenderer = renderer.create(
      <TestResult
        {...mockTestResultDataProps}
        testResult={{
          ...mockTestResult,
          date: testDate,
          time: testTime,
          colorMyRx: mockColor,
          valueMyRx: mockValueMyRx,
          textColorMyRx: mockTextColor,
        }}
      />
    );

    const testDiagnosis = testRenderer.root.findByType(TestDiagnosis);

    expect(testDiagnosis.props.colorMyRx).toEqual(mockColor);
    expect(testDiagnosis.props.textColorMyRx).toEqual(mockTextColor);
    expect(testDiagnosis.props.diagnosisHeader).toEqual(
      testResultContent.diagnosisHeader
    );
    expect(testDiagnosis.props.diagnosisValue).toEqual(`**${mockValueMyRx}**`);
    expect(testDiagnosis.props.testDateHeader).toEqual(
      testResultContent.testDateHeader
    );
    expect(testDiagnosis.props.testResultDate).toEqual(testDate);
    expect(testDiagnosis.props.testResultTime).toEqual(testTime);
  });

  it('renders instructions in Text container with expected properties', () => {
    const testRenderer = renderer.create(
      <TestResult {...mockTestResultDataProps} />
    );

    const view = testRenderer.root.findByType(View);

    const instructionsContainer =
      view.props.children[ViewComponents.instructions];
    expect(instructionsContainer.type).toEqual(MarkdownText);
    expect(instructionsContainer.props.textStyle).toEqual(
      testResultStyles.instructionsTextStyle
    );
  });

  it('renders expected instructions in Text container when passed in testResult prop', () => {
    const descriptionMyRx = 'test-description';
    const testRenderer = renderer.create(
      <TestResult
        {...mockTestResultDataProps}
        testResult={{ ...mockTestResult, descriptionMyRx }}
      />
    );

    const view = testRenderer.root.findByType(View);

    const instructionsContainer =
      view.props.children[ViewComponents.instructions];
    expect(instructionsContainer.type).toEqual(MarkdownText);
    expect(instructionsContainer.props.textStyle).toEqual(
      testResultStyles.instructionsTextStyle
    );
    expect(instructionsContainer.props.children).toEqual(descriptionMyRx);
  });

  it('renders more info from passed factSheetLinks, if available, in MarkdownText component', () => {
    const expectedMoreInfo = mockFactSheets;

    const testRenderer = renderer.create(
      <TestResult
        {...mockTestResultDataProps}
        testResult={{ ...mockTestResult, factSheetLinks: mockFactSheets }}
      />
    );
    const view = testRenderer.root.findByType(View);
    const moreInfoContainer = view.props.children[4];

    const markdown = moreInfoContainer.props.children;
    markdown.forEach((element: ReactTestInstance, index: number) => {
      expect(element.type).toEqual(MarkdownText);
      expect(element.props.children).toEqual(expectedMoreInfo[index]);
    });
  });

  it('renders provider information section', () => {
    const providerNameMock = 'Test Provider Name';
    const providerAddressMock = {
      address1: '321 E Boulevard Ave',
      address2: 'Apt 394',
      city: 'New York',
      state: 'NY',
      zip: '22122',
    } as IAddress;
    const testRenderer = renderer.create(
      <TestResult
        {...mockTestResultDataProps}
        testResult={{
          ...mockTestResult,
          providerName: providerNameMock,
          providerAddress: providerAddressMock,
        }}
      />
    );

    const protectedView = testRenderer.root.findByType(ProtectedView);

    const containerChildren = getChildren(protectedView);
    expect(containerChildren.length).toEqual(4);

    const topSeparator = containerChildren[0];
    expect(topSeparator.type).toEqual(LineSeparator);
    expect(topSeparator.props.viewStyle).toEqual(
      testResultStyles.separatorViewStyle
    );

    const providerNameLabel = containerChildren[1];
    expect(providerNameLabel.type).toEqual(TranslatableBaseText);
    expect(providerNameLabel.props.style).toEqual(
      testResultStyles.providerNameTextStyle
    );
    const providerNameValue = getChildren(providerNameLabel)[1];
    expect(providerNameValue.type).toEqual(ProtectedBaseText);
    expect(providerNameValue.props.children).toEqual(providerNameMock);

    const providerAddress = containerChildren[2];
    expect(providerAddress.type).toEqual(BaseText);
    expect(providerAddress.props.children).toEqual(
      `${providerAddressMock.address1} ${providerAddressMock.address2}, ${providerAddressMock.city}, ${providerAddressMock.state} ${providerAddressMock.zip}`
    );

    const bottomSeparator = containerChildren[3];
    expect(bottomSeparator.type).toEqual(LineSeparator);
    expect(bottomSeparator.props.viewStyle).toEqual(
      testResultStyles.separatorViewStyle
    );
  });

  it('does not render providerInformation section if provider name missing', () => {
    const providerName = undefined;
    const providerAddress = {
      address1: '321 E Boulevard Ave',
      address2: 'Apt 394',
      city: 'New York',
      state: 'NY',
      zip: '22122',
    } as IAddress;
    const testRenderer = renderer.create(
      <TestResult
        {...mockTestResultDataProps}
        testResult={{ ...mockTestResult, providerName, providerAddress }}
      />
    );

    const view = testRenderer.root.findByType(View);

    const providerInformationContainer =
      view.props.children[ViewComponents.providerInformation];
    expect(providerInformationContainer).toBeNull();
  });

  it('does not render providerInformation section if provider address missing', () => {
    const providerName = 'Test Provider Name';
    const providerAddress = undefined;
    const testRenderer = renderer.create(
      <TestResult
        {...mockTestResultDataProps}
        testResult={{ ...mockTestResult, providerName, providerAddress }}
      />
    );

    const view = testRenderer.root.findByType(View);

    const providerInformationContainer =
      view.props.children[ViewComponents.providerInformation];
    expect(providerInformationContainer).toBeNull();
  });

  it('renders toolbutton', () => {
    const providerNameMock = 'Test Provider Name';
    const providerAddressMock = {
      address1: '321 E Boulevard Ave',
      address2: 'Apt 394',
      city: 'New York',
      state: 'NY',
      zip: '22122',
    } as IAddress;
    const testRenderer = renderer.create(
      <TestResult
        {...mockTestResultDataProps}
        testResult={{
          ...mockTestResult,
          providerName: providerNameMock,
          providerAddress: providerAddressMock,
          resultPdf: testResultPdfMock,
        }}
      />
    );

    const view = testRenderer.root.findByType(View);

    const viewPdfContainer = getChildren(view)[ViewComponents.viewPdf];

    const containerChildren = getChildren(viewPdfContainer);
    expect(containerChildren.length).toEqual(1);

    const viewPdfButton = containerChildren[0];
    expect(viewPdfButton.type).toEqual(ToolButton);
    expect(viewPdfButton.props.iconTextStyle).toEqual(
      testResultStyles.toolButtonIconTextStyle
    );
    expect(viewPdfButton.props.iconName).toEqual('file-export');
    expect(viewPdfButton.props.onPress).toEqual(expect.any(Function));
    expect(viewPdfButton.props.style).toEqual(
      testResultStyles.toolButtonViewStyle
    );
    expect(viewPdfButton.props.children).toEqual('View PDF');

    viewPdfButton.props.onPress();

    expect(base64StringToBlobMock).toHaveBeenCalledTimes(1);

    expect(goToUrlMock).toBeDefined();
  });

  it('if there is no test result in props, should render null', () => {
    const testRenderer = renderer
      .create(<TestResult testResult={{}} />)
      .toJSON();

    expect(testRenderer).toEqual(null);
  });
});
