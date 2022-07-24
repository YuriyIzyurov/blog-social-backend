//middware, которая выполняется при гет запросе auth/me, авторизация не идет дальше, пока не выполнтся функция next()
import jwt from "jsonwebtoken";

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
    if(token) {
        try {
            const decoded = jwt.verify(token, 'secret12345')
            req.userID = decoded._id
            next()
        } catch(err) {
            return res.status(403).json({message: "Хуевенький токен" })
        }
    } else {
        return res.status(403).json({message: "Нет доступа"})
    }

}