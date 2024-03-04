'use strict'

import express from 'express'
import { deleteC, getC, saveC, updateC } from './category.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = express.Router()

api.post('/save',[validateJwt],saveC)
api.put('/update/:id',[validateJwt],updateC)
api.delete('/delete/:id',[validateJwt],deleteC)
api.get('/get',[validateJwt],getC)

export default api