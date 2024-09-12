const { getAll, create, getOne, remove, update } = require('../controllers/song.controllers');
const express = require('express');
const verifyJWT = require('../utils/verifyJWT');

const songRouter = express.Router();

songRouter.route('/songs')
    .get(verifyJWT,getAll)
    .post(verifyJWT, create);

songRouter.route('/songs/:id')
    .get(verifyJWT, getOne)
    .delete(verifyJWT, remove)
    .put(verifyJWT, update);

module.exports = songRouter;