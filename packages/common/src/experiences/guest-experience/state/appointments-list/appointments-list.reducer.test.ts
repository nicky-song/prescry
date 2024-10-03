// Copyright 2021 Prescryptive Health, Inc.

import { IAppointmentListItem } from '../../../../models/api-response/appointment.response';
import { appointmentsListReducer } from './appointments-list.reducer';
import { defaultAppointmentsListState, IAppointmentsListState } from './appointments-list.state';
import { setCurrentAppointmentsAction } from './actions/set-current-appointments.action';
import { IAppointmentType } from '../../../../components/member/lists/appointments-list/appointments-list';
import { appointmentsListMock } from '../../__mocks__/appointments-list.mock';

describe('AppointmentsListReducer', () => {
  it('reduces to default values when appointmentListType changes', () => {
    const initialAppointments: IAppointmentListItem[] = appointmentsListMock;
    const initialStart: number = defaultAppointmentsListState.start;
    const initialAppointmentsListType: IAppointmentType = defaultAppointmentsListState.appointmentsType;
    const initialAllAppointmentsReceived: boolean = defaultAppointmentsListState.allAppointmentsReceived;

    const expectedAppointments: IAppointmentListItem[] = defaultAppointmentsListState.appointments;
    const expectedStart: number = defaultAppointmentsListState.start;
    const expectedAppointmentsListType: IAppointmentType = 'cancelled' as IAppointmentType;
    const expectedAllAppointmentsReceived = true;

    const initialState: IAppointmentsListState = { appointments: initialAppointments, start: initialStart, appointmentsType: initialAppointmentsListType, allAppointmentsReceived: initialAllAppointmentsReceived, batchSize: defaultAppointmentsListState.batchSize };

    const expectedState: IAppointmentsListState = { appointments: expectedAppointments, start: expectedStart, appointmentsType: expectedAppointmentsListType, allAppointmentsReceived: expectedAllAppointmentsReceived, batchSize: defaultAppointmentsListState.batchSize };
    
    const action = setCurrentAppointmentsAction(defaultAppointmentsListState.appointments, defaultAppointmentsListState.start, 'cancelled' as IAppointmentType, defaultAppointmentsListState.batchSize);

    const reducedState = appointmentsListReducer(initialState, action);

    expect(reducedState).toEqual(expectedState);
  });
  it('reduces allAppointmentsReceived to true when no appointments and start > 0', () => {
    const initialAppointments: IAppointmentListItem[] = appointmentsListMock;
    const initialStart = 5;
    const initialAppointmentsListType: IAppointmentType = defaultAppointmentsListState.appointmentsType;
    const initialAllAppointmentsReceived: boolean = defaultAppointmentsListState.allAppointmentsReceived;

    const expectedAppointments: IAppointmentListItem[] = appointmentsListMock;
    const expectedStart = 5;
    const expectedAppointmentsListType: IAppointmentType = defaultAppointmentsListState.appointmentsType;
    const expectedAllAppointmentsReceived = true;

    const initialState: IAppointmentsListState = { appointments: initialAppointments, start: initialStart, appointmentsType: initialAppointmentsListType, allAppointmentsReceived: initialAllAppointmentsReceived, batchSize: defaultAppointmentsListState.batchSize };

    const expectedState: IAppointmentsListState = { appointments: expectedAppointments, start: expectedStart, appointmentsType: expectedAppointmentsListType, allAppointmentsReceived: expectedAllAppointmentsReceived, batchSize: defaultAppointmentsListState.batchSize };
    
    const action = setCurrentAppointmentsAction(defaultAppointmentsListState.appointments, initialStart, initialAppointmentsListType, defaultAppointmentsListState.batchSize);

    const reducedState = appointmentsListReducer(initialState, action);

    expect(reducedState).toEqual(expectedState);
  });
  it('reduces appointments to concat state and payload (less than batch)', () => {
    const initialAppointments: IAppointmentListItem[] = appointmentsListMock;
    const initialStart = 5;
    const initialAppointmentsListType: IAppointmentType = defaultAppointmentsListState.appointmentsType;
    const initialAllAppointmentsReceived: boolean = defaultAppointmentsListState.allAppointmentsReceived;

    const expectedAppointments: IAppointmentListItem[] =  appointmentsListMock.concat(appointmentsListMock);
    const expectedStart = 6;
    const expectedAppointmentsListType: IAppointmentType = defaultAppointmentsListState.appointmentsType;
    const expectedAllAppointmentsReceived = true;

    const initialState: IAppointmentsListState = { appointments: initialAppointments, start: initialStart, appointmentsType: initialAppointmentsListType, allAppointmentsReceived: initialAllAppointmentsReceived, batchSize: defaultAppointmentsListState.batchSize };

    const expectedState: IAppointmentsListState = { appointments: expectedAppointments, start: expectedStart, appointmentsType: expectedAppointmentsListType, allAppointmentsReceived: expectedAllAppointmentsReceived, batchSize: defaultAppointmentsListState.batchSize };
    
    const action = setCurrentAppointmentsAction(appointmentsListMock, 5, defaultAppointmentsListState.appointmentsType, defaultAppointmentsListState.batchSize);

    const reducedState = appointmentsListReducer(initialState, action);

    expect(reducedState).toEqual(expectedState);
  });
  it('reduces appointments to concat state and payload (equal batch)', () => {
    const fiveAppointmentsMock = [...appointmentsListMock, ...appointmentsListMock, ...appointmentsListMock, ...appointmentsListMock, ...appointmentsListMock];
    
    const initialAppointments: IAppointmentListItem[] = appointmentsListMock;
    const initialStart = 5;
    const initialAppointmentsListType: IAppointmentType = defaultAppointmentsListState.appointmentsType;
    const initialAllAppointmentsReceived: boolean = defaultAppointmentsListState.allAppointmentsReceived;

    const expectedAppointments: IAppointmentListItem[] =  appointmentsListMock.concat(fiveAppointmentsMock);
    const expectedStart = 10;
    const expectedAppointmentsListType: IAppointmentType = defaultAppointmentsListState.appointmentsType;
    const expectedAllAppointmentsReceived: boolean = defaultAppointmentsListState.allAppointmentsReceived;

    const initialState: IAppointmentsListState = { appointments: initialAppointments, start: initialStart, appointmentsType: initialAppointmentsListType, allAppointmentsReceived: initialAllAppointmentsReceived, batchSize: defaultAppointmentsListState.batchSize };

    const expectedState: IAppointmentsListState = { appointments: expectedAppointments, start: expectedStart, appointmentsType: expectedAppointmentsListType, allAppointmentsReceived: expectedAllAppointmentsReceived, batchSize: defaultAppointmentsListState.batchSize };

    const action = setCurrentAppointmentsAction(fiveAppointmentsMock, 5, defaultAppointmentsListState.appointmentsType, defaultAppointmentsListState.batchSize);

    const reducedState = appointmentsListReducer(initialState, action);

    expect(reducedState).toEqual(expectedState);
  });
});
