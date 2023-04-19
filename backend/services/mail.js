const nodemailer = require("nodemailer");
var config = require('config');

let transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
        user: "test@gigikart.com",
        pass: "Test123#"
    }
});

let sendmail = (toid,sub,text,html)=>{
    return transporter.sendMail({
        from: 'test@gigikart.com',
        to: toid,
        subject: sub,
        text: text,
        html: html || null
    });
}

module.exports = {sendmail}