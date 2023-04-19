let QuestionModel = require("../models/questions");
let options = require("../models/option");
let tool = require("./tool");
const csv=require('csvtojson');
const { response } = require("express");


let importQuestions = (req,res,next)=>{
    try {
        
        csv().fromFile(req.file.path).then(async (response) => {
            response.forEach(element => {
                let body =  element.body;
                let subjectid = element.subject;
                let anscount = 0;
                let weightage = element.weightage;
                let explanation = element.explanation;

                let option1 =  element.option1;
                let option2 =  element.option2;
                let option3 =  element.option3;
                let option4 =  element.option4;
                let option5 =  element.option5;

                let answers =  element.answers.split(',');
                
                let option = [];
               
                option.push({optbody:option1,isAnswer: answers.includes("1")});
                option.push({optbody:option2,isAnswer: answers.includes("2")});
                option.push({optbody:option3,isAnswer: answers.includes("3")});
                option.push({optbody:option4,isAnswer: answers.includes("4")});
                option.push({optbody:option5,isAnswer: answers.includes("5")});

                //chcek answer count
                option.map((d,i)=>{
                    if(d.isAnswer){
                        anscount=anscount+1;
                    }
                })
                

                QuestionModel.findOne({ body : body,status:1 },{status:0})
                .then((info)=>{
                    if(!info){
                        options.insertMany(option,(err,op)=>{
                            if(err){
                                console.log(err);
                                res.status(500).json({
                                    success : false,
                                    message : "Unable to create new question!"
                                })
                            }
                            else{
                                var ra=[];
                                console.log(op)
                                op.map((d,i)=>{
                                    if(d.isAnswer){
                                        ra.push(d._id)
                                    }
                                })
                                var tempdata = QuestionModel({
                                    body: body,
                                    explanation : explanation,
                                    // quesimg : quesimg,
                                    subject : subjectid,
                                    // difficulty :difficulty,
                                    options:op,
                                    // createdBy : req.user._id,
                                    createdBy : "641198eb48fb585218e1c578",
                                    anscount:anscount,
                                    weightage : weightage,
                                    rightAnswers:ra
                                })
                                tempdata.save()
                            }
                        })
                    }
                    else{
                        res.json({
                            success : false,
                            message : `This question already exists!`
                        })
                    }   

                })


            });
        }).then(()=>{
            res.json({
                success : true,
                message : `New question created successfully!`
            })
        })
        // res.send({status:200,success:true,message:"Questions imported successfully!"})
    } catch (error) {
        // res.send({status:400,success:false,message:"Unable to import questions!"})
    }
}

let createQuestion = (req,res,next)=>{
    if(req.user.type==='TRAINER'){
        req.check('body', `Invalid question!`).notEmpty();
        req.check('subject', 'Enter subject!').notEmpty();
        var errors = req.validationErrors()
        if(errors){
            res.json({
                success : false,
                message : 'Invalid inputs',
                errors : errors
            })
        }
        else {
            var body =  req.body.body;
            var option =  req.body.options;
            var quesimg =  req.body.quesimg;
            var difficulty =  req.body.difficulty;
            var subjectid = req.body.subject;
            var anscount = 0;
            var weightage = req.body.weightage;
            option.map((d,i)=>{
                if(d.isAnswer){
                    anscount=anscount+1;
                }
            })
            console.log(anscount);
            var explanation = req.body.explanation;
                QuestionModel.findOne({ body : body,status:1 },{status:0})
                .then((info)=>{
                    if(!info){
                        options.insertMany(option,(err,op)=>{
                            if(err){
                                console.log(err);
                                res.status(500).json({
                                    success : false,
                                    message : "Unable to create new question!"
                                })
                            }
                            else{
                                var ra=[];
                                console.log(op)
                                op.map((d,i)=>{
                                    if(d.isAnswer){
                                        ra.push(d._id)
                                    }
                                })
                                var tempdata = QuestionModel({
                                    body: body,
                                    explanation : explanation,
                                    quesimg : quesimg,
                                    subject : subjectid,
                                    difficulty :difficulty,
                                    options:op,
                                    createdBy : req.user._id,
                                    anscount:anscount,
                                    weightage : weightage,
                                    rightAnswers:ra
                                })
                                tempdata.save().then(()=>{
                                    res.json({
                                        success : true,
                                        message : `New question created successfully!`
                                    })
                                }).catch((err)=>{
                                    console.log(err);
                                    res.status(500).json({
                                        success : false,
                                        message : "Unable to create new question!"
                                    })
                                })
                            }
                        })
                    }
                    else{
                        res.json({
                            success : false,
                            message : `This question already exists!`
                        })
                    }   

                })
            
        }
        
    }

    else{
        res.status(401).json({
            success : false,
            message : "Permissions not granted!"
        })
    }
}


let deleteQuestion = (req,res,next)=>{
    if(req.user.type==='TRAINER'){
        var _id =  req.body._id;
        QuestionModel.findOneAndUpdate({
            _id : _id
        },
        {
            status : 0

        }).then(()=>{
            res.json({
                success: true,
                message :  "Question has been deleted"
            })
        }).catch((err)=>{
            res.status(500).json({
                success : false,
                message : "Unable to delete question"
            })
        })
    }
    else{
        res.status(401).json({
            success : false,
            message : "Permissions not granted!"
        })
    } 
}


let getAllQuestions = (req,res,next)=>{
    if(req.user.type==='TRAINER'){
        var subject = req.body.subject;
        if(subject.length!==0){
            QuestionModel.find({subject : subject,status : 1},{status : 0})
            .populate('createdBy', 'name')
            .populate('subject', 'topic')
            .populate('options')
            .exec(function (err, question) {
                if (err){
                    console.log(err)
                    res.status(500).json({
                        success : false,
                        message : "Unable to fetch data"
                    })
                }
                else{
                    res.json({
                        success : true,
                        message : `Success`,
                        data : question
                    })
                }
            })        

        }
        else{
            QuestionModel.find({status : 1},{status : 0})
            .populate('createdBy', 'name')
            .populate('subject', 'topic')
            .populate('options')
            .exec(function (err, question) {
                if (err){
                    console.log(err)
                    res.status(500).json({
                        success : false,
                        message : "Unable to fetch data"
                    })
                }
                else{
                    res.json({
                        success : true,
                        message : `Success`,
                        data : question
                    })
                }
            })        
        }
        }
    else{
        res.status(401).json({
            success : false,
            message : "Permissions not granted!"
        })
    } 
}   
 




let getSingleQuestion = (req,res,next)=>{
    if(req.user.type==='TRAINER'){
        let _id = req.params._id;
        console.log(_id);
        QuestionModel.find({_id : _id , status : 1},{status : 0})
        .populate('questions', 'body')
        .populate('subject', 'topic')
        .populate('options')
        .exec(function (err, question) {
            if (err){
                console.log(err)
                res.status(500).json({
                    success : false,
                    message : "Unable to fetch data"
                })
            }
            else{
                if(question.length===0){
                    res.json({
                        success : false,
                        message : `No such question exists`,
                    })
                }
                else{
                    res.json({
                        success : true,
                        message : `Success`,
                        data : question
                    })
                }   
            }
        })        
    }
    else{
        res.status(401).json({
            success : false,
            message : "Permissions not granted!"
        })
    }    
}
 
//create test papers

module.exports = { createQuestion, getAllQuestions, getSingleQuestion, deleteQuestion, importQuestions}







