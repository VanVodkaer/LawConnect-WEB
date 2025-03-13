import React, { useState } from "react";
import ajaxGateway from "../../utils/ajaxGateway";
import "./index.css";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  // 表单状态
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // 错误状态
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  // 加载和成功状态
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  // 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // 清除相应字段的错误提示
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // 验证表单
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // 验证用户名
    if (!formData.username.trim()) {
      newErrors.username = "用户名不能为空";
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "用户名长度不能少于3个字符";
      isValid = false;
    }

    // 验证邮箱
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "邮箱不能为空";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "请输入有效的邮箱地址";
      isValid = false;
    }

    // 验证密码
    if (!formData.password) {
      newErrors.password = "密码不能为空";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "密码长度不能少于6个字符";
      isValid = false;
    }

    // 验证确认密码
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "两次输入的密码不一致";
      isValid = false;
    }

    setErrors({
      ...errors,
      ...newErrors,
    });

    return isValid;
  };

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 表单验证
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({ ...errors, general: "" });

    try {
      // 发送注册请求
      const response = await ajaxGateway.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // 检查响应状态
      if (response.data.code === 200) {
        // 注册成功
        setSuccess(true);
        // 清空表单
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // 显示成功消息3秒后可以跳转到登录页面
        setTimeout(() => {
          navigate("/login");

          setSuccess(false);
        }, 3000);
      } else {
        // 处理其他状态码
        setErrors({
          ...errors,
          general: response.data.message || "注册失败，请稍后再试",
        });
      }
    } catch (err) {
      console.error("注册失败：", err);

      // 处理不同类型的错误
      if (err.response) {
        // 服务器返回了错误响应
        const { status, data } = err.response;

        if (status === 400) {
          // 处理表单验证错误
          if (data.message.includes("邮箱")) {
            setErrors({ ...errors, email: data.message });
          } else if (data.message.includes("用户名")) {
            setErrors({ ...errors, username: data.message });
          } else if (data.message.includes("密码")) {
            setErrors({ ...errors, password: data.message });
          } else {
            setErrors({ ...errors, general: data.message });
          }
        } else if (status === 409) {
          // 冲突错误，如用户名或邮箱已存在
          if (data.message.includes("邮箱已存在")) {
            setErrors({ ...errors, email: "该邮箱已被注册" });
          } else if (data.message.includes("用户名已存在")) {
            setErrors({ ...errors, username: "该用户名已被使用" });
          } else {
            setErrors({ ...errors, general: data.message || "注册失败，用户名或邮箱已存在" });
          }
        } else {
          setErrors({ ...errors, general: data.message || "注册失败，请稍后再试" });
        }
      } else if (err.request) {
        // 请求已发送但没有收到响应
        setErrors({ ...errors, general: "服务器无响应，请检查网络连接" });
      } else {
        // 请求设置时发生错误
        setErrors({ ...errors, general: "请求发送失败，请稍后再试" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>注册</h1>

      {/* 成功消息 */}
      {success && <div className="success-message">注册成功！正在跳转到登录页面...</div>}

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">用户名：</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="请输入用户名(至少3个字符)"
            required
            disabled={loading}
          />
          {errors.username && <div className="field-error">{errors.username}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">邮箱：</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="请输入有效的邮箱地址"
            required
            disabled={loading}
          />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password">密码：</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="请输入密码(至少6个字符)"
            required
            disabled={loading}
          />
          {errors.password && <div className="field-error">{errors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">确认密码：</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="请再次输入密码"
            required
            disabled={loading}
          />
          {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
        </div>

        {/* 通用错误信息 */}
        {errors.general && <div className="error">{errors.general}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "注册中..." : "注册"}
        </button>

        {/* 登录链接 */}
        <div className="form-footer">
          已有账号？
          <Link to="/login" className="link">
            立即登录
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
