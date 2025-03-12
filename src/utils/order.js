export function generateOrderNumber() {
    const prefix = 'ORD'; // Optional: Order prefix
    const timestamp = Date.now(); // Current timestamp in milliseconds
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number

    return `${prefix}-${timestamp}-${randomNum}`;
}
