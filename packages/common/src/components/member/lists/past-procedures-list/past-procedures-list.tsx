// Copyright 2020 Prescryptive Health, Inc.

import React, { useEffect } from 'react';
import {
  TitlePropertiesItem,
  ILabelContentProps,
} from '../../items/title-properties-item/title-properties-item';
import { TitleContainerList } from '../title-container-list/title-container-list';
import { pastProceduresListStyle } from './past-procedures-list.styles';
import { pastProceduresListContent } from './past-procedures-list.content';
import { MemberNameFormatter } from '../../../../utils/formatters/member-name-formatter';
import { IPastProcedure } from '../../../../models/api-response/past-procedure-response';
import { usePastProceduresContext } from '../../../../experiences/guest-experience/context-providers/past-procedures/use-past-procedures-context.hook';
import {
  getPastProceduresAsyncAction,
  IGetPastProceduresListAsyncActionArgs,
} from '../../../../experiences/guest-experience/state/past-procedures/async-actions/get-past-procedures.async-action';
import { useReduxContext } from '../../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook';
import { BodyContentContainer } from '../../../containers/body-content/body-content.container';
import { RootStackNavigationProp } from '../../../../experiences/guest-experience/navigation/stack-navigators/root/root.stack-navigator';
import { navigateVaccinationRecordScreenDispatch } from '../../../../experiences/guest-experience/store/navigation/dispatch/navigate-vaccination-record-screen-dispatch';
import { navigateTestResultScreenDispatch } from '../../../../experiences/guest-experience/store/navigation/dispatch/navigate-test-result-screen-dispatch';

export interface IPastProceduresListProps {
  navigation: RootStackNavigationProp;
  title: string;
}

export const PastProceduresList = ({
  navigation,
  title,
}: IPastProceduresListProps) => {
  const {
    pastProceduresState: { pastProceduresList },
    pastProceduresDispatch,
  } = usePastProceduresContext();

  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();

  const getPastProcedures = async () => {
    const args: IGetPastProceduresListAsyncActionArgs = {
      reduxDispatch,
      reduxGetState,
      navigation,
      pastProceduresDispatch,
    };
    await getPastProceduresAsyncAction(args);
  };

  useEffect(() => {
    void getPastProcedures();
  }, []);

  function createServiceDescriptionProp(
    serviceDescription?: string
  ): ILabelContentProps {
    return {
      label: pastProceduresListContent.serviceNameLabel,
      content: serviceDescription || '',
      translateContent: false,
    };
  }

  function createDateResultProp(
    date?: string,
    time?: string
  ): ILabelContentProps {
    return {
      label: pastProceduresListContent.pastProcedureDateLabel,
      content: `${date} ${time}`,
      translateContent: true,
    };
  }

  const onPastProcedurePress = (pastProcedure: IPastProcedure) => {
    if (pastProcedure.procedureType === 'immunization') {
      navigateVaccinationRecordScreenDispatch(
        navigation,
        pastProcedure.orderNumber
      );
    } else {
      navigateTestResultScreenDispatch(navigation, pastProcedure.orderNumber);
    }
  };

  function renderLatestPastProcedure(results: IPastProcedure[]) {
    if (results.length > 0) {
      const latestPastProcedure = results[0];
      const properties: ILabelContentProps[] = [
        createServiceDescriptionProp(latestPastProcedure.serviceDescription),
        createDateResultProp(
          latestPastProcedure.date,
          latestPastProcedure.time
        ),
      ];
      const handlePress = () => {
        onPastProcedurePress(latestPastProcedure);
      };
      return (
        <TitleContainerList title={pastProceduresListContent.latestHeading}>
          <TitlePropertiesItem
            key={latestPastProcedure.orderNumber}
            id={latestPastProcedure.orderNumber}
            title={MemberNameFormatter.formatName(
              latestPastProcedure.memberFirstName,
              latestPastProcedure.memberLastName
            )}
            style={pastProceduresListStyle.itemTextStyle}
            properties={properties}
            onPress={handlePress}
            testID={`titlePropertiesItem-${latestPastProcedure.orderNumber}`}
          />
        </TitleContainerList>
      );
    }
    return null;
  }

  function renderOlderPastProcedures(results: IPastProcedure[]) {
    if (results.length > 1) {
      const pastResults = results.slice(1);
      return (
        <TitleContainerList title={pastProceduresListContent.pastHeading}>
          {pastResults.map((pastProcedure) => {
            const properties: ILabelContentProps[] = [
              createServiceDescriptionProp(pastProcedure.serviceDescription),
              createDateResultProp(pastProcedure.date, pastProcedure.time),
            ];
            const handlePress = () => {
              onPastProcedurePress(pastProcedure);
            };
            return (
              <TitlePropertiesItem
                key={pastProcedure.orderNumber}
                id={pastProcedure.orderNumber}
                title={MemberNameFormatter.formatName(
                  pastProcedure.memberFirstName,
                  pastProcedure.memberLastName
                )}
                style={pastProceduresListStyle.itemTextStyle}
                properties={properties}
                onPress={handlePress}
                testID={`titlePropertiesItem-${pastProcedure.orderNumber}`}
              />
            );
          })}
        </TitleContainerList>
      );
    }
    return null;
  }

  return (
    <BodyContentContainer title={title} testID='PastProceduresList'>
      {renderLatestPastProcedure(pastProceduresList)}
      {renderOlderPastProcedures(pastProceduresList)}
    </BodyContentContainer>
  );
};
