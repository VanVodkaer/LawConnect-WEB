// auth.js - 认证相关工具函数

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("jwtToken");
  const expireTime = localStorage.getItem("tokenExpire");

  if (!token || !expireTime) {
    return false;
  }

  // 检查token是否过期
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime > parseInt(expireTime)) {
    // token已过期，清除用户信息
    logout();
    return false;
  }

  return true;
};

/**
 * 获取当前登录用户信息
 * @returns {Object|null} 用户信息对象或null（如果未登录）
 */
export const getCurrentUser = () => {
  if (!isAuthenticated()) {
    return null;
  }

  const userInfo = localStorage.getItem("userInfo");
  return userInfo ? JSON.parse(userInfo) : null;
};

/**
 * 检查当前用户是否是管理员
 * @returns {boolean} 是否是管理员
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user ? user.role === 2 : false;
};

/**
 * 退出登录，清除用户信息
 */
export const logout = () => {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("userInfo");
  localStorage.removeItem("tokenExpire");
};

/**
 * 刷新Token（示例实现，需要与后端接口对接）
 * @param {function} callback 刷新成功后的回调函数
 */
export const refreshToken = async (callback) => {
  try {
    // 这里应该调用实际的刷新Token接口
    const response = await fetch("/api/refresh-token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.code === 200) {
      // 更新存储的token和过期时间
      localStorage.setItem("jwtToken", data.data.token);
      localStorage.setItem("tokenExpire", data.data.expire.toString());

      if (callback && typeof callback === "function") {
        callback();
      }

      return true;
    } else {
      // 刷新失败，可能需要重新登录
      logout();
      return false;
    }
  } catch (error) {
    console.error("刷新Token失败:", error);
    logout();
    return false;
  }
};

/**
 * 保护路由的高阶组件（与React Router配合使用）
 * 使用示例：
 *
 * import { PrivateRoute } from './utils/auth';
 *
 * function App() {
 *   return (
 *     <Routes>
 *       <Route path="/login" element={<Login />} />
 *       <Route path="/dashboard" element={
 *         <PrivateRoute>
 *           <Dashboard />
 *         </PrivateRoute>
 *       } />
 *     </Routes>
 *   );
 * }
 */
// export const PrivateRoute = ({ children, adminOnly = false }) => {
// 这个注释块是提供给开发者的使用说明
// 实际使用时，需要取消下面的注释，并确保安装了react-router-dom

/*
  import { Navigate, useLocation } from 'react-router-dom';
  
  const location = useLocation();
  
  if (!isAuthenticated()) {
    // 未登录时重定向到登录页面
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (adminOnly && !isAdmin()) {
    // 需要管理员权限但用户不是管理员时重定向到无权限页面
    return <Navigate to="/unauthorized" replace />;
  }
  
  // 已登录且权限符合要求时渲染子组件
  return children;
  */

// 由于这只是一个示例，先返回children
//   return children;
// };
