// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { PastProceduresList } from './past-procedures-list';
import { pastProceduresListContent } from './past-procedures-list.content';
import { IPastProcedure } from '../../../../models/api-response/past-procedure-response';
import { usePastProceduresContext } from '../../../../experiences/guest-experience/context-providers/past-procedures/use-past-procedures-context.hook';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { pastProceduresStackNavigationMock } from '../../../../experiences/guest-experience/navigation/stack-navigators/past-procedures/__mocks__/past-procedures.stack-navigation.mock';
import { MemberNameFormatter } from '../../../../utils/formatters/member-name-formatter';
import { TitlePropertiesItem } from '../../items/title-properties-item/title-properties-item';
import { useReduxContext } from '../../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook';
import { BodyContentContainer } from '../../../containers/body-content/body-content.container';
import { getChildren } from '../../../../testing/test.helper';
import { navigateVaccinationRecordScreenDispatch } from '../../../../experiences/guest-experience/store/navigation/dispatch/navigate-vaccination-record-screen-dispatch';
import { navigateTestResultScreenDispatch } from '../../../../experiences/guest-experience/store/navigation/dispatch/navigate-test-result-screen-dispatch';

jest.mock(
  '../../../../experiences/guest-experience/store/navigation/dispatch/navigate-test-result-screen-dispatch'
);
const navigateTestResultScreenDispatchMock =
  navigateTestResultScreenDispatch as jest.Mock;

jest.mock(
  '../../../../experiences/guest-experience/store/navigation/dispatch/navigate-vaccination-record-screen-dispatch'
);
const navigateVaccinationRecordScreenDispatchMock =
  navigateVaccinationRecordScreenDispatch as jest.Mock;

jest.mock(
  '../../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook'
);
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock(
  '../../../../experiences/guest-experience/state/past-procedures/async-actions/get-past-procedures.async-action'
);

jest.mock(
  '../../../../experiences/guest-experience/context-providers/past-procedures/use-past-procedures-context.hook'
);
const usePastProceduresContextMock = usePastProceduresContext as jest.Mock;

jest.mock('../title-container-list/title-container-list', () => ({
  TitleContainerList: () => <div />,
}));

jest.mock('../../items/title-properties-item/title-properties-item', () => ({
  TitlePropertiesItem: () => <div />,
}));

jest.mock('../../../../utils/formatters/member-name-formatter');
const memberNameFormatterMock = MemberNameFormatter as unknown as jest.Mock;

const orderNumberMocks = ['0000', '0001', '0002'];

const pastProceduresListMock: IPastProcedure[] = [
  {
    orderNumber: orderNumberMocks[0],
    time: '1:00 AM',
    date: 'December 15, 2021',
    serviceDescription: 'COVID-19 Abbott Antigen Testing',
    memberFirstName: 'TEST',
    memberLastName: 'TESTER',
    procedureType: 'observation',
  },
  {
    orderNumber: orderNumberMocks[1],
    time: '2:00 PM',
    date: 'January 1, 2010',
    serviceDescription: 'COVID-19 Abbott Antigen Medicaid Testing',
    memberFirstName: 'TEST1',
    memberLastName: 'TESTER1',
    procedureType: 'observation',
  },
  {
    orderNumber: orderNumberMocks[2],
    time: '3:30 PM',
    date: 'June 4, 2008',
    serviceDescription: 'COVID-19 Vaccine Record',
    memberFirstName: 'TEST2',
    memberLastName: 'TESTER2',
    procedureType: 'observation',
  },
];

const pastProceduresImmunizationsListMock: IPastProcedure[] = [
  {
    orderNumber: orderNumberMocks[0],
    time: '1:00 AM',
    date: 'December 15, 2021',
    serviceDescription: 'COVID-19 Abbott Antigen Testing',
    memberFirstName: 'TEST',
    memberLastName: 'TESTER',
    procedureType: 'immunization',
  },
  {
    orderNumber: orderNumberMocks[1],
    time: '2:00 PM',
    date: 'January 1, 2010',
    serviceDescription: 'COVID-19 Abbott Antigen Medicaid Testing',
    memberFirstName: 'TEST1',
    memberLastName: 'TESTER1',
    procedureType: 'immunization',
  },
  {
    orderNumber: orderNumberMocks[2],
    time: '3:30 PM',
    date: 'June 4, 2008',
    serviceDescription: 'COVID-19 Vaccine Record',
    memberFirstName: 'TEST2',
    memberLastName: 'TESTER2',
    procedureType: 'immunization',
  },
];

