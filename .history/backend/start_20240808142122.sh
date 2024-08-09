#!/bin/sh
./cloud_sql_proxy -dir=/cloudsql -instances=$GSP_INSTANCES -credential_file=credentials.json &
exec gunicorn api:app