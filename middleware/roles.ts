import { NextFunction, Request,Response } from "express"

//authenthicate role ;
const authencateRole = (role:Array<String>) => {
    return async (req: Request, res: Response,next:NextFunction) => {
        try {
            let check = 0;
            for(let i=0;i<role.length;i++){
                if(role[i]!==req.body.role[i]){
                    check=1;
                }
            }
            if(check) return  res.status(400).send("You don't have access of this api");  
            else next();
        } catch (err: unknown) {
            res.status(401).send(err);
        }
    }
    
}
module.exports = { authencateRole };