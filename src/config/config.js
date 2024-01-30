import Dotenv from "dotenv"

Dotenv.config({

    override: true,
    path: '../src/.env'
})
export let config = {

    NPORT: process.env.NPORT||8080,
    mongo_URL: process.env.mongo_URL,
    dbName: process.env.dbName,
    passClient: process.env.passClient,
    secret: process.env.secret
}
