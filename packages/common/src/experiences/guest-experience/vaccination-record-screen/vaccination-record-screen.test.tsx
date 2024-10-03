// Copyright 2021 Prescryptive Health, Inc.

import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { ImmunizationCertificate } from '../../../components/member/immunization-certificate/immunization-certificate';
import { PersonalInfoExpander } from '../../../components/member/personal-info-expander/personal-info-expander';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { MarkdownText } from '../../../components/text/markdown-text/markdown-text';
import { useUrl } from '../../../hooks/use-url';
import { IImmunizationRecord } from '../../../models/api-response/immunization-record-response';
import { getChildren } from '../../../testing/test.helper';
import { rootStackNavigationMock } from '../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { navigatePastProceduresListDispatch } from '../store/navigation/dispatch/navigate-past-procedures-list.dispatch';
import {
  IVaccinationRecordScreenDispatchProps,
  IVaccinationRecordScreenProps,
  VaccinationRecordScreen,
} from './vaccination-record-screen';
import { vaccinationRecordScreenContent } from './vaccination-record-screen.content';
import { popToTop } from '../navigation/navigation.helper';

jest.mock('../navigation/navigation.helper');
const popToTopMock = popToTop as jest.Mock;

jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('../../../hooks/use-url');
const useUrlMock = useUrl as jest.Mock;

jest.mock(
  '../store/navigation/dispatch/navigate-past-procedures-list.dispatch'
);
const navigatePastProceduresListDispatchMock =
  navigatePastProceduresListDispatch as jest.Mock;

const orderNumberMock = '1234';
const immunizationRecords: IImmunizationRecord[] = [
  {
    orderNumber: orderNumberMock,
    manufacturer: 'Moderna',
    lotNumber: '1234',
    doseNumber: 1,
    locationName: 'Lonehollow Pharmacy',
    address1: '1010 Cooley Lane',
    city: 'Vanderpool',
    state: 'TX',
    zip: '78885',
    time: 'appointment-time',
    date: 'appointment-date',
    memberId: 'member_1',
    vaccineCode: 'vaccine-1',
    serviceDescription: 'test',
    factSheetLinks: [
      '(This is a test link)[https://www.modernatx.com/covid19vaccine-eua/eua-fact-sheet-recipients.pdf]',
      '(This is another test link)[https://www.modernatx.com/covid19vaccine-eua/eua-fact-sheet-recipients.pdf]',
    ],
  },
];

const mockVaccinationRecordScreenProps: IVaccinationRecordScreenDispatchProps &
  IVaccinationRecordScreenProps = {
  getImmunizationRecord: jest.fn(),
  recipientName: 'Luke Combs',
  immunizationRecords,
};

const getImmunizationRecordMock =
  mockVaccinationRecordScreenProps.getImmunizationRecord as jest.Mock;
const propsWithVaccinationRecordMock = {
  ...mockVaccinationRecordScreenProps,
  getImmunizationRecord: getImmunizationRecordMock,
};

