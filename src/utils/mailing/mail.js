import nodemailer from 'nodemailer'
import path from 'path'
import fs from 'fs'
import 'nodemailer-wellknown'
import { EmailTemplate } from 'email-templates'

import config from 'config'

const transport = nodemailer.createTransport(config.email)

export async function sendEmail (templateName, templateData, email, subject) {
  const template = getEmailTemplate(templateName)
  return template.render({ email, ...templateData }).then(result => {
    return new Promise((resolve, reject) => {
      transport.sendMail(
        {
          from: `<${config.email.auth.user}>`,
          to: email,
          subject: subject,
          html: result.html,
          text: result.text,
        },
        function (err, responseStatus) {
          if (err) {
            return reject(err)
          }
          resolve(responseStatus)
        }
      )
    })
  })
}

function getEmailTemplate (templateName) {
  var templatesDir = path.resolve(__dirname, 'templates')
  const templates = fs.readdirSync(templatesDir)
  if (templates.indexOf(templateName) < 0) {
    throw new Error(`Email template ${templateName} cannot be found into email templates directory ${templatesDir}`)
  }
  return new EmailTemplate(path.join(templatesDir, templateName))
}
