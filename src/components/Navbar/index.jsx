import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./index.css";

function Navbar() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // 获取当前日期
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    setCurrentDate(formattedDate);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          首页
        </Link>
        <div className="navbar-date">{currentDate}</div>
        <ul className="navbar-menu">
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
