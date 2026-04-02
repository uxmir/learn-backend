import *as authService from './auth.service'
import ApiResponse from '../../common/utils/api-response'
const register=async (req,res)=>{
const user=await authService.register(req.body)
ApiResponse.created(res, "user has been created",user)
}

export{
    register
}