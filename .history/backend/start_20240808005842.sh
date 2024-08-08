#!/bin/bash

# 启动 Cloud SQL Proxy
./cloud_sql_proxy -dir=/cloudsql -instances=$GSP_INSTANCES -credential_file=/app/credentials.json &

# 等待代理启动
sleep 5

# 启动应用程序
gunicorn api:app