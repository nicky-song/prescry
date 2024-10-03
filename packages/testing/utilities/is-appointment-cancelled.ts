// Copyright 2023 Prescryptive Health, Inc.

import DatabaseConnection from './database/database-connection';

export const isAppointmentCancelled = async (orderNumber: string) => {
  const connection = await DatabaseConnection.connect();
  try {
    const rxAssistantDatabase = connection.getRxAssistant();
    const appointment = await rxAssistantDatabase.findAppointmentByOrderNumber(
      orderNumber
    );

    if (appointment === null) return null;

    return appointment.eventData.appointment.status === 'Cancelled';
  } catch (error) {
    throw new Error(
      `Failed to get Appointment document in database with error ${error}`
    );
  } finally {
    await connection.close();
  }
};
