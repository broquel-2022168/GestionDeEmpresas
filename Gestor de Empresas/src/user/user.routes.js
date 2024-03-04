'use strict'

import express from 'express'
import { login, saveUser } from './user.controller.js'

const api = express.Router()

api.post('/save',saveUser)
api.post('/login',login)

export default api