import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./index.css";

function Home({ defaultTab }) {
  const navigate = useNavigate();
  const location = useLocation();

  // 初始的activeTab根据props或路径设置
  const [activeTab, setActiveTab] = useState(defaultTab || "lawForum");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("最新动态"); // 默认选中法学交流社区的第一个子类别

  // 当defaultTab更改或URL路径更改时更新activeTab
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);

      // 设置相应的默认类别
      if (defaultTab === "lawForum") {
        setActiveCategory("最新动态");
      } else if (defaultTab === "policy") {
        setActiveCategory("最新政策");
      } else if (defaultTab === "offlineEvents") {
        setActiveCategory("线下联动");
      }
    } else {
      // 从URL路径中提取activeTab
      const path = location.pathname.substring(1);
      if (path === "lawForum" || path === "policy" || path === "offlineEvents") {
        setActiveTab(path);

        // 设置相应的默认类别
        if (path === "lawForum") {
          setActiveCategory("最新动态");
        } else if (path === "policy") {
          setActiveCategory("最新政策");
        } else if (path === "offlineEvents") {
          setActiveCategory("线下联动");
        }
      }
    }
  }, [defaultTab, location.pathname]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // 导航到相应的路由
    navigate(`/${tab}`);

    // 重置子类别的默认选中
    if (tab === "lawForum") {
      setActiveCategory("最新动态");
    } else if (tab === "policy") {
      setActiveCategory("最新政策");
    } else if (tab === "offlineEvents") {
      setActiveCategory("线下联动");
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("搜索:", searchQuery);
    // 这里可以添加搜索逻辑
  };

  const renderTabContent = () => {
    const tabContents = {
      lawForum: (
        <div className="subtab-container">
          <div className="subtab-header">
            <h3 className="subtab-title">法学交流社区</h3>
          </div>
          <div className="subtab-categories">
            {["最新动态", "最热帖子", "热门问答"].map((category) => (
              <div
                key={category}
                className={`category-item ${activeCategory === category ? "active" : ""}`}
                onClick={() => handleCategoryClick(category)}>
                {category}
              </div>
            ))}
          </div>
          <div className="content-list">
            <div className="list-item">
              <span className="item-number">1.</span>
              <span className="item-content">最高人民法院关于审理民间借贷案件司法解释研讨</span>
            </div>
            <div className="list-item">
              <span className="item-number">2.</span>
              <span className="item-content">行政诉讼中证据的收集与使用探讨</span>
            </div>
            <div className="list-item">
              <span className="item-number">3.</span>
              <span className="item-content">刑事案件辩护律师的角色定位与职责边界</span>
            </div>
            <div className="list-more">...</div>
          </div>
        </div>
      ),
      policy: (
        <div className="subtab-container">
          <div className="subtab-header">
            <h3 className="subtab-title">政策推送专区</h3>
          </div>
          <div className="subtab-categories">
            {["最新政策", "地方政策", "政策解读"].map((category) => (
              <div
                key={category}
                className={`category-item ${activeCategory === category ? "active" : ""}`}
                onClick={() => handleCategoryClick(category)}>
                {category}
              </div>
            ))}
          </div>
          <div className="content-list">
            <div className="list-item">
              <span className="item-number">1.</span>
              <span className="item-content">关于深化"放管服"改革优化营商环境的实施意见</span>
            </div>
            <div className="list-item">
              <span className="item-number">2.</span>
              <span className="item-content">民法典实施后相关配套规定的解读与适用</span>
            </div>
            <div className="list-item">
              <span className="item-number">3.</span>
              <span className="item-content">最高法发布环境资源审判工作新规定及解读</span>
            </div>
            <div className="list-more">...</div>
          </div>
        </div>
      ),
      offlineEvents: (
        <div className="subtab-container">
          <div className="subtab-header">
            <h3 className="subtab-title">线下实践平台</h3>
          </div>
          <div className="subtab-categories">
            {["线下联动", "线上活动", "报名中心"].map((category) => (
              <div
                key={category}
                className={`category-item ${activeCategory === category ? "active" : ""}`}
                onClick={() => handleCategoryClick(category)}>
                {category}
              </div>
            ))}
          </div>
          <div className="content-list">
            <div className="list-item">
              <span className="item-number">1.</span>
              <span className="item-content">2025年春季法学研讨会报名通知</span>
            </div>
            <div className="list-item">
              <span className="item-number">2.</span>
              <span className="item-content">模拟法庭大赛活动预告</span>
            </div>
            <div className="list-item">
              <span className="item-number">3.</span>
              <span className="item-content">法律援助志愿者招募计划</span>
            </div>
            <div className="list-more">...</div>
          </div>
        </div>
      ),
    };

    return tabContents[activeTab];
  };

  return (
    <div className="tab-container">
      <div className="tab-header">
        <h1 className="tab-title">法聚知行</h1>

        <div className="nav-search-wrapper">
          <ul className="tab-nav">
            <li
              className={`tab-item ${activeTab === "lawForum" ? "active" : ""}`}
              onClick={() => handleTabClick("lawForum")}>
              法学交流社区
            </li>
            <li
              className={`tab-item ${activeTab === "policy" ? "active" : ""}`}
              onClick={() => handleTabClick("policy")}>
              政策推送专区
            </li>
            <li
              className={`tab-item ${activeTab === "offlineEvents" ? "active" : ""}`}
              onClick={() => handleTabClick("offlineEvents")}>
              线下实践平台
            </li>
          </ul>

          <div className="search-container">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="搜索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                搜索
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
}

export default Home;
