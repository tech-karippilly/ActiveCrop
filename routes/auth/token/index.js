import express from 'express'
import { tokenRefresh } from '../../../controllers/auth/token/index.js'

const route = express.Router()


route.post('/refresh_token',tokenRefresh)


export default route