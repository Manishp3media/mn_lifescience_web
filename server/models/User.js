import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { 
        type: String 
    },
    
    // For MR: mobileNumber is required and unique
    mobileNumber: {
        type: String,
        unique: true,
        sparse: true, 
        validate: {
            validator: function (v) {
                return this.role === 'user' ? !!v : true;
            },
            message: 'Mobile number is required for users'
        }
    },
    
    // For Admin: email is required and unique
    email: {
        type: String,
        unique: true,
        sparse: true,
        validate: {
            validator: function (v) {
                return this.role === 'admin' ? !!v : true;
            },
            message: 'Email is required for Admin'
        }
    },
    // otp: {
    //     type: String,
    // },
    password: {
        type: String,
    },
    clinicName: {
        type: String
    },
    city: {
        type: String
    },
    speciality: {
        type: String
    },
    role: { 
        type: String, 
        enum: ['admin', 'user'], 
        default: 'user' 
    }, 
},
{ timestamps: true });

export default mongoose.model('User', userSchema);