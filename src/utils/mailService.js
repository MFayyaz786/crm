const nodemailer = require("nodemailer");
const SMSModel = require("../SMS/SMSModel");
const templateModel=require("../SMS/templateModel");
const credentialsModel=require("../companyMailCredential/companyMailModel")
const { model } = require("mongoose");
const mailService = async (processedData, sentBy,count) => {
  console.log("count: ", count);
  try {
    const credentials=await credentialsModel.findOne({_id:processedData[0].compony});
    if(!credentials){
      throw new Error("Compony mail credentials not exist")
    }
    const transporter = nodemailer.createTransport({
      host:credentials.host,
      port:credentials.port,
      secure: false,
      auth: {
        user:credentials.email,
        pass:credentials.password
      },
    });
    let send=0;
    for (const message of processedData) {
      const mailOptions = {
        from: credentials.email,
        to: message.email,
        subject: "Sim Dispatched",
        text: message.message,
      };
      const result = await transporter.sendMail(mailOptions);
      console.log("result: ", result);
      if (result.accepted.length > 0) {
        send++; // Increment 'send' only for successfully sent emails
        await SMSModel.findOneAndUpdate(
          { _id: message._id },
          { isSent: true, sentBy: sentBy, status: "Sent" }
        );
        console.log("Email sent:", result);
      } else {
        console.log("Email not sent:", result);
      }
    }
    console.log("send: ", send);
    if(count===send){
      console.log("temeplateId", processedData[0].templateId);
      await templateModel.findOneAndUpdate({templateId:processedData[0].templateId},{status:"Sent"})
    }
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = mailService;
