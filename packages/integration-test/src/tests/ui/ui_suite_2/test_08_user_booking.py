# Copyright 2021 Prescryptive Health Inc
import copy

import pytest

from libraries.common import Common
from modules.ui.page_library.page_factory import PageObjects

page_list = ["login", "covidtest", "homepage"]
testdata_list = ["login", "covidtest", "homepage", "config"]
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
    page.login.login(
        mobile_number=login_data['waitlist_mobile_number'], pin_no=login_data['pin_no'], terms_condition_flag=True
    )


@pytest.mark.dependency(depends=["test_login"])
def test_user_booking_scenario1(page):
    """
    Test method to validating user booking scenario1- When two user select same timeslot at same time,then third user
    book test he should not be able to see that time slot in dropdown.
    :param page: objects for provided page list
    """
    page.covidtest.open_two_tabs()
    timeslot_list = []
    # For loop is used to execute functions in three different tabs
    for tab in range(0, 3):
        # To switch to given tab number
        page.covidtest.switch_to_tab_no(tab_no=tab)
        covid_test = copy.deepcopy(testdata['covidtest'])
        page.homepage.click_homepage_card(covid_test['covid_test_and_pharmacy']['select_covid_test'])
        # Select covid test and enter zip code and pharmacy
        page.covidtest.click_covid_test_and_enter_zipcode_pharmacy(
            card=covid_test['select_test']['test_type_1']['covid_test_selection'],
            zip_code=covid_test['covid_test_and_pharmacy']['zip_code'],
            pharmacy_name=covid_test['covid_test_and_pharmacy']['pharmacy_name']
        )
        # select test date and time
        covid_test_time = page.covidtest.timeslot_selection_for_user_booking()
        timeslot_list.append(covid_test_time)
    page.covidtest.timeslot_scenario1(timeslot_list)


@pytest.mark.dependency(depends=["test_login"])
def test_user_booking_scenario2(page):
    """
    Test method to validating user booking scenario2-When three users are booking test for same timeslot
    third user should get the timeslot error that timeslots are blocked
    :param page: objects for provided page list
    """
    page.covidtest.open_two_tabs()
    # For loop is used to execute functions in three different tabs
    for tab in range(0, 3):
        # To switch to given tab number
        page.covidtest.switch_to_tab_no(tab_no=tab)
        page.covidtest.reload_page()
        covid_test = copy.deepcopy(testdata['covidtest'])
        page.homepage.click_homepage_card(covid_test['covid_test_and_pharmacy']['select_covid_test'])
        # Select covid test and enter zip code and pharmacy
        page.covidtest.click_covid_test_and_enter_zipcode_pharmacy(
            card=covid_test['select_test']['test_type_1']['covid_test_selection'],
            zip_code=covid_test['covid_test_and_pharmacy']['zip_code'],
            pharmacy_name=covid_test['covid_test_and_pharmacy']['pharmacy_name']
        )
    page.covidtest.timeslot_scenario2()


def test_logout(page):
    """
    Test method is used to close the browser
    """
    page.login.close_browser()
