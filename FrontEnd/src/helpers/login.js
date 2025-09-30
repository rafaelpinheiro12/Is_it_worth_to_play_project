import * as jose from 'jose'

  const login = (token, setUser, setIsLoggedIn) => {
    debugger
    let decodedToken = jose.decodeJwt(token);
    // composing a user object based on what data we included in our token (login controller - jwt.sign() first argument)
    let user = {
      email: decodedToken.userEmail,
    };
    localStorage.setItem("token", JSON.stringify(token));
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user)
    setIsLoggedIn(true);
  };
  
  export default login;