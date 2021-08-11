from gtbay.mysql_connector.connector import MySQLConnector
from gtbay.etc.harness import base_response


class Rating(object):
    def __init__(self):
        self.cnx = MySQLConnector()

    def get_average(self, itemID):
        query = "SELECT AVG(`item_rating`) FROM `Rating` WHERE `itemID`={}".format(itemID)
        res = self.cnx.get_data(query)
        return res[0]['AVG(`item_rating`)']

    def get_ratings(self, itemID, userID):
        query = "SELECT `Rating`.`userID`, `userName`, `item_rating`, `comment`, `rateTime`, (`Rating`.`userID`={}) AS isOwner " \
                "FROM `Rating` INNER JOIN `User` ON `Rating`.`userID`=`User`.`userID` " \
                "WHERE `itemID`={} ORDER BY `rateTime` DESC".format(userID, itemID)
        res = self.cnx.get_data(query)
        avg = self.get_average(itemID)
        if avg:
            avg = float(round(avg, 1))
        isOwner = False
        for item in res:
            if item["isOwner"]:
                isOwner = True
            item["rateTime"] = item["rateTime"].strftime('%m/%d/%Y %H:%M')

        return {"avg": avg, "ratings": res, "isOwner": isOwner}

    def rate_item(self, userID, itemID, rating, comment=""):
        query = "INSERT INTO `Rating` VALUES ({}, {}, {}, \"{}\", NOW())".format(itemID, userID, rating, comment)
        self.cnx.cursor.execute(query)
        self.cnx.connector.commit()
        return base_response(True)

    def delete_rating(self, userID, itemID):
        query = "DELETE FROM `Rating` WHERE `itemID`={} AND `userID`={}".format(itemID, userID)
        self.cnx.cursor.execute(query)
        self.cnx.connector.commit()
        avg = self.get_average(itemID)
        return base_response(True)
