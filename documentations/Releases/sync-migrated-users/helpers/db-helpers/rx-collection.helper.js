// Copyright 2022 Prescryptive Health, Inc.

import { searchCollection } from './collection.helper.js';

export const getAccountsForPhoneNumbers = async (phoneNumbers) =>
  searchCollection('Account', { phoneNumber: { $in: phoneNumbers } });

export const getAllRecentlyUpdatedUsers = (skip, limit) =>
  searchCollection(
    'Person',
    {
      $and: [
        { recentlyUpdated: { $exists: true } },
        { recentlyUpdated: true },
        { phoneNumber: /^\+1/i },
        { $or: [{ deleted: { $exists: false } }, { deleted: false }] },
      ],
    },
    skip,
    limit
  );

export const getAllRecentlyUpdatedAccounts = (skip, limit) =>
  searchCollection(
    'Account',
    {
      $and: [
        { recentlyUpdated: { $exists: true } },
        { recentlyUpdated: true },
        { $or: [{ deleted: { $exists: false } }, { deleted: false }] },
      ],
    },
    skip,
    limit
  );

export const getPBMUsersForPhoneNumbers = async (phoneNumbers) =>
  searchCollection('Person', {
    $and: [
      { phoneNumber: { $in: phoneNumbers } },
      { rxGroupType: 'SIE', isPrimary: true },
      { $or: [{ deleted: { $exists: false } }, { deleted: false }] },
    ],
  });

export const getCashUsersForPhoneNumbers = async (phoneNumbers) =>
  searchCollection('Person', {
    $and: [
      { phoneNumber: { $in: phoneNumbers } },
      { rxGroupType: 'CASH', isPrimary: true },
      { $or: [{ deleted: { $exists: false } }, { deleted: false }] },
    ],
  });

export const getAllUnlinkedPbmUsers = async (skip, limit) =>
  searchCollection(
    'Person',
    {
      $and: [
        { rxGroupType: 'SIE' },
        {
          $and: [
            { phoneNumber: { $exists: true } },
            { phoneNumber: { $ne: '' } },
            { phoneNumber: /^\+1/i },
          ],
        },
        { $or: [{ deleted: { $exists: false } }, { deleted: false }] },
        {
          $or: [{ masterId: { $exists: false } }, { masterId: { $eq: null } }],
        },
        {
          $and: [
            { accountId: { $exists: true } },
            { accountId: { $ne: null } },
          ],
        },
      ],
    },
    skip,
    limit
  );

export const getAllUnpublishedCashUsers = async (skip, limit) =>
  searchCollection(
    'Person',
    {
      $and: [
        { rxGroupType: 'CASH', isPrimary: true },
        {
          $and: [
            { phoneNumber: { $exists: true } },
            { phoneNumber: { $ne: '' } },
            { phoneNumber: /^\+1/i },
          ],
        },
        { $or: [{ deleted: { $exists: false } }, { deleted: false }] },
        { $or: [{ masterId: { $exists: false } }, { masterId: null }] },
        { $or: [{ accountId: { $exists: false } }, { accountId: null }] },
      ],
    },
    skip,
    limit
  );

export const searchAllDependents = async (familyIds) =>
  searchCollection('Person', {
    $and: [
      { primaryMemberFamilyId: { $in: familyIds } },
      { primaryMemberPersonCode: { $ne: '01' } },
      { $or: [{ deleted: { $exists: false } }, { deleted: false }] },
      { $or: [{ masterId: { $exists: false } }, { masterId: null }] },
      { $or: [{ accountId: { $exists: false } }, { accountId: null }] },
    ],
  });

export const getAllExistingCashDependents = async (skip, limit) =>
  searchCollection(
    'Person',
    {
      $and: [
        { rxGroupType: 'CASH', isPrimary: false },
        { $or: [{ deleted: { $exists: false } }, { deleted: false }] },
        { $or: [{ masterId: { $exists: false } }, { masterId: null }] },
        { $or: [{ accountId: { $exists: false } }, { masterId: null }] },
      ],
    },
    skip,
    limit
  );

export const searchAllPrimaryUsers = async (familyIds) =>
  searchCollection('Person', {
    primaryMemberFamilyId: { $in: familyIds },
    primaryMemberPersonCode: { $eq: '01' },
  });
