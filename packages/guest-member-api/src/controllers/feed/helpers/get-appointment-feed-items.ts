// Copyright 2020 Prescryptive Health, Inc.

import {
  IFeedItem,
  ITitleDescriptionContext,
} from '@phx/common/src/models/api-response/feed-response';
import {
  getAllAppointmentEventsForMember,
  getUpcomingAppointmentsCountEventForMember,
} from '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper';
import { IFeedItemParams } from './get-feed-item-context';

export async function getAppointmentFeedItems(
  params: IFeedItemParams
): Promise<IFeedItem[]> {
  const { feed, members, database } = params;
  if (members.length < 1) {
    return [];
  }
  const appointmentFeedItems: IFeedItem[] = [];
  const appointments = await getAllAppointmentEventsForMember(
    members,
    database
  );
  if (appointments && appointments.length > 0) {
    const upcomingAppointmentsCount =
      await getUpcomingAppointmentsCountEventForMember(members, database);
    const appointmentContext: ITitleDescriptionContext = {};
    const count =
      upcomingAppointmentsCount > 0
        ? ' (' + upcomingAppointmentsCount + ')'
        : '';
    if (feed.context) {
      appointmentContext.title = feed.context.title + count;
      appointmentContext.description = feed.context.description;
    }
    appointmentFeedItems.push({
      feedCode: feed.feedCode,
      context: {
        defaultContext: appointmentContext,
      },
    });
  }
  return appointmentFeedItems;
}
