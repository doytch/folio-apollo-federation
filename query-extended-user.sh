echo "Fetching a list of users where the user object is extended with their permissions (fetched via mod-permissions)..."

curl --location --request POST 'http://localhost:9130/graphql' \
--header 'x-okapi-tenant: diku' \
--header 'Content-Type: application/json' \
--data-raw '{"query":"{\n    users(limit: 10) {\n        username\n        permissions\n    }\n}","variables":{}}'