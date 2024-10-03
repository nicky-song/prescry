# Copyright 2021 Prescryptive Health Inc
import copy

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
def test_joinwaitlist_for_covid_dose1_for_dependent(page):
    """
    Test method to check covid dose1 join waitlist functionality for dependent
    :param page: objects for provided page list
    """
    covid_test = copy.deepcopy(testdata['covidtest'])
    login_data = copy.deepcopy(testdata["login"])
    page.homepage.click_homepage_card(covid_test['covid_vaccine']['select_covid_vaccine'],
                                          vaccine_url=covid_test["vaccine_url"])
    # Select a Covid vaccine dose
    page.covidtest.click_covid_vaccine(covid_test['covid_vaccine']['covid_vaccine_dose1'])
    # Getting mobile number from login.json data and replacing X
    mobile_number = login_data['waitlist_mobile_number'].replace('X', "")
    # Enter zip code and validate join waitlist
    page.covidtest.validate_join_waitlist(
        pharmacy_distance=covid_test['join_waitlist']['pharmacy_distance'],
        applicant_type=covid_test['join_waitlist']['applicant_type_another'],
        zipcode=covid_test['covid_test_and_pharmacy']['zip_code'],
        firstname=covid_test['join_waitlist']['firstname'], lastname=covid_test['join_waitlist']['lastname'],
        mobile=mobile_number, birth_month=covid_test['dependent']['dependent_dob_month'],
        birth_date=covid_test['dependent']['dependent_dob_day'],
        birth_year=covid_test['dependent']['dependent_dob_year']
    )


@pytest.mark.dependency(depends=["test_joinwaitlist_for_covid_dose1_for_dependent"])
def test_joinwaitlist_for_dependent_error_on_adding_again(page):
    """
    Test method to check join waitlist functionality for dependent after adding the existing dependent again
    :param page: objects for provided page list
    """
    covid_test = copy.deepcopy(testdata['covidtest'])
    login_data = copy.deepcopy(testdata["login"])
    page.login.reload_page()
    page.homepage.click_homepage_card(covid_test['covid_vaccine']['select_covid_vaccine'],
                                          vaccine_url=covid_test["vaccine_url"])
    # Select a Covid vaccine dose
    page.covidtest.click_covid_vaccine(covid_test['covid_vaccine']['covid_vaccine_dose1'])
    # Getting mobile number from login.json data and replacing X
    mobile_number = login_data['waitlist_mobile_number'].replace('X', "")
    # Enter zip code and validate join waitlist
    page.covidtest.validate_join_waitlist(
        pharmacy_distance=covid_test['join_waitlist']['pharmacy_distance'],
        applicant_type=covid_test['join_waitlist']['applicant_type_another'],
        zipcode=covid_test['covid_test_and_pharmacy']['zip_code'],
        firstname=covid_test['join_waitlist']['firstname'], lastname=covid_test['join_waitlist']['lastname'],
        mobile=mobile_number, birth_month=covid_test['dependent']['dependent_dob_month'],
        birth_date=covid_test['dependent']['dependent_dob_day'],
        birth_year=covid_test['dependent']['dependent_dob_year'], waitlist_entry="duplicate"
    )


def test_joinwaitlist_for_dependent_add_another_person(page):
    """
    Test method to check join waitlist functionality for adding another person
    :param page: objects for provided page list
    """
    covid_test = copy.deepcopy(testdata['covidtest'])
    login_data = copy.deepcopy(testdata["login"])
    mobile_number = login_data['waitlist_mobile_number'].replace('X', "")
    # Validate add another person functionality
    page.covidtest.validate_add_another_person(
        applicant_type=covid_test['join_waitlist']['applicant_type_another'],
        firstname=covid_test['join_waitlist']['firstname'], lastname=covid_test['join_waitlist']['lastname'],
        mobile=mobile_number, birth_month=covid_test['dependent']['dependent_dob_month'],
        birth_date=covid_test['dependent']['dependent_dob_day'],
        birth_year=covid_test['dependent']['another_dependent_dob_year']
    )


def test_joinwaitlist_for_dependent_add_another_person_invalid_number(page):
    """
    Test method to check join waitlist functionality for myself if adding again for myself
    :param page: objects for provided page list
    """
    covid_test = copy.deepcopy(testdata['covidtest'])
    login_data = copy.deepcopy(testdata['login'])
    mobile_number = login_data['mobile_number']
    # Validate add another person functionality
    page.covidtest.validate_add_another_person(
        applicant_type=covid_test['join_waitlist']['applicant_type_another'],
        firstname=covid_test['join_waitlist']['firstname'], lastname=covid_test['join_waitlist']['lastname'],
        mobile=mobile_number, birth_month=covid_test['dependent']['dependent_dob_month'],
        birth_date=covid_test['dependent']['dependent_dob_day'],
        birth_year=covid_test['dependent']['another_dependent_dob_year'], waitlist_entry="invalid"
    )


