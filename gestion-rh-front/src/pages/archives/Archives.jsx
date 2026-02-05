import { useState } from "react";
import SalariesArchiveTab from "./tabs/SalariesArchiveTab";
import StagiairesArchiveTab from "./tabs/StagiairesArchiveTab";
import SocieteArchiveTab from "./tabs/SocieteArchiveTab";
import ServiceArchiveTab from "./tabs/ServiceArchiveTab";

export default function Archives() {
  const [activeTab, setActiveTab] = useState("salaries");

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Archives</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          className={`btn ${activeTab === "salaries" ? "btn-primary" : ""}`}
          onClick={() => setActiveTab("salaries")}
        >
          Salariés archivés
        </button>

        <button
          className={`btn ${activeTab === "stagiaires" ? "btn-primary" : ""}`}
          onClick={() => setActiveTab("stagiaires")}
        >
          Stagiaires archivés
        </button>

        <button
          className={`btn ${activeTab === "societes" ? "btn-primary" : ""}`}
          onClick={() => setActiveTab("societes")}
        >
          Sociétés archivées
        </button>

        <button
          className={`btn ${activeTab === "services" ? "btn-primary" : ""}`}
          onClick={() => setActiveTab("services")}
        >
          Services archivés
        </button>
      </div>

      {/* Content */}
      {activeTab === "salaries" && <SalariesArchiveTab />}
      {activeTab === "stagiaires" && <StagiairesArchiveTab />}
      {activeTab === "societes" && <SocieteArchiveTab />}
      {activeTab === "services" && <ServiceArchiveTab />}
    </>
  );
}
