const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
mongoose.connect(process.env.MONGO_URI);

const userSchema = Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
});

const adminSchema = Schema ({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
});

const courseSchema = Schema ({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId
});

const purchaseSchema = Schema({
    userId: ObjectId,
    creatorId: ObjectId
});

const userModel = mongoose.Model("user", userSchema);
const adminModel = mongoose.Model("Model", adminSchema);
const courseModel = mongoose.Model("course", courseSchema);
const purchaseModel = mongoose.Model("purchase", purchaseSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}