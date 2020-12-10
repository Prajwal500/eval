

var passport = require("passport");
var BearerStrategy = require("passport-http-bearer").Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleTokenStrategy = require("passport-google-token").Strategy;
var TwitterTokenStrategy = require('passport-twitter-token');
var mongoose = require("mongoose");
var config = require("../configs/config");
//var Users = mongoose.model("Users");
var Employees = mongoose.model("Employees")
// module.exports = function () {
var utils = require("../utils/util");

// passport.use(new BearerStrategy(
//     function (token, done) {
//         console.log("-----------token", token);
//         var queryObj = {
//             token: token,
//             tokenExpiry: { $gte: new Date() }
//         };


//         Users.getUser(queryObj, function (err, user) {
//             if (err) {
//                 return done(err);
//             }
//             if (!user) {
//                 return done(null, false);
//             }
//             return done(null, user)

//         })

//     }
// ));
passport.use(new BearerStrategy(
    async function (token, done) {
        try {
            console.log("-----------token", token);
            var queryObj = {
                token: token,
                tokenExpiry: { $gte: new Date() }
            };

            let user = await Employees.getData(queryObj);
            // if(!user){

            // }
            // Users.getUser(queryObj, function (err, user) {
            // if (err) {
            //     return done(err);
            // }
            if (!user) {
                return done(null, false);
            }
            return done(null, user)

            // }) 
        } catch (error) {
            return done(error);
        }


    }
));
// passport.use(new FacebookTokenStrategy({
//     clientID: config.facebook.appId,
//     clientSecret: config.facebook.appSecret,
//     // "profileFields": ['emails', 'name', 'gender', 'displayName']
//     // fbGraphVersion: 'v3.0'
// }, async function (accessToken, refreshToken, profile, done) {
//     console.log("------accessToken", accessToken, "-----profile", profile)

//     try {
//         var userObj = {};
//         var query = {};
//         var email;
//         if (profile) {
//             if (profile.emails && profile.emails.length > 0) {
//                 email = profile.emails[0].value;
//             }
//             query = {
//                 $or: [
//                     // { email: email },
//                     { faceBookId: profile.id }

//                 ]
//             };
//             if (email !== undefined) {
//                 query['$or'].push({ email: email });
//             }
//             userObj.name = profile.displayName;
//             userObj.gender = profile.gender;
//             userObj.profilePic = profile.photos ? profile.photos[0].value : '';
//             userObj.faceBookId = profile.id;

//             let user = await Users.getData(query);

//             if (!user) {
//                 user = await Users.addData(userObj);


//                 return done(null, user);


//             } else {
//                 var updateObj = {
//                     facebookId: userObj.facebookId
//                 }
//                 user = await Users.updateDataById(user._id, updateObj);


//                 return done(null, user);


//             }

//         }
//         else {
//             return done(null, false);
//         }
//     } catch (error) {
//         return done(error);
//     }
// }
// ));

// passport.use(new GoogleTokenStrategy({
//     clientID: config.google.clientId,
//     clientSecret: config.google.clientSecret
// },
//     async function (accessToken, refreshToken, profile, done) {
//         try {
//             var query = {};
//             var userObj = {};
//             var email;
//             if (profile) {
//                 if (profile.emails && profile.emails.length > 0) {
//                     var email = profile.emails[0].value;
//                     userObj.email = email;
//                 }
//                 query = {
//                     $or: [
//                         { email: email },
//                         { googleId: profile.id }

//                     ]
//                 };
//                 userObj.name = profile.displayName;
//                 userObj.profilePic = profile._json.picture;
//                 userObj.googleId = profile.id;
//                 let user = await Users.getData(query);
//                 if (!user) {
//                     user = await Users.addData(userObj);
//                     return done(null, user);
//                 } else {
//                     var updateObj = {
//                         googleId: userObj.googleId
//                     }
//                     user = await Users.updateDataById(user._id, updateObj);
//                     return done(null, user);
//                 }
//             }
//         } catch (error) {
//             return done(error);
//         }

//     }
// ));
// passport.use(new TwitterTokenStrategy({
//     consumerKey: config.twitter.consumerKey,
//     consumerSecret: config.twitter.consumerSecret
// }, async function (token, tokenSecret, profile, done) {
//     try {
//         var query = {};
//         var userObj = {};
//         var email;
//         if (profile) {
//             if (profile.emails && profile.emails.length > 0) {
//                 email = profile.emails[0].value;
//             }
//             query = {
//                 $or: [
//                     // { email: email },
//                     { twitterId: profile.id }

//                 ]
//             };
//             if (email !== undefined) {
//                 query['$or'].push({ email: email });
//             }
//             userObj.name = profile._json.name;
//             userObj.location = profile._json.location;
//             userObj.profilePic = profile._json.profile_image_url;
//             userObj.twitterId = profile.id;
//             let user = await Users.getData(query);

//             if (!user) {
//                 user = await Users.addData(userObj);
//                 return done(null, user);

//             } else {
//                 var updateObj = {
//                     twitterId: profile.id
//                 }
//                 user = await Users.updateDataById(user._id, updateObj);

//                 return done(null, user)

//             }

//         }
//     } catch (error) {
//         return done(error)
//     }

// }
// ));

exports.isAuthenticated = passport.authenticate('bearer', { session: false });
// exports.faceBookAuthenticate = passport.authenticate('facebook-token', { session: false });
// exports.googleAuthenticate = passport.authenticate('google-token', { session: false });
// exports.twitterAuthenticate = passport.authenticate('twitter-token', { session: false })


