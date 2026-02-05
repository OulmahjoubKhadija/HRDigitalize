<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SalarieResource extends JsonResource
{
    public function toArray($request)
    {
         $user = $request->user();
         $isAuthenticated = auth()->check();
         $isRH = $isAuthenticated && $user->role === 'RH';
        //  $isOwner = $isAuthenticated && $this->user_id === $user->id;
        $isOwner = $isAuthenticated && $user->salarie_id === $this->id;

        // $user = auth()->user();

        // $isAuthenticated = $user !== null;
        // $isRH = $isAuthenticated && $user->role === 'RH';
        // $isOwner = $isAuthenticated && $this->user_id === $user->id;


        return [
            'id'     => $this->id,
            'photo'  => $this->photo ? asset('storage/' . ltrim($this->photo, '/')) : null,
            'prenom' => $this->prenom,
            'nom'    => $this->nom,
            'poste'  => $this->poste,
            'role'   => $this->role,

            'societe' => $this->societe ? [
                'id' => $this->societe->id,
                'nom' => $this->societe->nom,
            ] : null,

            'service' => $this->service ? [
                'id' => $this->service->id,
                'nom' => $this->service->nom,
            ] : null,

            // Authenticated users
            'email'    => $this->when($isAuthenticated, $this->email),
            'linkedin' => $this->when($isAuthenticated && $this->linkedin, $this->linkedin),
            'github'   => $this->when($isAuthenticated && $this->github, $this->github),

            // Owner OR RH
            'telephone' => $this->when($isOwner || $isRH, $this->telephone),
            'adresse'   => $this->when($isOwner || $isRH, $this->adresse),
            'cin'       => $this->when($isOwner || $isRH, $this->cin),
            'cv'        => $this->when($isOwner || $isRH, $this->cv ?
                asset('storage/' . ltrim($this->cv, '/')) : null
            ),

            // RH only
            'date_embauche' => $this->when($isRH, $this->date_embauche),
            'status'        => $this->when($isRH, $this->status),
            'user' => $this->whenLoaded('user', [
                'id'        => $this->user->id,
                'is_active' => $this->user->is_active,
                'email'     => $this->user->email,
                'photo'     => $this->user->photo ? asset('storage/' . ltrim($this->user->photo, '/')) : null,
                'cin'       => $this->user->cin ?? null,
            ]),


        ];
    }

}
