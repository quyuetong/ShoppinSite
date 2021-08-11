CREATE TABLE  `User`(
 `userID` int(16) unsigned NOT NULL AUTO_INCREMENT,
 `userName` varchar(50) NOT NULL,
 `password` varchar(50) NOT NULL,
 `firstName` varchar(50) NOT NULL,
 `lastName` varchar(50) NOT NULL,
 PRIMARY KEY (`userName`),
 UNIQUE (`userID`));


CREATE TABLE `AdminUser`(
`userID` int(16) unsigned NOT NULL,
`position` varchar(50) NOT NULL,
PRIMARY KEY(`userID`),
FOREIGN KEY(`userID`) REFERENCES `User`(`userID`));


CREATE TABLE `Category`(
`categoryName` varchar(50) NOT NULL,
PRIMARY KEY(`categoryName`));


CREATE TABLE `Item`(
`itemID` int(16) unsigned NOT NULL AUTO_INCREMENT,
`condition` TINYINT(1) NOT NULL,
`description` varchar(250) NOT NULL,
`item_name` varchar(50) NOT NULL,
`returnable` boolean NOT NULL,
`end_time` datetime NOT NULL,
`get_it_now_price` decimal(10,2) NULL,
`min_price` decimal(10,2) NOT NULL,
`start_price` decimal(10,2) NOT NULL,
`category` varchar(50) NOT NULL,
`owner_userID` int(16) unsigned NOT NULL,
PRIMARY KEY(`itemID`),
FOREIGN KEY(`category`) REFERENCES `Category`(`categoryName`),
FOREIGN KEY(`owner_userID`) REFERENCES `User`(`userID`),
CHECK (`min_price` >= `start_price`),
CHECK (`get_it_now_price` >= `min_price`),
CHECK (`condition` >= 1 AND `condition` <= 5));


CREATE TABLE `SoldItem`(
`itemID` int(16) unsigned NOT NULL,
`sold_price` decimal(10,2) NULL,
`sold_time` datetime NOT NULL,
`winner` varchar(50) NULL,
PRIMARY KEY(`itemID`),
FOREIGN KEY(`itemID`) REFERENCES `Item`(`itemID`),
FOREIGN KEY(`winner`)REFERENCES `User` (`userName`));


CREATE TABLE `Bid`(
`userID` int(16) unsigned NOT NULL,
`itemID` int(16) unsigned NOT NULL,
`bid_time` datetime NOT NULL,
`bid_price` decimal(10,2) NOT NULL,
PRIMARY KEY( `itemID`, `userID`, `bid_time`),
FOREIGN KEY( `userID`) REFERENCES `User`(`userID`),
FOREIGN KEY(`itemID`) REFERENCES `Item`(`itemID`));


CREATE TABLE `Rating`(
`itemID` int(16) unsigned NOT NULL,
`userID` int(16) unsigned NOT NULL,
`item_rating` int(16) unsigned NOT NULL,
`comment` varchar(250) NULL,
`rateTime` datetime NOT NULL,
PRIMARY KEY(`itemID`, `userID`),
FOREIGN KEY(`itemID`) REFERENCES `Item`(`itemID`),
FOREIGN KEY(`userID`) REFERENCES `User`(`userID`));
