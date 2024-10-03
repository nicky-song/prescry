// Copyright 2021 Prescryptive Health, Inc.

import { IMarkedDate } from '../../../../../components/member/appointment-calendar/appointment-calendar';
import { IProcessInviteCodeResponse } from '../../../../../models/api-response/process-invite-code.response';
import {
  ILocation,
  IServiceInfo,
} from '../../../../../models/api-response/provider-location-details-response';
import { IProviderLocationDetails } from '../../../../../models/api-response/provider-location-response';
import { ServiceTypes } from '../../../../../models/provider-location';
import { processInviteCode } from '../../../api/api-v1.process-invite-code';
import { setCalendarStatusAction } from '../../appointment/actions/set-calendar-status.action';
import { setInviteCodeAction } from '../../appointment/actions/set-invite-code.action';
import { setSelectedLocationAction } from '../../appointment/actions/set-selected-location.action';
import { getProviderLocationsResponseAction } from '../../provider-locations/actions/get-provider-locations-response.action';
import { setServiceDetailsAction } from '../../service-type/actions/set-service-details.action';
import { setServiceTypeAction } from '../../service-type/actions/set-service-type.action';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { processInviteCodeDispatch } from './process-invite-code.dispatch';

const response: IProcessInviteCodeResponse = {
  data: {
    availableSlots: { slots: [], unAvailableDays: [] },
    location: {
      id: '1',
      providerName: 'Bartell Drugs',
      locationName: 'Bartell Drugs',
      address1: '7370 170th Ave NE',
      city: 'Redmond',
      state: 'WA',
      zip: '98052',
      phoneNumber: '(425) 977-5489',
      serviceInfo: {} as IServiceInfo[],
      timezone: 'PDT',
      regionName: 'Western Washington',
    } as ILocation,
    service: { serviceType: ServiceTypes.c19Vaccine } as IServiceInfo,
    inviteCode: 'string',
    minDate: 'string',
    maxDate: 'string',
    serviceNameMyRx: 'mock-service-name',
    minimumAge: 3,
    aboutQuestionsDescriptionMyRx: 'mock-about-question-desc',
    aboutDependentDescriptionMyRx: 'mock-about-dep-desc',
    cancellationPolicyMyRx: 'mock-cancellation-policy',
  },
  message: 'ok',
  status: 'ok',
};

jest.mock('../../../api/api-v1.process-invite-code', () => ({
  processInviteCode: jest.fn().mockResolvedValue({
    data: {
      availableSlots: { slots: [], unAvailableDays: [] },
    },
  }),
}));
const processInviteCodeMock = processInviteCode as jest.Mock;

jest.mock('../../settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

const authTokenMock = 'auth_token';
const deviceTokenMock = 'device_token';

const defaultStateMock = {
  config: {
    apis: {},
  },
  settings: {
    deviceToken: deviceTokenMock,
    token: authTokenMock,
  },
};
const getStateMock = jest.fn();

describe('processInviteCodeDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getStateMock.mockReturnValue(defaultStateMock);
    processInviteCodeMock.mockResolvedValue(response);
  });

  it('calls processInviteCode API with expected arguments', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const stateMock = {
      ...defaultStateMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
      },
    };
    getStateMock.mockReturnValue(stateMock);

    const inviteCode = 'invite-code';

    const dispatchMock = jest.fn();

    await processInviteCodeDispatch(dispatchMock, getStateMock, inviteCode);

    expect(processInviteCodeMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      inviteCode,
      authTokenMock,
      deviceTokenMock
    );
    expect(tokenUpdateDispatchMock).toBeCalled();
  });

  it('dispatches getProviderLocationsResponseAction', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const stateMock = {
      ...defaultStateMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
      },
    };
    getStateMock.mockReturnValue(stateMock);

    const inviteCode = 'invite-code';

    const dispatchMock = jest.fn();
    await processInviteCodeDispatch(dispatchMock, getStateMock, inviteCode);

    processInviteCodeMock.mockResolvedValue(response);

    const responseAction = getProviderLocationsResponseAction([
      response.data.location,
    ] as IProviderLocationDetails[]);
    expect(dispatchMock).toHaveBeenNthCalledWith(1, responseAction);
  });

  it('dispatches setSelectedLocationAction', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const stateMock = {
      ...defaultStateMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
      },
    };
    getStateMock.mockReturnValue(stateMock);

    const inviteCode = 'invite-code';

    const dispatchMock = jest.fn();
    await processInviteCodeDispatch(dispatchMock, getStateMock, inviteCode);

    const responseAction = setSelectedLocationAction({
      selectedLocation: response.data.location,
      selectedService: response.data.service,
      minDate: response.data.minDate,
      maxDate: response.data.maxDate,
    });
    expect(dispatchMock).toHaveBeenNthCalledWith(2, responseAction);
  });

  it('dispatches setServiceTypeAction', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const stateMock = {
      ...defaultStateMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
      },
    };
    getStateMock.mockReturnValue(stateMock);

    const inviteCode = 'invite-code';

    const dispatchMock = jest.fn();
    await processInviteCodeDispatch(dispatchMock, getStateMock, inviteCode);

    processInviteCodeMock.mockResolvedValue(response);

    const responseAction = setServiceTypeAction({
      type: response.data.service.serviceType,
    });
    expect(dispatchMock).toHaveBeenNthCalledWith(3, responseAction);
  });

  it('dispatches setServiceDetailsAction action', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const stateMock = {
      ...defaultStateMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
      },
    };
    getStateMock.mockReturnValue(stateMock);

    const inviteCode = 'invite-code';

    const dispatchMock = jest.fn();
    await processInviteCodeDispatch(dispatchMock, getStateMock, inviteCode);

    processInviteCodeMock.mockResolvedValue(response);

    const responseAction = setServiceDetailsAction({
      serviceNameMyRx: response.data.serviceNameMyRx,
      minimumAge: response.data.minimumAge,
      aboutQuestionsDescriptionMyRx:
        response.data.aboutQuestionsDescriptionMyRx,
      aboutDependentDescriptionMyRx:
        response.data.aboutDependentDescriptionMyRx,
      cancellationPolicyMyRx: response.data.cancellationPolicyMyRx,
    });
    expect(dispatchMock).toHaveBeenNthCalledWith(4, responseAction);
  });
  it('dispatches setCalendarStatusAction', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const stateMock = {
      ...defaultStateMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
      },
    };
    getStateMock.mockReturnValue(stateMock);

    const inviteCode = 'invite-code';

    const dispatchMock = jest.fn();
    await processInviteCodeDispatch(dispatchMock, getStateMock, inviteCode);

    const markedDates: IMarkedDate = {};
    response.data.availableSlots.unAvailableDays.forEach((day: string) => {
      markedDates[day] = {
        disabled: true,
        disableTouchEvent: true,
      };
    });

    const responseAction = setCalendarStatusAction({
      slots: response.data.availableSlots.slots,
      markedDates,
    });
    expect(dispatchMock).toHaveBeenNthCalledWith(5, responseAction);
  });
  it('dispatches setInviteCodeAction', async () => {
    const stateMock = {
      ...defaultStateMock,
      inviteCode: undefined,
    };
    getStateMock.mockReturnValue(stateMock);

    const inviteCode = 'invite-code';

    const dispatchMock = jest.fn();
    await processInviteCodeDispatch(dispatchMock, getStateMock, inviteCode);

    const responseAction = setInviteCodeAction(inviteCode);
    expect(dispatchMock).toHaveBeenNthCalledWith(6, responseAction);
  });
});
