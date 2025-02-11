import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constans/httpStatus.js";
import { ADMIN_ORDER_DETAILS_PAGE, ADMIN_ORDER_LIST_PAGE } from "../../constans/page.js";
import { Order } from "../../models/index.js";


async function renderOrderPage(req, res) {
    try {
        const page = parseInt(req.query.page, 10) || 1;  
        const limit = 10;                                   
        const skip = (page - 1) * limit;                    

        const orders = await Order.find().skip(skip).limit(limit).lean(); 
        const totalOrders = await Order.countDocuments();               
        const totalPages = Math.ceil(totalOrders / limit);             

        res.status(200).render(ADMIN_ORDER_LIST_PAGE, {     
            orders,
            currentPage: page,
            totalPages
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).render(ADMIN_ORDER_LIST_PAGE, {
            orders: [],
            currentPage: 1,
            totalPages: 1,
            error: 'Failed to load orders. Please try again later.'
        });
    }
}

async function orderDetailsPage (req,res){
    try{
        const orderId = req.params.id;
        const order = await Order.findById(orderId)

        if (!order) {
            return res.status(404).render(ADMIN_ORDER_DETAILS_PAGE,{order:{}});
        }
        res.status(200).render(ADMIN_ORDER_DETAILS_PAGE,{order});
    }catch(error){
        return res.status(500).render(ADMIN_ORDER_DETAILS_PAGE,{order:{}});
    }
}

// Update Order Status Controller
async function orderStatus(req, res) {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        // Validate Status Options
        const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        if (order.deliveryStatus === "Cancelled") {
            return res.status(400).json({ message: "Cannot update status of a cancelled order." });
        }

        order.deliveryStatus = status;
        await order.save();

        res.status(200).json({ message: "Order status updated successfully.", updatedStatus: order.deliveryStatus });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}



export {
    renderOrderPage,
    orderDetailsPage,
    orderStatus
}