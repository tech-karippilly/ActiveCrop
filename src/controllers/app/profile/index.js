import { HTTP_NOT_FOUND, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../../constans/httpStatus.js";
import { USER_PROFILE_PAGE } from "../../../constans/page.js";
import { User } from "../../../models/index.js";
import jwt from 'jsonwebtoken'
import { uploadImage } from "../../../services/cloudinary.js";

export async function renderProfilePage(req, res) {
    try {
        const access_token = req.session.accessToken
        if (access_token) {
            const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)
            const userId = jwtDecode.userId
            const currentUser = await User.findById(userId)
            res.status(HTTP_SUCCESS).render(USER_PROFILE_PAGE, { currentUser })
        }


    } catch (error) {
        res.status(HTTP_SERVER_ERROR).render(USER_PROFILE_PAGE)
    }
}

export async function updateProfileDetails(req, res) {
    try {
        const { firstName, lastName, userName, email, phone } = req.body

        const access_token = req.session.accessToken

        if (access_token) {
            const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)
            const userId = jwtDecode.userId
            const currentUser = await User.findById(userId)
            if (currentUser) {

                currentUser.firstName = firstName
                currentUser.lastName = lastName
                currentUser.userName = userName
                currentUser.email = email
                currentUser.phone = phone


                if (req.file) {
                    try {
                        const cloudinaryResponse = await uploadImage(req.file.path);
                        currentUser.profileImage = cloudinaryResponse.secure_url; 
                    } catch (error) {
                        console.error("Cloudinary upload failed:", error);
                        return res.status(500).json({ message: "Failed to upload image" });
                    }
                }

                await currentUser.save()
                return res.status(HTTP_SUCCESS).json({ message: "User Update Successfully" })
            }
            return res.status(HTTP_NOT_FOUND).json({ message: "User Not Found" })
        }



        return res.status(HTTP_NOT_FOUND).json({ message: "Log in to continue" })

    } catch (error) {
        return res.status(HTTP_SERVER_ERROR).json({ message: "Internal Server Error" })
    }
}