describe('VaccinationRecordScreen', () => {
  beforeEach(() => {
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useRouteMock.mockReturnValue({
      params: {
        backToList: false,
        orderNumber: orderNumberMock,
      },
    });
  });

  it('renders as BasicPageConnected with expected properties', () => {
    const testRenderer = renderer.create(
      <VaccinationRecordScreen {...propsWithVaccinationRecordMock} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;

    expect(pageProps.showProfileAvatar).toEqual(true);
    expect(pageProps.translateContent).toEqual(true);
  });

  it('renders as BasicPageConnected with navigation.goback if backToList is false', () => {
    useRouteMock.mockReturnValue({ params: { backToList: false } });
    const testRenderer = renderer.create(
      <VaccinationRecordScreen {...propsWithVaccinationRecordMock} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;

    pageProps.navigateBack();
    expect(rootStackNavigationMock.goBack).toHaveBeenCalledTimes(1);
  });

  it('renders as BasicPageConnected with navigatePastProceduresListDispatch if backToList is true', () => {
    useRouteMock.mockReturnValue({ params: { backToList: true } });
    const testRenderer = renderer.create(
      <VaccinationRecordScreen {...propsWithVaccinationRecordMock} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;

    pageProps.navigateBack();
    expect(popToTopMock).toHaveBeenCalledWith(rootStackNavigationMock);
    expect(navigatePastProceduresListDispatchMock).toHaveBeenCalledTimes(1);
    expect(navigatePastProceduresListDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      true
    );
  });

  it('renders body in content container', () => {
    const testRenderer = renderer.create(
      <VaccinationRecordScreen {...propsWithVaccinationRecordMock} />
    );

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const contentContainer = basicPageConnected.props.body;

    expect(contentContainer.type).toEqual(BodyContentContainer);
    expect(contentContainer.props.title).toEqual(
      vaccinationRecordScreenContent.title
    );
    expect(getChildren(contentContainer).length).toEqual(3);
  });

  it('update url with vaccine orderNumber if props provides orderNumber', () => {
    renderer.create(
      <VaccinationRecordScreen {...propsWithVaccinationRecordMock} />
    );

    expect(useUrlMock).toHaveBeenCalledWith(
      `/results/vaccine/${orderNumberMock}`
    );
  });

  it('renders a PersonalInfoExpander with expected properties', () => {
    const testRenderer = renderer.create(
      <VaccinationRecordScreen {...propsWithVaccinationRecordMock} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;
    const personalInfoExpander = getChildren(bodyProp)[0];

    expect(personalInfoExpander.type).toBe(PersonalInfoExpander);
    expect(personalInfoExpander.props.PersonalInfoExpanderData).toStrictEqual({
      name: propsWithVaccinationRecordMock.recipientName,
      dateOfBirth: undefined,
    });
  });

  it('renders ImmunizationCertificate when expected', () => {
    const testRenderer = renderer.create(
      <VaccinationRecordScreen {...propsWithVaccinationRecordMock} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;
    const immunizationCertificate = getChildren(bodyProp)[1];

    expect(immunizationCertificate.type).toBe(ImmunizationCertificate);
    expect(immunizationCertificate.props.immunizationRecords).toBe(
      immunizationRecords
    );
  });

  it('renders all information links for patients based on the service when expected', () => {
    const immunizationRecordWithFactSheet = [
      {
        orderNumber: '1234',
        manufacturer: 'Moderna',
        lotNumber: '1234',
        doseNumber: 1,
        locationName: 'Lonehollow Pharmacy',
        address1: '1010 Cooley Lane',
        city: 'Vanderpool',
        state: 'TX',
        zip: '78885',
        time: 'appointment-time',
        date: 'appointment-date',
        memberId: 'member_1',
        vaccineCode: 'vaccine-1',
        serviceDescription: 'test',
        factSheetLinks: [
          '(This is a test link)[https://www.modernatx.com/covid19vaccine-eua/eua-fact-sheet-recipients.pdf]',
          '(This is another test link)[https://www.modernatx.com/covid19vaccine-eua/eua-fact-sheet-recipients.pdf]',
        ],
      } as IImmunizationRecord,
    ];

    const props = {
      ...propsWithVaccinationRecordMock,
      immunizationRecords: immunizationRecordWithFactSheet,
    };
    const testRenderer = renderer.create(
      <VaccinationRecordScreen {...props} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;
    const vaccineLinks = getChildren(bodyProp)[2];
    expect(vaccineLinks.type).toEqual(View);
    const firstInformationLink = vaccineLinks.props.children[0];
    const secondInformationLink = vaccineLinks.props.children[1];
    expect(firstInformationLink.type).toEqual(MarkdownText);
    expect(secondInformationLink.type).toEqual(MarkdownText);
  });

  it('renders no information link view when no links are present', () => {
    const immunizationRecordWithFactSheet = [
      {
        orderNumber: '1234',
        manufacturer: 'Moderna',
        lotNumber: '1234',
        doseNumber: 1,
        locationName: 'Lonehollow Pharmacy',
        address1: '1010 Cooley Lane',
        city: 'Vanderpool',
        state: 'TX',
        zip: '78885',
        time: 'appointment-time',
        date: 'appointment-date',
        memberId: 'member_1',
        vaccineCode: 'vaccine-1',
        serviceDescription: 'test',
        factSheetLinks: undefined,
      } as IImmunizationRecord,
    ];

    const props = {
      ...propsWithVaccinationRecordMock,
      immunizationRecords: immunizationRecordWithFactSheet,
    };
    const testRenderer = renderer.create(
      <VaccinationRecordScreen {...props} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const bodyProp = pageProps.body;
    expect(getChildren(bodyProp)[2]).toBeNull();
  });
});
