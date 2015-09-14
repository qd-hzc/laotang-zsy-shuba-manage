
运行步骤:

1:安装mysql数据库

2:配置如下环境变量:

    MYSQL_CONNECTION_LIMIT(连接池大小)
    
    MYSQL_IPMYSQL_USERNAME
    
    MYSQL_PASSWORDMYSQL_SCHEMA(库名)
    
    ZSYSB_PORT(web应用端口)
    
3:在服务器安装配置pdf2htmlEX,具体安装过程请百度

4:服务安装 npm  install  zsysb  -g 

5:直接运行如下命令启动 nohup zsysb & 

6:浏览器地址栏输入 http://server ip:ZSYSB_PORT",
