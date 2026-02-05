import React from "react"; 
export default function StagiaireDeleteConfirm({ stagiaire, onClose, onConfirm, }) 
{ 
    if (!stagiaire) return null; 
    
    return ( 
    <div className="modal"> 
        <div className="modal-box max-w-md"> 
            <h2 className="text-lg font-bold mb-3"> Confirmer la suppression </h2> 
            <p className="mb-2"> Voulez-vous vraiment archiver le stagiaire : </p> 
            <p className="font-semibold mb-3"> {stagiaire.nom} {stagiaire.prenom} </p>
            <p className="text-sm text-gray-500"> 
                Le stagiaire sera déplacé vers les archives et pourra être restauré ultérieurement. </p> 
            <div className="modal-action flex justify-end gap-2 mt-4"> 
                <button className="btn btn-outline" onClick={onClose}> Annuler </button> 
                <button className="btn btn-error" onClick={() => { 
                    onConfirm(stagiaire); 
                    onClose(); 
                    }} >
                    Archiver 
                </button> 
            </div> 
        </div> 
    </div> ); }