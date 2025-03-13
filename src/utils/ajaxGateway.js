import axios from "axios";

// 创建axios实例
const ajaxGateway = axios.create({
  baseURL: import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:8080", // 从环境变量获取API基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
ajaxGateway.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem("jwtToken");

    // 如果token存在，则添加到请求头中
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // 请求错误处理
    console.error("请求拦截器错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
ajaxGateway.interceptors.response.use(
  (response) => {
    // 直接返回响应数据
    return response;
  },
  (error) => {
    if (error.response) {
      // 服务器返回错误状态码
      switch (error.response.status) {
        case 401: // 未授权
          // 清除本地存储的token和用户信息
          if (error.response.data.message === "认证令牌已过期" || error.response.data.message === "无效的认证令牌") {
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("userInfo");
            localStorage.removeItem("tokenExpire");

            // 可以根据需要重定向到登录页面
            // window.location.href = '/login';
          }
          break;
        case 403: // 禁止访问
          console.error("没有权限访问该资源");
          break;
        case 500: // 服务器错误
          console.error("服务器错误");
          break;
        default:
          console.error("请求失败:", error.response.data);
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error("服务器无响应");
    } else {
      // 请求设置时发生错误
      console.error("请求错误:", error.message);
    }

    return Promise.reject(error);
  }
);

// 检查token是否过期
export const checkTokenExpiration = () => {
  const expireTime = localStorage.getItem("tokenExpire");

  if (expireTime) {
    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime > parseInt(expireTime)) {
      // token已过期，清除用户信息
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("tokenExpire");
      return true; // 返回true表示token已过期
    }
  }

  return false; // 返回false表示token未过期或不存在
};

export default ajaxGateway;
