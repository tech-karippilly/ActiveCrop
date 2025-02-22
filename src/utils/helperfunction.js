import crypto from 'crypto'
function generateReceiptNumber(prefix = "REC", length = 10) {
    const randomBytes = crypto.randomBytes(length);
    const receiptNumber = randomBytes.toString('hex').toUpperCase().slice(0, length);
    return `${prefix}-${receiptNumber}`;
}

function applyOffers(productList, offers) {
    const newProductList = productList.map((product) => {
        const productOffer = offers.find((offer) => offer.product._id.equals(product._id));
        if (productOffer) {
            const value = appyOfferPrice(product.price, productOffer.discountValue, productOffer.offer_type)
            return {
                ...product._doc,
                offerprice: `${value}`
            }
        }

        return {
            ...product._doc
        }
    })
    return newProductList
}

export  const appyOfferPrice = (productPrice, offerPrice, offerType) => {
    if (offerType === 'percentage') {
        const product = Number(productPrice)
        const percentagePrice = calculatePercentage(product, Number(offerPrice))
        const price = product - percentagePrice
        return price
    } else {
        const product = Number(productPrice)
        const price = product - Number(offerPrice)
        return price
    }
}

function calculatePercentage(number, percentage) {
    return (number * percentage) / 100;
}

export {
    generateReceiptNumber,
    applyOffers
}