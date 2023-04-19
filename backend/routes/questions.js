var express = require("express");
var router = express.Router();

var questions = require("../services/trainerFunctions");


const multer = require('multer')
const path =  require('path')
var bodyParser = require('body-parser');


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

let upload = multer({ storage: storage });

router.post('/import_questions',upload.single('file'),questions.importQuestions);

router.post('/create',questions.createQuestion);
router.post('/details/all',questions.getAllQuestions);
router.get('/details/:_id',questions.getSingleQuestion);
router.post('/delete',questions.deleteQuestion);



module.exports=router;

