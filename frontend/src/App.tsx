import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/common/Layout';
import Landing from './pages/Landing';
import Swipe from './pages/Swipe';
import Login from './pages/Login';
import Register from './pages/Register';
import ProjectUploadPage from './pages/ProjectUpload';
import Search from './pages/Search';
import Profile from './pages/Profile';
import MyProjects from './pages/MyProjects';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            {/* 门户页面 */}
            <Route path="/" element={<Landing />} />
            
            {/* 认证路由 */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* 主应用路由 */}
            <Route path="/app" element={<Swipe />} />
            <Route path="/app/feed" element={<Layout />}>
              <Route index element={<Swipe />} />
              <Route path="upload" element={<ProjectUploadPage />} />
              <Route path="search" element={<Search />} />
              <Route path="my-projects" element={<MyProjects />} />
              <Route path="profile/:id" element={<Profile />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* 404 重定向 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
