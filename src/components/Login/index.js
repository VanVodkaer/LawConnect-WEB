import "./index.css";

function Login() {
  return (
    <div className="login-container">
      <h1>登录</h1>
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="username">用户名：</label>
          <input type="text" id="username" name="username" />
        </div>
        <div className="form-group">
          <label htmlFor="password">密码：</label>
          <input type="password" id="password" name="password" />
        </div>
        <button type="submit">登录</button>
      </form>
    </div>
  );
}

export default Login;
