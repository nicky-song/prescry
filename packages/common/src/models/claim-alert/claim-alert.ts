// Copyright 2022 Prescryptive Health, Inc.

import { IContactInfo } from '../contact-info';
import { IAlternativeMedication } from '../alternative-medication';
import { IPrescribedMedication } from '../prescribed-medication';

/**
 * The party/entity that has been classified as the saver
 */
export type IWhoSaves = 'plan' | 'member' | 'none';
/**
 * Clam Notification type after processing.
 */
export type ClaimNotification =
  | 'alternativesAvailable'
  | 'bestPrice'
  | 'reversal';

/**
 * Alert generated from a prescription claim
 */
export interface IClaimAlert {
  /**
   * Claim alert ID
   */
  identifier: string;
  /**
   * Unique ID for a patient
   * @example "630fb621e0880fd69c89ba78"
   */
  masterId: string;
  /**
   * Type of notification
   */
  notificationType: ClaimNotification;
  /**
   * Currently prescribed medication
   */
  prescribedMedication: IPrescribedMedication;
  /**
   * Alternative medications available for this prescription
   */
  alternativeMedicationList: IAlternativeMedication[];
  /**
   * Contact info for the pharmacy
   */
  pharmacyInfo: IContactInfo;
  /**
   * Contact info for the prescriber
   */
  prescriber: Pick<IContactInfo, 'name' | 'phone'>;
}

// TODO: M.Meletti - Investigate other the usage of other existing interfaces
