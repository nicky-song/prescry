// Copyright 2021 Prescryptive Health, Inc.

import React, {
  BaseSyntheticEvent,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BaseButton } from '../../../components/buttons/base/base.button';
import { RadioButtonToggle } from '../../../components/member/radio-button-toggle/radio-button-toggle';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { MarkdownText } from '../../../components/text/markdown-text/markdown-text';
import { ICreateWaitlistRequestBody } from '../../../models/api-request-body/create-waitlist.request-body';
import {
  mandatoryIconUsingStrikeThroughStyle,
  PhoneNumberDialingCode,
} from '../../../theming/constants';
import { JoinWaitlistScreenContent } from './join-waitlist-screen.content';
import { joinWaitlistScreenStyle } from './join-waitlist-screen.style';
import { OtherPersonInfo } from '../../../components/member/join-waitlist-form/create-other-person-info-component';
import DateValidator from '../../../utils/validators/date.validator';
import AddressValidator from '../../../utils/validators/address.validator';
import {
  guestExperienceCustomEventLogger,
  CustomAppInsightEvents,
} from '../guest-experience-logger.middleware';
import { IServiceTypeState } from '../store/service-type/service-type.reducer';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  AppointmentsStackNavigationProp,
  JoinWaitlistRouteProp,
} from '../navigation/stack-navigators/appointments/appointments.stack-navigator';
import { BasePicker } from '../../../components/member/pickers/base/base.picker';
import { ItemValue } from '@react-native-picker/picker/typings/Picker';
import { BaseText } from '../../../components/text/base-text/base-text';
import { Heading } from '../../../components/member/heading/heading';
import { IDependentProfile } from '../../../models/member-profile/member-profile-info';

export interface IJoinWaitlistScreenRouteProps {
  zipCode?: string;
}

export interface IJoinWaitlistScreenDataProps {
  serviceType: IServiceTypeState;
  error?: string;
  availableWaitlistMembers: IDependentProfile[];
}
export interface IJoinWaitlistScreenActionProps {
  navigateToWaitlistConfirmation?: () => void;
  onJoinPress: (
    navigation: AppointmentsStackNavigationProp,
    requestBody: ICreateWaitlistRequestBody
  ) => void;
  resetErrorMessage: () => void;
  updateLocationPreferences: (zipCode?: string, distance?: number) => void;
}

export type IJoinWaitlistScreenProps = IJoinWaitlistScreenDataProps &
  IJoinWaitlistScreenActionProps;

const {
  headerViewStyle,
  bodyViewStyle,
  selectedServiceTextStyle,
  selectedServiceViewStyle,
  leftFormItemTextStyle,
  leftItemViewStyle,
  rightItemViewStyle,
  formItemLabelTextStyle,
  mandatoryIconTextStyle,
  pickerContainerTextStyle,
  locationFormViewStyle,
  otherPersonFormContainerStyle,
} = joinWaitlistScreenStyle;

