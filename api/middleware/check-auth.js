const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
     try {
         //get token from headers, and split by space to get index 1
         const token = req.headers.authorization.split(" ")[1];

         // verify token
         const decoded = jwt.verify(token, process.env.JWT_KEY);
        //  console.log(decoded);
         req.userData = decoded;
         next();

     } catch(err) {
         return res.status(401).json({
            message: 'Invalid token!'
         })
     }
}