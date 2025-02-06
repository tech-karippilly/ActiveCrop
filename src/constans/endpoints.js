export const ADMIN_AUTH_BASE = '/admin/auth'
export const ADMIN_LOGIN ='/'
export const ADMIN_LOGIN_POST= '/login'
export const ADMIN_CREATE ='/create-admin'
export const ADMIN_LOGOUT ='/logout'


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


export const USER_AUTH_BASE ='/auth'
export const USER_AUTH_GOOGLE ='/google'
export const USER_ATUH_GOOGLE_CALLBACK = '/google/callback'

export const USER_HOME ='/'
export const USER_CATAGOERY= '/catagoery'
export const USER_PRODUCTS ='/products'
export const USER_PRODUCT_DETAILS = '/details/:id/:cataid'

export const USER_LOGIN_BASE = '/auth'
export const USER_LOGIN = '/login'
export const USER_SIGNUP ='/signup'
export const USER_RESET_EMAIL = '/reset-mail'
export const USER_RESET_PASSWORD = '/reset-password'


export const USER_OTP_BASE = '/otp'
export const USER_OTP_VERIFY = '/verifyotp'

export const USER_PROFILE= '/user/profile'
export const USER_ADDRESS_BASE = `${USER_PROFILE}/address`

export const USER_ADDRESS_CREATE = `${USER_ADDRESS_BASE}/create`
export const USER_ADDRESS_DYNAMIC = `${USER_ADDRESS_BASE}${DYNAMIC_ID}`

export const USER_ORDER_BASE = '/user/orders'
export const USER_DYNAMIC = `${USER_ORDER_BASE}${DYNAMIC_ID}`

export const USER_REST_PASSWORD = '/user/password'



export const DYNAMIC_ID = '/:id'
export const LOGOUT = '/logout'





