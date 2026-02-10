<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StagiaireResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();

        // Encadrant info
        $encadrant = $this->encadrant ? [
            'id' => $this->encadrant->id,
            'nom' => $this->encadrant->nom,
            'prenom' => $this->encadrant->prenom,
        ] : null;

        // Societe and Service names
        $societe = $this->societe ? [
            'id' => $this->societe->id,
            'name' => $this->societe->name ?? $this->societe->nom ?? null,
        ] : null;

        $service = $this->service ? [
            'id' => $this->service->id,
            'name' => $this->service->name ?? $this->service->nom ?? null,
        ] : null;

        // Full access: RH + stagiaire himself + encadrant of this stagiaire
        $fullAccess = $user->role === 'RH' 
                      || ($user->role === 'STAGIAIRE' && $user->id === $this->user_id)
                      || ($user->role !== 'RH' && $this->encadrant_id === $user->salarie->id);

        if ($fullAccess) {
            return [
                'id' => $this->id,
                'cin' => $this->cin,
                'nom' => $this->nom,
                'prenom' => $this->prenom,
                'sexe' => $this->sexe,
                'cv' => $this->cv ? asset('storage/' . ltrim($this->cv, '/')) : null,
                'demande_stage' => $this->demande_stage ? asset('storage/' . ltrim($this->demande_stage, '/')) : null,
                'fiche_reussite' => $this->fiche_reussite ? asset('storage/' . ltrim($this->fiche_reussite, '/')) : null,
                'accord_stage' => $this->accord_stage ? asset('storage/' . ltrim($this->accord_stage, '/')) : null,
                'entreprise_accueil' => $this->entreprise_accueil ? asset('storage/' . ltrim($this->entreprise_accueil, '/')) : null,
                'adresse' => $this->adresse,
                'email' => $this->email,
                'telephone' => $this->telephone,
                'filiere' => $this->filiere,
                'status' => $this->status,
                'date_debut' => $this->date_debut,
                'date_fin' => $this->date_fin,
                'societe' => $this->societe ? [
                'id' => $this->societe->id,
                'nom' => $this->societe->nom
            ] : null,
            'service' => $this->service ? [
                'id' => $this->service->id,
                'nom' => $this->service->nom
            ] : null,
                'encadrant' => $encadrant,
                'user' => $this->whenLoaded('stagiaireUser', function () {
                    return [
                        'id' => $this->stagiaireUser->id,
                        'is_active' => $this->stagiaireUser->is_active,
                        'role' => $this->stagiaireUser->role,
                    ];
                }),
                'photo' => $this->photo ? '/storage/' . $this->photo : null,
                'archived_at' => $this->stagiaireUser->archived_at ?? null,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
            ];
        }

        // Limited access: everyone else
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'photo' => $this->photo ? '/storage/' . $this->photo : null,
            'societe' => $this->societe ? [
                'id' => $this->societe->id,
                'nom' => $this->societe->nom
            ] : null,
            'service' => $this->service ? [
                'id' => $this->service->id,
                'nom' => $this->service->nom
            ] : null,
            'encadrant' => $encadrant,
            'date_debut' => $this->date_debut,
            'date_fin' => $this->date_fin,
        ];
    }
}
