import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

export const tokenCheckMiddleware =async(req,res,next)=>{

    try{
        const access_token = req.headers['authorization'].split(' ')[1]
        const refreh_token = req.headers['refresh_token']

        if (!access_token || !refreh_token) {
            return res.status(401).json({ message: 'Access token or refresh token missing.' });
        }

        try{
            const decodedAccess = jwt.verify(access_token,process.env.JWT_SECRET_ACCESS_TOKEN)
            req.user = decodedAccess;
        }catch(error){
            return res.status(401).json({message:'Token expires please refresh token',})
        }
        next()
    }catch(error){
        console.error('Token Check Middleware Error:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const authAdminMiddleware = async(req,res,next)=>{

    if (req.session.access_token){
        res.redirect('/api/admin/dashboard')
    }else{
        next()
    }
}
export const authAdminDashboardMiddleware = async(req,res,next)=>{
    if (req.session.access_token){
        next()
    }else{
        res.redirect('/admin')
    }
}

