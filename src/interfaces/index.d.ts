// import { Request } from 'express';
// import {IRequestUser} from "./requestUser.interface";

import { InferRequest } from "better-auth";

declare global {
    namespace Express {
        interface Request{
            user: InferRequest;
        }
    }
}