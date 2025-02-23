export const ADMIN_AUTH_BASE = '/admin/auth'
export const ADMIN_LOGIN ='/'
export const ADMIN_LOGIN_POST= '/login'
export const ADMIN_CREATE ='/create-admin'
export const ADMIN_LOGOUT ='/logout'

export const BASE_URL = '/'
export const DYNAMIC_ID = '/:id'
export const LOGOUT = '/logout'



export const ADMIN_DASHBOARD_BASE = '/admin/dashboard'

export const ADMIN_CATAGOERY_BASE = '/admin/catagoery'
export const ADMIN_CATAGOERY='/'
export const ADMIN_CREATE_CATAGOERY = '/createCategoery'
export const ADMIN_UPDATE_CATAGOERY = '/:id'
export const ADMIN_DELETE_CATAGOERY = '/:id'
export const ADMIN_SEARCH_CATAGOERY = '/search'

export const ADMIN_PRODUCTS_BASE = '/admin/products'
export const ADMIN_PRODUCT_LIST ='/'
export const ADMIN_CREATE_PRODUCTS = '/createProducts'
export const ADMIN_CREATE_PRODUCTS_POST = '/createProducts'
export const ADMIN_UPDATE_PRODUCTS = '/:id'
export const ADMIN_DELETE_PRODUCTS = '/:id'
export const ADMIN_PRODUCT_SEARCH ='/search'
export const ADMIN_PRODUCT_DETAILS='/:id'

export const ADMIN_CUSTOMER_BASE = '/admin/customers'
export const ADMIN_CUSTOMER_SEARCH = '/search'
export const ADMIN_CUSTOMER_LIST ='/'
export const ADMIN_CREATE_CUSTOMER = '/create-customer'
export const ADMIN_UPDATE_CUSTOMER = '/:id'

export const ADMIN_ORDERS_BASE ='/admin/orders'
export const ADMIN_ORDERS_STATUS ='/:id/status'

export const ADMIN_OFFERS_BASE ='/admin/offers'
export const ADMIN_OFFER_PRODUCT_CREATE = '/create-product-offer'
export const ADMIN_OFFER_PRODUCT_UPDATE = '/prodict-update/:id'
export const ADMIN_OFFER_PRODUCT_DELETE = '/prodict-delete/:id'

export const ADMIN_OFFER_CATAGOERY_CREATE = '/create-catagoery-offer'
export const ADMIN_OFFER_CATAGOERY_UPDATE = '/update-catagoery-offer/:offer_id'
export const ADMIN_OFFER_CATAGOERY_DELETE = '/delete-catagoery-offer/:id'

export const ADMIN_OFFER_REFERAL_CREATE= '/referal-create'
export const ADMIN_OFFER_REFERAL_UPDATE='/referal-update/:id'
export const ADMIN_OFFER_REFERAL_DELETE='/referal-delete/:id'

export const ADMIN_COUPON_BASE='/admin/coupons'
export const ADMIN_COUPON_CREATE='/create'
export const ADMIN_COUPON_DYNAMIC='/:id'


export const USER_AUTH_BASE ='/auth'
export const USER_AUTH_GOOGLE ='/google'
export const USER_ATUH_GOOGLE_CALLBACK = '/google/callback'

export const USER_HOME ='/'
export const USER_CATAGOERY= '/catagoery'


export const USER_LOGIN_BASE = '/auth'
export const USER_LOGIN = '/login'
export const USER_SIGNUP ='/signup'
export const USER_RESET_EMAIL = '/reset-mail'
export const USER_RESET_PASSWORD = '/reset-password'


export const USER_OTP_BASE = '/otp'
export const USER_OTP_VERIFY = '/verifyotp'

export const USER_PROFILE= '/user/profile'
export const USER_PROFILE_EDIT= '/edit'
export const USER_ADDRESS_BASE = `/address`
export const USER_ORDERS = '/order'
export const USER_ORDER_DETAILS = `/order/:id`
export const USER_WALLET = '/wallet'
export const USER_REFERAL = '/user-referal'

export const USER_ADDRESS_CREATE = `${USER_ADDRESS_BASE}/create`
export const USER_ADDRESS_DYNAMIC = `${USER_ADDRESS_BASE}${DYNAMIC_ID}`

export const USER_ORDER_BASE = '/user/orders'
export const USER_DYNAMIC = `${USER_ORDER_BASE}${DYNAMIC_ID}`

export const USER_REST_PASSWORD = '/password'

export const USER_PRODUCTS ='/products'
export const USER_PRODUCT_DETAILS = '/details/:id/:cataid'
export const USER_PRODUCT = '/:id'
export const USER_PRODUCT_FILTER = `/filter/:catagoery`
export const PRODUCTS_BY_ID = '/catagoery/:id/products'


export const USER_CART_BASE = '/user/cart'
export const GET_CART='/get-cart'
export const ADD_CART = '/add'
export const UPDATE_CART = '/update'
export const DELETE_ITEM = '/delete/:id'

export const ORDERS_BASE = '/orders'
export const CHECKOUT = '/checkout'
export const PLACE_ORDER  ='/place-order'
export const RAZORPAY_VERIFY = '/payment/verify'

export const ORDER_SUCCESS = '/order-success/:id'
export const ORDER_FAILD = '/order-failed/:id'
export const ORDER_CANCEL = '/order-cancel/:id'

export const WHISLIST_BASE = '/whishlist'
export const ADD_WISHLIST='/add/:id'

export const USER_COUPON_BASE ='/coupon'
export const APPLY_COUPON = '/:coupon'

