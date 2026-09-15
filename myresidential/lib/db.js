import sql from "mssql";
import { ClientSecretCredential } from "@azure/identity";

const credential = new ClientSecretCredential(
  process.env.AZURE_TENANT_ID,
  process.env.AZURE_CLIENT_ID,
  process.env.AZURE_CLIENT_SECRET
);

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