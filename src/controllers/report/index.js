import { ADMIN_REPORT_PAGE } from "../../constans/page.js"
import { getMonthlyReportForSpecificMonth, getOrdersBetweenDates, getOrdersBySpecificDate } from "../../utils/report.js"


async function renderReport(req,res){
    res.status(200).render(ADMIN_REPORT_PAGE)
}

async function generateReport(req,res){
    try{
        const {type,date,month,startDate,endDate} =req.body
        if (type==='daily'){
            const report  =await getOrdersBySpecificDate(date)
            return res.status(200).json({message:"Rport Generated",report})
        }else if (type==='monthly'){
            const report  =await getMonthlyReportForSpecificMonth(month)
            return res.status(200).json({message:"Rport Generated",report})
        }else if (type ==='custom'){
            const report = await getOrdersBetweenDates(startDate,endDate)
            return res.status(200).json({message:"Rport Generated",report})
        }

        res.status(200).json({message:'crated'})
    }catch(error){
        res.status(500).json({message:'Internal Serverer Error',error:error.message})
    }
}

export {
    renderReport,
    generateReport
}