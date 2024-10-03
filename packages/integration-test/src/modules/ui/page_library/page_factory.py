# Copyright 2021 Prescryptive Health Inc
from modules.ui.page_library.appointments import Appointments
from modules.ui.page_library.covidtest import Covidtest
from modules.ui.page_library.digitalcard import Digitalcard
from modules.ui.page_library.homepage import Homepage
from modules.ui.page_library.join_employer_plan import JoinEmployerPlan
from modules.ui.page_library.login import Login
from modules.ui.page_library.sidemenu import Sidemenu
from modules.ui.page_library.signup import Signup


class PageObjects:
    def __init__(self, page_list, driver):
        # Initialing an objects for provided page list and raise ValueError if key not found
        for page in page_list:
            if page == 'login':
                self.login = Login(driver)
            elif page == 'homepage':
                self.homepage = Homepage(driver)
            elif page == 'covidtest':
                self.covidtest = Covidtest(driver)
            elif page == 'signup':
                self.signup = Signup(driver)
            elif page == 'sidemenu':
                self.sidemenu = Sidemenu(driver)
            elif page == 'digitalcard':
                self.digitalcard = Digitalcard(driver)
            elif page == 'appointments':
                self.appointments = Appointments(driver)
            elif page == 'join_employer_plan':
                self.join_employer_plan = JoinEmployerPlan(driver)
            else:
                raise ValueError(f'Page "{page}" not found. Please verify the page name')
