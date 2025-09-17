import React from 'react';

const GenericSubAppPage = ({ appName, onNavigateToDashboard }) => {
  return (
    <div className="subapp-page w-full max-w-4xl mx-auto p-4">
      <div className="subapp-header">
        <h1 className="subapp-title">{appName || "Sub-aplicação"}</h1>
        <button onClick={onNavigateToDashboard} className="action-button secondary">
          Voltar ao Dashboard
        </button>
      </div>
      <div className="subapp-section">
        <div className="content-placeholder">
          Conteúdo para "{appName}" em desenvolvimento.
        </div>
      </div>
    </div>
  );
};

export default GenericSubAppPage;
