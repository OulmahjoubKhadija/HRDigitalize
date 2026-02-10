<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Societe;
use App\Models\Service;
// use App\Models\Stagiaire;
// use App\Models\TypeDocument;
// use App\Models\DocumentTemplate;
// use App\Models\Demande;
// use App\Models\DocumentGenere;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {

        // Crée le premier RH user
        $this->call(FirstRHUserSeeder::class);

        // Création des sociétés et Création des services par société
        $societes = Societe::factory()->count(3)->create();

        $societes->each(function ($societe) {
            Service::factory()->count(4)->create([
                'societe_id' => $societe->id,
            ]);
        });

    }
}
