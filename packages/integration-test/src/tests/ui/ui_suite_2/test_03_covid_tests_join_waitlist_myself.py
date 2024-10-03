import copy
import logging
import random

import pytest

from libraries.common import Common
from libraries.database import Database
from modules.ui.page_library.page_factory import PageObjects

page_list = ["login", "covidtest", "homepage"]
testdata_list = ["login", "covidtest", "database", "config"]
testdata = Common.ui_test_data(testdata_list)


@pytest.fixture(scope="module", autouse=True)
def page(driver):
    return PageObjects(page_list, driver)


@pytest.mark.dependency()
def test_login(page):
    """
    Test method to login to the prescryptive application
    :param page: objects for provided page list
    """
    login_data = copy.deepcopy(testdata["login"])
    page.login.login(
        mobile_number=login_data['waitlist_mobile_number'], pin_no=login_data['pin_no'], terms_condition_flag=True
    )


@pytest.mark.dependency(depends=["test_login"])
@pytest.mark.parametrize("covid_test_type", random.choice(list(testdata["covidtest"]["select_test"].values())))
def test_joinwaitlist_of_covid_tests_for_myself(page, covid_test_type):
    """
    Test method to join waitlist of all four covid test for myself - antigen,  medicare, medicaid
    :param page: objects for provided page list
    :param covid_test_type: Type of covid tests - antigen, medicare, medicaid
    """
    covid_test_type = random.choice(list(testdata["covidtest"]["select_test"].values()))
    covid_test = copy.deepcopy(testdata['covidtest'])
    page.homepage.click_homepage_card(covid_test['covid_test_and_pharmacy']['select_covid_test'])
    # Select a Covid test
    logging.info(
        f"Join waitlist test case running for the covid test type - {covid_test_type['covid_test_selection']}"
    )
    page.covidtest.click_covid_test(covid_test_type['covid_test_selection'])
    # Enter zip code and validate join waitlist
    page.covidtest.validate_join_waitlist(
        pharmacy_distance=covid_test['join_waitlist']['pharmacy_distance'],
        applicant_type=covid_test['join_waitlist']['applicant_type_myself'],
        zipcode=covid_test['covid_test_and_pharmacy']['zip_code']
    )
    # Covid test name selected by random function
    test_joinwaitlist_of_covid_tests_for_myself.test_type = covid_test_type['covid_test_selection']


@pytest.mark.dependency(depends=["test_login"])
def test_update_the_covid_tests_myself_record_from_waitlist_database(page):
    """
    Test method to update the covid tests for myself record from waitlist database
    :param page: objects for provided page list
    (abbott_antigen, medicare_abbott_antigen, medicaid_abbott_antigen)
    """
    config_data = copy.deepcopy(testdata['config'])
    database_data = copy.deepcopy(testdata['database'])
    login_data = copy.deepcopy(testdata['login'])
    database = Database()
    query_dict, updated_values, updated_record_dict = database.create_query_to_update_the_waitlist_database(
        mobile_number=login_data['waitlist_mobile_number'], country_code=login_data['country_code_mobile'],
        invited_status=database_data["invited_status"],
        service_type=database_data["select_service_type"][test_joinwaitlist_of_covid_tests_for_myself.test_type],
        updated_values=database_data["updated_values"]
    )
    identifier = database.update_waitlist_data(query_dict, updated_values, updated_record_dict)
    # Waitlist url for the specific selected test by random function
    test_update_the_covid_tests_myself_record_from_waitlist_database.waitlist_url = (
            config_data["waitlist_url"] + identifier
    )


@pytest.mark.dependency(depends=["test_login"])
def test_book_covid_tests_for_myself_through_waitlist(page):
    """
    Test method to book covid all four covid tests for myself by using identifier (antigen, medicare, medicaid)
    :param page: objects for provided page list
    """
    covid_test = copy.deepcopy(testdata['covidtest'])
    # Hit url in browser
    page.covidtest.hit_url_in_browser(test_update_the_covid_tests_myself_record_from_waitlist_database.waitlist_url)
    # Schedule an appointment for covid vaccine
    covid_test_date_and_time = page.covidtest.schedule_appointment(
        covid_test_type=test_joinwaitlist_of_covid_tests_for_myself.test_type,
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
        patients_employer_phone=covid_test['pharmacy_specific']['patients_phone'],
        medicaid_medicare_id=covid_test['survey_form']['medicaid_medicare_id']
    )

    # For medicare and medicaid if directly click on the book button without clicking on book button
    if test_joinwaitlist_of_covid_tests_for_myself.test_type == "antigen":
        # Complete payment procedure
        page.covidtest.payment_screen(
            email=covid_test['payment']['email'], card_number=covid_test['payment']['card_number'],
            card_expiry=covid_test['payment']['card_expiry'], cvc_number=covid_test['payment']['cvc_number'],
            name_on_card=covid_test['payment']['name_on_card'], country=covid_test['payment']['country_name']
        )
    # Validate appointment is confirmed
    page.covidtest.confirm_appointment_assertions(
        covid_test_date_and_time=covid_test_date_and_time,
        covid_test_name=covid_test['appointment_confirmation']['covid_antigen_test_name']
    )


def test_logout(page):
    """
    Test method is used to close the browser
    """
    page.login.close_browser()
