# Copyright 2021 Prescryptive Health Inc
import copy
import random

import pytest

from libraries.common import Common
from modules.ui.page_library.page_factory import PageObjects

page_list = ["login", "covidtest", "homepage", "signup"]
testdata_list = ["login", "covidtest", "homepage", "signup", "config"]
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


@pytest.mark.parametrize("covid_test_type", random.choice(list(testdata["covidtest"]["select_test"].values())))
def test_book_covid_test_for_myself(page, covid_test_type):
    """
    Test method to book random covid test for myself - covid antigen, medicare, medicaid
    :param page: objects for provided page list
    :param covid_test_type: Type of covid tests - antigen, medicare, medicaid
    """
    covid_test_type = random.choice(list(testdata["covidtest"]["select_test"].values()))
    try:
        covid_test = copy.deepcopy(testdata['covidtest'])
        page.homepage.click_homepage_card(covid_test['covid_test_and_pharmacy']['select_covid_test'])
        # Select a Covid test
        page.covidtest.click_covid_test(covid_test_type['covid_test_selection'])
        # Enter zip code and select pharmacy
        page.covidtest.enter_zipcode_and_pharmacy(
            zip_code=covid_test['covid_test_and_pharmacy']['zip_code'],
            pharmacy_name=covid_test['covid_test_and_pharmacy']['pharmacy_name']
        )

        # Schedule an appointment
        covid_test_date_and_time = page.covidtest.schedule_appointment(
            covid_test_type['covid_test_selection'], appointment_type=covid_test['book_appointment_for']['myself'],
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
            patients_employer_phone=covid_test['pharmacy_specific']['patients_phone'],
            medicaid_medicare_id=covid_test['survey_form']['medicaid_medicare_id']
        )

        # For medicare and medicaid if directly click on the book button without clicking on book button
        if covid_test_type['covid_test_selection'] == "antigen":
            # Complete payment procedure
            page.covidtest.payment_screen(
                email=covid_test['payment']['email'], card_number=covid_test['payment']['card_number'],
                card_expiry=covid_test['payment']['card_expiry'], cvc_number=covid_test['payment']['cvc_number'],
                name_on_card=covid_test['payment']['name_on_card'], country=covid_test['payment']['country_name']
            )
        covidtest_name = covid_test['appointment_confirmation']['covid_antigen_test_name']

        # Validate appointment is confirmed
        page.covidtest.confirm_appointment_assertions(
            covid_test_date_and_time=covid_test_date_and_time, covid_test_name=covidtest_name
        )
        covid_test_date_and_time_str = ' '.join(covid_test_date_and_time)

        page.homepage.click_homepage_card("appointment")
        # Verify appointment is added in upcoming appointment tab
        page.covidtest.appointment_verification_in_upcoming_appointments(
            covid_test_date_and_time=covid_test_date_and_time_str, covid_test_name=covidtest_name
        )
    finally:
        config_data = copy.deepcopy(testdata['config'])
        page.covidtest.hit_url_in_browser(config_data['url'])


def test_cancel_appointment(page):
    """
    Test method to cancel booked appointment and validation of count after canceling appointment
    :param page: objects for provided page list
    """
    appointments_count_homepage = page.homepage.get_appointments_count_homepage()
    page.homepage.click_homepage_card("appointment")
    appointment_count_str = page.covidtest.cancel_appointment(appointments_count_homepage)
    appointment_count_homepage = page.homepage.get_appointments_count_homepage()
    page.covidtest.appointment_count_validation(appointment_count_str, appointment_count_homepage)


def test_logout(page):
    """
    Test method is used to close the browser
    """
    page.login.close_browser()
