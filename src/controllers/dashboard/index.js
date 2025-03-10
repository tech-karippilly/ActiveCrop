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

        const sales = await Order.aggregate([
            {
                $match: {
                    deliveryStatus: 'Delivered',
                    paymentStatus: 'Paid'
                }
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    totalSales: {
                        $sum: "$totalAmount",
                    },
                    orderCount: { $sum: 1 },
                    date: { $first: "$createdAt" }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ])
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        const formattedSales = sales.map(sale => ({
            month: monthNames[sale._id - 1],  // Convert month number to name
            totalSales: sale.totalSales
        }));
        res.status(200).render('admin/dashboard/dasbboard', { activePage: 'Dashboard', totalOrders, totalDiscoutAmount, totalAmount, successOrders, pendingOrders, sales:formattedSales })
    } catch (error) {

    }

}

export { dasboardPage }