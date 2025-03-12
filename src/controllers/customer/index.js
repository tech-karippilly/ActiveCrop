import { HTTP_BAD_REQUEST, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../constans/httpStatus.js"
import { ADMIN_CUSTOMER_CREATE_PAGE, ADMIN_CUSTOMER_LIST_PAGE, ADMIN_CUSTOMER_UPDATE_PAGE } from "../../constans/page.js"
import { Role, User } from "../../models/index.js"
import { ALERT_DANGER, ALERT_SUCCESS, ALERT_WARNING } from "../../utils/alert.js"




export const updateCustomerPage = async (req, res) => {
    try{
        const id = req.params.id
        const users = await User.findById(id)
      
        if(users){
            return renderPage(ADMIN_CUSTOMER_UPDATE_PAGE, res, HTTP_SUCCESS, '', '', '', users)
        }else{
            return res.redirect('/api/customers')
        }
      
    }catch(error){
        return res.redirect('/api/customers')
    }

}

export const createCustomer = async (req, res) => {
    const { firstName, lastName, email, password, userName, phone } = req.body

    try {
        const userRole = await Role.findOne({ roleName: 'User' });

        const filePath = JSON.parse(JSON.stringify(req.file))

        const fileName = `${process.env.HOST_URL}/${filePath.path}`
        const user = {
            firstName,
            lastName,
            email,
            phone,
            password,
            userName,
            isBlocked: false,
            role: userRole._id,
            profileImage: fileName
        }

        const existingUser = await User.findOne({ $or: [{ userName:{$regex:{userName,option:'i'}} }, { email }] });

        if (existingUser) {
            return renderPage(ADMIN_CUSTOMER_CREATE_PAGE, res, HTTP_BAD_REQUEST, 'Username or email already exists', ALERT_WARNING, '')
        }

        const newUser = new User(user);
        await newUser.save();
        return renderPage(ADMIN_CUSTOMER_CREATE_PAGE, res, HTTP_SUCCESS, 'User created successfully', ALERT_SUCCESS, '/admin/customers')
    } catch (error) {
        return renderPage(ADMIN_CUSTOMER_CREATE_PAGE, res, HTTP_SERVER_ERROR, 'Internal server error', ALERT_DANGER, '')
    }
}

export const createCustomerPage = (req, res) => {
    return renderPage(ADMIN_CUSTOMER_CREATE_PAGE, res, HTTP_SUCCESS, '', '', '')
}

export const getCoustomers = async (req, res) => {
    try {
        const users = await User.find();
        renderPage(ADMIN_CUSTOMER_LIST_PAGE, res, HTTP_SUCCESS, '', '', '', users)
    } catch (error) {
        renderPage(ADMIN_CUSTOMER_LIST_PAGE, res, HTTP_SUCCESS, 'Internal Server Error', ALERT_DANGER, '', [])
    }
}

export const searchCustomers = async (req, res) => {
    try {
        const { searchString } = req.query
        const searchUserCriteria = {
            $or: [
                { firstName: { $regex: searchString, $options: 'i' } },
                { lastName: { $regex: searchString, $options: 'i' } },
                { email: { $regex: searchString, $options: 'i' } },
                { phone: { $regex: searchString, $options: 'i' } }
            ]
        };
        const customers = await User.find(searchUserCriteria);

        renderPage(ADMIN_CUSTOMER_LIST_PAGE, res, HTTP_SUCCESS, '', '', '', customers)
    } catch (error) {
        renderPage(ADMIN_CUSTOMER_LIST_PAGE, res, HTTP_SERVER_ERROR, 'Internal Server Error', ALERT_DANGER, '', [])
    }
}

const renderPage = (pageName, res, status, alertMessage, alertType, redirectUrl, customers) => {
    res.status(status).render(pageName, {activePage:"Customers", alertMessage, alertType, redirectUrl, customers })
}

export const getCustomerDetails = async (req, res) => {
    try {
        const user_id = req.params.id
        const users = await User.findById(user_id)
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
}

export const updateCustomer = async (req, res) => {
    try {
        const _id = req.params.id;
        const { firstName, lastName, email, password, userName, phone } = req.body;
        const userRole = await Role.findOne({ roleName: 'User' });

        // Find existing user
        const existingUser = await User.findById(_id);

        if (!existingUser) {
            return res.status(404).render('admin/customers/update', { 
                activePage:"Customers",
                alertMessage: 'User Not found', 
                alertType: 'warning', 
                redirectUrl: '', 
                user: existingUser 
            });
        }

        // Update fields if they exist
        existingUser.firstName = firstName;
        existingUser.email = email;
        existingUser.lastName = lastName;
        existingUser.phone = phone;
        existingUser.password = password;
        existingUser.userName = userName;
        existingUser.isBlocked = false;
        existingUser.role = userRole._id;

        if (req.file) {
            const filePath = JSON.parse(JSON.stringify(req.file));
            existingUser.profileImage = `${process.env.HOST_URL}/${filePath.path}`;
        }

        await existingUser.save();
        return res.status(200).render('admin/customers/update', { 
            activePage:"Customers",
            alertMessage: 'User Updated successfully', 
            alertType: 'success', 
            redirectUrl: '/admin/customers', 
            customers: existingUser 
        });

    } catch (error) {
        res.status(500).render('admin/customers/update', { 
            activePage:"Customers",
            alertMessage: 'Internal server error', 
            alertType: 'danger', 
            redirectUrl: '', 
            customers: [] 
        });
    }
};


export const toggleUserBlockStatus = async (req, res) => {
    try {
        const user_id = req.params.id
        const user = await User.findById(user_id);

        if (user) {
            user.isBlocked = !user.isBlocked
            user.save()
            return res.status(200).json({ message: "User Status Updated successfully" })
        }
        res.status(404).json({ message: "User Not found" })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}


export const deleteCustomer = async (req, res) => {
    try {
        const user_id = req.params.id
        const user = await User.findById(user_id);
        if (user) {
            const delte = await User.deleteOne({ _id: user_id })
            return res.status(200).json({ message: 'User Deleted successfully', redirect: '/admin/customers' });
        }
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
}