@pytest.mark.dependency(depends=["test_joinwaitlist_for_covid_dose1_for_dependent"])
def test_update_the_covid_dose1_dependent_record_from_waitlist_database(page):
    """
    Test method to update the covid dose1 for dependent record from waitlist database
    :param page: objects for provided page list
    """
    config_data = copy.deepcopy(testdata['config'])
    covidtest_data = copy.deepcopy(testdata['covidtest'])
    database_data = copy.deepcopy(testdata['database'])
    login_data = copy.deepcopy(testdata['login'])
    database = Database()
    query_dict, updated_values, updated_record_dict = database.create_query_to_update_the_waitlist_database(
        mobile_number=login_data['waitlist_mobile_number'], country_code=login_data['country_code_mobile'],
        invited_status=database_data["invited_status"], service_type=database_data['c19_vaccine_dose1_service_type'],
        updated_values=database_data["updated_values"],
        dependent_first_name=(covidtest_data['join_waitlist']['firstname']).upper(),
        dependent_last_name=(covidtest_data['join_waitlist']['lastname']).upper(),
        birth_month=covidtest_data['dependent']['dependent_dob_month'],
        birth_date=covidtest_data['dependent']['dependent_dob_day'],
        birth_year=covidtest_data['dependent']['dependent_dob_year'], appointment_type="Dependent"
    )
    identifier = database.update_waitlist_data(query_dict, updated_values, updated_record_dict)
    test_update_the_covid_dose1_dependent_record_from_waitlist_database.waitlist_url = (
            config_data["waitlist_url"] + identifier
    )


@pytest.mark.dependency(depends=["test_update_the_covid_dose1_dependent_record_from_waitlist_database"])
def test_book_covid_dose1_vaccine_for_dependent_through_waitlist(page):
    """
    Test method to book covid vaccine dose1 for dependent through waitlist
    :param page: objects for provided page list
    """
    covid_test = copy.deepcopy(testdata['covidtest'])
    # Hit url in browser
    page.covidtest.hit_url_in_browser(test_update_the_covid_dose1_dependent_record_from_waitlist_database.waitlist_url)
    # Schedule an appointment for covid vaccine
    page.covidtest.schedule_covid_vaccine_appointment(
        dose=covid_test['covid_vaccine']['covid_vaccine_dose1'],
        appointment_type=covid_test['book_appointment_for']['dependent'],
        eligible_to_receive_vaccine=covid_test['survey_form']['eligible_to_receive_vaccine'],
        primary_healthcare_insurance=covid_test['survey_form']['primary_healthcare_insurance'],
        insurance_name_policy_id=covid_test['survey_form']['insurance_name_policy_id'],
        received_positive_covid_19=covid_test['covid_vaccine']['received_positive_covid_19'],
        received_vaccine_past_14_days=covid_test['covid_vaccine']['received_vaccine_past_14_days'],
        received_covid19_vaccine=covid_test['covid_vaccine']['received_covid19_vaccine'],
        received_monoclonal_antibodies=covid_test['covid_vaccine']['received_monoclonal_antibodies'],
        bleeding_disorder=covid_test['covid_vaccine']['bleeding_disorder'],
        had_a_seizure_disorder=covid_test['covid_vaccine']['had_a_seizure_disorder'],
        is_pregnant_or_breastfeeding=covid_test['covid_vaccine']['is_pregnant_or_breastfeeding'],
        has_severe_allergic_reaction=covid_test['covid_vaccine']['has_severe_allergic_reaction'],
        reason_allergic_reaction_checkbox=covid_test['covid_vaccine']['reason_allergic_reaction_checkbox'],
        anaphylactic_response=covid_test['covid_vaccine']['anaphylactic_response'],
        mothers_maiden_name=covid_test['survey_form']['mothers_maiden_name'],
        ethnicity=covid_test['survey_form']['ethnicity'],
        race=covid_test['survey_form']['race'], address=covid_test['address_info']['address'],
        city=covid_test['address_info']['city'], state=covid_test['address_info']['state'],
        address_zip_code=covid_test['address_info']['address_zip_code'],
        county_name=covid_test['address_info']['county'],
        dependent_picker=covid_test['dependent']["dependent_picker"],
        dependent_first_name=covid_test['join_waitlist']['firstname'],
        dependent_last_name=covid_test['join_waitlist']['lastname'],
        dependent_dob_month=covid_test['dependent']["dependent_dob_month"],
        dependent_dob_year=covid_test['dependent']["dependent_dob_year"],
        dependent_dob_day=covid_test['dependent']["dependent_dob_day"],
        dependent_address=covid_test['dependent']["dependent_address"],
        dependent_city=covid_test['dependent']["dependent_city"],
        dependent_zipcode=covid_test['dependent']["dependent_zipcode"],
        dependent_county=covid_test['dependent']["dependent_county"],
        dependent_state=covid_test['dependent']["dependent_state"]
    )
    page.covidtest.vaccine_appointment_confirmation()


def test_logout(page):
    """
    Test method is used to close the browser
    """
    page.login.close_browser()
