/**
 * Project          : Eval
 * Module           : Questionnaire Controller File
 * Source filename  : Questionnaire.js
 * Description      : This file defines all the operation for Questionnaire module.
 * Author           : Prajwal Kiran Amin  
 * Copyright        : Copyright © 2020, Eval
 *                    Written under contract by Robosoft Technologies Pvt. Ltd.
 */

"use strict";

const { decode } = require("jwt-simple");
const util = require("../utils/util");
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var json2xls = require('json2xls');
// var logger = require('logger').createLogger();

// console.log("--")
// logger.info("--------")
//Here we’re assigning the functions  we want to export to an exports property on module
// The module.exports is a special object which is included in every JavaScript file in the Node.js application by default. The module is a variable that represents the current module, and exports is an object that will be exposed as a module. So, whatever you assign to module.exports will be exposed as a module.
module.exports = function (mongoose, utils, config, constants, logger) {

    var Questionnaires = mongoose.model('Questionnaires');
    var Employees = mongoose.model('Employees');
    var Empmaps = mongoose.model('Empmaps');
    var questionnaireCtrl = {}

    questionnaireCtrl.createQuestionnaire = async function (req, res) {
        try {

            var questionnaireObj = {};
            if (req.body.title) {
                questionnaireObj.title = req.body.title;
            }
            if (req.body.description) {
                questionnaireObj.description = req.body.description;
            }


            if (req.body.buttonTitle) {
                questionnaireObj.buttonTitle = req.body.buttonTitle;
            }
            if (req.body.buttonText) {
                questionnaireObj.buttonText = req.body.buttonText;
            }
            if (req.body.checkBoxText) {
                questionnaireObj.checkBoxText = req.body.checkBoxText;
            }
            if (req.body.startDate) {
                questionnaireObj.startDate = req.body.startDate;
            }
            if (req.body.endDate) {
                questionnaireObj.endDate = req.body.endDate;
            }
            if (req.body.remindDays) {
                questionnaireObj.remindDays = req.body.remindDays;
            }
            if (req.body.mailBody) {
                questionnaireObj.mailBody = req.body.mailBody;
            }
            if (req.body.admin) {
                questionnaireObj.admin = req.body.admin;
            }

            if (req.body.pptUpload) {
                questionnaireObj.pptUpload = req.body.pptUpload;
            }


            if (req.file && req.file.originalname) {
                questionnaireObj.participantList = req.file.originalname;
            }
            var exceltojson;
            if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders: true
                }, function (err, result) {
                    if (err) {
                        return res.json({ error_code: 1, err_desc: err, data: null });
                    }
                    let info;
                    result.forEach(async element => {
                        let otp = utils.generateOtp();
                        console.log("password", otp);
                        element.password = utils.encryptPassword(otp);
                        // element.userType = "user";

                        info = await Employees.addData(element);
                        console.log(info);
                        // utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");

                    });


                });
            } catch (err) {
                return utils.sendDBCallbackErrs(req, res, err, null);

                //res.json({ error_code: 1, err_desc: "Corupted excel file" });
            }


            // questionnaireObj.password = await utils.encryptPassword(questionnaireObj.password);


            // var query = {};
            // query.email = req.body.email;
            let data = await Questionnaires.addData(questionnaireObj);

            console.log("________________data", data);
            return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");

        } catch (error) {
            console.log("____________Err", error)
            return utils.sendDBCallbackErrs(req, res, error, null);
        }



    }
    
    

    questionnaireCtrl.getQuestionnaire = async function (req, res) {
        try {
            let data = await Questionnaires.getDataById(req.params.questionnaireId);
            if (!data) {
                return utils.sendCustomError(req, res, "HTTP_ERR", "USER_NOT_EXISTS")
            } else {
                return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
            }

        } catch (error) {
            return utils.sendDBCallbackErrs(req, res, error, null);
        }


    }

    questionnaireCtrl.getQuestionnaires = async function (req, res) {

        try {
            if (req.user && req.user.userType === 'superAdmin') {
                var queryObj = {};
                queryObj.query = {};
                if (req.query.name) {
                    queryObj.query.name = req.query.name;
                }
                console.log(queryObj)
                queryObj.options = {

                };
                if (req.query.limit) {
                    queryObj.options.limit = JSON.parse(req.query.limit)
                }
                if (req.query.skip) {
                    queryObj.options.skip = JSON.parse(req.query.skip);
                }
                if (req.query.sortField && req.query.sortOrder) {
                    console.log("------------------sortField", req.query.sortField, req.query.sortOrder);
                    var sortField = req.query.sortField;
                    var sortOrder = req.query.sortOrder;
                    queryObj.options.sort = { [`${sortField}`]: JSON.parse(sortOrder) };
                };
                // }
                if (req.query.searchText) {
                    queryObj.query.name = { $regex: req.query.searchText, $options: 'i' }
                };
                //queryObj.selectFields = 'name logo category';
                //queryObj.populate = { path: 'category', select: 'name' }
                console.log(queryObj)
                let data = await Questionnaires.getLists(queryObj);
                console.log("------------------data", data);
                let count = await Questionnaires.getCount(queryObj.query);
                // var xls = json2xls(data);
                // fs.writeFileSync('data.xlsx', xls, 'binary');
                return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS", count);

            }
            else {
                return utils.sendAuthError(req, res, "NOT_AUTHERIZED", "NOT_AUTHERIZED")
            }



        } catch (error) {
            return utils.sendDBCallbackErrs(req, res, error, null);
        }



    }
    // questionnaireCtrl.generateReport = async function (req, res) {

    //     try {
    //         var queryObj = {};
    //         queryObj.query = {};
    //         if (req.query.name) {
    //             queryObj.query.name = req.query.name;
    //         }
    //         console.log(queryObj)
    //         queryObj.options = {

    //         };
    //         if (req.query.limit) {
    //             queryObj.options.limit = JSON.parse(req.query.limit)
    //         }
    //         if (req.query.skip) {
    //             queryObj.options.skip = JSON.parse(req.query.skip);
    //         }
    //         if (req.query.sortField && req.query.sortOrder) {
    //             console.log("------------------sortField", req.query.sortField, req.query.sortOrder);
    //             var sortField = req.query.sortField;
    //             var sortOrder = req.query.sortOrder;
    //             queryObj.options.sort = { [`${sortField}`]: JSON.parse(sortOrder) };
    //         };
    //         // }
    //         if (req.query.searchText) {
    //             queryObj.query.name = { $regex: req.query.searchText, $options: 'i' }
    //         };
    //         //queryObj.selectFields = 'name logo category';
    //         queryObj.populate = { path: 'category', select: 'name' }
    //         console.log(queryObj)
    //         let data = await Questionnaires.getLists(queryObj);
    //         let count = await Questionnaires.getCount(queryObj.query);
    //         var xls = json2xls(data);
    //         fs.writeFileSync('data.xlsx', xls, 'binary');
    //         return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS", count);


    //     } catch (error) {
    //         return utils.sendDBCallbackErrs(req, res, error, null);
    //     }


    // }
    questionnaireCtrl.updateQuestionnaire = async function (req, res) {
        try {

            if (req.params.questionnaireId === "null") {
                var questionnaireObj = {};

                var questionnaireData = {};
                if (req.body.publish) {
                    questionnaireData.publish = req.body.publish;
                }
                // if (req.body.id) {
                //     questionnaireObj._id = req.body.id;
                // }
                if (req.body.title) {
                    questionnaireObj.title = req.body.title;
                }
                if (req.body.description) {
                    questionnaireObj.description = req.body.description;
                }


                if (req.body.buttonTitle) {
                    questionnaireObj.buttonTitle = req.body.buttonTitle;
                }
                if (req.body.buttonText) {
                    questionnaireObj.buttonText = req.body.buttonText;
                }
                if (req.body.checkBoxText) {
                    questionnaireObj.checkBoxText = req.body.checkBoxText;
                }
                if (req.body.startDate) {
                    questionnaireObj.startDate = req.body.startDate;
                }
                if (req.body.endDate) {
                    questionnaireObj.endDate = req.body.endDate;
                }
                if (req.body.remindDays) {
                    questionnaireObj.remindDays = req.body.remindDays;
                }
                if (req.body.mailBody) {
                    questionnaireObj.mailBody = req.body.mailBody;
                }
                if (req.body.admin) {
                    questionnaireObj.admin = req.body.admin;
                }

                if (req.body.pptUpload) {
                    questionnaireObj.pptUpload = req.body.pptUpload;
                }


                if (req.file && req.file.originalname) {
                    questionnaireObj.participantList = req.file.originalname;
                }
                let data = await Questionnaires.addData(questionnaireObj);
                console.log("id--------------------------", questionnaireObj._id);
                var exceltojson;
                if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
                    exceltojson = xlsxtojson;
                } else {
                    exceltojson = xlstojson;
                }
                try {
                    exceltojson({
                        input: req.file.path,
                        output: null, //since we don't need output.json
                        lowerCaseHeaders: true
                    }, function (err, result) {
                        if (err) {
                            return res.json({ error_code: 1, err_desc: err, data: null });
                        }
                        let info;
                        let inf;
                        let outt;
                        let queryy = {};
                        result.forEach(async element => {
                            queryy.email = element.email;
                            let otp = utils.generateOtp();
                            console.log("password", otp);
                            console.log("element code",element.employeeCode);
                            element.username = otp;
                            element.password = utils.encryptPassword(otp);
                            element.userType = "user";
                            console.log("queryy-------------------", queryy);
                            // element.userType = "user";
                            outt = await Employees.getData(queryy);
                            console.log("********data", outt);
                            if (!outt) {
                                info = await Employees.addData(element);
                                console.log("info----------------------------", info);
                                inf = await Empmaps.addData({ empId: info._id, questId: data._id });
                                console.log("inf", inf);


                                console.log("----------publish", questionnaireData.publish);
                                if (questionnaireData.publish === "true") {
                                    console.log("inside");
                                    console.log("ele", element.userType)
                                    //await utils.sendMail(element.name, element.email, element.password, element.userType);
                                    //await utils.sendMails(element.name, element.email, element.password, element.userType, questionnaireObj.mailBody);
                                }
                            }




                            // utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");

                        });


                    });
                } catch (err) {
                    return utils.sendDBCallbackErrs(req, res, err, null);

                    //res.json({ error_code: 1, err_desc: "Corupted excel file" });
                }


                // questionnaireObj.password = await utils.encryptPassword(questionnaireObj.password);


                // var query = {};
                // query.email = req.body.email;
                // let data = await Questionnaires.addData(questionnaireObj);

                //let out = await Empmaps.getLists({});
                //console.log("out----------------------------",out);

                console.log("________________data", data);


                return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");


            }
            else {
                console.log("entered else");
                console.log("id", req.params.questionnaireId);
                var questionnaireOb = {};
                var questionnaireData = {};
                if (req.body.title) {
                    questionnaireOb.title = req.body.title;
                }
                if (req.body.description) {
                    questionnaireOb.description = req.body.description;
                }


                if (req.body.buttonTitle) {
                    questionnaireOb.buttonTitle = req.body.buttonTitle;
                }
                if (req.body.buttonText) {
                    questionnaireOb.buttonText = req.body.buttonText;
                }
                if (req.body.checkBoxText) {
                    questionnaireOb.checkBoxText = req.body.checkBoxText;
                }
                if (req.body.startDate) {
                    questionnaireOb.startDate = req.body.startDate;
                }
                if (req.body.endDate) {
                    questionnaireOb.endDate = req.body.endDate;
                }
                if (req.body.remindDays) {
                    questionnaireOb.remindDays = req.body.remindDays;
                }
                if (req.body.mailBody) {
                    questionnaireOb.mailBody = req.body.mailBody;
                }
                if (req.body.admin) {
                    questionnaireOb.admin = req.body.admin;
                }
                if (req.body.publish) {
                    questionnaireData.publish = req.body.publish;
                }

                if (req.body.pptUpload) {
                    questionnaireOb.pptUpload = req.body.pptUpload;
                }


                if (req.file && req.file.originalname) {
                    questionnaireOb.participantList = req.file.originalname;
                }
                console.log("button", questionnaireOb.buttonTitle);
                var exceltojson;
                if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
                    exceltojson = xlsxtojson;
                } else {
                    exceltojson = xlstojson;
                }
                try {
                    exceltojson({
                        input: req.file.path,
                        output: null, //since we don't need output.json
                        lowerCaseHeaders: true
                    }, function (err, result) {
                        if (err) {
                            return res.json({ error_code: 1, err_desc: err, data: null });
                        }
                        let info;
                        let inf;
                        let outt;
                        let queryy = {};
                        result.forEach(async element => {
                            queryy.email = element.email;
                            let otp = utils.generateOtp();
                            console.log("password", otp);
                            element.username = otp;
                            element.password = utils.encryptPassword(otp);
                            element.userType = "user";
                            console.log("queryy-------------------", queryy);
                            // element.userType = "user";
                            outt = await Employees.getData(queryy);
                            console.log("********data", outt);
                            if (!outt) {
                                info = await Employees.addData(element);
                                console.log("info----------------------------", info);
                                inf = await Empmaps.addData({ empId: info._id, questId: data._id });
                                console.log("inf", inf);


                                console.log("----------publish", questionnaireData.publish);
                                if (questionnaireData.publish === "true") {
                                    console.log("inside");
                                    console.log("ele", element.userType)
                                    //await utils.sendMail(element.name, element.email, element.password, element.userType);
                                    //await utils.sendMails(element.name, element.email, element.password, element.userType, questionnaireObj.mailBody);
                                }
                            }




                            // utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");

                        });



                    });
                } catch (err) {
                    return utils.sendDBCallbackErrs(req, res, err, null);

                    //res.json({ error_code: 1, err_desc: "Corupted excel file" });
                }

                let data = await Questionnaires.updateDataById(req.params.questionnaireId, questionnaireOb);

                console.log("data", data);

                if (!data) {
                    return utils.sendCustomError(req, res, "HTTP_ERR", "DATA_NOT_EXISTS")
                } else {
                    return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
                }
            }


        } catch (error) {
            return utils.sendDBCallbackErrs(req, res, error, null);
        }

    }

    questionnaireCtrl.deleteQuestionnaire = async function (req, res) {
        try {
            let data = await Questionnaires.removeDataById(req.params.questionnaireId);
            if (!data) {
                return utils.sendCustomError(req, res, "HTTP_ERR", "DATA_NOT_EXISTS")
            } else {
                return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
            }

        } catch (error) {
            return utils.sendDBCallbackErrs(req, res, error, null);
        }

    }
    questionnaireCtrl.getQuestionnairesCount = async function (req, res) {
        // logger.info("*********")s
        try {
            let data = await Questionnaires.aggregate([
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 }
                    }
                }


            ]);
            // console.log("---data", data)
            logger.info("----data", data)
            return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");

        } catch (error) {
            console.log("------err", error)
            return utils.sendDBCallbackErrs(req, res, error, null);
        }
    }

    // Questionnaires.aggregate([
    //     {
    //         $group: {
    //             _id: '$category',
    //             count: { $sum: 1 }
    //         }
    //     }


    // ], function (err, data) {
    //     return utils.sendResponse(req, res, data, "SUCCESS", "SUCCESS");
    // })

    // }
    
    
    

    return questionnaireCtrl;
}