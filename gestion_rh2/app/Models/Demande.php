<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Demande extends Model
{
    use HasFactory;

    protected $table = 'demandes';

    protected $fillable = [
        'demandeur_id',
        'demandeur_type',
        'type_document_id',
        'cible_id',
        'cible_type',
        'status',
        'format',
        'date_demande',
        'date_validation',
        'commentaire_rh',
    ];

    protected $casts = [
        'date_demande' => 'date',
        'date_validation' => 'date',
    ];

    public function demandeur(){
        return $this->morphTo();
    }

    public function cible()
    {
        return $this->morphTo();
    }

    public function typeDocument(){
        return $this-> belongsTo(TypeDocument::class);
    }

    public function documentGener(){
        return $this->hasOne(DocumentGenere::class);
    }
}