export const JoinWaitlistScreen = (props: IJoinWaitlistScreenProps) => {
  const navigation = useNavigation<AppointmentsStackNavigationProp>();
  const { params } = useRoute<JoinWaitlistRouteProp>();
  const { zipCode } = params;

  const [zipValue, setZipValue] = useState(zipCode ?? '');
  const [distanceValue, setDistanceValue] = useState(10);
  const [selectedPatientType, setSelectedPatientType] = useState(0);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [identifier, setIdentifier] = useState('');

  useEffect(() => {
    props.updateLocationPreferences(zipValue, distanceValue);
  }, []);

  useEffect(() => {
    if (props.error) {
      props.resetErrorMessage();
    }
  }, []);

  const header = (
    <Heading textStyle={joinWaitlistScreenStyle.headerTextStyle}>
      {JoinWaitlistScreenContent.headerText}
    </Heading>
  );
  const { availableWaitlistMembers, serviceType } = props;

  const renderZipCaption = (): React.ReactNode => {
    return (
      <MarkdownText
        textStyle={formItemLabelTextStyle}
        markdownTextStyle={mandatoryIconTextStyle}
      >
        {`${JoinWaitlistScreenContent.zipCodeText} ${mandatoryIconUsingStrikeThroughStyle}`}
      </MarkdownText>
    );
  };

  function renderZipCodeField(): ReactNode {
    const onChangeText = (newValue: string) => {
      if (
        newValue === '' ||
        (newValue !== zipValue && AddressValidator.isZipAllDigits(newValue))
      ) {
        if (props.error) {
          props.resetErrorMessage();
        }
        setZipValue(newValue);
      }
    };
    return (
      <View style={leftItemViewStyle}>
        {renderZipCaption()}
        <TextInput
          placeholder={JoinWaitlistScreenContent.zipCodePlaceholder}
          onChangeText={onChangeText}
          style={leftFormItemTextStyle}
          multiline={false}
          editable={true}
          maxLength={JoinWaitlistScreenContent.zipCodeLength}
          value={zipValue}
        />
      </View>
    );
  }

  const renderDistanceCaption = (): React.ReactNode => {
    return (
      <MarkdownText
        textStyle={formItemLabelTextStyle}
        markdownTextStyle={mandatoryIconTextStyle}
      >
        {`${JoinWaitlistScreenContent.searchDistanceText} ${mandatoryIconUsingStrikeThroughStyle}`}
      </MarkdownText>
    );
  };

  type OptionsList = [number, string][];

  const renderDistanceOptionsList = (
    distanceOptions: number[]
  ): OptionsList => {
    const allDistanceOptions: OptionsList = [];
    distanceOptions.forEach((mileOption: number) => {
      allDistanceOptions.push([
        mileOption,
        JoinWaitlistScreenContent.distance(mileOption),
      ]);
    });
    return allDistanceOptions;
  };

  const renderDistanceOptions = (
    optionsList: OptionsList
  ): React.ReactNode[] => {
    return optionsList.map(([code, label]) => (
      <Picker.Item
        key={`${code}-${label}`}
        label={label}
        value={code.toString()}
      />
    ));
  };

  function renderDistanceField(): ReactNode {
    const onSelect = (newValue: ItemValue, _newValueIndex: number) => {
      guestExperienceCustomEventLogger(
        CustomAppInsightEvents.SELECTED_WAITLIST_DISTANCE_VALUE,
        {
          distance: newValue.toString(),
        }
      );
      if (newValue !== distanceValue) {
        if (props.error) {
          props.resetErrorMessage();
        }
        setDistanceValue(newValue as number);
      }
    };
    return (
      <View style={rightItemViewStyle}>
        {renderDistanceCaption()}
        <BasePicker
          onValueChange={onSelect}
          style={pickerContainerTextStyle}
          selectedValue={distanceValue}
        >
          {renderDistanceOptions(
            renderDistanceOptionsList(JoinWaitlistScreenContent.mileOptionsList)
          )}
        </BasePicker>
      </View>
    );
  }

  function renderError(): ReactNode {
    if (props.error) {
      return (
        <View testID='joinWailistScreenErrorText'>
          <BaseText style={joinWaitlistScreenStyle.errorTextStyle}>
            {props.error}
          </BaseText>
        </View>
      );
    }
    return null;
  }

  function renderBody(): ReactNode {
    function onFirstNameChange(name: string) {
      if (name !== firstName) {
        if (props.error) {
          props.resetErrorMessage();
        }
        setFirstName(name);
      }
    }
    function onLastNameChange(name: string) {
      if (name !== lastName) {
        if (props.error) {
          props.resetErrorMessage();
        }
        setLastName(name);
      }
    }
    function onDateOfBirthChange(dob: string) {
      if (dob !== dateOfBirth) {
        if (props.error) {
          props.resetErrorMessage();
        }
        setDateOfBirth(dob);
      }
    }
    function onPhoneNumberChangeHandler(event: BaseSyntheticEvent) {
      const phone = event.target.value;
      const validTextInput = phone.replace(/[^0-9]+/g, '');
      if (
        validTextInput.length <= JoinWaitlistScreenContent.phoneNumberLength &&
        validTextInput !== phoneNumber
      ) {
        if (props.error) {
          props.resetErrorMessage();
        }
        setPhoneNumber(validTextInput);
      }
    }
    function onOtherPersonSelectedHandler(selected: string) {
      if (props.error) {
        props.resetErrorMessage();
      }
      if (selected !== identifier) {
        setIdentifier(selected);
      }
    }

    function renderOtherPersonDetails() {
      if (selectedPatientType === 1) {
        return (
          <View style={otherPersonFormContainerStyle}>
            <OtherPersonInfo
              onOtherPersonSelected={onOtherPersonSelectedHandler}
              onPhoneNumberChange={onPhoneNumberChangeHandler}
              onFirstNameChange={onFirstNameChange}
              onLastNameChange={onLastNameChange}
              onDateOfBirthChange={onDateOfBirthChange}
              currentInfo={{
                firstName,
                lastName,
                dateOfBirth,
                phoneNumber,
                serviceType: serviceType.type,
                availableWaitlistMembers,
              }}
              serviceType={serviceType}
            />
          </View>
        );
      }
      return null;
    }

    const onTogglePatientType = (selection: number) => {
      guestExperienceCustomEventLogger(
        CustomAppInsightEvents.SELECTED_WAITLIST_PERSON,
        {
          personSelected:
            selection === 0
              ? JoinWaitlistScreenContent.toggleOptionMyself
              : JoinWaitlistScreenContent.toggleOptionOtherPerson,
        }
      );
      if (props.error) {
        props.resetErrorMessage();
      }
      setSelectedPatientType(selection);
      setIdentifier('');
    };

    const joinButtonDisabled =
      !!props.error ||
      zipValue.length !== JoinWaitlistScreenContent.zipCodeLength ||
      (selectedPatientType !== 0 &&
        (identifier === '' ||
          identifier === 'default' ||
          (identifier === 'newDependent'
            ? firstName.trim() === '' ||
              lastName.trim() === '' ||
              dateOfBirth === '' ||
              !DateValidator.isDateOfBirthValid(dateOfBirth) ||
              phoneNumber.length < JoinWaitlistScreenContent.phoneNumberLength
            : false)));

    const onJoinPress = () => {
      guestExperienceCustomEventLogger(
        CustomAppInsightEvents.PRESSED_JOIN_WAITLIST_BUTTON,
        {}
      );
      if (props.error) {
        props.resetErrorMessage();
      }
      props.updateLocationPreferences(zipValue, distanceValue);
      if (selectedPatientType === 0) {
        props.onJoinPress(navigation, {
          serviceType: props.serviceType.type,
          zipCode: zipValue,
          maxMilesAway: distanceValue,
          myself: true,
        } as ICreateWaitlistRequestBody);
      } else {
        if (identifier === 'newDependent') {
          props.onJoinPress(navigation, {
            serviceType: serviceType.type,
            zipCode: zipValue,
            maxMilesAway: distanceValue,
            myself: false,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            dateOfBirth,
            phoneNumber:
              phoneNumber !== ''
                ? PhoneNumberDialingCode + phoneNumber
                : undefined,
          } as ICreateWaitlistRequestBody);
        } else {
          props.onJoinPress(navigation, {
            serviceType: serviceType.type,
            zipCode: zipValue,
            maxMilesAway: distanceValue,
            myself: false,
            dependentIdentifier: identifier,
          } as ICreateWaitlistRequestBody);
        }
      }
    };

    return (
      <View style={bodyViewStyle} testID={'joinWaitlistScreenBody'}>
        <MarkdownText>{JoinWaitlistScreenContent.instructions}</MarkdownText>
        <View style={selectedServiceViewStyle}>
          <MarkdownText>{JoinWaitlistScreenContent.interestedIn}</MarkdownText>
          <MarkdownText textStyle={selectedServiceTextStyle}>
            {props.serviceType.serviceNameMyRx}
          </MarkdownText>
        </View>
        <View style={locationFormViewStyle}>
          {renderZipCodeField()}
          {renderDistanceField()}
        </View>
        <RadioButtonToggle
          onOptionSelected={onTogglePatientType}
          optionAText={JoinWaitlistScreenContent.toggleOptionMyself}
          optionBText={JoinWaitlistScreenContent.toggleOptionOtherPerson}
          headerText={JoinWaitlistScreenContent.toggleHeaderText}
          defaultSelectedOption={0}
        />
        {renderOtherPersonDetails()}
        {renderError()}
        <View
          style={
            props.error
              ? joinWaitlistScreenStyle.buttonContainerWithErrorViewStyle
              : joinWaitlistScreenStyle.buttonContainerViewStyle
          }
        >
          <BaseButton disabled={joinButtonDisabled} onPress={onJoinPress}>
            {JoinWaitlistScreenContent.joinButtonLabel}
          </BaseButton>
        </View>
      </View>
    );
  }

  return (
    <BasicPageConnected
      header={header}
      headerViewStyle={headerViewStyle}
      body={renderBody()}
      hideNavigationMenuButton={false}
      showProfileAvatar={true}
      navigateBack={navigation.goBack}
      translateContent={true}
    />
  );
};
