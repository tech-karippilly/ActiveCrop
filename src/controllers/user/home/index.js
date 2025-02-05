

export const userHomePage = async (req,res)=>{
    res.status(200).render('user/home/index',{ alertMessage: '', alertType: '', redirectUrl: '' })
}