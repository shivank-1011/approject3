-- MySQL dump 10.13  Distrib 9.4.0, for macos15 (arm64)
--
-- Host: localhost    Database: expsplitter
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('0bd82e1c-700e-40b2-ba6f-fb1fc407df20','ca7186640c0704d9a40b21edd9935929940f1b0177f813c948b96a72d1c9ba5e','2025-11-05 14:47:32.805','20251104184321_add_settlement_model',NULL,NULL,'2025-11-05 14:47:32.800',1),('1cbe288c-52c6-4cff-a8fc-b1be733be50e','32aeba5e1f59db4317d455b62fbb0b79b50087dba4b8ee3796d292cb3b5495f8','2025-11-05 14:47:32.800','20251103180354_add_join_code',NULL,NULL,'2025-11-05 14:47:32.792',1),('231f88a4-142c-41ef-b5ea-4db5098beb42','69b22ff423e2ea0f2d7891944a18adceb342ec0326c5d08b4d3e5c134d34abe2','2025-11-05 14:47:49.296','20251105144749_update_settlement_with_user_relations',NULL,NULL,'2025-11-05 14:47:49.281',1),('2626ac69-36c0-4cf6-bbc0-06ec5048f81e','283f518b58a696b65727998614be0c8cb7680c3405bd7446b52e962930a54f9e','2025-11-05 14:47:32.750','20251031134125_init',NULL,NULL,'2025-11-05 14:47:32.747',1),('9954e744-3c12-4256-b7ce-6f0718e77f1b','a369c23ae0d2f44d2ec60635092e8c68ae812fa62fe41693d9c97de225287e07','2025-11-05 14:47:32.791','20251103162711_add_expense_models',NULL,NULL,'2025-11-05 14:47:32.768',1),('a85a441f-fc02-4faa-8eaa-a797b583c872','f0054f65dbb5fd641a5a9e3c1b48c5bcf3df65c8cacbab91ee1000e629b7c978','2025-11-05 14:47:32.830','20251104191511_add_cascade_delete_for_groups',NULL,NULL,'2025-11-05 14:47:32.806',1),('a9fd3fa3-0637-4521-8220-55c49dbe3322','7a14fb1963b9eb1345a726552104dbdf4daa2468f999f6b082378653da8d405f','2025-11-05 14:57:08.137','20251105145708_add_settlement_user_relations',NULL,NULL,'2025-11-05 14:57:08.118',1),('d347fc44-4819-4740-be01-f75f14dc54a3','88c568e04543ce0f49b1171736af54b008514a45d89c51d6b14ececfa7339db9','2025-11-05 14:47:32.768','20251101160711_add_group_models',NULL,NULL,'2025-11-05 14:47:32.752',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Expense`
--

DROP TABLE IF EXISTS `Expense`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Expense` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `paidBy` int NOT NULL,
  `groupId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Expense_paidBy_fkey` (`paidBy`),
  KEY `Expense_groupId_fkey` (`groupId`),
  CONSTRAINT `Expense_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Expense_paidBy_fkey` FOREIGN KEY (`paidBy`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Expense`
--

LOCK TABLES `Expense` WRITE;
/*!40000 ALTER TABLE `Expense` DISABLE KEYS */;
INSERT INTO `Expense` VALUES (1,'Team Dinner',120,1,1,'2025-11-05 15:07:43.769'),(2,'Groceries',85.5,1,1,'2025-11-05 15:07:43.783'),(3,'Movie Tickets',45,1,1,'2025-11-05 15:07:43.792'),(4,'Team Dinner',120,1,1,'2025-11-05 15:08:09.567'),(5,'Groceries',85.5,1,1,'2025-11-05 15:08:09.578'),(6,'Movie Tickets',45,1,1,'2025-11-05 15:08:09.587'),(7,'biryani',300,2,2,'2025-11-05 18:28:39.180'),(8,'juice',60,1,2,'2025-11-05 18:28:58.777'),(9,'sabji',500,1,2,'2025-11-05 18:30:01.801'),(10,'biryani2',500,2,2,'2025-11-05 18:30:45.926'),(11,'delhi',500,2,2,'2025-11-06 10:30:10.957');
/*!40000 ALTER TABLE `Expense` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ExpenseSplit`
--

DROP TABLE IF EXISTS `ExpenseSplit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ExpenseSplit` (
  `id` int NOT NULL AUTO_INCREMENT,
  `expenseId` int NOT NULL,
  `userId` int NOT NULL,
  `amount` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ExpenseSplit_expenseId_fkey` (`expenseId`),
  KEY `ExpenseSplit_userId_fkey` (`userId`),
  CONSTRAINT `ExpenseSplit_expenseId_fkey` FOREIGN KEY (`expenseId`) REFERENCES `Expense` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ExpenseSplit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ExpenseSplit`
--

LOCK TABLES `ExpenseSplit` WRITE;
/*!40000 ALTER TABLE `ExpenseSplit` DISABLE KEYS */;
INSERT INTO `ExpenseSplit` VALUES (1,1,1,120),(2,2,1,85.5),(3,3,1,45),(4,4,1,120),(5,5,1,85.5),(6,6,1,45),(7,7,2,150),(8,7,1,150),(9,8,2,30),(10,8,1,30),(11,9,2,250),(12,9,1,250),(13,10,2,250),(14,10,1,250),(15,11,2,250),(16,11,1,250);
/*!40000 ALTER TABLE `ExpenseSplit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Group`
--

DROP TABLE IF EXISTS `Group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdBy` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `joinCode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Group_joinCode_key` (`joinCode`),
  KEY `Group_createdBy_fkey` (`createdBy`),
  CONSTRAINT `Group_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Group`
--

LOCK TABLES `Group` WRITE;
/*!40000 ALTER TABLE `Group` DISABLE KEYS */;
INSERT INTO `Group` VALUES (1,'Test Analytics Group',1,'2025-11-05 15:06:42.252','A2XITSQ6'),(2,'mango tree',2,'2025-11-05 18:27:53.390','EJB88CGU'),(6,'omh',2,'2025-11-06 10:29:05.720','89XU6WO4'),(7,'hello',2,'2025-11-06 10:29:13.932','LERA6ZK6'),(8,'pune',2,'2025-11-06 10:29:19.015','3S15UG0U');
/*!40000 ALTER TABLE `Group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GroupMember`
--

DROP TABLE IF EXISTS `GroupMember`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GroupMember` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `groupId` int NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'member',
  PRIMARY KEY (`id`),
  KEY `GroupMember_userId_fkey` (`userId`),
  KEY `GroupMember_groupId_fkey` (`groupId`),
  CONSTRAINT `GroupMember_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `GroupMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GroupMember`
--

LOCK TABLES `GroupMember` WRITE;
/*!40000 ALTER TABLE `GroupMember` DISABLE KEYS */;
INSERT INTO `GroupMember` VALUES (1,1,1,'admin'),(2,2,2,'admin'),(3,1,2,'member'),(7,2,6,'admin'),(8,2,7,'admin'),(9,2,8,'admin');
/*!40000 ALTER TABLE `GroupMember` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Settlement`
--

DROP TABLE IF EXISTS `Settlement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Settlement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `groupId` int NOT NULL,
  `amount` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `paidBy` int NOT NULL,
  `paidTo` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Settlement_groupId_fkey` (`groupId`),
  KEY `Settlement_paidBy_fkey` (`paidBy`),
  KEY `Settlement_paidTo_fkey` (`paidTo`),
  CONSTRAINT `Settlement_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Settlement_paidBy_fkey` FOREIGN KEY (`paidBy`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Settlement_paidTo_fkey` FOREIGN KEY (`paidTo`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Settlement`
--

LOCK TABLES `Settlement` WRITE;
/*!40000 ALTER TABLE `Settlement` DISABLE KEYS */;
INSERT INTO `Settlement` VALUES (1,2,130,'2025-11-05 18:30:14.306',2,1);
/*!40000 ALTER TABLE `Settlement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'Test User','test@example.com','$2b$10$4LDjuBc9ls.EJabB8ptQjeVaYlCAROy3/Nvf.nlLcHRA9YfeoEG/S','2025-11-05 15:06:42.215'),(2,'siddu','siddu@gmail.com','$2b$10$UMQNDz6iKO2L0vUh/S.udusb/HGd3ZGUW4ud/t1n6o51bxyMlE282','2025-11-05 18:27:22.597');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-10 23:25:48
