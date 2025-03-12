// ajaxGateway.js
import axios from "axios";

const ajaxGateway = axios.create({
  baseURL: "http://localhost:", // 替换成你的接口地址
});

// 添加请求拦截器
ajaxGateway.interceptors.request.use(
  (config) => {
    // 从本地存储中获取JWT token
    const token = localStorage.getItem("jwtToken");
    if (token) {
      // 设置请求头 Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error);
  }
);

export default ajaxGateway;
