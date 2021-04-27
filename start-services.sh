echo "Creating Tenant..."

curl -X POST -w '\n' -H 'Content-type: application/json' -d @okapi-tenant.json http://localhost:9130/_/proxy/tenants

echo "Removing, adding and enabling mod-users-graphql..."
curl -X DELETE http://localhost:9130/_/proxy/tenants/diku/modules/mod-users-graphql-1.0.0
curl -X DELETE http://localhost:9130/_/discovery/modules/mod-users-graphql-1.0.0/c
curl -X DELETE http://localhost:9130/_/proxy/modules/mod-users-graphql-1.0.0

curl -X POST -w '\n' -H 'Content-type: application/json' -d @mod-users/ModuleDescriptor-graphql.json  http://localhost:9130/_/proxy/modules
curl -X POST -w '\n' -H 'Content-type: application/json' -d @mod-users/DeploymentDescriptor-graphql.json http://localhost:9130/_/discovery/modules
curl -X POST -w '\n' -H 'Content-type: application/json' -d '{"id": "mod-users-graphql-1.0.0"}' http://localhost:9130/_/proxy/tenants/diku/modules

echo "Removing, adding and enabling mod-permissions-graphql..."

curl -X DELETE http://localhost:9130/_/proxy/tenants/diku/modules/mod-permissions-graphql-1.0.0
curl -X DELETE http://localhost:9130/_/discovery/modules/mod-permissions-graphql-1.0.0/b
curl -X DELETE http://localhost:9130/_/proxy/modules/mod-permissions-graphql-1.0.0

curl -X POST -w '\n' -H 'Content-type: application/json' -d @mod-permissions/ModuleDescriptor-graphql.json  http://localhost:9130/_/proxy/modules
curl -X POST -w '\n' -H 'Content-type: application/json' -d @mod-permissions/DeploymentDescriptor-graphql.json http://localhost:9130/_/discovery/modules
curl -X POST -w '\n' -H 'Content-type: application/json' -d '{"id": "mod-permissions-graphql-1.0.0"}' http://localhost:9130/_/proxy/tenants/diku/modules