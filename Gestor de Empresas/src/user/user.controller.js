'use strict'

import User from './user.model.js'
import { encrypt, checkPassword } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const saveUser = async(req, res) =>{
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        let user = new User(data)
        await user.save()
        return res.send({message: 'User saved successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error saved user'})
    }
}

export const login = async(req, res)=>{
    try {
        let { email, username, password } = req.body
        if(email){
            var user = await User.findOne({email})
        }else if(username){
            var user = await User.findOne({username})
        }
       if(user && await checkPassword(password, user.password)){
            let loggedUser = {
                uid : user._id,
                username : user.username,
                name: user.name
            }
            let token = await generateJwt(loggedUser)
            return res.send(
             {
                message: `Welcome ${loggedUser}`,
                loggedUser,
                token
            }
            )
       }
       return res.status(404).send({message: 'Invalid Credentials'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Failed to login'})
    }
}