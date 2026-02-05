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


        // Création des types de documents
        // $typesDocuments = TypeDocument::factory()
        //     ->count(6)
        //     ->create();

        // // Templates de documents par société
        // $societes->each(function ($societe) use ($typesDocuments) {
        //     foreach ($typesDocuments as $type) {
        //         DocumentTemplate::factory()->create([
        //             'societe_id' => $societe->id,
        //             'type_document_id' => $type->id,
        //         ]);
        //     }
        // });

        // // Création des stagiaires
        // $societes->each(function ($societe) {

        //     $services = $societe->services;
        //     $encadrants = $societe->salaries;

        //     Stagiaire::factory()
        //         ->count(6)
        //         ->create([
        //             'societe_id' => $societe->id,
        //             'service_id' => $services->random()->id,
        //             'encadrant_id' => $encadrants->random()->id,
        //         ]);
        // });

        // // Création des demandes

        // Demande::factory()
        //     ->count(10)
        //     ->create();

        // // Documents générés pour demandes approuvées

        // Demande::where('status', 'approuvee')->each(function ($demande) {
        //     DocumentGenere::factory()->create([
        //         'demande_id' => $demande->id,
        //         'format' => $demande->format,
        //     ]);
        // });
    }
}
