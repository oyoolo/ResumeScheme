// dbPassword = 'mongodb+srv://USRNAME:'+ encodeURIComponent('PASSWORD') + '@CLUSTERmongodb.net/test?retryWrites=true';
require("dotenv").config();
dbPassword = process.env.DB_URL;
module.exports = {
    mongoURI: dbPassword
};
