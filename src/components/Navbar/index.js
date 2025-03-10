import React, { useState, useEffect } from "react";
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
        <a href="/" className="navbar-logo">
          首页
        </a>
        <div className="navbar-date">{currentDate}</div>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <a href="/home" className="navbar-link">
              登录
            </a>
          </li>
          <li className="navbar-item">
            <a href="/lawforum" className="navbar-link">
              注册
            </a>
          </li>
          <li className="navbar-item">
            <a href="/policy" className="navbar-link">
              意见建议
            </a>
          </li>
          <li className="navbar-item">
            <a href="/profile" className="navbar-link">
              使用帮助
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
