import { Server } from "http";
import app from "./app";

const port = 3333;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log(`HealthCare server is listening on port ${port}`);
  });
}

main();
