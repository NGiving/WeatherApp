const express = require('express');
// const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.enable('trust proxy')
app.use(express.static('public'));
app.use(cookieParser());
app.use((cors(
  {
    origin: '*',
    methods: '*',
    credentials: true
  }
)))

// mongoose.set("strictQuery", false);
// const mongoDB = process.env.NODE_ENV === 'production' ? process.env.DB_STRING_PROD : process.env.DB_STRING;
// main().catch((err) => console.log(err));
// mongoose.connection.once('open', () => { console.log('Connected to MongoDB') });
// async function main() {
//     await mongoose.connect(mongoDB);
// };

// const routes = require('./routes/routes');
// app.use('/api', routes);
const appController = require('./controllers/appController')
app.get('/', appController.home)
app.get('/weekly/:country/:region/:city', appController.weekly)
app.get('/hourly/:country/:region/:city', appController.hourly)
app.get('/fortnight/:country/:region/:city', appController.fortnight)


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})