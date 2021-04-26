echo "Creating Tenant..."

curl -w '\n' -X POST -D - -H 'Content-type: application/json' -d @okapi-tenant.json http://localhost:9130/_/proxy/tenants

echo "Adding and enabling mod-apollo-federation-gateway..."

curl -w '\n' -X POST -D - -H 'Content-type: application/json' -d @mod-apollo-federation-gateway/ModuleDescriptor.json  http://localhost:9130/_/proxy/modules

curl -w '\n' -D - -s -X POST -H 'Content-type: application/json' -d @mod-apollo-federation-gateway/DeploymentDescriptor.json http://localhost:9130/_/discovery/modules

curl -w '\n' -X POST -D - -H 'Content-type: application/json' -d '{"id": "mod-apollo-federation-gateway-1.0.0"}' http://localhost:9130/_/proxy/tenants/diku/modules
