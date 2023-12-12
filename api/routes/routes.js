const router = require('express').Router()
const appController = require('../controllers/appController')

router.get('/', appController.home);

router.get('/weekly/:country/:region/:city', appController.weekly);

router.get('/hourly/:country/:region:/:city', appController.hourly);

router.get('/fortnight/:country/:region/:city', appController.fortnight);

module.exports = router;