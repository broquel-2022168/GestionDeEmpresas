'use strict'

import { Schema, model } from 'mongoose'

const companySchema = Schema({
    name: {
        type: String,
        required: true
    },
    impacto: {
        type: String,
        uppercase: true,
        enum: ['ALTO','MEDIO','BAJO'],
        required: true
    },
    trayectoria: {
        type: String,
        required: true
    },
    category:{
        type: Schema.ObjectId,
        ref: 'category',
        required: true
    },
})

export default model('company', companySchema)