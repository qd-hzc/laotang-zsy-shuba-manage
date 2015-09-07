

CREATE TABLE `dic_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8_bin NOT NULL,
  `img_path` varchar(200) COLLATE utf8_bin NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '０：无效，１：有效',
  `cdate` datetime DEFAULT NULL COMMENT '图片地址',
  `udate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE `dic_pdf` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) COLLATE utf8_bin NOT NULL COMMENT '书名',
  `desc` varchar(100) COLLATE utf8_bin NOT NULL COMMENT '简介',
  `img_path` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `pdf_path` varchar(200) COLLATE utf8_bin NOT NULL COMMENT 'pdf存储路径',
  `html_dist` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT 'ｈｔｍｌ生成目录',
  `html_name` varchar(60) COLLATE utf8_bin DEFAULT NULL COMMENT '生成的ｈｔｍｌ文件名称',
  `json` text COLLATE utf8_bin,
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '０：无效，１：有效',
  `cdate` datetime DEFAULT NULL,
  `udate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `dic_category_id` int(11) NOT NULL COMMENT '文件ｌｉｓｔ',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `fk_dic_book_dic_category_idx` (`dic_category_id`),
  CONSTRAINT `fk_dic_book_dic_category` FOREIGN KEY (`dic_category_id`) REFERENCES `dic_category` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE `sys_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(10) COLLATE utf8_bin NOT NULL,
  `password` varchar(10) COLLATE utf8_bin NOT NULL,
  `company` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `department` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `name` varchar(25) COLLATE utf8_bin DEFAULT NULL,
  `phone` varchar(15) COLLATE utf8_bin NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0：失效，１：注册中，２：审批拒绝，３：有效',
  `cdate` datetime DEFAULT NULL,
  `udate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
