<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'variable_json',
        'template_path',
        'societe_id',
        'type_document_id',
    ];

    protected $casts = [
        'variable_json' => 'array',
    ];

    // Relations
    public function societe()
    {
        return $this->belongsTo(Societe::class);
    }

    public function typeDocument()
    {
        return $this->belongsTo(TypeDocument::class);
    }
}
