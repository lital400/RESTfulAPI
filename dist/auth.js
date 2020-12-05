"use strict";
// import { User } from './models/user';
// import jwt from 'jsonwebtoken';
// import { IncomingHttpHeaders } from 'http';
// import { userList } from './routes/users';
// class Auth {
//     static secret : string = '73F8C34C94EBB28E95279B6CC495F32A454F1FE2B92BEC88E2868E9D1858C3DC';
//     static verifyUser(headers: IncomingHttpHeaders){
//         let authHeader = headers.authorization;  
//         if (authHeader) {
//             try 
//             {
//                 let token = authHeader.split(' ')[1];
//                 let verified = jwt.verify(token, this.secret); 
//                 if(verified) 
//                     res.status(200).send(userList.map(({ password, ...cleanElement }) => cleanElement));  // exclude passwords from output 
//                 else
//                     res.status(401).json({ status: 401, message: 'Invalid Authorization Header' });
//             } catch(err) {
//                 status(403).json({ status: 403, message: err });
//             }
//         }
//         else
//     }
// }
// export {Auth};
//# sourceMappingURL=auth.js.map