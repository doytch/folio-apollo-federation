echo "Creating Tenant..."

curl -X POST -w '\n' -H 'Content-type: application/json' -d @okapi-tenant.json http://localhost:9130/_/proxy/tenants

echo "Removing, adding and enabling mod-apollo-federation-gateway..."

curl -X DELETE http://localhost:9130/_/proxy/tenants/diku/modules/mod-apollo-federation-gateway-1.0.0
curl -X DELETE http://localhost:9130/_/discovery/modules/mod-apollo-federation-gateway-1.0.0/a
curl -X DELETE http://localhost:9130/_/proxy/modules/mod-apollo-federation-gateway-1.0.0

curl -X POST -w '\n' -H 'Content-type: application/json' -d @mod-apollo-federation-gateway/ModuleDescriptor.json  http://localhost:9130/_/proxy/modules
curl -X POST -w '\n' -H 'Content-type: application/json' -d @mod-apollo-federation-gateway/DeploymentDescriptor.json http://localhost:9130/_/discovery/modules
curl -X POST -w '\n' -H 'Content-type: application/json' -d '{"id": "mod-apollo-federation-gateway-1.0.0"}' http://localhost:9130/_/proxy/tenants/diku/modules
