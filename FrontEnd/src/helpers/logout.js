
  const logout = (setIsLoggedIn) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  export default logout;