const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  tokenKey: process.env.TOKEN_KEY,
  tempPassword: process.env.TEMP_PASSWORD,
  noImage: process.env.NO_IMAGE,
  mailAuthentificationEmail: process.env.MAIL_AUTHENTIFICATION_EMAIL,
  mailAuthentificationPassword: process.env.MAIL_AUTHENTIFICATION_PASSWORD,
    mailsTo: process.env.MAILS_TO,
    bddHost: process.env.BDD_HOST,
    bddUser: process.env.BDD_USER,
    bddPassword: process.env.BDD_PASSWORD,
    bddDatabase: process.env.BDD_DATABASE
};
