import "./index.css";

function Register() {
  return (
    <div className="login-container">
      <h1>注册</h1>
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="username">用户名：</label>
          <input type="text" id="username" name="username" />
        </div>
        <div className="form-group">
          <label htmlFor="email">邮箱：</label>
          <input type="email" id="email" name="email" />
        </div>
        <div className="form-group">
          <label htmlFor="password">密码：</label>
          <input type="password" id="password" name="password" />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">确认密码：</label>
          <input type="password" id="confirmPassword" name="confirmPassword" />
        </div>
        <button type="submit">注册</button>
      </form>
    </div>
  );
}

export default Register;
