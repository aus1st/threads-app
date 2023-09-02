import UserService, { CreateUserPayload } from "../../services/user";

const queries  = {
    getToken: async (_:any, payload: {email: string, password: string})=>{
        const token = await UserService.getUserToken({
            email: payload.email,
            password: payload.password
        })

        return token;
    },

    getLoggedinUser: async(_:any, param:any, context: any)=>{
       
        if(context) {
           const user = await UserService.getUserById(context.id)
            return user;
        }

    }
};
const mutations = {
    createUser: async(_:any,payload:CreateUserPayload)=>{
        const res = await UserService.createUser(payload);
        return res.id;
    }
}

export const resolvers = {queries, mutations}