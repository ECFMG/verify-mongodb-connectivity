import mongoose from 'mongoose';
import {
    SecretClient,
  } from "@azure/keyvault-secrets";
  import { DefaultAzureCredential } from "@azure/identity";
import 'dotenv/config';


// Passwordless credential
const credential = new DefaultAzureCredential();

// Get Key Vault name from environment variables
// such as `https://${keyVaultName}.vault.azure.net`
const keyVaultUrl = process.env.KEY_VAULT_URL;
if (!keyVaultUrl) {
    throw new Error("KEY_VAULT_URL is empty");
}


export async function connect() {
    console.log("...Verification Started");

    // Create a new SecretClient
    const client = new SecretClient(keyVaultUrl, credential);
    // Get the secret by name
    const cosmosdbReadonlyPassword = await client.getSecret(process.env.COSMOSDB_PASSWORD_SECRET_NAME);

    try {
        await mongoose.connect(`mongodb://${process.env.COSMOSDB_USER}:${cosmosdbReadonlyPassword.value}@${process.env.COSMOSDB_HOST}:${process.env.COSMOSDB_PORT}/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@${process.env.COSMOSDB_USER}@`, {
            dbName: process.env.COSMOSDB_DBNAME,
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            maxPoolSize: Number(process.env.COSMOSDB_POOL_SIZE),
            serverSelectionTimeoutMS: 300000,
        }).then(() => {
            console.log(`🗄️ Successfully connected Mongoose to ${mongoose.connection.name} 🗄️`)
            mongoose.connection.close();
            console.log(`🗄️ Successfully closed Mongoose connection to ${mongoose.connection.name} 🗄️`)
        });

    } catch (error) {
        console.log(`🔥 An error occurred when trying to connect Mongo DB 🔥`)
        console.log(`===> error : ${error}`);
        console.error(error);
        throw error;
    }
    console.log("...Verification Ended");
}

mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
    //trying to get collection names
    mongoose.connection.db.listCollections().toArray(function (err, names) {
        console.log(names); // [{ name: 'dbname.myCollection' }]
        module.exports.Collection = names;
    });
})