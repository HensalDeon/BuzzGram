import jwt from "jsonwebtoken";

/** auth middleware */
export default async function Auth(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(403).send("Access Denied");
        }
        // const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = decodedToken;
        // next();
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decodedToken;
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ error: "Token has expired" });
            } else {
                return res.status(500).json({ error: error.message });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
