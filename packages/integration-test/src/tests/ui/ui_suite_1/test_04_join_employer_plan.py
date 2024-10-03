# Copyright 2021 Prescryptive Health Inc
import copy

import pytest

from libraries.common import Common
from modules.ui.page_library.page_factory import PageObjects


page_list = ["login", "homepage", "join_employer_plan", "covidtest"]
testdata_list = ["login", "homepage", "config", "join_employer_plan"]
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
@pytest.mark.parametrize(
    "join_employer_plan", testdata["join_employer_plan"]["neative_testing_join_employer_plan"].values()
)
def test_negative_testing_join_employer_plan_negative_testing(page, join_employer_plan):
    """
    Test method to test negative scenarios in Join employer plan
    :param page: objects for provided page list
    """
    employer_plan_data = copy.deepcopy(testdata['join_employer_plan'])
    config_data = copy.deepcopy(testdata['config'])
    page.homepage.click_homepage_card(employer_plan_data['join_employer_plan'])
    negative_data = join_employer_plan['negative_test_data']
    page.join_employer_plan.negative_testing_employer_plan(
        first_name=negative_data['first_name'], last_name=negative_data['last_name'],
        birth_month=negative_data['birth_month'], member_id=negative_data['member_id'],
        birth_date=negative_data['birth_date'], birth_year=negative_data['birth_year']
    )
    page.covidtest.hit_url_in_browser(config_data['url'])


def test_logout(page):
    """
    Test method is used to close the browser
    """
    page.login.close_browser()
