import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()


const { EMAIL, PASSWORD, SERVER_URL, CLIENT_URL } = process.env

const sendEmail = (to, url, text) => {

  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: false,
    auth: {
      user: EMAIL,
      pass: PASSWORD
    }
  })
  const mailOptions = {
    from: EMAIL,
    to: to,
    subject: "Welcome to Lovodi.com",
    html: `
        <div style="max-width:700px; margin:auto; border:10px solid #ddd; padding:50px 20px; font-size:110%;">
        <h2 style="text-align:center; text-transform:uppercase;color: teal;">Welcome to Lovodi.com.</h2>
        <p>Congratulations! You have set up Lovodi.com.
            Just click here to login and start using the app when you are ready.
        </p>
        
        <a href=${url} style="background: teal; text-decoration:none; color:white; padding:10px 20px; margin:10px 0; display:inline-block; align-items:center;">${text}</a>
    
        <p>If the button doesn't work for any reason, you can also click on the link below:</p>
    
        <a href =${url}>${url}</a>

        <div style="margin-top:30px; color:teal;">
            <p>Regards,</p>
            <p>Lovodi.com Team</p>
        </div>

        </div>
        `
  }
  smtpTransport.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err)
      return err
    } else {
      console.log('Email sent Successfully')
      return 'Email sent Successfully'
    }
  })
}


export { sendEmail};
