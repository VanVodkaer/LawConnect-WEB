import React, { useState, useEffect, useMemo } from "react";
import ajaxGateway from "../../utils/ajaxGateway";
import "./index.css";

function Home({ defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab || "lawForum");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("最新动态");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 默认子类别映射
  const defaultCategories = useMemo(
    () => ({
      lawForum: "最新动态",
      policy: "最新政策",
      offlineEvents: "线下联动",
    }),
    []
  );

  // API 接口映射，根据 tab 和子类别确定请求地址
  const endpointMap = useMemo(
    () => ({
      lawForum: {
        最新动态: "/public/community/latest",
        最热帖子: "/public/community/hottest",
        热门问答: "/public/community/hotqa",
      },
      policy: {
        最新政策: "/public/policy/latest",
        地方政策: "/public/policy/local",
        政策解读: "/public/policy/interpretation",
      },
      offlineEvents: {
        线下联动: "/public/offline/cooperation",
        线上活动: "/public/offline/online",
        报名中心: "/public/offline/registration",
      },
    }),
    []
  );

  // 当 defaultTab 变化时，更新 activeTab 与默认子类别
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
      setActiveCategory(defaultCategories[defaultTab] || "最新动态");
    }
  }, [defaultCategories, defaultTab]);

  // 当 activeTab 或 activeCategory 变化时，发起接口请求加载数据
  useEffect(() => {
    const endpoint = endpointMap[activeTab][activeCategory];
    if (!endpoint) return;

    setLoading(true);
    setError(null);
    ajaxGateway
      .get(endpoint)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          // 若返回的数据为 null，则赋值为空数组，避免 null.length 报错
          setArticles(response.data.data || []);
        } else {
          setError(response.data.message || "加载数据失败");
        }
      })
      .catch((err) => {
        setError("加载数据失败");
        console.error("Fetch articles error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeTab, activeCategory, endpointMap]);

  // 切换 tab 时同时更新默认子类别
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setActiveCategory(defaultCategories[tab]);
  };

  // 切换子类别
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  // 搜索事件（保持原逻辑）
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("搜索:", searchQuery);
  };

  // 渲染当前 tab 下的内容区域
  const renderTabContent = () => {
    return (
      <div className="subtab-container">
        <div className="subtab-header">
          <h3 className="subtab-title">
            {activeTab === "lawForum" ? "法学交流社区" : activeTab === "policy" ? "政策推送专区" : "线下实践平台"}
          </h3>
        </div>
        <div className="subtab-categories">
          {Object.keys(endpointMap[activeTab]).map((category) => (
            <div
              key={category}
              className={`category-item ${activeCategory === category ? "active" : ""}`}
              onClick={() => handleCategoryClick(category)}>
              {category}
            </div>
          ))}
        </div>
        <div className="content-list">
          {loading ? (
            <div>加载中...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : articles.length > 0 ? (
            articles.map((item, index) => (
              <div className="list-item" key={item.id}>
                <span className="item-number">{index + 1}.</span>
                <span className="item-content">{item.title}</span>
              </div>
            ))
          ) : (
            <div className="no-data">暂无数据</div>
          )}
          <div className="list-more">...</div>
        </div>
      </div>
    );
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
