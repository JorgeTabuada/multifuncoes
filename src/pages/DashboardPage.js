import React from 'react';
import AppLogo from '../components/common/AppLogo';
import { subAppsData, orderedCategoryNames, parks } from '../data/subAppsData';

const DashboardPage = ({ user, onLogout, onNavigateToApp, selectedPark, setSelectedPark }) => {
  const appsByCategory = subAppsData.reduce((acc, app) => {
    if (!acc[app.category]) acc[app.category] = [];
    acc[app.category].push(app);
    return acc;
  }, {});

  for (const category in appsByCategory) {
    appsByCategory[category].sort((a, b) => {
      if (category === 'Gestão') {
        if (a.id === 'hub_multipark') return 1;
        if (b.id === 'hub_multipark') return -1;
      }
      return a.name.localeCompare(b.name);
    });
  }

  return (
    <div className="app-container">
      <div className="main-content-container">
        <AppLogo />
        <div className="welcome-message">
          BEM-VINDO DE VOLTA, <span id="userName">{user?.fullName?.toUpperCase() || 'UTILIZADOR'}</span>!
        </div>
        <div className="park-selector-buttons-container mb-6 flex justify-center space-x-2 w-full max-w-md">
          {parks.map(park => (
            <button
              key={park.value}
              onClick={() => setSelectedPark(park.value)}
              className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                selectedPark === park.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
              }`}
            >
              {park.label}
            </button>
          ))}
        </div>
        <main id="categoriesLayoutContainer" className="w-full">
          {orderedCategoryNames.map(categoryName => (
            <div key={categoryName} className="category-group">
              <h2 className="category-title">{categoryName}</h2>
              <div className="dashboard-grid">
                {appsByCategory[categoryName]?.map(app => (
                  <button
                    key={app.id}
                    className="subapp-button-dashboard"
                    onClick={() => onNavigateToApp(app.id, app.name)}
                  >
                    {app.name}
                  </button>
                ))}
                {(!appsByCategory[categoryName] || appsByCategory[categoryName].length === 0) && (
                  <p className="text-xs text-gray-500 p-4">Sem aplicações nesta categoria.</p>
                )}
              </div>
            </div>
          ))}
        </main>
        <div className="logout-button-container">
          <button id="logoutButton" onClick={onLogout} className="w-full">
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
