
const express = require("express");
const { connectMongoDB } = require("./config/dbconfig");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const setupSwagger = require("./config/swagger");

require("dotenv").config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Serve uploaded media files
app.use(
  "/assets/media",
  express.static(path.join(__dirname, "assets/media"))
);

// API health check
app.get("/", (req, res) => {
  res.json({
    message: "Event Booking System API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    documentation: "/api-docs",
  });
});

// API routes
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/events", require("./routes/eventRoute"));
app.use("/api/bookings", require("./routes/bookingRoute"));
app.use("/api/reports", require("./routes/reportRoute"));

// Swagger documentation
setupSwagger(app);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    availableRoutes: [
      "/api/users",
      "/api/events",
      "/api/bookings",
      "/api/reports",
      "/api-docs",
    ],
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : undefined,
  });
});

const port = process.env.PORT || 5000;

// Connect to MongoDB before starting Express
const startServer = async () => {
  try {
    await connectMongoDB();

    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
