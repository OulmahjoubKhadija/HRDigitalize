<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SocieteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $isRH = $user && $user->role === 'RH';

        return [
            'id' => $this->id,

            // Visible to ALL authenticated users
            'nom'       => $this->nom,
            'email'     => $this->email,
            'activite'  => $this->activite,
            'telephone' => $this->telephone,
            'fax'       => $this->fax,
            'adresse'   => $this->adresse,
            'logo'      => $this->logo
                ? asset('storage/' . ltrim($this->logo, '/'))
                : null,

            // RH ONLY
            'if'      => $this->when($isRH, $this->if),
            'cnss'    => $this->when($isRH, $this->cnss),
            'rc'      => $this->when($isRH, $this->rc),
            'ice'     => $this->when($isRH, $this->ice),
            'patente' => $this->when($isRH, $this->patente),
            'archived_at' => $this->when($isRH, $this->archived_at),

            // Optional metadata (RH only – you can remove if not needed)
            'created_at' => $this->when($isRH, $this->created_at),
            'updated_at' => $this->when($isRH, $this->updated_at),
        ];
    }
}
