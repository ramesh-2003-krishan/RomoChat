import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();
await connectDB();

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
console.log(`Chat Service running on port ${PORT}`);
});
