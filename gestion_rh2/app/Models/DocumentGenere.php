<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentGenere extends Model
{
    use HasFactory;
    protected $table = 'documents_generes';
    protected $fillable = [
        'demande_id',
        'format',
        'fichier_genere',
        'fichier_pdf',
    ];

    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }
}
