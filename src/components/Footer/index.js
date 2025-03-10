import React from "react";
import "./index.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-divider"></div>

        <div className="footer-content">
          <div className="footer-item">
            <span className="footer-label">联系我们：</span>
            <span className="footer-info">admin@lawknowledge.com</span>
          </div>

          <div className="footer-item">
            <span className="footer-label">地址：</span>
            <span className="footer-info">湖北大学123456</span>
          </div>

          <div className="footer-item">
            <span className="footer-label">版权：</span>
            <span className="footer-info">© 2025 法聚知行 版权所有</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
