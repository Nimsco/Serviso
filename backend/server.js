require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/db/db")

connectDB()

const PORT = process.env.PORT || 3000;

const bookingRoutes = require("./src/routes/booking.routes");

app.use("/api/payment", require("./src/routes/payment.routes"));


app.use("/api/bookings", bookingRoutes);

app.use("/api/admin", require("./src/routes/admin.routes"));

const contactRoutes = require("./src/routes/contact.routes");

app.use("/api/contact", contactRoutes);

// User routes
const userRoutes = require("./src/routes/userRoutes");
app.use("/api/users", userRoutes);


app.listen(PORT,()=>{
    console.log(`Server is running in port ${PORT}`)
})

