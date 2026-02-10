import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";

import EditServiceModal from "../../../modals/EditServiceModal";
import ViewServiceModal from "../../../modals/ViewServiceModal";
import DeleteServiceModal from "../../../modals/DeleteServiceModal";

export default function ServicesTab() {
  const { user } = useAuth();
  const isRH = user?.role === "RH";

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Fetch services
  useEffect(() => {
    api
      .get("/service")
      .then((res) => setServices(res.data.data ?? res.data))
      .catch((err) => console.error(err));
  }, []);

  // Open modal
  const openModal = (type, service) => {
    setSelectedService(service);
    setActiveModal(type);
  };

  const closeModal = () => {
    setSelectedService(null);
    setActiveModal(null);
  };

  // Update service in state
  const updateServiceInState = (updatedService) => {
    setServices((prev) =>
      prev.map((s) => (s.id === updatedService.id ? updatedService : s))
    );
  };

  // Delete service
  const deleteService = async (service) => {
    try {
      await api.delete(`/service/${service.id}`);
      setServices((prev) => prev.filter((s) => s.id !== service.id));
    } catch (err) {
      console.error("Erreur lors de la suppression :", err.response?.data || err);
      alert(err.response?.data?.message || "Erreur inconue");
    }
  };

    const fetchServices = (page = 1) => {
        api
        .get(`/service?page=${page}`)
        .then((res) => {
            setServices(res.data.data);
            setCurrentPage(res.data.current_page);
            setLastPage(res.data.last_page);
        })
        .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const goNext = () => {
        if (currentPage < lastPage) fetchServices(currentPage + 1);
    };
    const goPrev = () => {
        if (currentPage > 1) fetchServices(currentPage - 1);
    };

  return (
    <>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Société</th>
            {isRH && <th className="p-2 border">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id}>
              <td className="p-2 border">{s.nom}</td>
              <td className="p-2 border">{s.societe?.nom ?? "-"}</td>
              {isRH && (
                <td className="p-2 border space-x-2">
                  <button
                    className="text-blue-600"
                    onClick={() => openModal("view", s)}
                  >
                    Voir
                  </button>
                  <button
                    className="text-orange-600"
                    onClick={() => openModal("edit", s)}
                  >
                    Modifier
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => openModal("delete", s)}
                  >
                    Supprimer
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-2 flex justify-between">
        <button onClick={goPrev} disabled={currentPage === 1} className="btn btn-sm">
          Précédent
        </button>
        <span>
          Page {currentPage} / {lastPage}
        </span>
        <button onClick={goNext} disabled={currentPage === lastPage} className="btn btn-sm">
          Suivant
        </button>
      </div>

      {/* Modals */}
      {activeModal === "view" && (
        <ViewServiceModal service={selectedService} onClose={closeModal} />
      )}

      {activeModal === "edit" && (
        <EditServiceModal
          service={selectedService}
          onClose={closeModal}
          updateServiceInState={updateServiceInState}
        />
      )}

      {activeModal === "delete" && selectedService && (
        <DeleteServiceModal
          service={selectedService} onClose={closeModal} onConfirm={deleteService}
        />
      )}
    </>
  );
}