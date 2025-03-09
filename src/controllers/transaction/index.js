import { ADMIN_TRANSACTION_PAGE } from "../../constans/page.js"
import { Transactions } from "../../models/index.js"

async function renderTransactionPage(req, res) {
    try {
        let page = parseInt(req.query.page) || 1; // Default page is 1
        let limit = 10; // Number of transactions per page
        let skip = (page - 1) * limit;

        const totalTransactions = await Transactions.countDocuments();

        const transactions = await Transactions.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        let totalPages = Math.ceil(totalTransactions / limit);

        console.log("transactions", transactions)

        res.status(200).render(ADMIN_TRANSACTION_PAGE, {
            activePage: 'Transactions',
            transactions: transactions,
            currentPage: page,
            totalPages: totalPages
        });
    } catch (error) {

    }

}


export {
    renderTransactionPage
}