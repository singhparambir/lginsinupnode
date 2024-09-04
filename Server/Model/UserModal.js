import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Your Email is required"],
        unique: true,
    },
    username: {
        type: String,
        required: [true, "Your username is required"]
    },
    password: {
        type: String,
        required: [true, "Your password is required"]
    },
    createdAt: {
        type: Date,
        default: () => new Date()
    },
    resetToken: String,
    resetTokenExpiry: Date,
    resetTokenStatus: {
        type: Number,
        default: 0 // 0 for valid, 1 for expired
    },
    retries: {
        type: Number,
        default: 0,
    },

    lockUntil: {
        type: Date,
    },

    failedAttempts: {    // eh schema main banaya hai failed attempts nu track karan lai
        count: {
            type: Number,  // count nal pata laggu ki kinhe aari hoya
            default: 0
        },
        lastAttempt: {
            type: Date,     // eh last attempt di date te time houga jithon baad fer menu set karna hou ki kad enable karna hai
            default: Date.now
        }
    }

});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});


const User = mongoose.model('User', userSchema);

export default User;
