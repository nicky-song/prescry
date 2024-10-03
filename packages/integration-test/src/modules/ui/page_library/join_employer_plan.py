# Copyright 2021 Prescryptive Health Inc
import logging

from libraries.selenium import BaseController

log = logging.getLogger(__name__)


class JoinEmployerPlan(BaseController):
    """ This class contains all join employer plan page functions """
    
    def __init__(self, driver):
        super().__init__()
        file_name = 'join_employer_plan'
        ini_tag_name = 'Join_Employer_Plan'
        self.element_parser = self.get_object_repo(file_name, ini_tag_name)
        self.driver = driver
    
    def negative_testing_employer_plan(
            self, first_name: str, last_name: str, birth_month: str, birth_date: str,
            birth_year: str, member_id: str
    ):
        """
        The method is used to test negative scenarios in employer plan
        :param first_name: first name of employee
        :param last_name: last name of employee
        :param member_id: member id of the employee
        :param birth_month: birth month of employee
        :param birth_date: birthdate of employee
        :param birth_year: birth year of employee
        :return error_message: Error message
        """
        self.enter_text(self.element_parser.get('first_name'), 'first_name', first_name)
        self.enter_text(self.element_parser.get('last_name'), 'last_name', last_name)
        self.enter_text(self.element_parser.get('member_id'), 'member_id', member_id)
        self.click(
            self.element_parser.get('birth_date_month_value').replace(self.replace_pattern, birth_month),
            'birth_date_month_value'
        )
        self.click(
            self.element_parser.get('birth_date_value').replace(self.replace_pattern, birth_date),
            'birth_date_value'
        )
        self.click(
            self.element_parser.get('birth_date_year_value').replace(self.replace_pattern, birth_year),
            'birth_date_year_value'
        )
        self.click(self.element_parser.get('join_button'), 'join_button')
        assert self.is_visible(self.element_parser.get('employer_plan_error'), 'employer_plan_error'), (
            "Failed to see employer plan error message"
        )
        logging.info("'We could not find your account with this information' error message is visible")
    
    def join_employer_plan(
            self, first_name: str, last_name: str, birth_month: str, birth_date: str, birth_year: str,
            member_id: str
    ):
        """
        The method is used to test positive scenario in employer plan
        :param first_name: first name of employee
        :param last_name: last name of employee
        :param member_id: member id of the employee
        :param birth_month: birth month of employee
        :param birth_date: birthdate of employee
        :param birth_year: birth year of employee
        :return error_message: Error message
         """
        self.enter_text(self.element_parser.get('first_name'), 'first_name', first_name)
        self.enter_text(self.element_parser.get('last_name'), 'last_name', last_name)
        self.enter_text(self.element_parser.get('member_id'), 'member_id', member_id)
        self.click(
            self.element_parser.get('birth_date_month_value').replace(self.replace_pattern, birth_month),
            'birth_date_month_value'
        )
        self.click(
            self.element_parser.get('birth_date_value').replace(self.replace_pattern, birth_date),
            'birth_date_value'
        )
        self.click(
            self.element_parser.get('birth_date_year_value').replace(self.replace_pattern, birth_year),
            'birth_date_year_value'
        )
        self.click(self.element_parser.get('join_button'), 'join_button')
        logging.info("User has successfully joined the employer plan")
    
    def join_emp_sie_user(self, member_id: str):
        """
        The function is used to add sie user to join employer plan
        :param member_id: memeber id of sie user
        :return: none
        """
        self.enter_text(self.element_parser.get('member_id'), 'member_id', member_id)
        self.click(self.element_parser.get('join_button'), 'join_button')
        logging.info("User has successfully joined the employer plan")
