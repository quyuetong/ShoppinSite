import logging
import mysql.connector
from mysql.connector import errorcode
logger = logging.getLogger(__name__)


# A harness interface to utilize mysql database.
class MySQLConnector(object):
    # You'll need to change database property to your test db.
    def __init__(self, user='gtbay', password='123456',
                 host='ec2-54-202-214-249.us-west-2.compute.amazonaws.com', database='gtbay_final', cursor_buffer=True):
        self._user = user
        self._password = password
        self._host = host
        self._database = database
        self._connector = None
        self._cursor = None
        self.setup(cursor_buffer)

    def setup(self, buffer):
        try:
            self._connector = mysql.connector.connect(user=self._user,
                                                      password=self._password,
                                                      host=self._host,
                                                      database=self._database)
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
                logger.error("Something is wrong with your user name or password")
            elif err.errno == errorcode.ER_BAD_DB_ERROR:
                logger.error("Database does not exist")
            else:
                logger.error(str(err))

        if self._connector:
            self._cursor = self._connector.cursor(buffered=buffer)

    def teardown(self):
        try:
            self._cursor.close()
        except Exception as error:
            logger.error('Fail to close cursor due to %s' % str(error))

        if self._connector:
            self._connector.close()

    def __enter__(self):
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.teardown()

    @property
    def connector(self):
        return self._connector

    @property
    def cursor(self):
        return self._cursor

    @property
    def user(self):
        return self._user

    @user.setter
    def user(self, val):
        self._user = val

    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, val):
        self._password = val

    @property
    def host(self):
        return self._host

    @host.setter
    def host(self, val):
        self._host = val

    @property
    def database(self):
        return self._database

    @database.setter
    def database(self, val):
        self._database = val

    def get_data(self, query):
        self.cursor.execute(query)
        column_names = self.cursor.column_names
        data = self.cursor.fetchall()
        result = []
        for record in data:
            item_d = {}
            for i in range(len(column_names)):
                item_d[column_names[i]] = record[i]
            result.append(item_d)
        return result
