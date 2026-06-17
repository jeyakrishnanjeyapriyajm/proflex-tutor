const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");

dotenv.config();

connectDB();

console.log("Python URL:", process.env.PYTHON_MODEL_URL);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});