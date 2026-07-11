import dotenv from "dotenv";

dotenv.config();

import app from "./src/app.js";
import connectToDB from "./src/config/db.js";

const PORT = process.env.PORT || 3001;

connectToDB();

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
