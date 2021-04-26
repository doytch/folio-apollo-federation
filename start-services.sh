echo "Creating Tenant..."

curl -w '\n' -X POST -D - -H 'Content-type: application/json' -d @okapi-tenant.json http://localhost:9130/_/proxy/tenants

echo "Adding and enabling mod-users-graphql..."

curl -w '\n' -X POST -D - -H 'Content-type: application/json' -d @mod-users/ModuleDescriptor-graphql.json  http://localhost:9130/_/proxy/modules

curl -w '\n' -D - -s -X POST -H 'Content-type: application/json' -d @mod-users/DeploymentDescriptor-graphql.json http://localhost:9130/_/discovery/modules

curl -w '\n' -X DELETE -D - http://localhost:9130/_/proxy/tenants/diku/modules/mod-users-graphql-1.0.0
curl -w '\n' -X POST -D - -H 'Content-type: application/json' -d '{"id": "mod-users-graphql-1.0.0"}' http://localhost:9130/_/proxy/tenants/diku/modules

echo "Adding and enabling mod-permissions-graphql..."

curl -w '\n' -X POST -D - -H 'Content-type: application/json' -d @mod-permissions/ModuleDescriptor-graphql.json  http://localhost:9130/_/proxy/modules

curl -w '\n' -D - -s -X POST -H 'Content-type: application/json' -d @mod-permissions/DeploymentDescriptor-graphql.json http://localhost:9130/_/discovery/modules

curl -w '\n' -X DELETE -D - http://localhost:9130/_/proxy/tenants/diku/modules/mod-permissions-graphql-1.0.0
curl -w '\n' -X POST -D - -H 'Content-type: application/json' -d '{"id": "mod-permissions-graphql-1.0.0"}' http://localhost:9130/_/proxy/tenants/diku/modules