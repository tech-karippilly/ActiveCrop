import { HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../../../constans/httpStatus.js";
import { USER_ADDRESS_CREATE_PAGE, USER_ADDRESS_EDIT_PAGE, USER_ADDRESS_PAGE } from "../../../../constans/page.js";
import { Address, User } from "../../../../models/index.js";
import { ALERT_SUCCESS } from "../../../../utils/alert.js";

export async function renderAddressPage(req, res) {
    try {
        const user = await User.findById('67930bdbd933b5aa5b33d335')
        const addressList = await Address.find({ user_id: user })

        res.status(HTTP_SUCCESS).render(USER_ADDRESS_PAGE, { addressList })
    } catch (errr) {
        res.status(HTTP_SERVER_ERROR).render(USER_ADDRESS_PAGE)
    }
}

export async function renderCreateAddressPage(req, res) {
    try {
        res.status(HTTP_SUCCESS).render(USER_ADDRESS_CREATE_PAGE)
    } catch (errr) {
        res.status(HTTP_SERVER_ERROR).render(USER_ADDRESS_CREATE_PAGE)
    }
}

async function createAddress(req, res) {
    try {
        const { landmark, address_line_1, address_line_2, pincode, state, district, city, nickname, phone } = req.body

        const currentUser = await User.findById('67930bdbd933b5aa5b33d335')
        const address = await Address.findOne({ nickname, address_line_1, address_line_2 })

        if (address) {
            return res.status(409).json({ message: 'Address already exist', alertype: 'alert-warning' })
        }

        const adderssDetails = {
            address_line_1,
            address_line_2,
            pincode,
            phone,
            state,
            district,
            city,
            landmark,
            nickname,
            user_id: currentUser._id
        }

        const newAddress = new Address(adderssDetails)

        await newAddress.save()

        return res.status(201).json({ message: "Address Created", alertype: 'alert-success', redirect:'/user/profile/address' })

    } catch (err) {
        res.status(HTTP_SERVER_ERROR).render(USER_ADDRESS_CREATE_PAGE)
    }
}

async function defaultAddress(req, res) {
    try {
        const { id } = req.params

        const address = await Address.findById(id)

        if (address) {
            address.is_default = !address.is_default
            await address.save()
            return res.status(200).json({ message: "Default adderess Updated", alertType: 'alert-success',redirect:'/user/profile/address' })
        }

        return res.status(404).json({ message: "Address Not fount", alertType: 'alert-danger' })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", alertType: 'alert-danger' })
    }
}

async function deleteAddress(req, res) {
    try {
        const { id } = req.params
        const address = await Address.findById(id)

        if (address) {
            const deleteStatus = await Address.deleteOne({ _id: id });
            if (deleteStatus.deletedCount) {
                return res.status(200).json({ message: "Address Deleted Successfully", alertType: 'alert-success' })
            }
        }
        return res.status(404).json({ message: "Address not found", alertType: 'alert-danger' })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", alertType: 'alert-danger' })
    }
}

export async function renderEditAddressPage(req, res) {
    try {
        res.status(HTTP_SUCCESS).render(USER_ADDRESS_EDIT_PAGE)
    } catch (errr) {
        res.status(HTTP_SERVER_ERROR).render(USER_ADDRESS_EDIT_PAGE)
    }
}

export { createAddress, defaultAddress, deleteAddress }