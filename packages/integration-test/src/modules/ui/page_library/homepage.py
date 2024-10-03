# Copyright 2021 Prescryptive Health Inc
import logging
import re
import time

from libraries.selenium import BaseController

log = logging.getLogger(__name__)


class Homepage(BaseController):
    """ This class contains all home page functions """

    def __init__(self, driver):
        super().__init__()
        file_name = 'homepage'
        ini_tag_name = 'Homepage'
        self.element_parser = self.get_object_repo(file_name, ini_tag_name)
        self.driver = driver

    def homepage_validation(self, pdf_url):
        """
        The method is used to validate the home page elements,verification of all test tab links,faq link
        :param:pdf_url:Pdf url of the navigated link
        """
        assert self.is_visible(self.element_parser.get("welcome_text"), "welcome_text")
        assert self.is_visible(self.element_parser.get("about_link_text"), "about_link_text")
        if self.is_visible(self.element_parser.get("appointment"), "appointment"):
            logging.info("There are booked appointments for the user")
        else:
            logging.info("There are no booked appointments for the user")
        if self.is_visible(self.element_parser.get("smart_price_card"), "smart_price_card"):
            logging.info("There is Start saving with SmartPrice card for the user")
        else:
            logging.info("There is no Start saving with SmartPrice card present for the user")
        if self.is_visible(self.element_parser.get("covid_test"), "covid_test"):
            logging.info("There is covid test present for the user")
        else:
            logging.info("There is no covid test present for the user")
        if self.is_visible(self.element_parser.get("join_employer_plan"), "join_employer_plan"):
            logging.info("There is join employer plan present for user")
        else:
            logging.info("There is no join employer plan present for user")
        self.click(self.element_parser.get("about_link_text"), "about_link_text")
        if not self.get_current_url() == pdf_url:
            raise Exception(f"The application is not navigated to the frequently asked question pdf {pdf_url}")

    def click_homepage_card(self, card: str, vaccine_url: str = ""):
        """
        The method is used to click on the card of home screen
        :param:card :card to be clicked
        :param:vaccine_url :vaccine url
        """
        self.is_visible(self.element_parser.get('home_page'), 'home_page', timeout=120)
        self.click(self.element_parser.get(card), card)
        # code if for if select a service is not visible
        limit = 0
        card_list = ['covid_vaccine', 'covid_test']
        while card in card_list and self.wait_until_visible(self.element_parser.get('select_service'),
                                                            'select_service') and limit < 5:
            self.click(self.element_parser.get(card), card)
            limit = limit + 1
            if card == "covid_vaccine":
                time.sleep(3)  # Added wait to avoid vaccine url click
                if self.get_current_url() == vaccine_url:
                    self.navigate_back()
                    return self.click_homepage_card(card="covid_vaccine")
        logging.info(f"User has selected card={card}")

    def id_status_flag(self):
        """
        The method is used to get the flag for id visibility status
        :return:flag for id visibility status
        """
        id_status_flag = self.is_visible(self.element_parser.get('id_card'), 'id_card')
        return id_status_flag

    def get_appointments_count_homepage(self):
        """
        The function is used to get the count of appointments count on homepage
        :return: appointments_count_homepage:appointments count on homepage
        """
        appointments_count_homepage = self.get_text(self.element_parser.get("appointments_count_homepage"),
                                                    "appointments_count_homepage")
        appointments_count_homepage = re.findall(r'\d+', appointments_count_homepage)
        if appointments_count_homepage != []:
            return appointments_count_homepage[0]
        else:
            return None

    def check_visiblity_of_card(self, card):
        """
        The function is used to check the visibility of card on homepage
        :param card: card name
        :return: status of card
        """
        visiblity_status_flag = self.is_visible(self.element_parser.get(card), card)
        return visiblity_status_flag
