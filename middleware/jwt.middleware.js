const { expressjwt: jwt } = require("express-jwt");

// Instantiate the JWT token validation middleware
const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: 'payload', 
  getToken: getTokenFromHeaders
});


// Function used to extract the JWT token from the request's 'Authorization' Headers
function getTokenFromHeaders (req) {
  
  // Check if the token is available on the request Headers
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {

    // Get the encoded token string and return it
    const token = req.headers.authorization.split(" ")[1];
    return token;
  } 
  
  return null;
}


// Export the middleware so that we can use it to create protected routes
module.exports = {
  isAuthenticated
}

/*
const jwt = require("jsonwebtoken");

// authenticateToken middleware fonksiyonu
module.exports = (req, res, next) => {
  // İstek başlığındaki Authorization bilgisini alın
  const authHeader = req.headers.authorization;
  // Authorization başlığından tokeni ayıklayın
  const token = authHeader && authHeader.split(" ")[1];

  // Token yoksa veya geçersizse hata döndürün
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Tokeni doğrulayın ve kullanıcı bilgilerini alın
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};
*/