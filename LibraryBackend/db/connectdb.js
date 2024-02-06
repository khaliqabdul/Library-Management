const mongoose = require("mongoose");
const connectDB = async (DATABASE_URL) => {
    try {
        const DB_OPTIONS = {
            dbName: 'library-management',
        }
        await mongoose.connect(DATABASE_URL, DB_OPTIONS)
        console.log('mongoose connected successfully...')
    } catch (error) {
        console.log(error)
    }
};

module.exports = connectDB

// // creating a database
// mongoose.connect("mongodb://localhost:27017/Student")
// .then(() => {
//     console.log("mongodb connected successfully...")
// })
// .catch((error) => {
//     console.log("connection failed...")
// })