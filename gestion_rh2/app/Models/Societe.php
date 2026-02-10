<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Societe extends Model
{
    use HasFactory;

    protected $table = 'societe';

    protected $fillable = [
        'nom',
        'is_archived',
        'email',
        'archived_at',
        'adresse',
        'logo',
        'telephone',
        'fax',
        'activite',
        'if',
        'cnss',
        'rc',
        'ice',
        'patente',
    ];

    protected $casts = [
    'is_archived' => 'boolean',
    'archived_at' => 'datetime',
    ];

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function salaries()
    {
        return $this->hasMany(Salarie::class);
    }

    public function stagiaires()
    {
        return $this->hasMany(Stagiaire::class);
    }

    public function documentTemplates()
    {
        return $this->hasMany(DocumentTemplate::class);
    }

}
