<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Salarie extends Model
{
    /**
    * @property \App\Models\User $user
    */
    use HasFactory; 

    protected $table = 'salarie';

    protected $fillable = [
        'user_id',
        'cin',
        'nom',
        'prenom',
        'sexe',
        'cv',
        'photo',
        'adresse',
        'email',
        'telephone',
        'poste',
        'date_embauche',
        'linkedin',
        'github',
        'role',
        'status',
        'societe_id',
        'service_id',
    ];

    
    public function societe(){
        return $this->belongsTo(Societe::class)->withDefault();
    }

    public function service(){
        return $this->belongsTo(Service::class)->withDefault();
    }

    public function demandes(){
        return $this->hasMany(Demande::class, 'demandeur_id');
    }

    public function stagiairesEncadres()
    {
        return $this->hasMany(Stagiaire::class, 'encadrant_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

}
