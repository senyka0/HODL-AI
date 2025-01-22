require("dotenv").config({ path: "../.env" });
const app = require("./src/app");
const db = require("./src/database");
// require("./src/jobs/updateJob");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await db.authenticate();
    await db.sync();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
}

startServer();
