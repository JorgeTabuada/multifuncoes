import React from 'react';

const GlobalStyles = () => (
  <style>{`
    body {
      font-family: 'Inter', sans-serif;
      background-color: #f0f2f5;
      color: #333;
      margin: 0;
      line-height: 1.6;
    }
    
    .app-container, .subapp-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
    }
    
    .main-content-container {
      background-color: #f0f2f5;
      padding: 1rem;
      border-radius: 0.5rem;
      width: 100%;
      max-width: 1200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 2rem;
      margin-bottom: 2rem;
    }
    
    .login-box {
      background-color: #fff;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    
    .app-logo-styled {
      font-size: 1.85rem;
      font-weight: 700;
      color: #0A2B5C;
      margin-bottom: 2rem;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: 0.5px;
    }
    
    .app-logo-styled .logo-p-icon {
      background-color: #0A2B5C;
      color: #fff;
      padding: 4px 10px;
      margin-right: 6px;
      border-radius: 4px;
      font-family: 'Arial Black', Gadget, sans-serif;
      font-size: 1.9rem;
      line-height: 1;
    }
    
    .app-logo-styled .logo-text-multipark {
      color: #0A2B5C;
    }
    
    .welcome-message {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 1rem;
      text-align: center;
    }
    
    #categoriesLayoutContainer {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1.5rem;
      width: 100%;
      margin-bottom: 2rem;
    }
    
    @media (min-width: 768px) {
      #categoriesLayoutContainer {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    .category-group {
      padding: 1rem;
      background-color: #fff;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      display: flex;
      flex-direction: column;
      min-height: 200px;
    }
    
    .category-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #0A2B5C;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #0d6efd;
    }
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0.75rem;
      width: 100%;
      flex-grow: 1;
    }
    
    .subapp-button-dashboard {
      background-color: #fff;
      color: #0d6efd;
      border: 1px solid #0d6efd;
      border-radius: 0.375rem;
      padding: 0.75rem 0.5rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 80px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      font-size: 0.8rem;
      word-break: break-word;
      font-weight: 600;
      line-height: 1.2;
    }
    
    .subapp-button-dashboard:hover {
      background-color: #0d6efd;
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .logout-button-container {
      width: 100%;
      max-width: 320px;
      margin-top: 1rem;
    }
    
    #logoutButton, .action-button {
      color: white;
      font-weight: 500;
      padding: 0.6rem 1.2rem;
      border-radius: 0.375rem;
      transition: background-color 0.2s;
      border: none;
      cursor: pointer;
      width: 100%;
    }
    
    #loginButton {
      background-color: #0d6efd;
      color: white;
      font-weight: 600;
      padding: 0.75rem;
      border-radius: 0.375rem;
    }
    
    #loginButton:hover {
      background-color: #0b5ed7;
    }
    
    #logoutButton {
      background-color: #dc3545;
    }
    
    #logoutButton:hover {
      background-color: #c82333;
    }
    
    .action-button {
      background-color: #0d6efd;
      width: auto;
    }
    
    .action-button:hover {
      background-color: #0b5ed7;
    }
    
    .action-button.secondary {
      background-color: #6c757d;
    }
    
    .action-button.secondary:hover {
      background-color: #5a6268;
    }
    
    .subapp-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: #fff;
      border-radius: 0.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 1.5rem;
    }
    
    .subapp-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #0A2B5C;
    }
    
    .subapp-section {
      width: 100%;
      background-color: #fff;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      margin-bottom: 1.5rem;
    }
    
    .subapp-section-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #eee;
    }
    
    .filters-grid, .actions-container {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
      align-items: flex-end;
    }
    
    .filters-grid > div {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-width: 150px;
    }
    
    .filters-grid label {
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
      color: #555;
    }
    
    .filters-grid input[type="text"],
    .filters-grid input[type="date"],
    .filters-grid input[type="datetime-local"],
    .filters-grid select {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 0.25rem;
      font-size: 0.9rem;
      width: 100%;
    }
    
    .table-container {
      overflow-x: auto;
      margin-top: 1rem;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
      font-size: 0.9em;
      white-space: nowrap;
    }
    
    th {
      background-color: #f2f2f2;
      font-weight: 600;
    }
    
    .content-placeholder {
      min-height: 150px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 2px dashed #ddd;
      border-radius: 0.25rem;
      color: #777;
      text-align: center;
      padding: 1rem;
    }
    
    .form-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1050;
    }
    
    .form-modal-dialog {
      background-color: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      width: 100%;
      max-width: 600px;
    }
    
    .modal-content {
      background-color: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      width: 100%;
      max-width: 400px;
      text-align: center;
    }
    
    .form-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0.75rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }
    
    .form-modal-title {
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    .form-modal-body .form-group {
      margin-bottom: 1rem;
    }
    
    .form-modal-body .form-group label {
      display: block;
      margin-bottom: 0.3rem;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .form-modal-body .form-group input,
    .form-modal-body .form-group select,
    .form-modal-body .form-group textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 0.25rem;
      font-size: 0.9rem;
    }
    
    .form-modal-footer {
      padding-top: 1rem;
      margin-top: 1rem;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
    
    input, select {
      box-sizing: border-box;
    }
  `}</style>
);

export default GlobalStyles;
