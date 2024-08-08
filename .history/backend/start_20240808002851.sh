
复制代码
#!/bin/bash

# Start the Cloud SQL Proxy
.cloud_sql_proxy -dir=/cloudsql -instances=$GSP_INSTANCES -credential_file=app.json &

# Wait for the proxy to start
sleep 5

# Start your application
gunicorn api:app