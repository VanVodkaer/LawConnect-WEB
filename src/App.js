import "./App.css";

import Navbar from "./components/Navbar";
import TabNav from "./components/TabNav";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content w">
        <TabNav />
      </div>
      <Footer />
    </div>
  );
}

export default App;
