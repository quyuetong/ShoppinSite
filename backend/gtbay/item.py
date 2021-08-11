from gtbay.mysql_connector.connector import MySQLConnector
from gtbay.etc.harness import base_response
import time


class Item(object):
    def __init__(self):
        self.cnx = MySQLConnector()

    def search(self, keyword=None, category=None, minPrice=0, maxPrice=99999999, condition=None):
        query = "SELECT `Item`.`itemID` , `Item`.`item_name` , `Bid`.`bid_price` , `Item`.`start_price` , `User`.`userName` , `Item`.`get_it_now_price` , `Item`.`end_time` " \
                "FROM `Item` LEFT JOIN (`Bid` INNER JOIN (SELECT `itemID`, MAX(`bid_price`) AS `high_bid` FROM `Bid` GROUP BY `itemID`) AS `b2` ON `Bid`.`itemID`=`b2`.`itemID` AND `Bid`.`bid_price`=`b2`.`high_bid`) ON `Item`.`itemID`=`Bid`.`itemID` LEFT JOIN `User` ON `Bid`.`userID`=`User`.`userID` " \
                "WHERE `Item`.`itemID` NOT IN (SELECT `itemID` FROM `SoldItem`) " \
                "AND ((ISNULL(`Bid`.`bid_price`) AND `Item`.`start_price`>{} AND `Item`.`start_price`<{}) OR (`Bid`.`bid_price`>{} AND `Bid`.`bid_price`<{}))".format(minPrice, maxPrice, minPrice, maxPrice)
        if condition:
            query += " AND `Item`.`condition`>={}".format(condition)
        if category:
            query += " AND `Item`.`category`=\"{}\"".format(category)
        if keyword:
            query += " AND (`Item`.`item_name` LIKE \"%{}%\" OR `Item`.`description` LIKE \"%{}%\")".format(keyword, keyword)
        query += " ORDER BY `Item`.`end_time`"
        res = self.cnx.get_data(query)

        for item in res:
            if item['bid_price']:
                item['bid_price'] = float(item['bid_price'])

            if item['get_it_now_price']:
                item['get_it_now_price'] = float(item['get_it_now_price'])

            if item['start_price']:
                item['start_price'] = float(item['start_price'])

            item['end_time'] = item['end_time'].strftime('%m/%d/%Y %H:%M:%S')

        return res

    def get_category(self):
        query = "SELECT `categoryName` FROM `Category`"
        return [item['categoryName'] for item in self.cnx.get_data(query)]

    def list_item(self, name, description, condition, category, ownerUserID, startPrice, minPrice, endDays, getNowPrice="null", returnable='off'):
        end_time = time.time() + int(endDays) * 24 * 3600
        end_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(end_time))
        returnable = 1 if returnable == 'on' else 0
        if float(minPrice) < float(startPrice):
            message = "Minimum price cannot less than start price!"
            return base_response(False, message)
        if getNowPrice != "null" and float(getNowPrice) < float(startPrice):
            message = "Get it now price cannot less than start price!"
            return base_response(False, message)
        query = "INSERT INTO Item(`condition`, `description`, `item_name`, `returnable`, `end_time`, `get_it_now_price`, `min_price`, `start_price`, `category`, `owner_userID`) " \
                "VALUES({}, \"{}\", \"{}\", {}, \"{}\", {}, {}, {}, \"{}\", {})".format(condition, description, name, returnable, end_time, getNowPrice, minPrice, startPrice, category, ownerUserID)
        self.cnx.cursor.execute(query)
        self.cnx.connector.commit()
        message = 'List Item successful.'
        return base_response(True, message)

    def get_item(self, itemID):
        condition_d = {1: "Pool", 2: "Fair", 3: "Good", 4: "Very Good", 5: "New"}
        query = "SELECT `category`, `condition`, `owner_userID`, `returnable`, `start_price`, `description` FROM `Item` WHERE `itemID`={}".format(itemID)
        item_res = self.cnx.get_data(query)
        query = "SELECT `bid_price`, `bid_time`, `userName` FROM `Bid` INNER JOIN `User` ON `Bid`.`userID`=`User`.`userID` WHERE `itemID`={} ORDER BY `bid_time` DESC limit 4".format(itemID)
        bid_res = self.cnx.get_data(query)

        # Reformat data for frontend
        item_res[0]["condition"] = condition_d[item_res[0]["condition"]]
        item_res[0]['returnable'] = "Yes" if item_res[0]['returnable'] else "No"
        item_res[0]['start_price'] = float(item_res[0]['start_price'])

        for item in bid_res:
            item["bid_price"] = float(item['bid_price'])
            item["bid_time"] = item['bid_time'].strftime('%m/%d/%Y %H:%M:%S')

        return {"item": item_res[0], "bid": bid_res}

    def bid_item(self, itemID, userID, bidPrice, getNow, userName):
        query = "SELECT `item_name` FROM `Item` WHERE `end_time` > NOW() AND ItemID={}".format(itemID)
        if len(self.cnx.get_data(query)) < 1:
            message = "Fail to bid item, this item just reached its auction end time."
            return base_response(True, message)

        query = "SELECT `itemID` FROM `SoldItem` WHERE `itemID`={}".format(itemID)
        if len(self.cnx.get_data(query)) > 0:
            message = "Fail to bid item, this item just been sold."
            return base_response(True, message)

        query = "INSERT INTO `Bid` VALUES ({}, {}, NOW(), {})".format(userID, itemID, bidPrice)
        self.cnx.cursor.execute(query)
        if getNow:
            query = "INSERT INTO `SoldItem` VALUES ({}, {}, NOW(), \"{}\")".format(itemID, bidPrice, userName)
            self.cnx.cursor.execute(query)
        self.cnx.connector.commit()
        if getNow:
            message = "Congratulations! You have got itemID {} at $ {}".format(itemID, bidPrice)
        else:
            message = "Your bid on itemID {} of $ {} has been placed".format(itemID, bidPrice)
        return base_response(True, message)

    def change_description(self, itemID, description):
        query = "UPDATE `Item` SET `description`=\"{}\" WHERE itemID={}".format(description, itemID)
        self.cnx.cursor.execute(query)
        self.cnx.connector.commit()
        return base_response(True)

    def auction_result(self):
        query = "INSERT INTO `SoldItem` " \
                "SELECT `Item`.`itemID`, `BidInfo`.`bid_price`, `Item`.`end_time`, `User`.`userName` " \
                "FROM `Item` LEFT JOIN (SELECT `Bid`.`bid_price`, `Bid`.`itemID`, `Bid`.`userID` FROM `Bid` INNER JOIN (SELECT `itemID`, MAX(`bid_price`) AS `high_bid` FROM `Bid` GROUP BY `itemID`) AS `b2` ON `Bid`.`itemID`=`b2`.`itemID` AND `Bid`.`bid_price`=`b2`.`high_bid` INNER JOIN Item AS i2 ON Bid.itemID=i2.itemID WHERE Bid.bid_price>=i2.min_price) AS `BidInfo` ON `Item`.`itemID`=`BidInfo`.`itemID` LEFT JOIN `User` ON `BidInfo`.`userID`=`User`.`userID` WHERE `Item`.`end_time` < NOW() AND `Item`.`itemID` NOT IN (SELECT `SoldItem`.`itemID` FROM `SoldItem`)"
        self.cnx.cursor.execute(query)
        self.cnx.connector.commit()

        query = "SELECT `SoldItem`.`itemID`, `Item`.`item_name`, `SoldItem`.`sold_price`, `SoldItem`.`winner`, `SoldItem`.`sold_time` " \
                "FROM `SoldItem` INNER JOIN `Item` ON `SoldItem`.`itemID`=`Item`.`itemID` ORDER BY `SoldItem`.`sold_time` DESC"
        res = self.cnx.get_data(query)
        for item in res:
            item["sold_price"] = float(item['sold_price'])
            item["sold_time"] = item['sold_time'].strftime('%m/%d/%Y %H:%M:%S')
        return res

    def category_report(self):
        # query = "SELECT `category`, COUNT(`ItemID`) AS total, MIN(`get_it_now_price`) AS minimum, MAX(`get_it_now_price`) AS maximum, AVG(`get_it_now_price`) AS average FROM `Item` GROUP BY `category` ORDER BY `category`"
        query = "SELECT `categoryName`, COUNT(`ItemID`) AS total, MIN(`get_it_now_price`) AS minimum, MAX(`get_it_now_price`) AS maximum, AVG(`get_it_now_price`) AS average FROM `Category` LEFT JOIN `Item` ON `Category`.`categoryName` = `Item`.`category` GROUP BY `categoryName` ORDER BY `categoryName`"
        res = self.cnx.get_data(query)
        for item in res:
            if item['minimum']:
                item['minimum'] = float(round(item['minimum'], 2))
            if item['maximum']:
                item['maximum'] = float(round(item['maximum'], 2))
            if item['average']:
                item['average'] = float(round(item['average'], 2))
        return res
