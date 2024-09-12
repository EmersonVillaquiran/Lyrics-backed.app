const express = require('express');
const songRouter = require('./song.router');
const userRouter = require('./user.router');
const router = express.Router();

// colocar las rutas aquí
router.use(songRouter);
router.use(userRouter);

module.exports = router;