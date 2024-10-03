// Copyright 2022 Prescryptive Health, Inc.

import { IGuestExperienceConfig } from '../../experiences/guest-experience/guest-experience-config';
import { transPerfectInject } from './transperfect-script.helper';

const transPerfectJavascriptUrlMock = 'transperfect-javascript-url-mock';
const transPerfectKeyMock = 'transperfect-key-mock';

const configStateMock = {
  transPerfectJavascriptUrl: transPerfectJavascriptUrlMock,
  transPerfectKey: transPerfectKeyMock,
} as IGuestExperienceConfig;

const transPerfectInjectedHtml =
  '<script referrerpolicy="no-referrer-when-downgrade" type="text/javascript" src="transperfect-javascript-url-mock" data-oljs="transperfect-key-mock" name="transperfect-script"></script>';

describe('transPerfectInject', () => {
  it('should append script to head if usetrans && !containsScript.length', () => {
    document.head.innerHTML = '';

    transPerfectInject({ usetrans: true }, configStateMock);

    expect(document.head.innerHTML).toBe(transPerfectInjectedHtml);
  });

  it('should not append script to head if !usetrans && !containsScript.length', () => {
    document.head.innerHTML = '';

    transPerfectInject({ usetrans: false }, configStateMock);

    expect(document.head.innerHTML).toBe('');
  });

  it('should not append additional script to head if usetrans && containsScript.length', () => {
    document.head.innerHTML = transPerfectInjectedHtml;

    transPerfectInject({ usetrans: true }, configStateMock);

    expect(document.head.innerHTML).toBe(transPerfectInjectedHtml);
  });

  it('should not append script to head if !usetrans && containsScript.length', () => {
    document.head.innerHTML = transPerfectInjectedHtml;

    transPerfectInject({ usetrans: true }, configStateMock);

    expect(document.head.innerHTML).toBe(transPerfectInjectedHtml);
  });
});
