export const getAuthToken = () => {
    return localStorage.getItem("token");
  };
  
  export const getAdminToken = () => {
    return localStorage.getItem("admin");
  };
  
  export const removeAuthToken = () => {
    try {
      localStorage.removeItem("token");
      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  };
  
  export const removeAdminToken = () => {
    try {
      localStorage.removeItem("admin");
      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  };
  