import { Order } from "../../models/index.js"

async function dasboardPage(req, res) {
    try {

        const totalOrders = await Order.aggregate([
            {
                $match: {
                    paymentStatus: 'Paid',
                }
            },
            {
                $count: "totalOrders"
            }
        ]);

        const pendingOrders = await Order.aggregate([
            {
                $match: {
                    deliveryStatus: { $ne: 'Delivered' }
                }
            },
            {
                $count: 'totalOrders'
            }
        ])

        const successOrders = await Order.aggregate([
            {
                $match: {
                    paymentStatus: "Paid",
                    deliveryStatus: 'Delivered'
                }
            },
            {
                $count: "totalOrders"
            }
        ]);

        const totalAmount = await Order.aggregate([
            {
                $match: {
                    paymentStatus: 'Paid',
                    deliveryStatus: 'Delivered'
                },
            },

            {
                $group: {
                    _id: null,
                    totalAmount: {
                        $sum: '$totalAmount'
                    }
                }
            }
        ]);

        const totalDiscoutAmount = await Order.aggregate([
            {
                $match: {
                    deliveryStatus: 'Paid',
                    deliveryStatus: 'Delivered'
                }
            },
            {
                $group: {
                    _id: null,
                    discount: {
                        $sum: '$discount'
                    }
                }
            }
        ]);
        
        res.status(200).render('admin/dashboard/dasbboard',{totalOrders,totalDiscoutAmount,totalAmount,successOrders,pendingOrders})
    } catch (error) {

    }

}

export { dasboardPage }