<?php

namespace App\Models;

use Illuminate\Container\Attributes\DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeDocument extends Model
{
    use HasFactory;
    protected $table = 'type_documents';
    protected $fillable = [
        'nom',
        'description',
        'cible',
        'cree_par',
    ];

    public function documentTemplates()
    {
        return $this->hasMany(DocumentTemplate::class);
    }

    public function demandes(){
        return $this->hasMany(Demande:: class);
    }
}
