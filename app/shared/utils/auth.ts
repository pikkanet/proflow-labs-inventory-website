export const clearAuthData = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  document.cookie = "access_token=; path=/; max-age=0";
};

export const isValidToken = (token: string): boolean => {
  try {
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      return false;
    }

    const payload = JSON.parse(atob(tokenParts[1]));

    // Check if token has expired
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
};
