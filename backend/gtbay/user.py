from mysql.connector.errors import IntegrityError
from gtbay.mysql_connector.connector import MySQLConnector
from gtbay.etc.harness import base_response


class User(object):
    def __init__(self):
        self.cnx = MySQLConnector()

    def login(self, username, password):
        query = "SELECT `User`.`userID`, `lastName`, `firstName`, `userName`, `password`, `position` " \
                "FROM `User` LEFT JOIN `AdminUser` ON `User`.`userID`=`AdminUser`.`userID` WHERE `userName`=\"{}\"".format(username)
        res = self.cnx.get_data(query)
        if res and res[0]['password'] == password:
            message = 'Login success.'
            # Remove password from response since we don't need that in frontend.
            res[0].pop('password')
            if res[0]['position']:
                res[0]['isAdmin'] = True
            else:
                res[0]['isAdmin'] = False
            return base_response(True, message, res[0])
        else:
            message = 'The combination of username and password are not match any record.'
            return base_response(False, message)

    def register(self, username, password, firstname, lastname):
        try:
            query = "INSERT INTO `User` (`userName`, `password`, `firstName`, `lastName`)" \
                    " VALUES (\"{}\", \"{}\", \"{}\", \"{}\")".format(username, password, firstname, lastname)
            self.cnx.cursor.execute(query)
        except IntegrityError as err:
            message = 'Username has already been registered.'
            return base_response(False, message)
        self.cnx.connector.commit()
        message = 'Register successful.'
        return base_response(True, message)

    def user_report(self):
        # Get listed item for each user
        query = "SELECT `userName`, COUNT(`owner_userID`) AS listed FROM `User` LEFT JOIN `Item` ON `User`.`userID` = `Item`.`owner_userID` GROUP BY `userName`"
        res = self.cnx.get_data(query)
        data = {}
        for item in res:
            data[item["userName"]] = item

        # Get sold item for each user
        query = "SELECT `userName`, COUNT(`owner_userID`) AS sold FROM `User` LEFT JOIN (SELECT * FROM `Item` WHERE `itemID` IN (SELECT `itemID` FROM `SoldItem`)) AS Sold ON `User`.`userID` = Sold.`owner_userID` GROUP BY `userName`"
        res = self.cnx.get_data(query)
        for item in res:
            data[item["userName"]]['sold'] = item['sold']

        # Get bought item for each user
        query = "SELECT `userName`, COUNT(`winner`) AS purchased FROM `User` LEFT JOIN `SoldItem` ON `User`.`userName` = `SoldItem`.`winner` GROUP BY `userName`"
        res = self.cnx.get_data(query)
        for item in res:
            data[item["userName"]]['purchased'] = item['purchased']

        # Get rating rated by each user.
        query = "SELECT `userName`, COUNT(`Rating`.`userID`) AS rated FROM `User` LEFT JOIN `Rating` ON `User`.`userID` = `Rating`.`userID` GROUP BY `userName`"
        res = self.cnx.get_data(query)
        for item in res:
            data[item["userName"]]['rated'] = item['rated']

        return list(data.values())