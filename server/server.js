require("dotenv").config();

const app = require("./src/app.js");
const connectDB = require("./src/db/db.js");

const PORT = process.env.PORT || 3000;

function validateEnv() {
  const required = ["JWT_SECRET"];
  const missing = required.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

async function startServer() {
  validateEnv();
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
