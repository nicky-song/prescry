// Copyright 2020 Prescryptive Health, Inc.

import { ITab } from '../../tabs/tabs';

export interface IAppointmentsListContent {
  confirmedText: string;
  canceledText: string;
  completedText: string;
  pastText: string;
  upcomingHeader: string;
  backToTopButtonText: string;
  seeMoreAppointmentsButton: string;
  appointmentBatchSize: number;
  noCancelledAppointmentsTitle: string;
  noCancelledAppointmentsContent: string;
  noUpcomingAppointmentsTitle: string;
  noUpcomingAppointmentsContent: string;
  noPastAppointmentsTitle: string;
  noPastAppointmentsContent: string;
  tabs: ITab[];
}

export const appointmentsListContent: IAppointmentsListContent = {
  confirmedText: 'Confirmed',
  canceledText: 'Cancelled',
  completedText: 'Completed',
  pastText: 'Past',
  upcomingHeader: 'Upcoming',
  backToTopButtonText: 'Back to the top',
  seeMoreAppointmentsButton: 'See more',
  appointmentBatchSize: 5,
  noCancelledAppointmentsTitle: 'No canceled appointments.',
  noCancelledAppointmentsContent:
    'Looks like you do not have any canceled appointments.',
  noUpcomingAppointmentsTitle: 'No upcoming appointments.',
  noUpcomingAppointmentsContent:
    'Looks like you do not have any upcoming appointments scheduled right now. Click the button below to find a service near you.',
  noPastAppointmentsTitle: 'No past appointments.',
  noPastAppointmentsContent:
    'Looks like you do not have any past appointments.',
  tabs: [
    { name: 'Upcoming', value: 'upcoming' },
    { name: 'Past', value: 'past' },
    { name: 'Canceled', value: 'cancelled' },
  ] as ITab[],
};
