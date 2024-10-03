# Copyright 2021 Prescryptive Health Inc
import logging

from libraries.selenium import BaseController

log = logging.getLogger(__name__)


class Appointments(BaseController):
    """ This class contains all appointments page functions """
    
    def __init__(self, driver):
        super().__init__()
        file_name = 'appointments'
        ini_tag_name = 'Appointments'
        self.element_parser = self.get_object_repo(file_name, ini_tag_name)
        self.driver = driver
    
    def validate_appointments_count(self, appointments_count_homepage: str):
        """
        The method is used to validate appointment count on homepage to the upcoming appointments
        :param:appointments_count_homepage :Appointment count on homepage
        """
        upcoming_appointment_count = self.find_elements(self.element_parser.get("appointments_count_upcoming"),
                                                        "appointments_count_upcoming")
        assert appointments_count_homepage.__contains__(
            str(len(upcoming_appointment_count))), "Appointment count is mismatched on homepage and for upcoming "
        logging.info("Appointment count is matched on homepage and for upcoming ")
