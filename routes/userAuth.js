// This is a middleware

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token === null) {
        return res.status(401).json({ message: 'Token is required.' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
        if(err) {
            return res.status(403).json({ message: 'Token is invalid.' });
        }

        req.user = payload;
        next();
    })
};

module.exports = authenticateToken;