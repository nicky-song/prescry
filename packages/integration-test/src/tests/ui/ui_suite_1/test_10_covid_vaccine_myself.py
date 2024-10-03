# Copyright 2021 Prescryptive Health Inc
import copy
import random

import pytest

from libraries.common import Common
from modules.ui.page_library.page_factory import PageObjects

page_list = ["login", "covidtest", "homepage"]
testdata_list = ["login", "covidtest", "config"]
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


def test_vaccine_url(page):
    """
    Test method to check covid vaccine url
    :param page: objects for provided page list
    """
    covid_test = copy.deepcopy(testdata['covidtest'])
    page.homepage.click_homepage_card(covid_test['covid_vaccine']['select_covid_vaccine'],
                                      vaccine_url=covid_test["vaccine_url"])
    page.covidtest.click_covid_vaccine_url(vaccine_url=covid_test["vaccine_url"])


@pytest.mark.parametrize("covid_vaccine_dose", random.choice(list(testdata["covidtest"]
                                                                  ["select_covid_vaccine_dose"].values())))
def test_covid_vaccine_dose1_and_dose2_for_myself(page, covid_vaccine_dose):
    """
    Test method to book covid vaccine dose1 or dose2 for myself
    :param page: objects for provided page list
    """
    covid_vaccine_dose = random.choice(list(testdata["covidtest"]["select_covid_vaccine_dose"].values()))
    try:
        covid_test = copy.deepcopy(testdata['covidtest'])
        page.homepage.click_homepage_card(covid_test['covid_vaccine']['select_covid_vaccine'],
                                          vaccine_url=covid_test["vaccine_url"])
        # Select a Covid vaccine dose
        page.covidtest.click_covid_vaccine(covid_vaccine_dose['covid_vaccine_selection'])
        # Enter zip code and select pharmacy
        page.covidtest.enter_zipcode_and_pharmacy(
            zip_code=covid_test['covid_test_and_pharmacy']['zip_code'],
            pharmacy_name=covid_test['covid_test_and_pharmacy']['pharmacy_name']
        )

        # Schedule an appointment for covid vaccine
        page.covidtest.schedule_covid_vaccine_appointment(
            dose=covid_vaccine_dose['covid_vaccine_selection'],
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
            county_name=covid_test['address_info']['county'],
            first_vaccine_dose=covid_test['covid_vaccine_dose2_que']['first_vaccine_dose'],
            first_dose_date_month=covid_test['covid_vaccine_dose2_que']['first_dose_date_month'],
            first_dose_date_day=covid_test['covid_vaccine_dose2_que']['first_dose_date_day'],
            first_dose_date_year=covid_test['covid_vaccine_dose2_que']['first_dose_date_year']
        )
        page.covidtest.vaccine_appointment_confirmation()
    finally:
        config_data = copy.deepcopy(testdata['config'])
        page.covidtest.hit_url_in_browser(config_data['url'])


def test_logout(page):
    """
    Test method is used to close the browser
    """
    page.login.close_browser()
