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
def test_survey_form_negative_testcase(page):
    """
    Test method to validate negative scenarios in survey form
    :param page: objects for provided page list
    """
    covid_test = copy.deepcopy(testdata['covidtest'])
    page.homepage.click_homepage_card(covid_test['covid_test_and_pharmacy']['select_covid_test'])
    # Select a Covid test
    page.covidtest.click_covid_test(covid_test['select_test']['test_type_1']['covid_test_selection'])
    # Enter invalid zip code and validate error message
    page.covidtest.invalid_zip_code(invalid_zip_code=covid_test['negative_test_data']['invalid_zip_code'])
    # Enter valid zip code and select pharmacy
    page.covidtest.enter_zipcode_and_pharmacy(
        zip_code=covid_test['covid_test_and_pharmacy']['zip_code'],
        pharmacy_name=covid_test['covid_test_and_pharmacy']['pharmacy_name']
    )
    # Negative scenarios in the survey form
    page.covidtest.negative_test_cases_survey_form(
        appointment_type=covid_test['book_appointment_for']['dependent'],
        dependent_picker=covid_test['dependent']["dependent_picker"],
        invalid_address=covid_test['negative_test_data']['invalid_address'],
        min_length_char=covid_test['negative_test_data']['min_length_char'],
        min_length_no=covid_test['negative_test_data']['min_length_no'],
        dependent_first_name=covid_test['dependent']["dependent_first_name"],
        dependent_last_name=covid_test['dependent']["dependent_last_name"],
        dependent_dob_month=covid_test['dependent']["dependent_dob_month"],
        dependent_dob_year=covid_test['dependent']["dependent_dob_year"],
        dependent_dob_day=covid_test['dependent']["dependent_dob_day"],
        dependent_address=covid_test['dependent']["dependent_address"],
        dependent_city=covid_test['dependent']["dependent_city"],
        dependent_zipcode=covid_test['dependent']["dependent_zipcode"],
        dependent_county=covid_test['dependent']["dependent_county"],
        dependent_state=covid_test['dependent']["dependent_state"], address=covid_test['address_info']['address'],
        city=covid_test['address_info']['city'], state=covid_test['address_info']['state'],
        address_zip_code=covid_test['address_info']['address_zip_code'],
        county_name=covid_test['address_info']['county']
    )


