# Copyright 2021 Prescryptive Health Inc
import copy

import pytest

from libraries.common import Common
from modules.ui.page_library.page_factory import PageObjects

page_list = ["login", "covidtest", "homepage"]
testdata_list = ["login", "covidtest"]
testdata = Common.ui_test_data(testdata_list)


@pytest.fixture(scope="module", autouse=True)
def page(driver):
    return PageObjects(page_list, driver)


@pytest.mark.dependency()
def test_login(page):
    """
    Test method to login to the prescryptive login
    :param page: objects for provided page list
    """
    login_data = copy.deepcopy(testdata["login"])
    page.login.login(mobile_number=login_data['mobile_number'], pin_no=login_data['pin_no'], terms_condition_flag=True)


@pytest.mark.dependency(depends=["test_login"])
def test_payment_expiry_link(page):
    """
    Test method to book covid antigen test for myself
    :param page: objects for provided page list
    """
    covid_test = copy.deepcopy(testdata['covidtest'])
    page.homepage.click_homepage_card(covid_test['covid_test_and_pharmacy']['select_covid_test'])
    # Select a Covid test
    page.covidtest.click_covid_test(covid_test['select_test']['test_type_1']['covid_test_selection'])
    # Enter zip code and select pharmacy
    page.covidtest.enter_zipcode_and_pharmacy(
        zip_code=covid_test['covid_test_and_pharmacy']['zip_code'],
        pharmacy_name=covid_test['covid_test_and_pharmacy']['pharmacy_name']
    )

    # Schedule an appointment
    page.covidtest.schedule_appointment(
        covid_test_type=covid_test['select_test']['test_type_1']['covid_test_selection'],
        appointment_type=covid_test['book_appointment_for']['myself'],
        contact_with_someone=covid_test['survey_form']['contact_with_someone'],
        direct_patient_contact=covid_test['survey_form']['direct_patient_contact'],
        symptoms=covid_test['survey_form']['symptoms'], is_pregnant=covid_test['survey_form']['is_pregnant'],
        currently_reside=covid_test['survey_form']['currently_reside'],
        covid_19_test=covid_test['survey_form']['had_covid_19_test'],
        primary_care_name=covid_test['survey_form']['primary_care_provider'],
        primary_care_number=covid_test['survey_form']['primary_care_provider_phone_number'],
        gender=covid_test['survey_form']['gender'], ethnicity=covid_test['survey_form']['ethnicity'],
        race=covid_test['survey_form']['race'], address=covid_test['address_info']['address'],
        city=covid_test['address_info']['city'], state=covid_test['address_info']['state'],
        address_zip_code=covid_test['address_info']['address_zip_code'],
        county_name=covid_test['address_info']['county'],
        student_in_a_school=covid_test['pharmacy_specific']['student_in_a_school'],
        patients_school_name=covid_test['pharmacy_specific']['school_name'],
        patients_occupation=covid_test['pharmacy_specific']['patients_occupation'],
        patients_employer_name=covid_test['pharmacy_specific']['patients_name'],
        patients_employer_address=covid_test['pharmacy_specific']['patients_address'],
        patients_employer_phone=covid_test['pharmacy_specific']['patients_phone']
    )
    # Validate payment expiry link of payment screen
    page.covidtest.validate_payment_expiry_link()


def test_logout(page):
    """
    Test method is used to close the browser
    """
    page.login.close_browser()
