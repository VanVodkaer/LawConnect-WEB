// Login.js
import React, { useState } from "react";
import ajaxGateway from "../../utils/ajaxGateway";
import "./index.css";

function Login() {
  const [username, setUsername] = useState(""); // 用户名状态
  const [password, setPassword] = useState(""); // 密码状态
  const [error, setError] = useState(""); // 错误提示状态

  const handleSubmit = async (e) => {
    e.preventDefault(); // 阻止表单默认提交行为
    setError(""); // 清除之前的错误信息

    try {
      // 发送登录请求（假设接口为 /login）
      const response = await ajaxGateway.post("/login", { username, password });
      // 假设后端返回的数据中包含 token 字段
      const { token } = response.data;
      if (token) {
        // 将 token 保存到 localStorage 中
        localStorage.setItem("jwtToken", token);
        console.log("登录成功！");
        // 可在此处添加页面跳转逻辑，例如使用 react-router 的 useNavigate
        // navigate('/dashboard');
      }
    } catch (err) {
      console.error("登录失败：", err);
      setError("登录失败，请检查用户名和密码！");
    }
  };

  return (
    <div className="login-container">
      <h1>登录</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">用户名：</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="请输入用户名"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">密码：</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            required
          />
        </div>
        {/* 错误信息展示 */}
        {error && <div className="error">{error}</div>}
        <button type="submit">登录</button>
      </form>
    </div>
  );
}

export default Login;
