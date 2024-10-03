// Copyright 2022 Prescryptive Health, Inc.

import { searchCollection } from './collection.helper.js';

export const getAccountsForPhoneNumbers = async (phoneNumbers) =>
  searchCollection('Account', { phoneNumber: { $in: phoneNumbers } });

export const searchAllUsersToDelete = async (skip, limit) =>
  searchCollection(
    'Person',
    {
      $or: [
        // Empty Cash Users
        {
          rxGroupType: 'CASH',
          isPrimary: true,
          phoneNumber: '',
          $or: [{ deleted: { $exists: false } }, { deleted: false }],
        },
        // Deleted Cash Users
        {
          rxGroupType: 'CASH',
          isPrimary: true,
          phoneNumber: /X\+1/i,
          $or: [{ deleted: { $exists: false } }, { deleted: false }],
        },
        // Deleted Pbm Users
        {
          rxGroupType: 'SIE',
          isPrimary: true,
          phoneNumber: /X\+1/i,
          $or: [{ deleted: { $exists: false } }, { deleted: false }],
        },
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

const overrideNumbers = process.env.OVERRIDE_NUMBERS?.split(',') ?? null;

export const getAllUnpublishedCashUsers = async (skip, limit) =>
  searchCollection(
    'Person',
    {
      $and: [
        { rxGroupType: 'CASH', rxSubGroup: 'CASH01', isPrimary: true },
        ...(overrideNumbers
          ? [{ phoneNumber: { $in: overrideNumbers } }]
          : [
              {
                $and: [
                  { phoneNumber: { $exists: true } },
                  { phoneNumber: { $ne: '' } },
                  { phoneNumber: /\+1/i },
                ],
              },
            ]),
        { $or: [{ deleted: { $exists: false } }, { deleted: false }] },
        { $or: [{ masterId: { $exists: false } }, { masterId: null }] },
        { $or: [{ accountId: { $exists: false } }, { accountId: null }] },
      ],
    },
    skip,
    limit
  );

export const getPBMUsersForPhoneNumbers = async (phoneNumbers) =>
  searchCollection('Person', {
    $and: [
      { phoneNumber: { $in: phoneNumbers } },
      { rxGroupType: 'SIE' },
      { $or: [{ deleted: { $exists: false } }, { deleted: false }] },
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

export const getCashUsersForPhoneNumbers = async (phoneNumbers) =>
  searchCollection('Person', {
    $and: [
      { phoneNumber: { $in: phoneNumbers } },
      { rxGroupType: 'CASH' },
      { $or: [{ deleted: { $exists: false } }, { deleted: false }] },
    ],
  });
