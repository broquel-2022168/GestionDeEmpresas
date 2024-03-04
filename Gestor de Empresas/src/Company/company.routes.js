'use strict'

import express from 'express'
import { generateExcell, getA_Z, getZ_A, get_C, saveCompany, updateCom } from './company.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = express.Router()

api.post('/saveCompany',[validateJwt],saveCompany)
api.get('/getCompanyAZ',[validateJwt], getA_Z)
api.get('/getCompanyZA',[validateJwt],getZ_A)
api.get('/getCompanyC',[validateJwt],get_C)
api.put('/updateCompany/:id',[validateJwt],updateCom)
api.get('/generar',[validateJwt],generateExcell)

export default api