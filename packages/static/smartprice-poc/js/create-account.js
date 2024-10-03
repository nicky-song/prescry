// Copyright 2021 Prescryptive Health, Inc.

var query = new URLSearchParams(document.location.search);
var service = query.get('service') || document.location.origin;

var registration = {
  dateOfBirth: null,
  phoneNumber: null,
  firstName: null,
  lastName: null,
  email: null,
  verifyCode: null,
  source: null
}

var boxes = {
  dobToolTip: new jBox('Tooltip', { 
    content: 'You must be older than 13', 
    target: '#dateOfBirth',
    position: { x: 'center', y: 'bottom' }, 
  }),
  phoneToolTip: new jBox('Tooltip', { 
    content: 'Phone number must be 10 digit', 
    target: '#phone',
    position: { x: 'center', y: 'bottom' }, 
  }),
  verificationToolip: new jBox('Tooltip', { 
    content: '6 digit verification code is required.', 
    target: '#verificationCode',
    position: { x: 'center', y: 'bottom' }, 
  }),
  verifyModal: null
};

var messages = {
  'NOT_FUTURE': 'Cannot be a date in the future',
  'TOO_YOUNG': 'Too young'
}

function dateOfBirth(dateOfBirthText) {
  const minAge = 13;
  var dob = new Date(Date.parse((dateOfBirthText || '').trim()));
  var today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const date = today.getDate();
  const minDateOfBirth = new Date(year - minAge, month, date);
  if (dob > minDateOfBirth)  {
		return { error: messages.TOO_YOUNG };
	} else { 
    return  { value: dob, error: undefined };
  }
}

function validateDateOfBirth(dateOfBirthText) {
  var dob = dateOfBirth(dateOfBirthText);
  if (dob.error === messages.TOO_YOUNG) {
    boxes.dobToolTip.open();
    jQuery('#dateOfBirth').focus().get(0).scrollIntoView();
    return undefined;
  }
  return dob.value;
}

function validatePhone(phoneText) {
  phoneText = '+1' + (phoneText || '').trim().replace(/[^\d]/gi,'');
  if (phoneText.length !== 12) {
    boxes.phoneToolTip.open();
    jQuery('#phone').focus().get(0).scrollIntoView();
    return undefined;
  }
  return phoneText;
}

var verifyPayload = {
  phoneNumber: null
};

function startRegistration(form) {
	try {
    boxes.phoneToolTip.close();
    boxes.dobToolTip.close();
    var dob = validateDateOfBirth(form['dateOfBirth'].value);
    var phone = validatePhone(form['phone'].value);

    if (!dob || !phone) {
      return false;
    }

    registration.dateOfBirth = dob;
    registration.phoneNumber = phone;
    registration.firstName = form['firstName'].value;
    registration.lastName = form['lastName'].value;
    registration.email = form['email'].value;

    boxes.verifyModal = createVerifyModal(phone);
    boxes.verifyModal.open();

	} catch (ex) {
		alert(ex.message && ex);
	} finally {
		return false;
	}
}


var createVerifyModal = function (phoneNumber) {
  return new jBox('Modal', {
    title: 'Sending verification code...',
    closeButton: false,
    overlay: true,
    ajax: {
      url: service + '/api/one-time-password/send',
      method: 'POST',
      data: JSON.stringify({ phoneNumber }),
      processData: false,
      reload: 'strict',
      contentType: 'application/json',
      dataType: 'json',
      setContent: false,
      success: function (response) {
        this.setTitle('Please enter the code sent to your mobile phone: ')
        this.setContent(jQuery('.hidden-divs .verify-code-div').html());
        jQuery('.jBox-content input.verify-code-input').focus();
      },
      error: function () {
        this.setContent('Error sending registration code.<br/>Reload page and try again.');
      }
    },
    onCloseComplete: function() {
      this.setTitle('Sending verification code...');
    },
  });
}

function verifyRegistrationCode() {
	try {
    const code = jQuery('.verify-code-input').get(1).value.trim();
    if (code.length !== 6) {
      boxes.verificationToolip.open();
    }
    registration.verifyCode = code;
    registration.source = query.get('bi') ? query.get('bi') : "";
    jQuery.ajax({
      url: service + '/api/smart-price/register',
      method: 'POST',
      data: JSON.stringify(registration),
      processData: false,
      reload: 'strict',
      contentType: 'application/json',
      dataType: 'json',
      setContent: false,
      success: function (response) {
        boxes.verifyModal.close();
        const referral = query.get('ru') && query.get('rd') ? '&ru=' + query.get('ru').replace('#', "%23") + '&rd=' + query.get('rd') : "";
        document.location = 'confirm.html?memberId=' + response.data.memberId + '&rxGroup=' + response.data.rxGroup + '&rxBin=' + response.data.rxBin + '&carrierPCN=' + response.data.carrierPCN + referral;
      },
      error: function () {
        boxes.verifyModal.setTitle('Oops, an error occurred')
        boxes.verifyModal.setContent('Reload page and try again.');
      }
    })
	} catch (ex) {
		alert(ex.message && ex);
	} finally {
		return false;
	}
}

function preFillFields(){
  const firstName = query.get('fn') ?? "";
  const lastName = query.get('ln') ?? "";
  const email = query.get('em') ?? "";
  const phone = query.get('ph') ?? "";
  const dob = query.get('dob') ?? "";

  document.getElementById('firstName').value = firstName;
  document.getElementById('lastName').value = lastName;
  document.getElementById('email').value = email;
  document.getElementById('phone').value = phone;
  document.getElementById('dateOfBirth').value = dob;
}

function onEnterVerifyRegistrationCode(e){
  if(e.which == 13) {
    verifyRegistrationCode();
  }
}

function init() {
  document.getElementById('verify-code-button').addEventListener('keypress', onEnterVerifyRegistrationCode, false);
}

window.onload = function() {
  init();
  preFillFields();
};

window.onclose = function() {
  document.getElementById('verify-code-button').removeEventListener('keypress', onEnterVerifyRegistrationCode);
}

