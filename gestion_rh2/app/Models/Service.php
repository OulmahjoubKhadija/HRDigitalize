<?php

namespace App\Models;
use App\Models\Salarie;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
     use HasFactory;

    protected $table = 'service';

    protected $fillable = [
        'nom',
        'societe_id',
        'is_archived',
        'archived_at',
    ];

    protected $casts = [
    'is_archived' => 'boolean',
    'archived_at' => 'datetime',
    ];

    public function societe()
    {
        return $this->belongsTo(Societe::class);
    }

    public function salaries()
    {
        return $this->hasMany(Salarie::class);
    }

    public function stagiaires()
    {
        return $this->hasMany(Stagiaire::class);
    }
}
