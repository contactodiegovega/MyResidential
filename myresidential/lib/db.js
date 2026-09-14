import sql from "mssql";
import { AzureCliCredential } from "@azure/identity";

const credential = new AzureCliCredential();

export async function getConnection() {
  const token = await credential.getToken(
    "https://database.windows.net/.default"
  );

  const config = {
    server: process.env.DATABASE_SERVER,
    database: process.env.DATABASE_NAME,

    authentication: {
      type: "azure-active-directory-access-token",
      options: {
        token: token.token,
      },
    },

    options: {
      encrypt: true,
      trustServerCertificate: false,
    },
  };

  return sql.connect(config);
}