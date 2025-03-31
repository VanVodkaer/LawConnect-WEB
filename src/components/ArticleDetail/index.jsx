import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ajaxGateway from "../../utils/ajaxGateway";
import "./index.css";

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 从 localStorage 获取用户信息
  const isAuthenticated = localStorage.getItem("jwtToken") ? true : false;
  const currentUser = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : { id: 0, role: 1 }; // 添加 role 属性，默认为普通用户(1)
  const isAdmin = currentUser.role === 2; // 检查是否为管理员

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likingComment, setLikingComment] = useState(null);
  const [deletingComment, setDeletingComment] = useState(null);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [message, setMessage] = useState({ type: "", content: "" });

  // 显示消息通知
  const showMessage = (type, content) => {
    setMessage({ type, content });
    setTimeout(() => setMessage({ type: "", content: "" }), 3000);
  };

  // 获取文章和评论数据
  const fetchArticleData = () => {
    setLoading(true);
    setError(null);

    ajaxGateway
      .get(`/public/article/${id}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          setArticle(response.data.data.article);

          // 为评论添加默认的点赞状态并保留用户ID信息
          const commentsWithLikedState = (response.data.data.comments || []).map((comment) => ({
            ...comment,
            liked: false, // 默认未点赞
          }));

          setComments(commentsWithLikedState);

          // 如果用户已登录，获取评论点赞状态
          if (isAuthenticated && commentsWithLikedState.length > 0) {
            fetchCommentsLikeStatus(commentsWithLikedState);
          }
        } else {
          setError(response.data.message || "加载文章失败");
        }
      })
      .catch((err) => {
        setError("加载文章失败");
        console.error("Fetch article error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 获取文章点赞状态
  const fetchArticleLikeStatus = () => {
    if (!isAuthenticated) return;

    ajaxGateway
      .get(`/api/article/${id}/like`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          setLiked(response.data.data.liked);
        }
      })
      .catch((err) => {
        console.error("Fetch like status error:", err);
      });
  };

  // 获取评论点赞状态
  const fetchCommentsLikeStatus = (commentsList) => {
    if (!isAuthenticated || !commentsList.length) return;

    // 为了减少请求数量，可以考虑实现一个批量检查点赞状态的API
    // 这里暂时按单个评论检查
    const promises = commentsList.map((comment) =>
      ajaxGateway
        .get(`/api/comment/${comment.id}/like`)
        .then((response) => {
          if (response.data && response.data.code === 200) {
            return {
              id: comment.id,
              liked: response.data.data.liked,
            };
          }
          return null;
        })
        .catch((err) => {
          console.error(`Fetch comment ${comment.id} like status error:`, err);
          return null;
        })
    );

    Promise.all(promises).then((results) => {
      const validResults = results.filter((result) => result !== null);
      if (validResults.length > 0) {
        setComments((prevComments) =>
          prevComments.map((comment) => {
            const matchResult = validResults.find((result) => result.id === comment.id);
            if (matchResult) {
              return { ...comment, liked: matchResult.liked };
            }
            return comment;
          })
        );
      }
    });
  };

  useEffect(() => {
    fetchArticleData();
    fetchArticleLikeStatus();
  }, [id, isAuthenticated]);

  // 格式化日期显示
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(
      2,
      "0"
    )} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  // 处理文章点赞
  const handleLikeArticle = () => {
    if (!isAuthenticated) {
      setLoginModalVisible(true);
      return;
    }

    const apiCall = liked ? ajaxGateway.delete(`/api/article/${id}/like`) : ajaxGateway.post(`/api/article/${id}/like`);

    apiCall
      .then((response) => {
        if (response.data && response.data.code === 200) {
          setLiked(!liked);
          // 更新文章点赞数
          setArticle({
            ...article,
            likes: liked ? article.likes - 1 : article.likes + 1,
          });
          showMessage("success", liked ? "已取消点赞" : "点赞成功");
        } else {
          showMessage("error", response.data.message || "操作失败");
        }
      })
      .catch((err) => {
        console.error("Like article error:", err);
        showMessage("error", err.response?.data?.message || "操作失败");
      });
  };

  // 处理评论点赞
  const handleLikeComment = (commentId) => {
    if (!isAuthenticated) {
      setLoginModalVisible(true);
      return;
    }

    setLikingComment(commentId);

    // 找到当前评论并检查是否已点赞
    const comment = comments.find((c) => c.id === commentId);
    const isCommentLiked = comment.liked;

    const apiCall = isCommentLiked
      ? ajaxGateway.delete(`/api/comment/${commentId}/like`)
      : ajaxGateway.post(`/api/comment/${commentId}/like`);

    apiCall
      .then((response) => {
        if (response.data && response.data.code === 200) {
          // 更新评论点赞状态
          const updatedComments = comments.map((c) => {
            if (c.id === commentId) {
              return {
                ...c,
                liked: !c.liked,
                likes: c.liked ? c.likes - 1 : c.likes + 1,
              };
            }
            return c;
          });

          setComments(updatedComments);
          showMessage("success", isCommentLiked ? "已取消点赞" : "点赞成功");
        } else {
          showMessage("error", response.data.message || "操作失败");
        }
      })
      .catch((err) => {
        console.error("Like comment error:", err);
        showMessage("error", err.response?.data?.message || "操作失败");
      })
      .finally(() => {
        setLikingComment(null);
      });
  };

  // 提交评论
  const handleSubmitComment = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setLoginModalVisible(true);
      return;
    }

    if (!commentContent.trim()) {
      showMessage("warning", "评论内容不能为空");
      return;
    }

    setSubmitting(true);

    ajaxGateway
      .post(`/api/article/${id}/comment`, { content: commentContent })
      .then((response) => {
        if (response.data && response.data.code === 200) {
          showMessage("success", "评论发表成功");
          setCommentContent("");
          // 刷新评论列表
          fetchArticleData();
        } else {
          showMessage("error", response.data.message || "评论发表失败");
        }
      })
      .catch((err) => {
        console.error("Submit comment error:", err);
        showMessage("error", err.response?.data?.message || "评论发表失败");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  // 确认删除评论对话框
  const confirmDeleteComment = (commentId) => {
    if (!isAuthenticated) {
      setLoginModalVisible(true);
      return;
    }

    // 找到要删除的评论
    const commentToDelete = comments.find((c) => c.id === commentId);
    if (!commentToDelete) return;

    // 检查权限：只有评论作者或管理员可以删除评论
    if (commentToDelete.user_id !== currentUser.id && !isAdmin) {
      showMessage("error", "您没有权限删除此评论");
      return;
    }

    setCommentToDelete(commentId);
    setDeleteModalVisible(true);
  };

  // 执行删除评论
  const handleDeleteComment = () => {
    if (!commentToDelete) return;

    setDeletingComment(commentToDelete);

    ajaxGateway
      .delete(`/api/comment/${commentToDelete}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          // 从评论列表中移除被删除的评论
          // 或者可以将其标记为已删除，但仍然显示"此评论已被删除"
          const updatedComments = comments.filter((c) => c.id !== commentToDelete);
          setComments(updatedComments);

          // 更新文章评论计数
          if (article) {
            setArticle({
              ...article,
              comment_count: Math.max(0, article.comment_count - 1),
            });
          }

          showMessage("success", "评论已删除");
        } else {
          showMessage("error", response.data.message || "删除评论失败");
        }
      })
      .catch((err) => {
        console.error("Delete comment error:", err);
        showMessage("error", err.response?.data?.message || "删除评论失败");
      })
      .finally(() => {
        setDeletingComment(null);
        setCommentToDelete(null);
        setDeleteModalVisible(false);
      });
  };

  // 跳转到登录页
  const redirectToLogin = () => {
    setLoginModalVisible(false);
    navigate("/login", { state: { from: `/article/${id}` } });
  };

  // 判断用户是否可以删除评论
  const canDeleteComment = (commentUserId) => {
    return isAuthenticated && (isAdmin || currentUser.id === commentUserId);
  };

  if (loading) return <div className="loading">加载中...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!article) return <div className="not-found">文章不存在</div>;

  return (
    <div className="article-detail-container">
      {/* 消息提示 */}
      {message.content && <div className={`message-notification ${message.type}`}>{message.content}</div>}

      <div className="article-header">
        <h1 className="article-title">{article.title}</h1>
        <div className="article-meta">
          <span className="article-date">发布时间：{formatDate(article.created_at)}</span>
          <div className="article-interactions">
            <button className={`like-button ${liked ? "liked" : ""}`} onClick={handleLikeArticle}>
              <span className="like-icon">{liked ? "❤️" : "♡"}</span>
              <span className="like-count">{article.likes}</span>
            </button>
            <span className="article-comments-count">
              <span className="comment-icon">💬</span> {article.comment_count}
            </span>
          </div>
        </div>
      </div>

      <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />

      <div className="article-comments-section">
        <h3 className="comments-title">评论 ({comments.length})</h3>

        <div className="comment-form">
          <div className="comment-avatar">
            <div className="avatar-placeholder">{currentUser?.username?.charAt(0) || "游"}</div>
          </div>
          <div className="comment-input-container">
            <form onSubmit={handleSubmitComment} className="comment-form-inner">
              <textarea
                rows="3"
                placeholder={isAuthenticated ? "发表你的评论..." : "登录后发表评论"}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                disabled={!isAuthenticated || submitting}
                className="comment-textarea"
              />
              <div className="comment-form-actions">
                {isAuthenticated ? (
                  <button type="submit" className="submit-button" disabled={!commentContent.trim() || submitting}>
                    {submitting ? "发送中..." : "发表评论"}
                  </button>
                ) : (
                  <button type="button" className="login-button" onClick={() => setLoginModalVisible(true)}>
                    登录后评论
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {comments.length > 0 ? (
          <div className="comments-list">
            {comments.map((comment) => (
              <div className="comment-item" key={comment.id}>
                <div className="comment-user">
                  <div className="comment-avatar">
                    <div className="avatar-placeholder">{comment.user_id}</div>
                  </div>
                  <span className="comment-username">
                    用户{comment.user_id}
                    {canDeleteComment(comment.user_id) && (
                      <button
                        className="delete-comment-button"
                        onClick={() => confirmDeleteComment(comment.id)}
                        disabled={deletingComment === comment.id}>
                        {deletingComment === comment.id ? "删除中..." : "删除"}
                      </button>
                    )}
                  </span>
                </div>
                <div className="comment-content">{comment.content}</div>
                <div className="comment-meta">
                  <span className="comment-date">{formatDate(comment.created_at)}</span>
                  <button
                    className={`comment-like-button ${comment.liked ? "liked" : ""}`}
                    onClick={() => handleLikeComment(comment.id)}
                    disabled={likingComment === comment.id}>
                    <span className="like-icon">{comment.liked ? "❤️" : "♡"}</span>
                    {comment.likes > 0 && <span className="like-count">{comment.likes}</span>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-comments">暂无评论，快来发表第一条评论吧！</div>
        )}
      </div>

      {/* 登录提示弹窗 */}
      {loginModalVisible && (
        <div className="modal-overlay">
          <div className="login-modal">
            <h3>需要登录</h3>
            <p>您需要登录后才能进行此操作。是否前往登录页面？</p>
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setLoginModalVisible(false)}>
                取消
              </button>
              <button className="login-button-primary" onClick={redirectToLogin}>
                去登录
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除评论确认弹窗 */}
      {deleteModalVisible && (
        <div className="modal-overlay">
          <div className="login-modal">
            <h3>确认删除</h3>
            <p>确定要删除这条评论吗？此操作不可撤销。</p>
            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => {
                  setDeleteModalVisible(false);
                  setCommentToDelete(null);
                }}>
                取消
              </button>
              <button className="delete-button" onClick={handleDeleteComment}>
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticleDetail;
