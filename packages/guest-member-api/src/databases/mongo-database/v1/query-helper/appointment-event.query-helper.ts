// Copyright 2020 Prescryptive Health, Inc.

import { IDatabase } from '../setup/setup-database';
import { ApiConstants } from '../../../../constants/api-constants';
import moment from 'moment';

export const getAllAppointmentEventsForMember = (
  memberIds: string[],
  database: IDatabase
) =>
  database.Models.AppointmentEventModel.find({
    $and: [
      { eventType: ApiConstants.APPOINTMENT_EVENT_TYPE },
      {
        $or: [
          { 'eventData.bookingStatus': 'Confirmed' },
          { 'eventData.bookingStatus': 'Completed' },
          {
            $and: [
              { 'eventData.bookingStatus': 'Cancelled' },
              {
                'eventData.bookingStatusReason': {
                  $in: [
                    'CustomerInitiatedCancellation',
                    'PharmacistInitiatedCancellation',
                  ],
                },
              },
            ],
          },
        ],
      },
      { 'eventData.appointment.memberRxId': { $in: memberIds } },
    ],
  }).sort('-eventData.appointment.start');

export const getAppointmentEventByOrderNumber = (
  primaryMemberRxId: string,
  appointmentId: string,
  database: IDatabase
) =>
  database.Models.AppointmentEventModel.findOne({
    $and: [
      { 'eventData.orderNumber': appointmentId },
      { eventType: ApiConstants.APPOINTMENT_EVENT_TYPE },
      { 'eventData.appointment.memberRxId': primaryMemberRxId },
    ],
  }).sort('-eventData.appointment.start');

export const getAppointmentEventByOrderNumberNoRxId = (
  appointmentId: string,
  database: IDatabase
) =>
  database.Models.AppointmentEventModel.findOne({
    $and: [
      { 'eventData.orderNumber': appointmentId },
      { eventType: ApiConstants.APPOINTMENT_EVENT_TYPE },
    ],
  }).sort('-eventData.appointment.start');

export const getMaxOrderNumberFromAppointment = (database: IDatabase) =>
  database.Models.AppointmentEventModel.findOne(
    {
      $and: [
        { eventType: ApiConstants.APPOINTMENT_EVENT_TYPE },
        { 'eventData.orderNumber': { $exists: true } },
      ],
    },
    'eventData.orderNumber'
  ).sort('-eventData.orderNumber');

export const getUpcomingAppointmentEventsForMember = (
  memberIds: string[],
  database: IDatabase,
  skip: number,
  limit: number
) =>
  database.Models.AppointmentEventModel.find({
    $and: [
      { eventType: ApiConstants.APPOINTMENT_EVENT_TYPE },
      {
        'eventData.bookingStatus': 'Confirmed',
      },
      { 'eventData.appointment.memberRxId': { $in: memberIds } },
      {
        'eventData.appointment.startInUtc': {
          $gte: moment.utc().format(),
        },
      },
    ],
  })
    .sort('eventData.appointment.start')
    .skip(skip)
    .limit(limit);

export const getPastAppointmentEventsForMember = (
  memberIds: string[],
  database: IDatabase,
  skip: number,
  limit: number
) =>
  database.Models.AppointmentEventModel.find({
    $and: [
      { eventType: ApiConstants.APPOINTMENT_EVENT_TYPE },
      {
        $or: [
          { 'eventData.bookingStatus': 'Completed' },
          {
            $and: [
              { 'eventData.bookingStatus': 'Confirmed' },
              {
                'eventData.appointment.startInUtc': {
                  $lt: moment.utc().format(),
                },
              },
            ],
          },
        ],
      },
      { 'eventData.appointment.memberRxId': { $in: memberIds } },
    ],
  })
    .sort('-eventData.appointment.start')
    .skip(skip)
    .limit(limit);

export const getCancelledAppointmentEventsForMember = (
  memberIds: string[],
  database: IDatabase,
  skip: number,
  limit: number
) =>
  database.Models.AppointmentEventModel.find({
    $and: [
      { eventType: ApiConstants.APPOINTMENT_EVENT_TYPE },
      {
        $and: [
          { 'eventData.bookingStatus': 'Cancelled' },
          {
            'eventData.bookingStatusReason': {
              $in: [
                'CustomerInitiatedCancellation',
                'PharmacistInitiatedCancellation',
              ],
            },
          },
        ],
      },
      { 'eventData.appointment.memberRxId': { $in: memberIds } },
    ],
  })
    .sort('-eventData.appointment.start')
    .skip(skip)
    .limit(limit);
export const getUpcomingAppointmentsCountEventForMember = (
  memberIds: string[],
  database: IDatabase
) =>
  database.Models.AppointmentEventModel.countDocuments({
    $and: [
      { eventType: ApiConstants.APPOINTMENT_EVENT_TYPE },
      { 'eventData.bookingStatus': 'Confirmed' },
      { 'eventData.appointment.memberRxId': { $in: memberIds } },
      {
        'eventData.appointment.startInUtc': {
          $gte: moment.utc().format(),
        },
      },
    ],
  }).sort('-eventData.appointment.start');
