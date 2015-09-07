SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `zsy_sb` ;
CREATE SCHEMA IF NOT EXISTS `zsy_sb` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin ;
USE `zsy_sb` ;

-- -----------------------------------------------------
-- Table `zsy_sb`.`sys_user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `zsy_sb`.`sys_user` ;

CREATE TABLE IF NOT EXISTS `zsy_sb`.`sys_user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(10) NOT NULL,
  `password` VARCHAR(10) NOT NULL,
  `company` VARCHAR(45) NULL,
  `department` VARCHAR(45) NULL,
  `name` VARCHAR(25) NULL,
  `phone` VARCHAR(15) NOT NULL,
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '0：失效，１：注册中，２：审批拒绝，３：有效',
  `cdate` DATETIME NULL,
  `udate` TIMESTAMP NULL DEFAULT NOW(),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `zsy_sb`.`dic_category`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `zsy_sb`.`dic_category` ;

CREATE TABLE IF NOT EXISTS `zsy_sb`.`dic_category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `img_path` VARCHAR(200) NOT NULL,
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '０：无效，１：有效',
  `cdate` DATETIME NULL COMMENT '图片地址',
  `udate` TIMESTAMP NULL DEFAULT NOW(),
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `zsy_sb`.`dic_book`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `zsy_sb`.`dic_book` ;

CREATE TABLE IF NOT EXISTS `zsy_sb`.`dic_book` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(60) NOT NULL COMMENT '书名',
  `img_path` VARCHAR(200) NULL,
  `pdf_path` VARCHAR(200) NOT NULL COMMENT 'pdf存储路径',
  `html_dist` VARCHAR(200) NULL COMMENT 'ｈｔｍｌ生成目录',
  `html_name` VARCHAR(60) NULL COMMENT '生成的ｈｔｍｌ文件名称',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '０：无效，１：有效',
  `cdate` DATETIME NULL,
  `udate` TIMESTAMP NULL DEFAULT NOW(),
  `dic_category_id` INT NOT NULL COMMENT '封面图片地址',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC),
  INDEX `fk_dic_book_dic_category_idx` (`dic_category_id` ASC),
  CONSTRAINT `fk_dic_book_dic_category`
    FOREIGN KEY (`dic_category_id`)
    REFERENCES `zsy_sb`.`dic_category` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
