/**
 * Project          : Eval
 * Module           : User model File
 * Source filename  : schema.js
 * Description      : This file is to set the schema for the user collection.
 * Author           : Prajwal Kiran Amin
 * Copyright        : Copyright © 2020, Eval
 *                    Written under contract by Robosoft Technologies Pvt. Ltd.
 */

"use strict";

/**
 * Module dependencies.
 * https://code.tutsplus.com/articles/an-introduction-to-mongoose-for-mongodb-and-nodejs--cms-29527
 */
/*Mongoose is a JavaScript library that allows you to define schemas with strongly typed data. Once a schema is defined, Mongoose lets you create a Model based on a specific schema. A Mongoose Model is then mapped to a MongoDB Document via the Model's schema definition.

Once you have defined your schemas and models, Mongoose contains many different functions that allow you to validate, save, delete, and query your data using common MongoDB functions.*/
module.exports = function (mongoose) {
    var Schema = mongoose.Schema;


    /*
     * User Schema
     */
    var EmployeeSchema = new Schema({
        name: {
            type: String,
            required: [true, 'Please enter your name'],
            // required: true
            /*
            Schema types (dataTypes)
            String
            Number
            Date
            Buffer -- The Buffer data type allows you to save binary data. A common example of binary data would be an image or an encoded file, such as a PDF document.
            Boolean
            Mixed --The Mixed data type turns the property into an "anything goes" field. 
            ObjectId -- The ObjectId data type commonly specifies a link to another document in your database. For example, if you had a collection of books and authors, the book document might contain an ObjectId property that refers to the specific author of the document.
            Array -- The Array data type allows you to store JavaScript-like arrays. With an Array data type, you can perform common JavaScript array operations on them, such as push, pop, shift, slice, etc.
            */
        },
        email: {
            type: String,
            // required: [true, 'Please enter your valid email address!!!'],
            // unique: true
        },
        employeeCode: {
            type: String,
        },
        // emailVerificationCode: {
        //     type: Number
        // },
        // otpExpiry: {
        //     type: Date
        // },
        password: {
            type: String,
            select: false,
            // required: true,
            // minlength: [6, 'Minimum password length is 6 characters']
        },
        username: {
            type: String
            // required: true,
            // minlength: [6, 'Minimum password length is 6 characters']
        },

        userType: {
            type: String,     //seeker, provider
            default: 'user',  //shortlisted , rejected,

            enum: ['superAdmin', 'admin', 'user']
        },
        gender: {
            type: String
        },
        // location: {
        //     type: String
        // },
        // profilePic: {
        //     type: String
        // },
        phone: {
            type: String,
            // validate: {
            //     validator: function (v) {
            //         return /\d{3}-\d{3}-\d{4}/.test(v);
            //     },
            //     message: props => `${props.value} is not a valid phone number!`
            // },
            // required: [true, 'User phone number required'],
            // unique: true
        },
        passwordToken: {
            type: String
        },
        passwordTokenExpiry: {
            type: Date,
            select: false
        },
        token: {
             type: String
         },
        tokenExpiry: {
            type: String
        },
        // twitterId: {
        //     type: String
        // },


        __v: {
            type: Number,
            select: false
        }
    }, { timestamps: true });
    // UserSchema.index({ email: 1, unique: true });
    EmployeeSchema = require('../../utils/db_queries')(EmployeeSchema);

    return mongoose.model('Employees', EmployeeSchema);
};
