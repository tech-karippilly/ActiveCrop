import express from 'express'
import { BASE_URL, GENERATE_REPORT } from '../../constans/endpoints.js'
import { generateReport, renderReport } from '../../controllers/report/index.js'

const route = express.Router()

route.get(BASE_URL,renderReport)
route.post(GENERATE_REPORT,generateReport)

export default route