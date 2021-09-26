import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    pass: {
        type: String,
        required: true,
        trim: true
    },
    createdOn: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model('User', UserSchema);