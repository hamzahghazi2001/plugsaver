import React, { useState, useEffect } from 'react';

const SupportPages = () => {
  const [currentView, setCurrentView] = useState('settings');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [searchQuery, setSearchQuery] = useState('');
  const [issueDescription, setIssueDescription] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const supportCategories = [
    'Connectivity Issues',
    'Energy Monitoring Inaccuracies',
    'Notifications and Alerts',
    'Firmware and Updates',
    'Account and Data Issues',
    'Statistics and Reports',
    'Rewards and Incentives',
    'Others'
  ];

  const settingsCategories = [
    { icon: '👤', label: 'Profile Picture' },
    { icon: 'ℹ️', label: 'Personal Information' },
    { icon: '🔄', label: 'Data Sharing Preferences' },
    { icon: '🔒', label: 'Security and Privacy' },
    { icon: '🔔', label: 'Notifications' },
    { icon: '👥', label: 'Members' },
    { icon: '♿', label: 'Accessibility' },
    { icon: '💬', label: 'Support' },
    { icon: '🏠', label: 'Household' },
    { icon: '📊', label: 'Dashboard' }
  ];

  const renderBottomNav = () => (
    <nav className="bottom-nav">
      {['Home', 'Devices', 'Dashboard', 'Rewards', 'Settings'].map((item, index) => (
        <button key={index} className={`nav-item ${item === 'Settings' ? 'active' : ''}`}>
          <span className="nav-icon">
            {item === 'Home' ? '🏠' : 
             item === 'Devices' ? '💡' : 
             item === 'Dashboard' ? '📊' : 
             item === 'Rewards' ? '🏆' : '⚙️'}
          </span>
          <span>{item}</span>
        </button>
      ))}
    </nav>
  );

  const renderSettings = () => (
    <div className="page-container">
      <header className="gradient-header settings">
        <h1>Settings</h1>
      </header>
      <div className="profile-section">
        <div className="avatar">👤</div>
        <div className="user-info">
          <h2>Username</h2>
          <p>Personal Information</p>
          <span>Household Manager</span>
        </div>
      </div>
      <div className="settings-sections">
        <section>
          <h3>Profile</h3>
          <div className="settings-list">
            {settingsCategories.slice(0, 3).map((item, index) => (
              <button key={index} className="settings-item">
                <span>{item.icon}</span>
                <span>{item.label}</span>
                <span className="arrow">›</span>
              </button>
            ))}
          </div>
        </section>
        <section>
          <h3>Account and App</h3>
          <div className="settings-list">
            {settingsCategories.slice(3).map((item, index) => (
              <button key={index} className="settings-item">
                <span>{item.icon}</span>
                <span>{item.label}</span>
                <span className="arrow">›</span>
              </button>
            ))}
          </div>
        </section>
      </div>
      {!isDesktop && renderBottomNav()}
    </div>
  );

  const renderSupport = () => (
    <div className="page-container">
      <header className="gradient-header support">
        <button className="back-button" onClick={() => setCurrentView('settings')}>←</button>
        <h1>Support</h1>
      </header>
      <div className="support-content">
        <h2>How can we help?</h2>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search Support Topics"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="categories-list">
          {supportCategories.map((category, index) => (
            <button 
              key={index} 
              className="category-item"
              onClick={() => category === 'Connectivity Issues' && setCurrentView('connectivity')}
            >
              {category}
              <span className="arrow">›</span>
            </button>
          ))}
        </div>
      </div>
      {!isDesktop && renderBottomNav()}
    </div>
  );

  const renderConnectivityIssues = () => (
    <div className="page-container">
      <header className="gradient-header support">
        <button className="back-button" onClick={() => setCurrentView('support')}>←</button>
        <h1>Support</h1>
      </header>
      <div className="issue-content">
        <h2>Connectivity Issues</h2>
        <p>Describe Your Issue</p>
        <textarea
          value={issueDescription}
          onChange={(e) => setIssueDescription(e.target.value)}
          placeholder="Maximum 150 Words"
          maxLength={150}
        />
        <button 
          className="submit-button"
          onClick={() => setCurrentView('submitted')}
        >
          Submit Ticket
        </button>
      </div>
      {!isDesktop && renderBottomNav()}
    </div>
  );

  const renderTicketSubmitted = () => (
    <div className="page-container">
      <header className="gradient-header support">
        <h1>Support</h1>
      </header>
      <div className="success-content">
        <h2>Your ticket has been submitted to the support team.</h2>
        <button 
          className="done-button"
          onClick={() => setCurrentView('settings')}
        >
          Done
        </button>
      </div>
      {!isDesktop && renderBottomNav()}
    </div>
  );

  return (
    <div className={`app-container ${isDesktop ? 'desktop' : 'mobile'}`}>
      <style>{`
        .app-container {
          min-height: 100vh;
          background: #1a1a1a;
          display: flex;
          justify-content: center;
          padding: 20px;
        }

        .page-container {
          background: white;
          border-radius: 20px;
          width: 100%;
          max-width: 480px;
          position: relative;
          overflow: hidden;
          min-height: 100vh;
        }

        .gradient-header {
          padding: 20px;
          color: white;
          text-align: center;
          position: relative;
        }

        .gradient-header.settings {
          background: linear-gradient(to right, #a18cd1, #fbc2eb);
        }

        .gradient-header.support {
          background: linear-gradient(to right, #ff8177, #ff867a);
        }

        .back-button {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
        }

        .profile-section {
          display: flex;
          padding: 20px;
          gap: 15px;
          border-bottom: 1px solid #eee;
        }

        .avatar {
          width: 60px;
          height: 60px;
          background: #f0f0f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
        }

        .settings-sections {
          padding: 20px;
        }

        .settings-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .settings-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .arrow {
          margin-left: auto;
          color: #999;
        }

        .support-content {
          padding: 20px;
        }

        .search-bar input {
          width: 100%;
          padding: 12px;
          border: 1px solid #eee;
          border-radius: 8px;
          margin: 15px 0;
        }

        .categories-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .category-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          border-bottom: 1px solid #eee;
        }

        .issue-content {
          padding: 20px;
        }

        textarea {
          width: 100%;
          height: 150px;
          padding: 12px;
          border: 1px solid #eee;
          border-radius: 8px;
          margin: 15px 0;
          resize: none;
        }

        .submit-button, .done-button {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 25px;
          background: #ff867a;
          color: white;
          font-size: 16px;
          cursor: pointer;
          margin-top: 20px;
        }

        .success-content {
          padding: 20px;
          text-align: center;
        }

        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          padding: 10px;
          border-top: 1px solid #eee;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          border: none;
          background: none;
          color: #666;
          font-size: 0.8rem;
          cursor: pointer;
        }

        .nav-item.active {
          color: #ff867a;
        }

        @media (min-width: 1024px) {
          .page-container {
            max-width: 960px;
            min-height: auto;
            display: grid;
            grid-template-columns: 250px 1fr;
          }

          .gradient-header {
            grid-column: 1 / -1;
          }

          .settings-sections {
            grid-column: 2;
          }

          .profile-section {
            grid-column: 1;
            flex-direction: column;
            align-items: center;
            text-align: center;
            border-right: 1px solid #eee;
            border-bottom: none;
            height: calc(100vh - 80px);
          }
        }
      `}</style>
      {currentView === 'settings' && renderSettings()}
      {currentView === 'support' && renderSupport()}
      {currentView === 'connectivity' && renderConnectivityIssues()}
      {currentView === 'submitted' && renderTicketSubmitted()}
    </div>
  );
};

export default SupportPages;