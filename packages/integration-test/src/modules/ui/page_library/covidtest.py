# Copyright 2021 Prescryptive Health Inc
import logging
import random
import time
from datetime import timedelta, date

from libraries.selenium import BaseController
from modules.ui.page_library import messages
from modules.ui.page_library.homepage import Homepage

log = logging.getLogger(__name__)


class Covidtest(BaseController):
    """ This class contains all select covid test page functions """

    def __init__(self, driver):
        super().__init__()
        file_name = 'covidtest'
        ini_tag_name = 'Covidtest'
        self.element_parser = self.get_object_repo(file_name, ini_tag_name)
        self.driver = driver
        self.homepage_object = Homepage(self.driver)

    def enter_zipcode_and_pharmacy(self, zip_code: int, pharmacy_name: str):
        """
        Library method to select the covid test and select the pharmacy.
        :param zip_code: Name of the covid test
        :param pharmacy_name: Name of the pharmacy
        :return: set_address: Boolean flag to set address of the flag
        """
        self.click(self.element_parser.get('enter_a_zip_code'), 'enter_a_zip_code')
        self.enter_text(self.element_parser.get('enter_a_zip_code'), 'enter_a_zip_code', zip_code)
        self.click(self.element_parser.get('search_pharmacy'), 'search_pharmacy')
        self.click(self.element_parser.get('pharmacy_name').replace(
            self.replace_pattern, pharmacy_name), 'pharmacy_name'
        )

    def schedule_appointment(
            self, covid_test_type: str, address: str, city: str, state: str, address_zip_code: str,
            county_name: str, appointment_type: str, contact_with_someone: str, direct_patient_contact: str,
            symptoms: str, is_pregnant: str, currently_reside: str, covid_19_test: str, primary_care_name: str,
            primary_care_number: str, gender: str, ethnicity: str, race: str, student_in_a_school: str = "",
            patients_school_name: str = "", patients_occupation: str = "", patients_employer_name: str = "",
            patients_employer_address: str = "", patients_employer_phone: int = 0000000000,
            medicaid_medicare_id: str = "", dependent_picker: str = "", dependent_first_name: str = "",
            dependent_last_name: str = "",
            dependent_dob_month: str = "", dependent_dob_year: int = 0000, dependent_dob_day: int = 00,
            dependent_address: str = "",
            dependent_city: str = "", dependent_zipcode: int = 00000, dependent_county: str = "",
            dependent_state: str = "", dependent_type: str = "", appointment: str = ""
    ) -> tuple:

        """
        Library method to schedule a appointment
        :param covid_test_type: Type of the covid test - antigen, medicare, medicaid
        :param address: Address of the user
        :param city: City of the user
        :param state: State of the user
        :param address_zip_code: Zip code
        :param county_name: Name of the county
        :param appointment_type: Appointment type - Myself/Dependent
        :param contact_with_someone: Answer of question - Have you been in contact with someone with COVID-19 in the
        past 14 days? (Answer - Yes/No/Possibly)
        :param direct_patient_contact: Answer of question - Do you currently work in a healthcare setting with direct
        patient contact? (Answer - Yes/No/Possibly)
        :param symptoms: Answer of question - Do you currently have one or more of the following symptoms?
        (Answer - Yes/No/Possibly)
        :param is_pregnant: Answer of question - Are you currently pregnant? (Answer - Yes/No/Not Applicable)
        :param currently_reside: Answer of question - Do you currently reside in a congregate (group) care setting?
        (Answer - Yes/No)
        :param covid_19_test: Answer of question -  Have you had a COVID-19 test? (Answer - Yes/No)
        :param primary_care_name: Name of the primary care provider
        :param primary_care_number: Number of the primary care provider
        :param gender: Gender
        :param ethnicity: Ethnicity of the user - Hispanic or Latino/Not Hispanic or Latino
        :param student_in_a_school: Answer of question - Are you a student or a volunteer at a school?(Answer - Yes/No)
        :param patients_school_name: Answer of question -  If yes, what is the name of your school?
        :param patients_occupation: Answer of question - What is your occupation?
        :param patients_employer_name: Answer of question - Employer’s name
        :param patients_employer_address: Answer of question - Employer’s full address
        :param patients_employer_phone: Answer of the question -  Employer’s phone number
        :param medicaid_medicare_id: Medicaid and medicare Id for covid tests
        :param race: Race of the user - American Indian or Alaska Native/Asian/Black or African American/
        Native Hawaiian or Other Pacific Islander/White/Other Race
        :param dependent_picker: dependent selection
        :param dependent_first_name: dependents first name
        :param dependent_last_name: dependents last name
        :param dependent_dob_month: dependents  dob month
        :param dependent_dob_year: dependents dob year
        :param dependent_dob_day: dependents dob day
        :param dependent_address: dependents address
        :param dependent_city: dependents city
        :param dependent_zipcode: dependents zipcode
        :param dependent_county: dependents county
        :param dependent_state: dependents state
        :param dependent_type: type of dependent new user or existing
        :param appointment: appointment for myself_dependent
        :return: covid_test_date_and_time - Tuple of covid appointment details - date, time, month, year
        """
        self.wait_until_visible(self.element_parser.get('month_and_year'), 'month_and_year', timeout=90)
        covid_test_date_and_time = self.select_date_and_time_for_covid_testing()
        self.is_visible(self.element_parser.get("timeslot_message"), "timeslot_message")
        if self.is_visible(self.element_parser.get("enter_address"), "enter_address", timeout=30):
            self.enter_address_details(address, city, state, address_zip_code, county_name)
        self.is_visible(
            self.element_parser.get('appointment_type').replace(self.replace_pattern, appointment_type),
            appointment_type
        )
        self.click(
            self.element_parser.get('appointment_type').replace(self.replace_pattern, appointment_type),
            appointment_type
        )
        if appointment_type != "Myself":
            if dependent_type != "Existing":
                self.dependent_details_for_covid_testing(
                    dependent_picker, dependent_first_name, dependent_last_name, dependent_dob_month,
                    dependent_dob_year, dependent_dob_day, dependent_address, dependent_city, dependent_zipcode,
                    dependent_county, dependent_state
                )
            else:
                self.click(
                    self.element_parser.get('dependent_picker').replace(self.replace_pattern, dependent_picker),
                    'dependent_picker'
                )
        # Have you been in contact with someone with COVID-19 in the past 14 days?
        self.click(self.element_parser.get('contact_with_someone_with_covid_19').replace(
            self.replace_pattern, contact_with_someone), 'contact_with_someone'
        )
        # Do you currently work in a healthcare setting with direct patient contact?
        self.click(self.element_parser.get('direct_patient_contact').replace(
            self.replace_pattern, direct_patient_contact), 'direct_patient_contact'
        )

        # Do you currently have one or more of the following symptoms?
        self.click(self.element_parser.get('symptoms_question').replace(
            self.replace_pattern, symptoms), 'symptoms_question'
        )

        # Are you currently pregnant?
        self.click(self.element_parser.get('currently_pregnant').replace(
            self.replace_pattern, is_pregnant), 'currently_pregnant'
        )

        # Do you currently reside in a congregate (group) care setting?
        self.click(self.element_parser.get('currently_reside').replace(
            self.replace_pattern, currently_reside), 'currently_reside'
        )

        # Have you had a COVID-19 test?
        self.click(self.element_parser.get('had_covid_test').replace(
            self.replace_pattern, covid_19_test), 'had_covid_test'
        )

        # What is the name of your Primary Care Provider?
        self.enter_text(
            self.element_parser.get('primary_care_name'), 'primary_care_provider_name', primary_care_name
        )

        # What is the phone number of your Primary Care Provider?
        self.enter_text(
            self.element_parser.get('primary_care_phone'), 'primary_care_provider_number', primary_care_number
        )

        # What is your gender?
        self.click(self.element_parser.get('gender').replace(self.replace_pattern, gender), gender)

        # I identify my ethnicity as:)
        self.click(self.element_parser.get('ethnicity').replace(self.replace_pattern, ethnicity), 'ethnicity')

        # I identify my race as:
        self.click(
            self.element_parser.get('race_identity_checkbox').replace(self.replace_pattern, race),
            'race_identity_checkbox'
        )
        self.pharmacy_specific_questions(
            student_in_a_school, patients_school_name, patients_occupation, patients_employer_name,
            patients_employer_address, patients_employer_phone
        )

        # Accept terms and conditions
        self.click(self.element_parser.get('accept_terms_and_conditions'), 'accept_terms_and_conditions')

        if appointment == 'myself_dependent':
            self.schedule_appointment_for_myself_dependent(
                dependent_picker, dependent_first_name, dependent_last_name, dependent_dob_month,
                dependent_dob_year, dependent_dob_day, dependent_address, dependent_city, dependent_zipcode,
                dependent_county, dependent_state
            )

        # If test is medicaid or medicare then click on the book button
        if covid_test_type == "medicare":
            self.enter_text(self.element_parser.get('medicare_id'), 'medicare_id', medicaid_medicare_id)
            self.click(self.element_parser.get('book_medicare_medicaid_test'), 'book_medicare_medicaid_test')
        elif covid_test_type == "medicaid":
            self.enter_text(self.element_parser.get('medicaid_id'), 'medicaid_id', medicaid_medicare_id)
            self.click(self.element_parser.get('book_medicare_medicaid_test'), 'book_medicare_medicaid_test')
        else:
            self.click(self.element_parser.get('continue_button'), 'continue_button')
        return covid_test_date_and_time

    def schedule_appointment_for_myself_dependent(
            self, dependent_picker: str = "", dependent_first_name: str = "", dependent_last_name: str = "",
            dependent_dob_month: str = "", dependent_dob_year: int = 0000, dependent_dob_day: int = 00,
            dependent_address: str = "", dependent_city: str = "", dependent_zipcode: int = 00000,
            dependent_county: str = "", dependent_state: str = ""
    ):
        """
        :method to fill out details about dependent and check the status of check box
        :param dependent_picker: dependent selection
        :param dependent_first_name: dependents first name
        :param dependent_last_name: dependents last name
        :param dependent_dob_month: dependents  dob month
        :param dependent_dob_year: dependents dob year
        :param dependent_dob_day: dependents dob day
        :param dependent_address: dependents address
        :param dependent_city: dependents city
        :param dependent_zipcode: dependents zipcode
        :param dependent_county: dependents county
        :param dependent_state: dependents state
        """
        self.click(self.element_parser.get('for_another_person'), 'for_another_person')

        self.click(
            self.element_parser.get('dependent_picker').replace(self.replace_pattern, dependent_picker),
            'dependent_picker')

        self.enter_text(self.element_parser.get('dependent_first_name'), 'dependent_first_name',
                        dependent_first_name)
        self.enter_text(self.element_parser.get('dependent_last_name'), 'dependent_last_name', dependent_last_name)
        # Enter dependent's DOB
        self.click(
            self.element_parser.get('dependent_dob_month').replace(self.replace_pattern, dependent_dob_month),
            'dependent_dob_month'
        )
        self.click(
            self.element_parser.get('dependent_dob_year').replace(self.replace_pattern, dependent_dob_year),
            'dependent_dob_year'
        )
        self.click(
            self.element_parser.get('dependent_dob_day').replace(self.replace_pattern, dependent_dob_day),
            'dependent_dob_day'
        )
        if self.get_text(self.element_parser.get('dependent_address'), 'dependent_address') == '':
            self.enter_text(self.element_parser.get('dependent_address'), 'dependent_address', dependent_address)

        self.enter_text(self.element_parser.get('dependent_city'), 'dependent_city', dependent_city)

        self.click(
            self.element_parser.get('dependent_state').replace(self.replace_pattern, dependent_state),
            'dependent_state'
        )
        self.enter_text(self.element_parser.get('dependent_zipcode'), 'dependent_zipcode', dependent_zipcode)
        self.enter_text(self.element_parser.get('dependent_county'), 'dependent_county', dependent_county)
        # fetching status of checkbox to verify it is unchecked for dependent after navigating from myself
        checked_flag = self.get_checkbox_status(
            self.element_parser.get('accept_terms_and_conditions'), 'accept_terms_and_conditions')
        if checked_flag:
            logging.info("check box is already checked when we select dependent user after myself")
            raise Exception('check box is already checked when we select dependent user after myself')

    def pharmacy_specific_questions(
            self, student_in_a_school: str, patients_school_name: str, patients_occupation: str,
            patients_employer_name: str, patients_employer_address: str, patients_employer_phone: int
    ):
        """
        Method to answer pharmacy dependent questions
        :param student_in_a_school: Answer of question - Are you a student or a volunteer at a school?(Answer - Yes/No)
        :param patients_school_name: Answer of question -  If yes, what is the name of your school?
        :param patients_occupation: Answer of question - What is your occupation?
        :param patients_employer_name: Answer of question - Employer’s name
        :param patients_employer_address: Answer of question - Employer’s full address
        :param patients_employer_phone: Answer of the question -  Employer’s phone number
        """
        # Are you a student or a volunteer at a school?
        if self.is_visible(self.element_parser.get('school_student_question'), 'school_student_question'):
            self.click(
                self.element_parser.get('school_student').replace(self.replace_pattern, student_in_a_school),
                'student_in_a_school'
            )

        # If yes, what is the name of your school?
        if self.is_visible(self.element_parser.get('school_name'), 'school_name'):
            self.enter_text(
                self.element_parser.get('school_name'), 'school_name', patients_school_name
            )

        # What is your occupation?
        if self.is_visible(self.element_parser.get('patients_occupation'), 'patients_occupation'):
            self.enter_text(
                self.element_parser.get('patients_occupation'), 'patients_occupation', patients_occupation
            )

        # Employer’s name
        if self.is_visible(self.element_parser.get('patients_employer_name'), 'patients_employer_name'):
            self.enter_text(
                self.element_parser.get('patients_employer_name'), 'patients_employer_name', patients_employer_name
            )

        # Employer’s full address
        if self.is_visible(self.element_parser.get('patients_employer_address'), 'patients-employer-address'):
            self.enter_text(
                self.element_parser.get('patients_employer_address'), 'patients-employer-address',
                patients_employer_address
            )

        # Employer’s phone number
        if self.is_visible(self.element_parser.get('patients_employer_phone'), 'patients_employer_phone'):
            self.enter_text(
                self.element_parser.get('patients_employer_phone'), 'patients_employer_phone', patients_employer_phone
            )

    def payment_screen(
            self, email: str, card_number: str, card_expiry: str, cvc_number: str, name_on_card: str, country: str
    ):
        """
        Library method to enter all card details on the payment screen
        :param email: Email of the user
        :param card_number: Card number required for the payment
        :param card_expiry: Card expiry
        :param cvc_number: Card number
        :param name_on_card: Name on the card
        :param country: Name of the country
        """
        self.wait_until_visible(self.element_parser.get('email'), 'email', timeout=100)
        self.enter_text(self.element_parser.get('email'), 'email', email)
        self.enter_text(self.element_parser.get('card_number'), 'card_number', card_number)
        self.enter_text(self.element_parser.get('card_expiry'), 'card_expiry', card_expiry)
        self.enter_text(self.element_parser.get('cvc_number'), 'cvc_number', cvc_number)
        self.enter_text(self.element_parser.get('name_on_card'), 'name_on_card', name_on_card)
        self.click(self.element_parser.get('country_dropdown'), 'country_dropdown')
        self.click(self.element_parser.get('select_country').replace(self.replace_pattern, country), 'select_country')
        self.click(self.element_parser.get('select_country').replace(self.replace_pattern, country), 'select_country')
        self.click(self.element_parser.get('book_covid_test'), 'book_covid_test')

    def confirm_appointment_assertions(self, covid_test_date_and_time: tuple, covid_test_name: str):
        """
        Library method to confirm the appointment booked.
        :param covid_test_date_and_time: Covid test date and time
        :param covid_test_name: Covid test name
        """
        self.wait_until_visible(self.element_parser.get('appointment_confirmed'), 'appointment_confirmed', timeout=150)
        assert self.is_visible(self.element_parser.get('appointment_confirmed'), 'appointment_confirmed'), (
            "Failed to confirm appointment"
        )
        for appoitment_details in covid_test_date_and_time:
            assert self.is_visible(self.element_parser.get('appointment_details').replace(
                self.replace_pattern, appoitment_details), 'appointment_details'
            ), "Failed to assert appointment date and time"
        assert self.is_visible(self.element_parser.get('booked_test_name').replace(
            self.replace_pattern, covid_test_name), 'booked_test_name'
        ), "Failed to confirm booked test name"
        self.click(self.element_parser.get('home_page_button'), 'home_page_button')

    def select_date_and_time_for_covid_testing(self, scenario="default_selection") -> tuple:
        """
        Library method to set the date.
        :param scenario: default_selection or user booking
        :return: Tuple of covid appointment details - date, time, month, year
        """
        # selecting a current date
        test_date = date.today()
        for i in range(1, 100):
            date_visible = self.get_attribute(self.element_parser.get('covid_test_date').replace(
                self.replace_pattern, str(test_date)), 'covid_test_date', "role"
            )
            if date_visible:
                self.wait_until_visible(
                    self.element_parser.get('covid_test_date').replace(self.replace_pattern, str(test_date)),
                    'covid_test_date', timeout=100
                )
                for date_selection_count in range(0, 3):
                    test = self.click_on_date(test_date=test_date)
                    if test:
                        break
                else:
                    raise Exception(f"Date {test_date} is not clicked even after 3 trials")
                break
            else:
                # selecting next date since current date is not visible
                test_date = (test_date + timedelta(days=1))
                if test_date.day == 1:
                    self.wait_until_visible(
                        self.element_parser.get('next_month_arrow'), 'next_month_arrow', timeout=100
                    )
                    self.click(self.element_parser.get('next_month_arrow'), 'next_month_arrow')
                    # TODO: Need to remove time.sleep() and add wait
                    time.sleep(10)
        month_and_year = None
        if self.is_visible(self.element_parser.get('select_time_dropdown'), 'select_time_dropdown'):
            month_and_year = self.get_text(self.element_parser.get('month_and_year'), 'month_and_year').split(" ")
        self.wait_until_visible(self.element_parser.get('select_time_dropdown'), 'select_time_dropdown')
        time_values = self.find_elements(
            self.element_parser.get('select_time_values'), 'select_time_values'
        )
        if time_values is not [] and scenario == 'default_selection':
            time_value = random.choice(time_values)
            time_value.click()
            covid_test_time = time_value.text.split(" ")
        elif time_values is not [] and scenario == 'userbooking':
            time_values[1].click()
            covid_test_time = time_values[1].text.split(" ")
        return (
            month_and_year[0], str(test_date.day) + ',', month_and_year[1], covid_test_time[0],
            covid_test_time[1].upper()
        )

    def click_on_date(self, test_date):
        """
        Test method to select the date
        :param test_date: Date which needs to be clicked
        :return: Returns True if date is selected
        """
        self.click(
            self.element_parser.get('covid_test_date').replace(self.replace_pattern, str(test_date)),
            'covid_test_date'
        )
        if self.is_visible(self.element_parser.get('select_time_dropdown'), 'select_time_dropdown'):
            return True

    def dependent_details_for_covid_testing(
            self, dependent_picker: str = "", dependent_first_name: str = "", dependent_last_name: str = "",
            dependent_dob_month: str = "", dependent_dob_year: int = 0000, dependent_dob_day: int = 00,
            dependent_address: str = "", dependent_city: str = "", dependent_zipcode: int = 00000,
            dependent_county: str = "", dependent_state: str = ""
    ):
        """
        The function is sued to fill all the details for the dependents entry
        :param dependent_picker: dependent selection
        :param dependent_first_name: dependents first name
        :param dependent_last_name: dependents last name
        :param dependent_dob_month: dependents  dob month
        :param dependent_dob_year: dependents dob year
        :param dependent_dob_day: dependents dob day
        :param dependent_address: dependents address
        :param dependent_city: dependents city
        :param dependent_zipcode: dependents zipcode
        :param dependent_county: dependents county
        :param dependent_state: dependents state
        :return:
        """
        self.click(
            self.element_parser.get('dependent_picker').replace(self.replace_pattern, dependent_picker),
            'dependent_picker'
        )
        self.enter_text(self.element_parser.get('dependent_first_name'), 'dependent_first_name', dependent_first_name)
        self.enter_text(self.element_parser.get('dependent_last_name'), 'dependent_last_name', dependent_last_name)
        # Enter dependent's DOB
        self.click(
            self.element_parser.get('dependent_dob_month').replace(self.replace_pattern, dependent_dob_month),
            'dependent_dob_month'
        )
        self.click(
            self.element_parser.get('dependent_dob_year').replace(self.replace_pattern, dependent_dob_year),
            'dependent_dob_year'
        )
        self.click(
            self.element_parser.get('dependent_dob_day').replace(self.replace_pattern, dependent_dob_day),
            'dependent_dob_day'
        )
        self.enter_text(self.element_parser.get('dependent_address'), 'dependent_address', dependent_address)
        self.enter_text(self.element_parser.get('dependent_city'), 'dependent_city', dependent_city)
        self.click(
            self.element_parser.get('dependent_state').replace(self.replace_pattern, dependent_state),
            'dependent_state'
        )
        self.enter_text(self.element_parser.get('dependent_zipcode'), 'dependent_zipcode', dependent_zipcode)
        self.enter_text(self.element_parser.get('dependent_county'), 'dependent_county', dependent_county)

    def covid_tests_page_validation(self):
        """
        The method is used to validate the list of all covid tests
        """
        tab_element_list = ["covid_antigen_test", "covid_medicare_test", "covid_medicaid_test"]
        assert self.is_visible(self.element_parser.get("select_service"), "select_service", timeout=120)
        for element in tab_element_list:
            assert self.is_visible(self.element_parser.get(element), element)

    def click_covid_test(self, card: str):
        """
        The method is used to click on the card of covid test
        :param:card :card to be clicked
        """
        self.wait_until_visible(self.element_parser.get("select_service"), "select_service", timeout=120)
        if card == "antigen":
            self.click(self.element_parser.get("covid_antigen_test"), "covid_antigen_test")
            logging.info(f"User has selected covid {card} test")
        elif card == "medicare":
            self.click(self.element_parser.get("covid_medicare_test"), "covid_medicare_test")
            logging.info(f"User has selected covid {card} test")
        elif card == "medicaid":
            self.click(self.element_parser.get("covid_medicaid_test"), "covid_medicaid_test")
            logging.info(f"User has selected covid {card} test")
        else:
            logging.info(f"Invalid card option entered card ={card}")

    def negative_test_cases_survey_form(
            self, appointment_type: str = "", dependent_picker: str = "",
            invalid_address: str = "", min_length_char: str = "", min_length_no: str = "",
            dependent_first_name: str = "", dependent_last_name: str = "",
            dependent_dob_month: str = "", dependent_dob_year: int = 0000,
            dependent_dob_day: int = 00, dependent_address: str = "", dependent_city: str = "",
            dependent_zipcode: int = 00000, dependent_county: str = "",
            dependent_state: str = "", address: str = "", city: str = "", state: str = "",
            address_zip_code: str = "", county_name: str = "",
    ):
        """
        The method is used to test negative test cases in the survey form
        :param appointment_type: appointment_type is used to select the type of appointment
        :param invalid_address: invalid address
        :param min_length_char: minimum characters to enter
        :param min_length_no: minimum no to enter
        :param dependent_picker: dependent selection
        :param dependent_first_name: dependents first name
        :param dependent_last_name: dependents last name
        :param dependent_dob_month: dependents  dob month
        :param dependent_dob_year: dependents dob year
        :param dependent_dob_day: dependents dob day
        :param dependent_address: dependents address
        :param dependent_city: dependents city
        :param dependent_zipcode: dependents zipcode
        :param dependent_county: dependents county
        :param dependent_state: dependents state
        :param address: Address of the user
        :param city: City of the user
        :param state: State of the user
        :param address_zip_code: Zip code
        :param county_name: Name of the county
        """
        # self.negative_testing_of_date_and_time()
        self.select_date_and_time_for_covid_testing()
        if self.is_visible(self.element_parser.get("enter_address"), "enter_address", timeout=30):
            # Enter negative test data in address field and validate error message
            self.address_fields_negative_test_cases(invalid_address, min_length_char, min_length_no)
            # Enter valid test data in address field
            self.enter_address_details(address, city, state, address_zip_code, county_name)
        self.wait_until_visible(self.element_parser.get('month_and_year'), 'month_and_year', timeout=90)
        self.click(
            self.element_parser.get('appointment_type').replace(self.replace_pattern, appointment_type),
            appointment_type
        )
        self.click(
            self.element_parser.get('dependent_picker').replace(self.replace_pattern, dependent_picker),
            'dependent_picker'
        )
        # Validate error messages when negative data entered in dependents address fields
        self.address_fields_negative_test_cases(invalid_address, min_length_char, min_length_no)
        self.dependent_details_for_covid_testing(
            dependent_picker, dependent_first_name, dependent_last_name, dependent_dob_month, dependent_dob_year,
            dependent_dob_day, dependent_address, dependent_city, dependent_zipcode, dependent_county, dependent_state
        )
        # Negative scenario for primary care name
        self.enter_text(self.element_parser.get('primary_care_name'), 'primary_care_provider_name', min_length_char)
        self.validate_error_msg(self.get_text(self.element_parser.get('min_length'), 'min_length'), messages.MIN_LENGTH)
        # Negative scenario for primary care phone
        self.enter_text(self.element_parser.get('primary_care_phone'), 'primary_care_provider_number', min_length_no)
        self.validate_error_msg(self.get_text(self.element_parser.get('min_length'), 'min_length'), messages.MIN_LENGTH)
        # Negative scenarios for pharmacy questions
        self.pharmacy_que_negative_test_cases('patients_occupation', min_length_char, 'min_length')
        self.pharmacy_que_negative_test_cases('patients_employer_name', min_length_char, 'min_length')
        self.pharmacy_que_negative_test_cases('patients_employer_address', min_length_char, 'min_length')
        self.pharmacy_que_negative_test_cases('patients_employer_phone', min_length_no, 'min_length')
        self.validate_error_msg(
            self.get_text(self.element_parser.get('answer_all_questions'), 'answer_all_questions'),
            messages.ANSWER_ALL_QUESTIONS
        )
        self.driver.refresh()

    def pharmacy_que_negative_test_cases(self, locator: str, data: str, actual_str: str):
        """
        The method is used to test negative test cases in the survey form
        :param:locator :element which have to get
        :param:data : data to be enter
        :param:actual_str :error message
        """
        if self.is_visible(self.element_parser.get(locator), locator):
            self.enter_text(self.element_parser.get(locator), locator, data)
        self.validate_error_msg(self.get_text(self.element_parser.get(actual_str), actual_str), messages.MIN_LENGTH)

    def invalid_zip_code(self, invalid_zip_code: str):
        """
        The method is used to validate error message when entering invalid zip code
        :param:invalid_zip_code :Invalid zip code
        """
        self.click(self.element_parser.get('enter_a_zip_code'), 'enter_a_zip_code')
        self.enter_text(self.element_parser.get('enter_a_zip_code'), 'enter_a_zip_code', invalid_zip_code)
        self.click(self.element_parser.get('search_pharmacy'), 'search_pharmacy')
        self.validate_error_msg(
            self.get_text(self.element_parser.get('invalid_zip_code'), 'invalid_zip_code'),
            messages.INVALID_ZIP_CODE
        )

    def payment_screen_negative_testcase(
            self, incomplete_email: str, invalid_card_no: str, invalid_card_expiry: str, card_number: str
    ):
        """
        Library method to enter invalid card details on the payment screen and validate error messages
        :param incomplete_email: Incomplete Email
        :param invalid_card_no: Invalid Card number
        :param invalid_card_expiry: Invalid Card expiry
        :param card_number: Valid Card no
        """
        self.wait_until_visible(self.element_parser.get('email'), 'email', timeout=120)
        self.enter_text(self.element_parser.get('email'), 'email', incomplete_email)
        self.enter_text(self.element_parser.get('card_number'), 'card_number', invalid_card_no)
        self.validate_error_msg(
            self.get_text(self.element_parser.get('incomplete_email'), 'incomplete_email'),
            messages.INCOMPLETE_EMAIL
        )
        self.validate_error_msg(
            self.get_text(self.element_parser.get('invalid_card_no'), 'invalid_card_no'),
            messages.INVALID_CARD_NO
        )
        self.enter_text(self.element_parser.get('card_number'), 'card_number', card_number)
        self.enter_text(self.element_parser.get('card_expiry'), 'card_expiry', invalid_card_expiry)
        self.validate_error_msg(
            self.get_text(self.element_parser.get('invalid_card_expiry'), 'invalid_card_expiry'),
            messages.INVALID_CARD_EXPIRY
        )

    def address_fields_negative_test_cases(
            self, invalid_address: str = "", min_length_char: str = "", min_length_no: str = ""
    ):
        """
        Method used to enter negative test data in address fields for new user as well as dependent and
        validate the error messages
        :param invalid_address: Invalid email address
        :param min_length_char: minimum characters to enter
        :param min_length_no: minimum numbers to enter
        """
        self.enter_text(self.element_parser.get('enter_address'), 'enter_address', invalid_address)
        self.validate_error_msg(
            self.get_text(self.element_parser.get('invalid_address_entry'), 'invalid_address_entry'),
            messages.INVALID_ADDRESS_ENTRY
        )
        self.enter_text(self.element_parser.get('enter_city'), 'enter_city', min_length_char)
        self.validate_error_msg(
            self.get_text(self.element_parser.get('invalid_city_entry'), 'invalid_entry_entry'),
            messages.INVALID_CITY_ENTRY
        )
        self.enter_text(self.element_parser.get('address_zip_code'), 'address_zip_code', min_length_no)
        self.validate_error_msg(
            self.get_text(self.element_parser.get('invalid_address_zip_code'), 'invalid_address_zip_code'),
            messages.INVALID_ADDRESS_ZIP_CODE
        )
        self.enter_text(self.element_parser.get('county_name'), 'county_name', min_length_char)
        self.validate_error_msg(
            self.get_text(self.element_parser.get('invalid_county_entry'), 'invalid_county_entry'),
            messages.INVALID_COUNTY_ENTRY
        )

    def validate_error_msg(self, actual_err: str, expected_err: str):
        """
        Method is used to validate error message
        :param actual_err: actual error message
        :param expected_err: expected error message
        """
        if actual_err == expected_err:
            logging.info(f'"{actual_err}" error message is visible')
        else:
            logging.info(f'"{actual_err}" error message is not visible')

    def validate_payment_expiry_link(self):
        """
        Method is used to validate the payment expiry link of payment screen after 10 min
        """
        self.wait_until_visible(self.element_parser.get('email'), 'email', timeout=90)
        time.sleep(600)
        self.driver.refresh()
        self.wait_until_visible(self.element_parser.get('expiry_link'), 'expiry_link', timeout=10)
        assert self.is_visible(
            self.element_parser.get('expiry_link'), 'expiry_link'), ("Link is not expired yet"
                                                                     )
        logging.info("Payment Link is expired ")

    def schedule_covid_vaccine_appointment(
            self, dose: str, address: str, city: str, state: str, address_zip_code: str,
            county_name: str, appointment_type: str, ethnicity: str, race: str, eligible_to_receive_vaccine: str = "",
            primary_healthcare_insurance: str = "", insurance_name_policy_id: str = "",
            received_positive_covid_19: str = "", received_vaccine_past_14_days: str = "",
            received_covid19_vaccine: str = "", received_monoclonal_antibodies: str = "", bleeding_disorder: str = "",
            had_a_seizure_disorder: str = "", is_pregnant_or_breastfeeding: str = "",
            reason_allergic_reaction_checkbox: str = "", has_severe_allergic_reaction: str = "",
            anaphylactic_response: str = "", mothers_maiden_name: str = "",
            dependent_picker: str = "", dependent_first_name: str = "", dependent_last_name: str = "",
            dependent_dob_month: str = "", dependent_dob_year: int = 0000, dependent_dob_day: int = 00,
            dependent_address: str = "", dependent_city: str = "", dependent_zipcode: int = 00000,
            dependent_county: str = "", dependent_state: str = "", first_vaccine_dose: str = "",
            first_dose_date_month: str = "", first_dose_date_day: str = "", first_dose_date_year: str = ""

    ):
        """
        Library method to schedule a appointment for covid vaccine
        :param dose: Covid vaccine dose no
        :param address: Address of the user
        :param city: City of the user
        :param state: State of the user
        :param address_zip_code: Zip code
        :param county_name: Name of the county
        :param appointment_type: Appointment type - Myself/Dependent
        :param ethnicity: Ethnicity of the user - Hispanic or Latino/Not Hispanic or Latino
        :param race: Race of the user - American Indian or Alaska Native/Asian/Black or African American/
         Native Hawaiian or Other Pacific Islander/White/Other Race
        :param eligible_to_receive_vaccine: Eligibility of person to receive vaccine
        :param primary_healthcare_insurance: Primary healthcare insurance type
        :param insurance_name_policy_id: Insurance name and policy id
        :param received_positive_covid_19: Is patient positive for covid-19 test
        :param received_vaccine_past_14_days:Is received vaccine past 14 days
        :param received_covid19_vaccine: Is received covid19 vaccine
        :param received_monoclonal_antibodies:Is Received monoclonal antibodies
        :param bleeding_disorder: Has bleeding disorder
        :param is_pregnant_or_breastfeeding:Is pregnant or breastfeeding
        :param has_severe_allergic_reaction: Has severe allergic reactions
        :param had_a_seizure_disorder: Had seizure disorder
        :param anaphylactic_response: Names of Allergies
        :param reason_allergic_reaction_checkbox: Reason for allergic reaction
        :param mothers_maiden_name: Mother's maiden name
        :param dependent_picker: dependent selection
        :param dependent_first_name: dependents first name
        :param dependent_last_name: dependents last name
        :param dependent_dob_month: dependents  dob month
        :param dependent_dob_year: dependents dob year
        :param dependent_dob_day: dependents dob day
        :param dependent_address: dependents address
        :param dependent_city: dependents city
        :param dependent_zipcode: dependents zipcode
        :param dependent_county: dependents county
        :param dependent_state: dependents state
        :param first_vaccine_dose: First dose name
        :param first_dose_date_year: year when first dose taken
        :param first_dose_date_month: Month when first dose taken
        :param first_dose_date_day: Day when first dose taken
        """
        self.wait_until_visible(self.element_parser.get('month_and_year'), 'month_and_year', timeout=90)
        self.select_date_and_time_for_covid_testing()
        if self.is_visible(self.element_parser.get("enter_address"), "enter_address", timeout=30):
            self.enter_address_details(address, city, state, address_zip_code, county_name)
        self.click(
            self.element_parser.get('appointment_type').replace(self.replace_pattern, appointment_type),
            appointment_type
        )
        if appointment_type != "Myself":
            self.dependent_details_for_covid_testing(
                dependent_picker, dependent_first_name, dependent_last_name, dependent_dob_month, dependent_dob_year,
                dependent_dob_day, dependent_address, dependent_city, dependent_zipcode, dependent_county,
                dependent_state
            )
        # Have you verified that you are eligible to receive vaccine per your state guidelines?
        self.click(self.element_parser.get('eligible_to_receive_vaccine').replace(
            self.replace_pattern, eligible_to_receive_vaccine), 'eligible_to_receive_vaccine'
        )
        # What is your primary health care insurance?
        self.click(self.element_parser.get('primary_healthcare_insurance').replace(
            self.replace_pattern, primary_healthcare_insurance), 'primary_healthcare_insurance'
        )
        # If insured, what is your insurance name and Policy/ID number?
        self.enter_text(
            self.element_parser.get('insurance_name_policy_id'), 'insurance_name_policy_id', insurance_name_policy_id
        )
        # Have you ever have a positive test for COVID - 19 or has a doctor ever told you that you had COVID-19?
        self.click(self.element_parser.get('received_positive_covid_19').replace(
            self.replace_pattern, received_positive_covid_19), 'received_positive_covid_19'
        )
        # Have you received any vaccines in the past 14 days?
        self.click(self.element_parser.get('received_vaccine_past_14_days').replace(
            self.replace_pattern, received_vaccine_past_14_days), 'received_vaccine_past_14_days'
        )
        # Have you received monoclonal antibodies or convalescent plasma as part of a COVID-19 treatment
        # in the past 90 days?
        self.click(self.element_parser.get('received_monoclonal_antibodies').replace(
            self.replace_pattern, received_monoclonal_antibodies), 'received_monoclonal_antibodies'
        )
        # Do you have a bleeding disorder or are you taking a blood thinner?
        self.click(self.element_parser.get('bleeding_disorder').replace(
            self.replace_pattern, bleeding_disorder), 'bleeding_disorder'
        )
        # Have you ever had a seizure disorder for which you are taking seizure medication(s), a brain disorder,
        # Guillain-Barre’s Syndrome, or other nervous system disorder?
        self.click(self.element_parser.get('had_a_seizure_disorder').replace(
            self.replace_pattern, had_a_seizure_disorder), 'had_a_seizure_disorder'
        )
        # Are you currently pregnant or breastfeeding?
        self.click(self.element_parser.get('is_pregnant_or_breastfeeding').replace(
            self.replace_pattern, is_pregnant_or_breastfeeding), 'is_pregnant_or_breastfeeding'
        )
        # Have you ever had a severe allergic reaction (e.g., anaphylaxis, fainting or dizziness) in the past? For
        # example, a reaction for which you were treated with epinephrine, or for which you had to go to the hospital?
        self.click(self.element_parser.get('has_severe_allergic_reaction').replace(
            self.replace_pattern, has_severe_allergic_reaction), 'has_severe_allergic_reaction'
        )
        # If you ever had severe allergic reaction in the past, was it due to:
        self.click(
            self.element_parser.get('reason_allergic_reaction_checkbox').replace(
                self.replace_pattern, reason_allergic_reaction_checkbox), 'reason_allergic_reaction_checkbox'
        )
        # Please list all allergens you have had an anaphylactic response to if any:
        self.enter_text(
            self.element_parser.get('anaphylactic_response'), 'anaphylactic-response', anaphylactic_response
        )
        # I identify my ethnicity as:)
        self.click(self.element_parser.get('ethnicity').replace(self.replace_pattern, ethnicity), 'ethnicity')

        # I identify my race as:
        self.click(
            self.element_parser.get('race_identity_checkbox').replace(self.replace_pattern, race),
            'race_identity_checkbox'
        )
        # What is your mother’s maiden name?
        self.enter_text(
            self.element_parser.get('mothers_maiden_name'), 'mothers_maiden_name', mothers_maiden_name
        )
        # Question present in Dose1 but not in dose2
        if dose != 'dose2':
            # Have you ever received a dose of any COVID-19 vaccine?
            self.click(self.element_parser.get('received_covid19_vaccine').replace(
                self.replace_pattern, received_covid19_vaccine), 'received_covid19_vaccine'
            )

        # Questions for dose2
        if dose == 'dose2':
            self.covid_vaccine_dose2_questions(
                first_vaccine_dose, first_dose_date_month, first_dose_date_day, first_dose_date_year
            )
        # Accept terms and conditions
        self.click(self.element_parser.get('accept_terms_and_conditions'), 'accept_terms_and_conditions')
        self.click(self.element_parser.get('book_medicare_medicaid_test'), 'book_covid_vaccine_dose')

    def vaccine_appointment_confirmation(self):
        """
        The method is used to confirm vaccine appointment
        """
        self.wait_until_visible(self.element_parser.get('appointment_confirmed'), 'appointment_confirmed', timeout=90)
        assert self.is_visible(self.element_parser.get('appointment_confirmed'), 'appointment_confirmed'), (
            "Failed to confirm appointment"
        )

    def click_covid_vaccine(self, card: str):
        """
        The method is used to click on the card of covid vaccine
        :param card: card to be clicked
        """
        self.wait_until_visible(self.element_parser.get("select_service"), "select_service", timeout=120)
        if card == "dose1":
            self.click(self.element_parser.get("covid_vaccine_dose1"), "covid_vaccine_dose1")
            logging.info(f"User has selected covid {card} test")
        elif card == "dose2":
            self.click(self.element_parser.get("covid_vaccine_dose2"), "covid_vaccine_dose2")
            logging.info(f"User has selected covid {card} test")
        else:
            logging.info(f"Invalid card option entered card ={card}")

    def click_covid_vaccine_url(self, vaccine_url: str = ""):
        """
        The method is used to click on the covid vaccine url
        :param vaccine_url: vaccine url link
        """
        self.is_visible(self.element_parser.get('covid_vaccine_url'), 'covid_vaccine_url')
        self.click(self.element_parser.get("covid_vaccine_url"), "covid_vaccine_url")
        if self.get_current_url() == vaccine_url:
            logging.info(f"url match with ={vaccine_url}")
            self.navigate_back()
        else:
            logging.info(f"url not match with ={vaccine_url}")

    def covid_vaccine_dose2_questions(
            self, first_vaccine_dose: str = "", first_dose_date_month: str = "", first_dose_date_day: str = "",
            first_dose_date_year: str = ""
    ):
        """
        The method is used to answer the covid vaccine dose 2 questions
        :param first_vaccine_dose: first vaccine dose name
        :param first_dose_date_month: month of first vaccine taken
        :param first_dose_date_day: day of first vaccine taken
        :param first_dose_date_year: year of first vaccine taken
        """
        # Which vaccine did you receive for the first dose
        self.click(
            self.element_parser.get('first_vaccine_dose').replace(self.replace_pattern, first_vaccine_dose),
            'first_vaccine_dose'
        )
        # When did you receive your first dose?
        self.click(
            self.element_parser.get('first_dose_date_month').replace(self.replace_pattern, first_dose_date_month),
            'first_dose_date_month'
        )
        self.enter_text(
            self.element_parser.get('first_dose_date_day'), 'first_dose_date_day', first_dose_date_day
        )
        self.enter_text(
            self.element_parser.get('first_dose_date_year'), 'first_dose_date_year', first_dose_date_year
        )

    def validate_join_waitlist(
            self, pharmacy_distance: str, applicant_type: str, zipcode: int, firstname: str = "", lastname: str = "",
            mobile: int = 0000000000, birth_month: str = "", birth_date: int = 00, birth_year: int = 0000,
            waitlist_entry: str = ""
    ):
        """
        The function is used to validate the join waitlist functionality
        :param pharmacy_distance:pharmacy distance dropdown value
        :param applicant_type:applicant/end user type
        :param firstname:first name of dependent
        :param lastname:last name of dependent
        :param mobile: mobile of dependent
        :param birth_month:birth month of dependent
        :param birth_date:birth date of dependent
        :param birth_year:birth year of dependent
        :param zipcode:zipcode
        :param waitlist_entry:waitlist entry
        """
        self.click(self.element_parser.get('enter_a_zip_code'), 'enter_a_zip_code')
        self.enter_text(self.element_parser.get('enter_a_zip_code'), 'enter_a_zip_code', zipcode)
        self.click(self.element_parser.get('search_pharmacy'), 'search_pharmacy')
        self.click(self.element_parser.get('pharamacy_distance').replace(
            self.replace_pattern, pharmacy_distance), 'pharamacy_distance'
        )
        self.is_visible(self.element_parser.get('join_waitlist'), 'join_waitlist')
        self.click(self.element_parser.get('join_waitlist'), 'join_waitlist')
        self.click(self.element_parser.get('user_radio_btn').replace(
            self.replace_pattern, applicant_type), 'user_radio_btn'
        )
        if applicant_type != "Myself":
            self.validate_dependent_join_waitlist(firstname, lastname, mobile, birth_month, birth_date, birth_year)
        self.click(self.element_parser.get('join_wishlist_btn'), 'join_wishlist_btn')
        if waitlist_entry == "duplicate":
            if not self.is_visible(self.element_parser.get('waitlist_error_vaccine'), 'waitlist_error_vaccine',
                                   timeout=90):
                logging.info(
                    f"Applicant ={applicant_type} has not been added to the waitlist as user is already added to the waitlist")
                raise Exception(
                    f"Applicant ={applicant_type} is already added to the waitlist and still not showing error message")
        elif not self.is_visible(self.element_parser.get('waitlist_confirm_page'), 'waitlist_confirm_page',
                                 timeout=160):
            raise Exception(
                f"Applicant ={applicant_type} is not added to the waitlist")
        logging.info(f"Applicant ={applicant_type} has been added to the waitlist")

    def validate_add_another_person(
            self, applicant_type: str, firstname: str = "", lastname: str = "", mobile: int = 0000000000,
            birth_month: str = "", birth_date: int = 00, birth_year: int = 0000, waitlist_entry: str = ""
    ):
        """
        The function is used to validate the join waitlist entry for the another person
        :param applicant_type:applicant/end user type
        :param firstname:first name of dependent
        :param lastname:last name of dependent
        :param mobile: mobile of dependent
        :param birth_month:birth month of dependent
        :param birth_date:birth date of dependent
        :param birth_year:birth year of dependent
        :param waitlist_entry:waitlist entry
        """
        if waitlist_entry == "invalid":
            self.click(self.element_parser.get('add_another_btn'), 'add_another_btn')
        # This is work around for not clearing the cache data
        self.click(self.element_parser.get('user_radio_btn').replace(
            self.replace_pattern, "Myself"), 'user_radio_btn'
        )
        self.click(self.element_parser.get('user_radio_btn').replace(
            self.replace_pattern, applicant_type), 'user_radio_btn'
        )
        # To add another person
        self.validate_dependent_join_waitlist(firstname, lastname, mobile, birth_month, birth_date, birth_year)
        self.click(self.element_parser.get('join_wishlist_btn'), 'join_wishlist_btn')
        if waitlist_entry == "invalid":
            if not self.is_visible(self.element_parser.get('waitlist_error_vaccine_invalid'),
                                   'waitlist_error_vaccine_invalid'):
                logging.info(
                    f"Applicant ={applicant_type} has not been added to the waitlist as user has entered invalid number")
                raise Exception(
                    f"Applicant ={applicant_type} is added to the waitlist using invalid number")
        elif not self.is_visible(self.element_parser.get('waitlist_confirm_page'), 'waitlist_confirm_page', timeout=90):
            raise Exception(
                f"Applicant ={applicant_type} is not added to the waitlist")
        else:
            logging.info(f"Applicant ={applicant_type} has been added to the waitlist")

    def validate_dependent_join_waitlist(
            self, firstname: str, lastname: str, mobile: int, birth_month: str, birth_date: int,
            birth_year: int
    ):
        """
        The function is sued to validate dependent functionality of join waitlist
        :param firstname:first name of dependent
        :param lastname:last name of dependent
        :param mobile: mobile of dependent
        :param birth_month:birth month of dependent
        :param birth_date:birth date of dependent
        :param birth_year:birth year of dependent
        """
        self.click(self.element_parser.get('othet_person_picker'), 'othet_person_picker')
        self.enter_text(
            self.element_parser.get('other_person_firstname'), 'other_person_firstname', firstname
        )
        self.enter_text(
            self.element_parser.get('other_person_lastname'), 'othr_person_lastname', lastname
        )

        self.enter_text(
            self.element_parser.get('other_person_mobile'), 'other_person_mobile', mobile
        )
        self.click(
            self.element_parser.get('birth_date_month_value').replace(self.replace_pattern, birth_month),
            'birth_date_month_value'
        )
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

    def hit_url_in_browser(self, url: str):
        """
        Method to hit waitlist url in the browser
        :param url: url that needs to open in the browser
        """
        logging.info(f"URL - {url}")
        self.driver.get(url)

    def set_address_value(self, id_status_flag: bool) -> bool:
        """
        Library method to check set set_address flag.
        :param id_status_flag: Visibility of idcard in homepage
        :return: set_address: Boolean flag to set address of the flag
        """
        set_address = True
        if id_status_flag:
            set_address = False
        return set_address

    def negative_testing_of_date_and_time(self):
        """
        Method to perform negative testing of date and time
        """
        # TODO: LOGIC WILL BE FIXED BY PRANITA
        test_date = (date.today() - timedelta(days=1))
        for covid_date in range(test_date.day, 0, -1):
            date_disables = self.get_attribute(self.element_parser.get('covid_test_date').replace(
                self.replace_pattern, str(test_date)), 'covid_test_date', "role"
            )
            assert date_disables is None, f"{test_date} is enabled"
            test_date = (test_date - timedelta(days=1))

    def cancel_appointment(self, appointments_count_homepage: str) -> str:
        """
        The method is used to cancel booked appointment
        :param appointments_count_homepage: Upcoming Appointments count on homepage
        :return appointment_count_str: Appointment count after canceling appointment
        """
        appointment_list = self.find_elements(self.element_parser.get('appointment'), 'appointment')
        appointment_list[1].click()
        self.wait_until_visible(self.element_parser.get('appointment_confirmed'), 'appointment_confirmed')
        appointment_count_after_cancellation = int(appointments_count_homepage)
        # if cancel button is disabled to click then click home page button
        is_disabled = self.get_attribute(
            self.element_parser.get('cancel_appointment'), 'cancel_appointment', "aria-disabled"
        )
        if is_disabled:
            assert is_disabled, "cancel_appointment button is disabled "
            logging.info("Failed to cancel the appointment from the list "
                         "because cancellation must be submitted at least 6 hours in advance")
            self.click(self.element_parser.get('home_page_button'), 'home_page_button')
        else:
            self.click(self.element_parser.get('cancel_appointment'), 'cancel_appointment')
            self.click(self.element_parser.get('yes_cancel_button'), 'yes_cancel_button')
            self.is_visible(self.element_parser.get('appointment_canceled'), 'appointment_canceled', timeout=90)
            appointment_count_after_cancellation = int(appointments_count_homepage) - 1
            self.click(self.element_parser.get('home_page_button'), 'home_page_button')
        return appointment_count_after_cancellation

    def appointment_count_validation(self, appointment_count_homepage: str, appointment_count_str: str):
        """
        The method is used to validate appointment count after canceling appointment
        :param appointment_count_homepage: appointment count on homepage after canceling appointment
        :param appointment_count_str: appointment count after cancelling appointment
        """
        if int(appointment_count_homepage) == 0:
            assert appointment_count_str == None, ("Appointment count is not none after cancelling appointment")
            logging.info("Appointment count is 0 after canceling appointment")
        else:
            assert int(appointment_count_homepage) == int(appointment_count_str), (
                'Appointment count is not decreased after canceling appointment'
            )

    def validate_dob_error_for_age_under_18_or_3(self):
        """
        The method is used to validate invalid date of birth error for age of user under 3 or 18
        """
        self.validate_error_msg(
            self.get_text(self.element_parser.get('invalid_dob_error'), 'invalid_dob_error'),
            messages.INVALID_DOB_FOR_VACCINE_TEST
        )
        self.driver.refresh()

    def accepting_popup_for_payment_screen(self):
        """
        The method is used to accept the pop up when we refresh at payment screen
        """
        self.hit_url_in_browser("https://test.myrx.io/")
        alert_obj = self.driver.switch_to.alert
        alert_obj.accept()

    def covid_vaccine_negative_testing(
            self, appointment_type: str = "", dependent_picker: str = "",
            invalid_address: str = "", min_length_char: str = "", min_length_no: str = "",
            dependent_first_name: str = "", dependent_last_name: str = "",
            dependent_dob_month: str = "", dependent_dob_year: int = 0000,
            dependent_dob_day: int = 00, dependent_address: str = "", dependent_city: str = "",
            dependent_zipcode: int = 00000, dependent_county: str = "",
            dependent_state: str = "", address: str = "", city: str = "", state: str = "",
            address_zip_code: str = "", county_name: str = "", first_dose_date_day: str = "",
            first_dose_date_year: str = "", invalid_day: str = "", invalid_year: str = ""
    ):
        """
        The method is used to test negative test cases in the survey form
        :param appointment_type: appointment_type is used to select the type of appointment
        :param invalid_address: invalid address
        :param min_length_char: minimum characters to enter
        :param min_length_no: minimum no to enter
        :param dependent_picker: dependent selection
        :param dependent_first_name: dependents first name
        :param dependent_last_name: dependents last name
        :param dependent_dob_month: dependents  dob month
        :param dependent_dob_year: dependents dob year
        :param dependent_dob_day: dependents dob day
        :param dependent_address: dependents address
        :param dependent_city: dependents city
        :param dependent_zipcode: dependents zipcode
        :param dependent_county: dependents county
        :param dependent_state: dependents state
        :param address: Address of the user
        :param city: City of the user
        :param state: State of the user
        :param address_zip_code: Zip code
        :param county_name: Name of the county
        :param invalid_day: Invalid day
        :param invalid_year: Invalid year
        :param first_dose_date_year: year when first dose taken
        :param first_dose_date_day: day when first dose taken
        """
        # self.negative_testing_of_date_and_time()
        self.select_date_and_time_for_covid_testing()
        if self.is_visible(self.element_parser.get("enter_address"), "enter_address", timeout=30):
            # Enter negative test data in address field and validate error message
            self.address_fields_negative_test_cases(invalid_address, min_length_char, min_length_no)
            # Enter valid test data in address field
            self.enter_address_details(address, city, state, address_zip_code, county_name)
        self.wait_until_visible(self.element_parser.get('month_and_year'), 'month_and_year', timeout=90)
        self.click(
            self.element_parser.get('appointment_type').replace(self.replace_pattern, appointment_type),
            appointment_type
        )
        self.click(
            self.element_parser.get('dependent_picker').replace(self.replace_pattern, dependent_picker),
            'dependent_picker'
        )
        # Validate error messages when negative data entered in dependents address fields
        self.address_fields_negative_test_cases(invalid_address, min_length_char, min_length_no)
        self.dependent_details_for_covid_testing(
            dependent_picker, dependent_first_name, dependent_last_name, dependent_dob_month, dependent_dob_year,
            dependent_dob_day, dependent_address, dependent_city, dependent_zipcode, dependent_county, dependent_state
        )
        # When did you receive your first dose?
        self.enter_text(self.element_parser.get('first_dose_date_day'), 'first_dose_date_day', invalid_day)
        self.validate_error_msg(
            self.get_text(self.element_parser.get('invalid_day_error'), 'invalid_day_error'), messages.INVALID_DAY_ERROR
        )
        self.enter_text(
            self.element_parser.get('first_dose_date_day'), 'first_dose_date_day', first_dose_date_day
        )
        self.enter_text(self.element_parser.get('first_dose_date_year'), 'first_dose_date_year', invalid_year)
        self.validate_error_msg(
            self.get_text(self.element_parser.get('invalid_year_error'), 'invalid_year_error'),
            messages.INVALID_YEAR_ERROR
        )
        self.enter_text(
            self.element_parser.get('first_dose_date_year'), 'first_dose_date_year', first_dose_date_year
        )
        # Negative scenario for primary care name
        self.enter_text(self.element_parser.get('mothers_maiden_name'), 'mothers_maiden_name', min_length_char)
        self.validate_error_msg(self.get_text(self.element_parser.get('min_length'), 'min_length'), messages.MIN_LENGTH)
        self.driver.refresh()

    def appointment_verification_in_upcoming_appointments(self, covid_test_date_and_time: str, covid_test_name: str):
        """
        The method is used to verify whether booked appointment added in upcoming appointment
        :param covid_test_date_and_time: covid test booked date and time
        :param covid_test_name: Booked covid test name
        """
        assert self.is_visible(self.element_parser.get('covid_test_date_time').replace(
            self.replace_pattern, covid_test_date_and_time), 'covid_test_date_time'
        ), "Failed to assert appointment date and time in upcoming appointments"
        assert self.is_visible(self.element_parser.get('covid_test_name').replace(
            self.replace_pattern, covid_test_name), 'covid_test_name'
        ), "Failed to assert booked test name in upcoming appointments"

    def enter_address_details(self, address: str, city: str, state: str, address_zip_code: str, county_name: str):
        """
        The method id used to enter all the address details
        :param address: Address of the user
        :param city: City of the user
        :param state: State of the user
        :param address_zip_code: Zip code
        :param county_name: Name of the county
        """
        self.enter_text(self.element_parser.get('enter_address'), 'enter_address', address)
        self.enter_text(self.element_parser.get('enter_city'), 'enter_city', city)
        self.click(self.element_parser.get('state_dropdown'), 'state_dropdown')
        self.click(self.element_parser.get('select_state').replace(self.replace_pattern, state), 'select_state')
        self.enter_text(self.element_parser.get('address_zip_code'), 'address_zip_code', address_zip_code)
        self.enter_text(self.element_parser.get('county_name'), 'county_name', county_name)

    def timeslot_selection_for_user_booking(self) -> str:
        """
        The method is used to select timeslot for user booking scenarios
        :return covid_test_time_string: covid test time string
        """
        self.wait_until_visible(self.element_parser.get('month_and_year'), 'month_and_year', timeout=90)
        covid_test_time = self.select_date_and_time_for_covid_testing(scenario="userbooking")
        covid_test_time_string = covid_test_time[3] + "" + covid_test_time[4]
        return covid_test_time_string

    def click_covid_test_and_enter_zipcode_pharmacy(self, card: str, zip_code: int, pharmacy_name: str):
        """
        The method is used to click covid test and enter zipcode and select the pharmacy
        :param card: covid test name
        :param zip_code: zip code of pharmacy
        :param pharmacy_name: Name of the pharmacy
        """
        self.click_covid_test(card)
        self.enter_zipcode_and_pharmacy(zip_code, pharmacy_name)

    def timeslot_scenario1(self, timeslot_list: list):
        """
        The method is used for scenario 1 that is when two user select same timeslot at same time,then third user hit
        api then he should not be able to see that time slot it select different timeslot
        :param timeslot_list: list of the timeslots selected by 3 users
        """
        any_two_timeslots_equal = any(timeslot_list.count(x) == 2 for x in timeslot_list)
        if any_two_timeslots_equal:
            logging.info(
                'In two tabs,covid test timeslots are same and in third tab that timeslot is not displayed'
                ' so it will select another timeslot'
            )
        else:
            raise Exception(
                'In two tabs,covid test timeslots are same and in third tab that timeslot is showing same timeslot'
            )

    def timeslot_scenario2(self):
        """
        The method is used for scenario 2 that is when three user booking test for same timeslot third user should get
        the timeslot error
        """
        timeslot_list = []
        for tab in range(0, 3):
            self.switch_to_tab_no(tab_no=tab)
            covid_test_time = self.timeslot_selection_for_user_booking()
            timeslot_list.append(covid_test_time)
        print(timeslot_list)
        if len(set(timeslot_list)) == 1:
            assert self.is_visible(self.element_parser.get('timeslot_error'), 'timeslot_error'), \
                "If three timeslots selected by three tabs are same then timeslot block error is not visible"
            logging.info("Three timeslots selected by three tabs are same then timeslot block error is visible")
