// contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import ajaxGateway from "../utils/ajaxGateway";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // 检查用户登录状态
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (token) {
        try {
          // 设置请求头的认证令牌
          ajaxGateway.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // 获取用户信息
          const response = await ajaxGateway.get("/api/user/profile");
          if (response.data && response.data.code === 200) {
            setCurrentUser(response.data.data);
            setIsAuthenticated(true);
          } else {
            // 令牌无效或过期
            handleLogout();
          }
        } catch (error) {
          console.error("Auth check error:", error);
          handleLogout();
        }
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, [token]);

  // 登录函数
  const login = async (email, password) => {
    try {
      const response = await ajaxGateway.post("/auth/login", { email, password });
      if (response.data && response.data.code === 200) {
        const authToken = response.data.data.token;
        setToken(authToken);
        localStorage.setItem("token", authToken);
        ajaxGateway.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

        // 获取用户信息
        const userResponse = await ajaxGateway.get("/api/user/profile");
        if (userResponse.data && userResponse.data.code === 200) {
          setCurrentUser(userResponse.data.data);
          setIsAuthenticated(true);
          return { success: true };
        }
      }
      return { success: false, message: response.data.message || "登录失败" };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "登录失败，请检查网络连接",
      };
    }
  };

  // 注册函数
  const register = async (username, email, password) => {
    try {
      const response = await ajaxGateway.post("/auth/register", {
        username,
        email,
        password,
      });

      if (response.data && response.data.code === 200) {
        return { success: true };
      }
      return { success: false, message: response.data.message || "注册失败" };
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "注册失败，请检查网络连接",
      };
    }
  };

  // 登出函数
  const handleLogout = () => {
    localStorage.removeItem("token");
    delete ajaxGateway.defaults.headers.common["Authorization"];
    setToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // 刷新令牌
  const refreshToken = async () => {
    try {
      const response = await ajaxGateway.post("/api/refresh-token");
      if (response.data && response.data.code === 200) {
        const newToken = response.data.data.token;
        setToken(newToken);
        localStorage.setItem("token", newToken);
        ajaxGateway.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        return true;
      }
      return false;
    } catch (error) {
      console.error("Refresh token error:", error);
      handleLogout();
      return false;
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout: handleLogout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
