import React, { useState } from "react";
import ajaxGateway from "../../utils/ajaxGateway";
import "./index.css";

function Login() {
  const [username, setUsername] = useState(""); // 用户名状态
  const [password, setPassword] = useState(""); // 密码状态
  const [error, setError] = useState(""); // 错误提示状态
  const [loading, setLoading] = useState(false); // 加载状态

  const handleSubmit = async (e) => {
    e.preventDefault(); // 阻止表单默认提交行为
    setError(""); // 清除之前的错误信息
    setLoading(true); // 设置加载状态为true

    try {
      // 发送登录请求
      const response = await ajaxGateway.post("/auth/login", { username, password });

      // 检查响应状态
      if (response.data.code === 200) {
        // 登录成功，从响应中提取数据
        const { token, user, expire } = response.data.data;

        // 将token和用户信息保存到localStorage
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("userInfo", JSON.stringify(user));
        localStorage.setItem("tokenExpire", expire.toString());

        console.log("登录成功！");
        window.location.href = "/";
      } else {
        // 登录失败，显示后端返回的错误信息
        setError(response.data.message || "登录失败，请稍后再试");
      }
    } catch (err) {
      console.error("登录失败：", err);

      // 处理不同类型的错误
      if (err.response) {
        // 服务器返回了错误响应
        const { status, data } = err.response;

        if (status === 401) {
          setError("用户名或密码不正确");
        } else if (status === 400) {
          setError("请求格式不正确，请检查输入");
        } else {
          setError(data.message || "登录失败，请稍后再试");
        }
      } else if (err.request) {
        // 请求已发送但没有收到响应
        setError("服务器无响应，请检查网络连接");
      } else {
        // 请求设置时发生错误
        setError("请求发送失败，请稍后再试");
      }
    } finally {
      setLoading(false); // 无论成功失败，都结束加载状态
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>
        {/* 错误信息展示 */}
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "登录中..." : "登录"}
        </button>
      </form>
    </div>
  );
}

export default Login;
