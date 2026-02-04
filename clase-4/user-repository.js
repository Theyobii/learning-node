import DBLocal from 'db-local'

import { z } from 'zod'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

const { Schema } = new DBLocal({ path: './db'})


const User = Schema('User', {
    _id: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true}
})

export class UserRepository {
    static async create ({username, password}) {

        //1. validaciones de username y password
        validation.validate({ username, password })
        //2. asegurarse que el username no exista
        const user = User.findOne ({ username })
        if (user) {
            throw new Error('El username ya existe')
        }

        const id = crypto.randomUUID()
        const hashedPassword =  await bcrypt.hash(password, 10) 

        User.create ({
            _id: id,
            username,
            password:hashedPassword
        }).save()

        return id
    }
    
    static login ({username, password}) {
        validation.validate({ username, password })

        const user = User.findOne ({ username })
        if (!user) throw new Error('Usuario no encontrado')

        const isValid = bcrypt.compareSync(password, user.password)
        if (!isValid) throw new Error('Password incorrecto')

        const { password: _, ... publicUser } = user

                return publicUser
    } 
}

    class validation {
        static validate ({username, password}) {   
            const schema = z.object({
                username: z.string().min(3).max(20),
                password: z.string().min(6).max(100)
            })

            schema.parse({ username, password })
        }
    }
export default UserRepository