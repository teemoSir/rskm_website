
[databases]
postgres = host=127.0.0.1 port=1717 dbname=postgres

listen_addr = *
listen_port = 6432

logfile = /var/log/postgresql/pgbouncer.log
pidfile = /var/run/postgresql/pgbouncer.pid

admin_users = postgres
stats_users = postgres

pool_mode = session
server_reset_query = DISCARD ALL
ignore_startup_parameters = extra_float_digits

unix_socket_dir = /var/run/postgresql


auth_type = scram-sha-256
auth_file = /etc/pgbouncer/userlist.txt

max_client_conn = 100
server_check_query = select 1
server_check_delay = 30
max_client_conn = 1000
default_pool_size = 36
reserve_pool_size = 5
dns_max_ttl = 15

