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
        'type_document_id',
        'status',
        'format',
        'cible_id',
        'date_demande',
        'date_validation',
        'commentaire_rh',
    ];

    protected $casts = [
        'date_demande' => 'date',
        'date_validation' => 'date',
    ];

    public function demandeur(){
        return $this->belongsTo(Salarie::class, 'demandeur_id');
    }

    public function typeDocument(){
        return $this-> belongsTo(TypeDocument::class);
    }

    public function documentGener(){
        return $this->hasOne(DocumentGenere::class);
    }
}
