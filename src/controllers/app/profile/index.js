import { HTTP_NOT_FOUND, HTTP_SERVER_ERROR, HTTP_SUCCESS } from "../../../constans/httpStatus.js";
import { USER_PROFILE_PAGE } from "../../../constans/page.js";
import { User } from "../../../models/index.js";

export async function renderProfilePage(req, res) {
    try {
        // const access_token = req.session.accessToken

        // if(access_token){
        //     const jwtDecode = jwt.verify(access_token, process.env.JWT_SECRET_ACCESS_TOKEN)
        //     const userId = jwtDecode.userId
        //     const currentUser = await User.findById(userId)

        // }
        const currentUser = await User.findById('67930bdbd933b5aa5b33d335')
      

        // console.log(access_token)
        res.status(HTTP_SUCCESS).render(USER_PROFILE_PAGE, { currentUser })
    } catch (error) {
        res.status(HTTP_SERVER_ERROR).render(USER_PROFILE_PAGE)
    }
}

export async function updateProfileDetails(req, res) {
    try {
        const { firstName, lastName, userName, email, phone } = req.body

        const currentUser = await User.findById('67930bdbd933b5aa5b33d335')

        if (currentUser) {

            currentUser.firstName = firstName
            currentUser.lastName = lastName
            currentUser.userName = userName
            currentUser.email = email
            currentUser.phone = phone


            if (req.file) {
                const newPath = req.file.path.replace(/^src[\\/]/, '');
                const filePath = `http://localhost:3000/${newPath}`
                currentUser.profileImage = filePath
            }

            await currentUser.save()
            return res.status(HTTP_SUCCESS).json({ message: "User Update Successfully" })
        }
        return res.status(HTTP_NOT_FOUND).json({ message: "User Not Found" })

    } catch (error) {
        return res.status(HTTP_SERVER_ERROR).json({ message: "Internal Server Error" })
    }
}