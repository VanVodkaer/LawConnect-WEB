import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";
import { isAuthenticated, logout } from "../../utils/auth";

function Navbar() {
  const [currentDate, setCurrentDate] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // 检查用户登录状态
  useEffect(() => {
    // 获取当前日期
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    setCurrentDate(formattedDate);

    // 检查localStorage中是否有token和用户信息
    if (isAuthenticated()) {
      setIsLoggedIn(true);
      try {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        setUsername(user.username || "用户");
      } catch (error) {
        console.error("解析用户信息失败", error);
        setUsername("用户");
      }
    } else {
      setIsLoggedIn(false);
      setUsername("");
    }
  }, []);

  function handlelogout() {
    logout();
    setIsLoggedIn(false);
    setUsername("");
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          首页
        </Link>
        <div className="navbar-date">{currentDate}</div>
        <ul className="navbar-menu">
          {/* 根据登录状态显示不同的导航项 */}
          {isLoggedIn ? (
            <>
              <li className="navbar-item navbar-user">
                <span className="username">{username}</span>
              </li>
              <li className="navbar-item">
                <button onClick={handlelogout} className="logout-button">
                  退出登录
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <Link to="/login" className="navbar-link">
                  登录
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/register" className="navbar-link">
                  注册
                </Link>
              </li>
            </>
          )}
          <li className="navbar-item">
            <Link to="/feedback" className="navbar-link">
              意见建议
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/help" className="navbar-link">
              使用帮助
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
