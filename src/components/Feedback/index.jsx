import "./index.css";

function Feedback() {
  return (
    <div className="login-container">
      <h1>意见反馈</h1>
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="email">联系方式：</label>
          <input type="email" id="email" name="email" />
        </div>
        <div className="form-group">
          <label htmlFor="subject">主题：</label>
          <input type="text" id="subject" name="subject" />
        </div>
        <div className="form-group">
          <label htmlFor="message">反馈内容：</label>
          <textarea id="message" name="message" rows="5" className="feedback-textarea"></textarea>
        </div>
        <button type="submit">提交反馈</button>
      </form>
    </div>
  );
}

export default Feedback;
