const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CheckInSchema = new Schema({
    mood: { type: Number },
    imageUrl: { type: String},
    audioUrl: { type: String },
    diaryEntry: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User"},
});

module.exports = model("CheckIn", CheckInSchema);