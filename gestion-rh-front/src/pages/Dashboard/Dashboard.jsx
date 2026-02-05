import { useState } from "react";
import SocietesTab from "./tabs/SocietesTab";
import ServicesTab from "./tabs/ServicesTab";
import SalariesTab from "./tabs/SalariesTab";
import StagiairesTab from "./tabs/StagiairesTab";
import './Dashboard.css';

const tabs = [
  { key: "societes", label: "Sociétés" },
  { key: "services", label: "Services" },
  { key: "salaries", label: "Salariés" },
  { key: "stagiaires", label: "Stagiaires" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("societes");

  return (
    <div className="dashboard-container p-6 min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="dashboard-content p-6 max-w-7xl mx-auto">
        <h1 className="dashboard-title text-3xl font-bold mb-8">Gestion</h1>

        {/* Tabs */}
        <div className="tabs-container mb-8">
          <div className="tabs-list">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`tab-button transition-all duration-300 ${
                  activeTab === tab.key 
                    ? 'active text-indigo-600' 
                    : 'text-gray-500 hover:text-indigo-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="tab-content">
          {activeTab === "societes" && <SocietesTab />}
          {activeTab === "services" && <ServicesTab />}
          {activeTab === "salaries" && <SalariesTab />}
          {activeTab === "stagiaires" && <StagiairesTab />}
        </div>
      </div>
    </div>
  );
}