@pytest.mark.dependency(depends=["test_survey_form_negative_testcase"])
def test_payment_screen_negative_testcase(page):
    """
    Test method to validate negative scenarios at payment screen
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
    # Schedule an appointment with valid data
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
    # Payment screen negative scenario
    page.covidtest.payment_screen_negative_testcase(
        incomplete_email=covid_test['negative_test_data']['incomplete_email'],
        invalid_card_no=covid_test['negative_test_data']['invalid_card_no'],
        invalid_card_expiry=covid_test['negative_test_data']['invalid_card_expiry'],
        card_number=covid_test['payment']['card_number']
    )


def test_negative_edge_scenarios(page):
    """
    Test method for dependent user of age is under 3 for covid test
    :param page: objects for provided page list
    """
    page.covidtest.accepting_popup_for_payment_screen()
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
        appointment_type=covid_test['book_appointment_for']['dependent'],
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
        medicaid_medicare_id=covid_test['survey_form']['medicaid_medicare_id'],
        dependent_picker=covid_test['dependent']["dependent_picker"],
        dependent_first_name=covid_test['dependent']["dependent_first_name"],
        dependent_last_name=covid_test['dependent']["dependent_last_name"],
        dependent_dob_month=covid_test['negative_test_data']["dependent_dob_month"],
        dependent_dob_year=covid_test['negative_test_data']["test_dependent_dob_year"],
        dependent_dob_day=covid_test['negative_test_data']["dependent_dob_day"],
        dependent_address=covid_test['dependent']["dependent_address"],
        dependent_city=covid_test['dependent']["dependent_city"],
        dependent_zipcode=covid_test['dependent']["dependent_zipcode"],
        dependent_county=covid_test['dependent']["dependent_county"],
        dependent_state=covid_test['dependent']["dependent_state"]
    )
    page.covidtest.validate_dob_error_for_age_under_18_or_3()


@pytest.mark.dependency(depends=["test_login"])
def test_covid_vaccine_survey_form_negative_testcase(page):
    """
    Test method to validate negative scenarios in covid vaccine survey form
    :param page: objects for provided page list
    """
    covid_test = copy.deepcopy(testdata['covidtest'])
    page.homepage.click_homepage_card(covid_test['covid_vaccine']['select_covid_vaccine'],
                                      vaccine_url=covid_test["vaccine_url"])
    # Select a Covid vaccine dose
    page.covidtest.click_covid_vaccine(covid_test['select_covid_vaccine_dose']['dose_2']['covid_vaccine_selection'])
    # Enter zip code and select pharmacy
    page.covidtest.enter_zipcode_and_pharmacy(
        zip_code=covid_test['covid_test_and_pharmacy']['zip_code'],
        pharmacy_name=covid_test['covid_test_and_pharmacy']['pharmacy_name']
    )
    # Negative scenarios in the survey form
    page.covidtest.covid_vaccine_negative_testing(
        appointment_type=covid_test['book_appointment_for']['dependent'],
        dependent_picker=covid_test['dependent']["dependent_picker"],
        invalid_address=covid_test['negative_test_data']['invalid_address'],
        min_length_char=covid_test['negative_test_data']['min_length_char'],
        min_length_no=covid_test['negative_test_data']['min_length_no'],
        dependent_first_name=covid_test['dependent']["dependent_first_name"],
        dependent_last_name=covid_test['dependent']["dependent_last_name"],
        dependent_dob_month=covid_test['dependent']["dependent_dob_month"],
        dependent_dob_year=covid_test['dependent']["dependent_dob_year"],
        dependent_dob_day=covid_test['dependent']["dependent_dob_day"],
        dependent_address=covid_test['dependent']["dependent_address"],
        dependent_city=covid_test['dependent']["dependent_city"],
        dependent_zipcode=covid_test['dependent']["dependent_zipcode"],
        dependent_county=covid_test['dependent']["dependent_county"],
        dependent_state=covid_test['dependent']["dependent_state"], address=covid_test['address_info']['address'],
        city=covid_test['address_info']['city'], state=covid_test['address_info']['state'],
        address_zip_code=covid_test['address_info']['address_zip_code'],
        invalid_year=covid_test['negative_test_data']['invalid_year'],
        county_name=covid_test['address_info']['county'], invalid_day=covid_test['negative_test_data']['invalid_day'],
        first_dose_date_day=covid_test['covid_vaccine_dose2_que']['first_dose_date_day'],
        first_dose_date_year=covid_test['covid_vaccine_dose2_que']['first_dose_date_year']
    )


def test_vaccine_negative_edge_scenarios(page):
    """
    Test method for dependent user of age is under 18 for covid vaccine
    :param page: objects for provided page list
    """
    covid_test = copy.deepcopy(testdata['covidtest'])
    page.homepage.click_homepage_card(covid_test['covid_vaccine']['select_covid_vaccine'],
                                      vaccine_url=covid_test["vaccine_url"])
    # Select a Covid vaccine dose
    page.covidtest.click_covid_vaccine(covid_test['select_covid_vaccine_dose']['dose_1']['covid_vaccine_selection'])
    # Enter zip code and select pharmacy
    page.covidtest.enter_zipcode_and_pharmacy(
        zip_code=covid_test['covid_test_and_pharmacy']['zip_code'],
        pharmacy_name=covid_test['covid_test_and_pharmacy']['pharmacy_name']
    )
    # Schedule an appointment
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
        dependent_first_name=covid_test['dependent']["dependent_first_name"],
        dependent_last_name=covid_test['dependent']["dependent_last_name"],
        dependent_dob_month=covid_test['negative_test_data']["dependent_dob_month"],
        dependent_dob_year=covid_test['negative_test_data']["vaccine_dependent_dob_year"],
        dependent_dob_day=covid_test['negative_test_data']["dependent_dob_day"],
        dependent_address=covid_test['dependent']["dependent_address"],
        dependent_city=covid_test['dependent']["dependent_city"],
        dependent_zipcode=covid_test['dependent']["dependent_zipcode"],
        dependent_county=covid_test['dependent']["dependent_county"],
        dependent_state=covid_test['dependent']["dependent_state"],
        first_vaccine_dose=covid_test['covid_vaccine_dose2_que']['first_vaccine_dose'],
        first_dose_date_month=covid_test['covid_vaccine_dose2_que']['first_dose_date_month'],
        first_dose_date_day=covid_test['covid_vaccine_dose2_que']['first_dose_date_day'],
        first_dose_date_year=covid_test['covid_vaccine_dose2_que']['first_dose_date_year']
    )
    page.covidtest.validate_dob_error_for_age_under_18_or_3()


def test_logout(page):
    """
    Test method is used to close browser instance
    :param page: objects for provided page list
    """
    page.login.close_browser()
