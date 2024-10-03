# PrimeRx Quick Start Guide

Follow the steps in this guide to get initially set up with PrimeRx for
development testing purposes.

## Table of Contents

- [Setup](#setup)
  - [Authentication](#authentication)
  - [Accessing PrimeRx](#accessing-primerx)
- [Basic operations](#basic-operations)
  - [Creating a prescription](#creating-a-prescription)
  - [View patent details](#view-patient-details)
  - [Moving prescriptions between queues](#moving-prescriptions-between-queues)
  - [Deleting prescriptions](#deleting-prescriptions)
  - [Deleting patients](#deleting-patients)
- [Troubleshooting](#troubleshooting)
  - [SMS not received](#sms-not-received)
  - [Opening prescription fails](#opening-prescription-fails)

---

## Setup

### Authentication

#### PhxPharm Account

Before anything else, you'll need a PrimeRx Azure Portal account
(**xxx@phxpharm.com**). Contact
[Daniel Velasco Torne](mailto:daniel@prescryptive.com) to make that happen.

#### PrimeRx Authentication

To log into the PrimeRx application itself, you'll use user name "Test" and
password "Test". However, in order for this to work, further access must be
granted. Contact [Sandeep Jain](mailto:sandeep@prescryptive.com) to get this set
up.

### Accessing PrimeRx

1. From Windows start menu, search for and start "Remote Desktop" app (not
   "Remote Desktop Connection")
1. First time:
   1. Click "Add" (upper right)
   1. Select "Workspaces"
   1. Specify workspace URL --
      https://rdweb.wvd.microsoft.com/api/arm/feeddiscovery
   1. Click "Subscribe" (if it's disabed, there's probably a typo in above URL)
1. If not already logged in, log in with "PhxPharm" credentials -- e.g.
   **xxx@phxpharm**
1. Double-click "SessionDesktop"
1. Specify **PhxPharm** credential password and click "Connect"
1. Start **C:\ShareQA\vm-qa-primrx** (save as shortcut or pin to taskbar so it's
   easy to find again)
1. double-click to start
1. if correct phxpharm account not shown, **\> more choices \> diff account \>
   xxx@phxpharm.com**
1. Specify password
1. Only 2 connections are permitted so you may need to disconnect someone else
   1. select someone who's been idle for a few minutes; _don't_ select "force"
   1. if there's no response within 30 secs, they'll be automatically
      disconnected
1. double-click **f:\phwin\phw**
1. Login:
   1. Creds: Test/Test
   1. Ignore alerts

## Basic operations

### Creating a prescription

**Important!** In the steps below, where it says \<Enter\>, always use \<Enter\>
and not \<Tab\> as you might expect. They're not always equivalent and sometimes
\<Tab\> misses some important steps and things just don't work.

1. Click "Enter Rx (F5)" (or, obviously, press \<F5\>).
1. Type last name of patient and press \<Enter\>.
1. Cursor should be on "Prescriber" name. Press \<Enter\> again.
1. Ignore the error about NPI number.
1. Specify first few letters of a drug name -- e.g. "IBU". Press \<Enter\>.
1. You should get a list of possible matches.
1. Pick the one you want. Ignore any warnings about the drug.
1. Press \<Enter\>.
1. Specify quantity. Press \<Enter\>.
1. Type "TEST" or "UD" in the "Sig" field. Press \<Enter\>.
1. Use \<Enter\> to move between fields and specify:
   1. Days supply (Days Supp.)
      1. Authorized refills (Auth.Rfls)
1. Press \<Enter\> until "File" shows up and is enabled in the buttons at the
   bottom left of the screen.
1. Click "File".
1. Use the default date and press "Save".

Congratulations! You've managed to create a new prescription.

At this point, your prescription should be created and indicate that it is in
the "File RX" queue.

Further, an SMS message should have been sent to the mobile phone number for the
patient you specified. If the patient _did not_ receive an SMS message within a
couple of minutes, there may be an issue with the patient record. See
[SMS not received](#sms-not-received) for possible causes.

### View patient details

#### Patient Information

1. Click "Patient (F9)" (or press \<F9\>).
1. Type last name of patient to search for. Press \<Enter\>.
1. If only one record, lucky you, that's probably the one you want. If multiple,
   you'll have to open each one to figure out which is the most up-to-date.
1. "Last Name", "First Name", "Date of Birth" must match the patient's record in
   the myRx database **Person** collection.
1. "Mobile number" must match the record in the myRx database.

#### More Patient Info

1. Click the "More Patient Info(Ctrl+M)" tab.
1. At the bottom center of the screen, there should be a table titled "External
   Identifiers". In that table, there should be a row with "Context" set to
   "Prescryptive" and "External Id". For PBM users, the id should be set to the
   **primaryMemberFamilyId** value from the patient's PBM record (**rxGroupType:
   SIE**) in the **Person** collection in the myRx database. For CASH users, it
   would be the value from the same property in the CASH record in the
   **Person** collection.

### Moving prescriptions between queues

Note: In the production system, many of these queue transitions happen
automatically. In the test environment, however, we don't actually send any
information to pharmacies so we have to manually make these transitions
ourselves.

1. Click "History (F6)".
1. Specify last name of Patient for prescription(s) you want to move. Press
   \<Enter\>.
1. Select Patient if more than one matched.
1. You should see a list of prescriptions for the selected patient. Double-click
   the prescription to move.
1. Click the "Workflow" tab.
1. Depending upon the queue the prescription is currently in, you'll see various
   buttons to move the prescription to a different queue (e.g. "FILL AT
   PHARMACY", "TRANSFER OUT", "Move To Exception", "Move to queue", "COMPLETE",
   etc.). Click the button for the queue you want the prescription to move to.

### Deleting prescriptions

1. Click "History (F6)".
1. Specify last name of Patient for prescription(s) you want to move. Press
   \<Enter\>.
1. Select Patient if more than one matched.
1. Right-click on prescription to delete and select "Delete".
1. Select "Yes".

### Deleting patients

**Note:** If a patient has any prescriptions, you will not be able to delete the
patient. You must first
[delete all prescriptions for the patient](#deleting-prescriptions).

1. Click "Patient (F9)".
1. Type last name of patient to search for. Press \<Enter\>.
1. Right-click on patient to delete and select "Delete".
1. Select "Yes".

## Troubleshooting

### SMS not received

If the new prescription SMS is never received by the patient.

The mobile number may be incorrect or missing in the PrimeRx patient
information. Verify the _mobile_ phone number in the patient record. See
[Patient Information](#patient-information).

### Opening prescription fails

A new prescription has been successfully created and the SMS message containing
the deep link has been received but clicking on the link causes myRx to error
out.

The Prescryptive external id may be missing in the PrimeRx patient information.
Verify that the "External Id" exists and is valid. See
[More Patient Info](#more-patient-info).

If the id _is_ missing, try the following:

1. Clear all Redis keys for phone number.
1. Try accessing the deep link again using either Incognito mode or after
   clearing browser cache.
