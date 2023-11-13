source ../.env

#create service principal for terraform
az ad sp create-for-rbac --name myApp --role Contributor --scopes /subscriptions/$SUBSCRIPTION_ID --json-auth
