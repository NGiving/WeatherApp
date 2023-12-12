const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const app = express();
app.enable('trust proxy')
app.use(express.static('public'));
app.use(cookieParser());

mongoose.set("strictQuery", false);
const mongoDB = process.env.NODE_ENV === 'production' ? process.env.DB_STRING_PROD : process.env.DB_STRING;
main().catch((err) => console.log(err));
mongoose.connection.once('open', () => { console.log('Connected to MongoDB') });
async function main() {
    await mongoose.connect(mongoDB);
};

// const routes = require('./routes/routes');
// app.use('/api', routes);
const appController = require('./controllers/appController')
app.get('/api/', appController.home)
app.get('/api/weekly/:country/:region/:city', appController.weekly)
app.get('/api/hourly/:country/:region/:city', appController.hourly)
app.get('/api/fortnight/:country/:region/:city', appController.fortnight)


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})