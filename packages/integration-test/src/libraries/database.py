# Copyright 2021 Prescryptive Health Inc
import base64
import copy
import logging
import os
from datetime import timedelta, date
from time import strptime

import redis
from pymongo import MongoClient

from libraries.common import Common

log = logging.getLogger(__name__)


class Database:

    def __init__(self):
        pass

    def connect_client(self):
        """
        The function is used to create a connection to the database
        :return: client
        """
        try:
            file_path_db = os.path.join(Common.project_path(), "testdata/ui/mongo.txt")
            database_file = open(file_path_db, 'r')
            base64_database = database_file.read()
            database_string = base64.b64decode(base64_database).decode('utf-8')
            if not database_string:
                raise Exception("database string not Found.")
            client = MongoClient(database_string)
            logging.info("The connection to the MongoDB has been created")
            return client
        except Exception as e:
            raise Exception("Unbale to connect to client", e)

    def update_waitlist_data(self, query_dict: dict, updated_values: dict, updated_record_dict: dict):
        """
        Method to update the waitlist data from the database
        :param query_dict: Record which needs to be updated
        :param updated_values: Updated data
        :param updated_record_dict: Updated record dict
        :return: Identifier of the updated record
        """
        try:
            db = self.connect_client().RxAssistant_test
            waitlist_data = db.Waitlist
            # find the record which needs to be updated and update the record
            if waitlist_data.find_one(query_dict):
                waitlist_data.update_one(query_dict, updated_values)
            # Get the identifier of the updated record of the user
            updated_result = waitlist_data.find_one(updated_record_dict)
            if not updated_result:
                raise Exception(f"Failed to find the record of the user {updated_record_dict}")
            logging.info(
                f"Successfully updated the data of the user with identifier {updated_result['identifier']} from the "
                f"waitlist database"
            )
            return updated_result["identifier"]
        except Exception as e:
            raise Exception("Failed to update watilist data with error ", e)

    def delete_person_data_database(self, country_code: str, phone_number: str, rxgroup_type: str = "CASH"):
        """
        The function is used to delete the data for the specific number from the database
        :param country_code: Country code
        :param phone_number: Phone number
        :param rxgroup_type: Phone number
        """
        try:
            db = self.connect_client().RxAssistant_test
            phone_number = (country_code + phone_number).replace("X", "")
            account_data = db.Account
            if account_data.find_one({"phoneNumber": phone_number}):
                account_data.delete_one({"phoneNumber": phone_number})
            if db.Waitlist.find({"phoneNumber": phone_number}):
                db.Waitlist.delete_many({"phoneNumber": phone_number})
            person_data = db.Person.find_one({"phoneNumber": phone_number, "rxGroupType": rxgroup_type})
            if (person_data and db.Person.find_one({'identifier': person_data['identifier']})):
                db.Person.delete_one({'identifier': person_data['identifier']})
            logging.info(
                f"The data for the number {phone_number} has been deleted from the Accounts, waitlist and Person "
                f"database"
            )
        except Exception as e:
            raise Exception(f"Unable to delete data for phone number {phone_number}", e)

    def update_already_created_sie_user_record(self, identifier: str, child_dependent: bool = False):
        """
        Updating the sie user record(primary sie user/dependent) which is already present in the database
        Adding a blank string for mobile number, first name, last name and birth date of the sie user record
        :param identifier: identifier of the sie user entry
        :param child_dependent: Flag when to update child dependent entry
        """
        sie_user_testdata = copy.deepcopy(Common.read_ui_testdata("sie_user_database.json"))
        db = self.connect_client().RxAssistant_test
        filter_by_identifier = {"identifier": identifier}
        if not db.Person.find(filter_by_identifier):
            raise Exception(f"user entry with identifier {identifier} is not present in the code")
        updated_value = copy.deepcopy(sie_user_testdata['sie_user_details']['updated_values'])
        if child_dependent:
            updated_value['$set']['primaryMemberFamilyId'] = ""
        db.Person.update_one(filter_by_identifier, updated_value)
        updated_dict = sie_user_testdata['sie_user_details']['updated_values']['$set']
        updated_dict.update(filter_by_identifier)
        if not db.Person.find_one(updated_dict):
            raise Exception(f"Failed to update the SIE user record with identifier {identifier}")
        logging.info(f"Updated the values of SIE user record with identifier {identifier} in the person database")

    def create_sie_user(
            self, identifier: str, phone_number: str, country_code: str, first_name: str, last_name: str,
            birth_date: str
    ):
        """
        Method to add SIE user details in the person collection
        :param identifier: Identifier for which sie user details needs to add (Prerequisite - Entry for sie user is
        already present in the database)
        :param phone_number: Phone number of the user
        :param country_code: Country code of the user
        :param first_name: First name of the user
        :param last_name: Last name of the user
        :param birth_date: Birth date of the user
        """
        try:
            database_testdata = copy.deepcopy(Common.read_ui_testdata("sie_user_database.json"))
            db = self.connect_client().RxAssistant_test
            phone_number = (country_code + phone_number).replace("X", "")
            filter_by_identifier = {"identifier": identifier}
            if db.Person.find_one(filter_by_identifier):
                updated_values = database_testdata['sie_user_details']['updated_values']
                updated_values['$set']['firstName'] = first_name
                updated_values['$set']['lastName'] = last_name
                updated_values['$set']['dateOfBirth'] = birth_date
                updated_values['$set']['phoneNumber'] = phone_number
                db.Person.update_one(filter_by_identifier, updated_values)
            database_query = {"identifier": identifier, "phoneNumber": phone_number}
            if not db.Person.find_one(database_query):
                raise Exception(f"Failed to get the user record of given query - {database_query}")
            logging.info(f"Successfully added the sie user for the mobile number - '{phone_number}'")
        except Exception as e:
            raise Exception("Failed to create sie user with error ", e)

    def create_sie_dependent_user(
            self, sie_identifier: str, identifier: str, first_name: str, last_name: str, birth_date: str
    ):
        """
        Method to add SIE user dependent details in the person collection
        :param identifier: Identifier for which sie user details needs to add (Prerequisite - Entry for sie user is
        already present in the database)
        :param sie_identifier: Sie user identifier
        :param identifier: Child user identifier
        :param first_name: First name of the user
        :param last_name: Last name of the user
        :param birth_date: Birth date of the user
        """
        try:
            sie_user_database_testdata = copy.deepcopy(Common.read_ui_testdata("sie_user_database.json"))
            db = self.connect_client().RxAssistant_test
            filter_sie_record = {"identifier": sie_identifier}
            sie_record = db.Person.find_one(filter_sie_record)['primaryMemberFamilyId']
            if not sie_record:
                raise Exception(f"Failed to get the sie user record of given query - {filter_sie_record}")
            filter_by_identifier = {"identifier": identifier}
            if db.Person.find_one(filter_by_identifier):
                updated_values = copy.deepcopy(sie_user_database_testdata['sie_user_details']['updated_values'])
                updated_values['$set']['firstName'] = first_name
                updated_values['$set']['lastName'] = last_name
                updated_values['$set']['dateOfBirth'] = birth_date
                updated_values['$set']['primaryMemberFamilyId'] = sie_record
                db.Person.update_one(filter_by_identifier, updated_values)
            database_query = {"identifier": identifier, "firstName": first_name}
            database_entry = db.Person.find_one(database_query)
            if not database_entry:
                raise Exception(f"Failed to get the sie user dependent record of given query - {database_query}")
            logging.info(
                f"Successfully added the sie user dependent entry with primaryMemberFamilyId - "
                f"'{database_entry['primaryMemberFamilyId']}'"
            )
        except Exception as e:
            raise Exception("Failed to create sie user dependent entry with error ", e)

    def get_idcard_details(self, country_code: str, phone_number: str, rxgroup_type: str) -> dict:
        """
        The function is used to get health plan card for SIE User details and smart card for CASH user details from the
        database for cash user
        :param country_code: Country code
        :param phone_number:number to fetch smart card details
        :param rxgroup_type:group type of user(CASH/SIE)
        :return:health plan card/smart price card details dict according to user type
        """
        try:
            database_testdata = copy.deepcopy(Common.read_ui_testdata("database.json"))
            db = self.connect_client().RxAssistant_test
            phone_number = (country_code + phone_number).replace("X", "")
            person_data = db.Person
            issuer_no = database_testdata['digital_card']['issuer_no']
            query = {"phoneNumber": phone_number, "rxGroupType": rxgroup_type}
            rx_pcn = person_data.find_one(query)['carrierPCN']
            rx_bin = person_data.find_one(query)['rxBin']
            rx_group = person_data.find_one(query)['rxGroup']
            rx_id = person_data.find_one(query)['primaryMemberFamilyId'] + \
                    person_data.find_one(query)['primaryMemberPersonCode']
            name = person_data.find_one(query)['firstName'] + person_data.find_one(query)['lastName']
            # For CASH user smart card details
            card_details_dict = dict(rx_pcn=rx_pcn, rx_bin=rx_bin, rx_group=rx_group, rx_id=rx_id, name=name)
            logging.info(f"The smart card details for cash user are ={card_details_dict}")
            # For SIE user health plan card details
            if rxgroup_type == 'SIE' and person_data.find_one(query):
                card_details_dict["issuer_no"] = issuer_no
                logging.info(f"The health plan card details for sie user are ={card_details_dict}")
            return card_details_dict
        except Exception as e:
            raise Exception(
                f"Unable to get id card data of rxgroup_type = {rxgroup_type} user for phone number = {phone_number}")

    def delete_tokens_for_device(self, country_code: str, phone_number: str):
        """
        Delete  device token for the specific mobile number from redis
        :param country_code: Country code
        :param phone_number :mobile number to clear data
        """
        try:
            redis_testdata = copy.deepcopy(Common.read_ui_testdata("redis.json"))
            redis_file_path = os.path.join(Common.project_path(), "testdata/ui/redis.txt")
            redis_file_data = open(redis_file_path, 'r')
            base64_redis = redis_file_data.read()
            redis_password = base64.b64decode(base64_redis).decode('utf-8')
            if not redis_password:
                raise Exception("redis password not Found")
            redis_conn = redis.StrictRedis(
                host=redis_testdata["redis_conn_host"], port=6380, db=0, password=redis_password, ssl=True
            )
            phone_number = (country_code + phone_number).replace("X", "")
            cursor = '0'
            while cursor != 0:
                cursor, keys = redis_conn.scan(cursor=cursor, match=f"myrx:*:{phone_number}*", count=5000)
                if keys:
                    redis_conn.delete(*keys)
            logging.info(f"All the device token for the number {phone_number} has been deleted from Redis")
        except Exception as e:
            raise Exception("Failed to delete token for device from the redis with error ", e)

    def create_query_to_update_the_waitlist_database(
            self, mobile_number, country_code, invited_status, service_type, updated_values, dependent_first_name="",
            dependent_last_name="", birth_month="", birth_year="", birth_date="", appointment_type="Myself"
    ) -> tuple:
        """
        Method to create a database query to update the waitlist database
        :param mobile_number: Mobile number
        :param country_code: Country code
        :param invited_status: Status of the record
        :param service_type: Service type of the covid
        :param updated_values: Values that needs to be updated
        :param dependent_first_name: First name of the dependent
        :param dependent_last_name: Last name of the dependent
        :param birth_month: Birth month of the dependent
        :param birth_year: Birth year of the dependent
        :param birth_date: Birth date of the dependent
        :param appointment_type: Appointment type of the user
        :return: Database queries - query_dict, updated_values, updated_record_dict
        """
        try:
            # Update the mobile number in the database queries
            mobile_number = (country_code + mobile_number).replace("X", "")
            # Creating a query to find the record of the covid19 dose1 for myself in the waitlist database
            database_testdata = copy.deepcopy(Common.read_ui_testdata("database.json"))
            join_waitlist_query_dict = database_testdata['join_waitlist_query_dict']
            join_waitlist_query_dict['serviceType'] = service_type
            join_waitlist_query_dict['phoneNumber'] = mobile_number
            join_waitlist_query_dict['status'] = None

            if appointment_type is not "Myself":
                join_waitlist_query_dict["firstName"] = dependent_first_name
                join_waitlist_query_dict["lastName"] = dependent_last_name
                birth_month = str(strptime(birth_month[:3], '%b').tm_mon)
                if int(birth_month) < 10:
                    birth_month = '0' + birth_month
                complete_birth_date = birth_year + "-" + birth_month + "-" + birth_date
                join_waitlist_query_dict["dateOfBirth"] = complete_birth_date
            updated_record_dict = copy.deepcopy(join_waitlist_query_dict)
            updated_record_dict["status"] = invited_status
            test_date = date.today()
            updated_values["$set"]["invitation"]["invitedOn"] = (
                    str(test_date - timedelta(days=15)) + updated_values["$set"]["invitation"]["invitedOn"]
            )
            logging.info(f"invited on date = '{str(test_date - timedelta(days=15))}'")
            updated_values["$set"]["invitation"]["start"] = (
                    str(test_date - timedelta(days=2)) + updated_values["$set"]["invitation"]["start"]
            )
            logging.info(f"invitation start date = '{str(test_date - timedelta(days=2))}'")
            updated_values["$set"]["invitation"]["end"] = (
                    str(test_date + timedelta(days=21)) + updated_values["$set"]["invitation"]["end"]
            )
            logging.info(f"invitation start date = '{str(test_date + timedelta(days=21))}'")
            return join_waitlist_query_dict, updated_values, updated_record_dict
        except Exception as e:
            raise Exception("Failed to create an queries to update the test data with error ", e)

    def update_database_values_for_join_emp_sie_user(self, identifier: str = ""):
        """
        The function is used to update the databse value for sie user
        :return:none
        """
        try:
            sie_user_database_data = copy.deepcopy(Common.read_ui_testdata("sie_user_database.json"))
            db = self.connect_client().RxAssistant_test
            if db.Person.find({"identifier": identifier}):
                filter_by_identifier = {"identifier": identifier}
                updated_value = sie_user_database_data['update_for_join_emp']
                db.Person.update_one(filter_by_identifier, updated_value)
                logging.info(f"updated database values for join emp plan fo the identifier {identifier}")
                return db.Person.find_one({'identifier': identifier})['primaryMemberRxId']
        except Exception as e:
            raise Exception(f"unable to update database values for join emp plan for indentifier {identifier} ", e)
