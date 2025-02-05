# verify-mongodb-connectivity
This repo provides a typescript based solution to test the connectivity to a MongoDB, where database password is saved in Azure Key Vault

## Pre-requisites
- NodeJS
- Azure account with Key Vault access (Get, List access policies for secrets)

## How to Set up
1. Create .env file by referring to the app settings in .env.sample file

## How to Run
```
az login
az account set --subscription <subscription-id> (subscription-id for your azure subscription)
npm install
npx ts-node index.ts
```
