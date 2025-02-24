import moment from "moment";
import { Order } from "../models/index.js";


const getOrdersBySpecificDate = async (dateString) => {
    try {
        const startDate = moment(dateString).startOf("day").toDate();
        const endDate = moment(dateString).endOf("day").toDate();
        const orders = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        return orders;
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
}

const getMonthlyReportForSpecificMonth = async (monthString) => {
    try {
      const startDate = moment(monthString, "YYYY-MM").startOf("month").toDate();
      const endDate = moment(monthString, "YYYY-MM").endOf("month").toDate(); 

      console.log(startDate)
      console.log(endDate)
      console.log(moment(monthString))

      const order = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate } 
          }
        }
      ]);
  
      console.log(`Report for ${monthString}:`, order);
      return order
    } catch (error) {
      console.error("Error generating monthly report:", error);
    }
  };

  const getOrdersBetweenDates = async (startDateString, endDateString) => {
    try {
      const startDate = moment(startDateString, "YYYY-MM-DD").startOf("day").toDate(); 
      const endDate = moment(endDateString, "YYYY-MM-DD").endOf("day").toDate(); 
  
      const orders = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate } 
          }
        }
      ]);
  
      return orders
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

export {
    getOrdersBySpecificDate,
    getMonthlyReportForSpecificMonth,
    getOrdersBetweenDates
}