describe('PastProceduresList', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    usePastProceduresContextMock.mockReturnValue({
      pastProceduresState: { pastProceduresList: pastProceduresListMock },
    });
    useReduxContextMock.mockReturnValue({
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn().mockReturnValue({ features: {} }),
    });
    memberNameFormatterMock.mockReturnValue('TEST TESTER');
  });

  it('renders in BodyContentContainer', () => {
    const titleMock = 'title';

    const testRenderer = renderer.create(
      <PastProceduresList
        navigation={pastProceduresStackNavigationMock}
        title={titleMock}
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(BodyContentContainer);
    expect(container.props.testID).toEqual('PastProceduresList');
    expect(container.props.title).toEqual(titleMock);
    expect(getChildren(container).length).toEqual(2);
  });

  it('renders latest test result with expected properties', () => {
    const testRenderer = renderer.create(
      <PastProceduresList
        navigation={pastProceduresStackNavigationMock}
        title='title'
      />
    );

    const container = testRenderer.root.findByType(BodyContentContainer);
    const pastProcedureItem = container.props.children[0].props.children;
    expect(pastProcedureItem.props.properties).toEqual([
      {
        content: 'COVID-19 Abbott Antigen Testing',
        label: 'Service',
        translateContent: false,
      },
      {
        content: 'December 15, 2021 1:00 AM',
        label: 'Date',
        translateContent: true,
      },
    ]);
  });

  it('navigateVaccinationRecordScreenDispatch should be called when latest procedure is pressed and procedureType is immunization', () => {
    usePastProceduresContextMock.mockReturnValueOnce({
      pastProceduresState: {
        pastProceduresList: pastProceduresImmunizationsListMock,
      },
    });
    const testRenderer = renderer.create(
      <PastProceduresList
        navigation={pastProceduresStackNavigationMock}
        title='title'
      />
    );

    const container = testRenderer.root.findByType(BodyContentContainer);
    const pastProcedureItem = container.props.children[0].props.children;
    expect(pastProcedureItem.type).toEqual(TitlePropertiesItem);
    pastProcedureItem.props.onPress();
    expect(navigateVaccinationRecordScreenDispatchMock).toHaveBeenCalledWith(
      pastProceduresStackNavigationMock,
      orderNumberMocks[0]
    );
  });

  it('navigateTestResultScreenDispatch should be called when latest procedure is pressed and procedureType is NOT immunization', () => {
    const testRenderer = renderer.create(
      <PastProceduresList
        navigation={pastProceduresStackNavigationMock}
        title='title'
      />
    );

    const container = testRenderer.root.findByType(BodyContentContainer);
    const pastProcedureItem = container.props.children[0].props.children;
    expect(pastProcedureItem.type).toEqual(TitlePropertiesItem);
    pastProcedureItem.props.onPress();
    expect(navigateVaccinationRecordScreenDispatchMock).not.toBeCalled();
    expect(navigateTestResultScreenDispatchMock).toHaveBeenCalledWith(
      pastProceduresStackNavigationMock,
      orderNumberMocks[0]
    );
  });

  it('renders Past heading with expected properties', () => {
    const testRenderer = renderer.create(
      <PastProceduresList
        navigation={pastProceduresStackNavigationMock}
        title='title'
      />
    );
    const container = testRenderer.root.findByType(BodyContentContainer);
    const pastHeading = container.props.children[1].props;

    expect(pastHeading.title).toEqual(pastProceduresListContent.pastHeading);
  });

  it('render past test result with expected properties', () => {
    const testRenderer = renderer.create(
      <PastProceduresList
        navigation={pastProceduresStackNavigationMock}
        title='title'
      />
    );

    const container = testRenderer.root.findByType(BodyContentContainer);
    const pastProcedureItems = container.props.children[1].props.children;
    expect(pastProcedureItems[0].props.properties).toEqual([
      {
        content: 'COVID-19 Abbott Antigen Medicaid Testing',
        label: 'Service',
        translateContent: false,
      },
      {
        content: 'January 1, 2010 2:00 PM',
        label: 'Date',
        translateContent: true,
      },
    ]);
    expect(pastProcedureItems[0].props.id).toEqual(orderNumberMocks[1]);
    expect(pastProcedureItems[0].props.testID).toEqual(
      `titlePropertiesItem-${orderNumberMocks[1]}`
    );

    expect(pastProcedureItems[1].props.properties).toEqual([
      {
        content: 'COVID-19 Vaccine Record',
        label: 'Service',
        translateContent: false,
      },
      {
        content: 'June 4, 2008 3:30 PM',
        label: 'Date',
        translateContent: true,
      },
    ]);
    expect(pastProcedureItems[1].props.id).toEqual(orderNumberMocks[2]);
    expect(pastProcedureItems[1].props.testID).toEqual(
      `titlePropertiesItem-${orderNumberMocks[2]}`
    );
  });

  it('renders only Latest test results list with expected properties', () => {
    usePastProceduresContextMock.mockReturnValue({
      pastProceduresState: { pastProceduresList: [pastProceduresListMock[0]] },
    });
    const testRenderer = renderer.create(
      <PastProceduresList
        navigation={pastProceduresStackNavigationMock}
        title='title'
      />
    );

    const container = testRenderer.root.findByType(BodyContentContainer);
    const lists = container.props.children;
    const latestHeading = lists[0].props.title;
    expect(latestHeading).toEqual(pastProceduresListContent.latestHeading);
    expect(lists[1]).toBeNull();
  });
});
