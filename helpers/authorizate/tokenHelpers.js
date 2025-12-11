const sendJwtToClient = (user, res) => {
    // generate JWT
    const token = user.generateJwtFromUser();

    // Değişkenlerin .env dosyasından geldiğinden emin oluyoruz

    const { JWT_COOKIE, NODE_ENV } = process.env;

    return res
        .status(200)
        .cookie("access_token", token, {
            httpOnly: true, // "httponly" yerine "httpOnly" (camelCase) kullanımı daha standarttır
            expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 60 * 1000),
            secure: NODE_ENV === "development" ? false : true
        })
        .json({
            success: true,
            access_token: token,
            data: {
                name: user.name,
                email: user.email
            }
        });
};

const isTokenIncluded = (req) => {
    return (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    );
};
const getAccessTokenFromHeader = (req) => {
    const authorization = req.headers.authorization;
    // Eğer authorization undefined ise hata almamak için kontrol eklenebilir
    // veya isTokenIncluded middleware'i bunu zaten garanti ediyordur.
    const access_token = authorization.split(" ")[1];
    return access_token;
};

module.exports = {
    sendJwtToClient,
    isTokenIncluded,
    getAccessTokenFromHeader
};