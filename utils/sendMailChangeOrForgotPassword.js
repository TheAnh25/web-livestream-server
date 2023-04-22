require('dotenv')
const nodeMailer = require('nodemailer')

const sendMail = async (options) => {
  let testAccount = await nodeMailer.createTestAccount()

  const transporter = await nodeMailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      ...testAccount,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  const mailOptions = {
    from: 'web-stream-apb@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.text,
    html: options.html,
  }

  const info = await transporter.sendMail(mailOptions)

  console.log('Message sent: %s', info.messageId)
  console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(info))
}

module.exports = { sendMail }
