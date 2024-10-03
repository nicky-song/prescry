# Copyright 2021 Prescryptive Health Inc
import copy

import pytest

from libraries.common import Common
from libraries.database import Database
from modules.ui.page_library.page_factory import PageObjects

page_list = ["login", "covidtest", "homepage", "signup"]
testdata_list = ["login", "covidtest", "database", "config", "signup"]
testdata = Common.ui_test_data(testdata_list)


@pytest.fixture(scope="module", autouse=True)
def page(driver):
    return PageObjects(page_list, driver)


@pytest.mark.dependency()
def test_prerequisite_login(page):
    """
    The method is used to delete tokens and data related to this number so that user is applicable to join waitlist
    """
    login_data = copy.deepcopy(testdata["login"])
    signup_data = copy.deepcopy(testdata["signup"])
    data_obj = Database()
    data_obj.delete_person_data_database(login_data['country_code_mobile'], login_data['waitlist_mobile_number'])
    # Delete device tokens for the registered number
    data_obj.delete_tokens_for_device(login_data['country_code_mobile'], login_data['waitlist_mobile_number'])
    page.login.login(
        mobile_number=login_data['waitlist_mobile_number'], pin_no=login_data['pin_no'], terms_condition_flag=True,
        login='signup'
    )
    page.signup.enter_signup_details(
        first_name=signup_data['first_name'], last_name=signup_data['last_name'],
        birth_month=signup_data['birth_month'], email=signup_data['email'], birth_date=signup_data['birth_date'],
        birth_year=signup_data['birth_year']
    )
    # To create pin -enter pin
    page.login.enter_pin(pin_no=login_data['pin_no'], enter_value="create")
    # To create pin-re-enter pin
    page.login.enter_pin(pin_no=login_data['pin_no'], enter_value="re-enter")


@pytest.mark.dependency(depends=["test_prerequisite_login"])
def test_joinwaitlist_for_covid_dose1_for_myself(page):
    """
    Test method to check covid dose1 join waitlist functionality for myself
    :param page: objects for provided page list
    """
    covid_test = copy.deepcopy(testdata['covidtest'])
    page.homepage.click_homepage_card(covid_test['covid_vaccine']['select_covid_vaccine'],
                                          vaccine_url=covid_test["vaccine_url"])
    # Select a Covid vaccine dose
    page.covidtest.click_covid_vaccine(covid_test['covid_vaccine']['covid_vaccine_dose1'])
    # Enter zip code and validate join waitlist
    page.covidtest.validate_join_waitlist(
        pharmacy_distance=covid_test['join_waitlist']['pharmacy_distance'],
        applicant_type=covid_test['join_waitlist']['applicant_type_myself'],
        zipcode=covid_test['covid_test_and_pharmacy']['zip_code']
    )


@pytest.mark.dependency(depends=["test_joinwaitlist_for_covid_dose1_for_myself"])
def test_joinwaitlist_myself_error_on_adding_again(page):
    """
    Test method to check join waitlist functionality for myself if adding again for myself
    :param page: objects for provided page list
    """
    covid_test = copy.deepcopy(testdata['covidtest'])
    page.login.reload_page()
    page.homepage.click_homepage_card(covid_test['covid_vaccine']['select_covid_vaccine'],
                                          vaccine_url=covid_test["vaccine_url"])
    # Select a Covid vaccine dose
    page.covidtest.click_covid_vaccine(covid_test['covid_vaccine']['covid_vaccine_dose1'])
    # Enter zip code and validate join waitlist
    page.covidtest.validate_join_waitlist(
        pharmacy_distance=covid_test['join_waitlist']['pharmacy_distance'],
        applicant_type=covid_test['join_waitlist']['applicant_type_myself'],
        zipcode=covid_test['covid_test_and_pharmacy']['zip_code'], waitlist_entry="duplicate"
    )


@pytest.mark.dependency(depends=["test_joinwaitlist_for_covid_dose1_for_myself"])
def test_update_the_covid_dose1_myself_record_from_waitlist_database(page):
    """
    Test method to update the covid dose1 for myself record from waitlist database
    :param page: objects for provided page list
    """
    config_data = copy.deepcopy(testdata['config'])
    database_data = copy.deepcopy(testdata['database'])
    login_data = copy.deepcopy(testdata['login'])
    database = Database()
    query_dict, updated_values, updated_record_dict = database.create_query_to_update_the_waitlist_database(
        mobile_number=login_data['waitlist_mobile_number'], country_code=login_data['country_code_mobile'],
        invited_status=database_data["invited_status"], service_type=database_data['c19_vaccine_dose1_service_type'],
        updated_values=database_data["updated_values"]
    )
    identifier = database.update_waitlist_data(query_dict, updated_values, updated_record_dict)
    test_update_the_covid_dose1_myself_record_from_waitlist_database.waitlist_url = (
            config_data["waitlist_url"] + identifier
    )


@pytest.mark.dependency(depends=["test_update_the_covid_dose1_myself_record_from_waitlist_database"])
def test_book_covid_dose1_vaccine_for_myself_through_waitlist(page):
    """
    Test method to book covid vaccine dose1 for myself through waitlist
    :param page: objects for provided page list
    """
    covid_test = copy.deepcopy(testdata['covidtest'])
    # Hit url in browser
    page.covidtest.hit_url_in_browser(test_update_the_covid_dose1_myself_record_from_waitlist_database.waitlist_url)
    # Schedule an appointment for covid vaccine
    page.covidtest.schedule_covid_vaccine_appointment(
        dose=covid_test['covid_vaccine']['covid_vaccine_dose1'],
        appointment_type=covid_test['book_appointment_for']['myself'],
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
        county_name=covid_test['address_info']['county']
    )
    page.covidtest.vaccine_appointment_confirmation()


def test_logout(page):
    """
    Test method is used to close the browser
    """
    page.login.close_browser()
