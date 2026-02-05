<?php

namespace Database\Factories;

use App\Models\Salarie;
use App\Models\Service;
use App\Models\Societe;
use App\Models\Stagiaire;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Stagiaire>
 */
class StagiaireFactory extends Factory
{
    protected $model = Stagiaire::class;

    public function definition(): array
    {
        //Date nullable
        $dateDebut = $this->faker->boolean(80) ? $this-> faker->dateTimeBetween('-2 months', 'now') : null;

        $dateFin = $dateDebut ? (clone $dateDebut)->modify('+3 months') : null;

        return [
            'cin' => strtoupper($this->faker->bothify('??######')),
            'nom' => $this->faker->lastName(),
            'prenom' => $this->faker->firstName(),
            'sexe' => $this->faker->randomElement(['homme', 'femme']),

            // Fichiers (nullable)
            'cv' => $this->faker->boolean(70) ? 'cv_' . $this->faker->uuid . '.pdf' : null,

            'demande_stage' => $this->faker->boolean(60) ? 'demande_stage_' . $this->faker->uuid . '.pdf' : null,
            
            'fiche_reussite' => $this->faker->boolean(40) ? 'fiche_reussite_' . $this->faker->uuid . '.pdf' : null,

            // Info personnelle
            'adresse' => $this-> faker->boolean(70) ? $this->faker->address() : null,
            'email' => $this->faker->unique()->safeEmail(),
            'telephone' => $this->faker->boolean(70) ? $this->faker->phoneNumber() : null,
            'filiere' => $this->faker->words(3, true),
            
            // Dates
            'date_debut' => $dateDebut,
            'date_fin' => $dateFin,
            
            // Status
            'status' => $this->faker->randomElement([
                'en-stage',
                'fin-stage',
                'interromper',
            ]),

            // Relatons
            'societe_id' => Societe::factory(),
            'service_id' => Service::factory(),
            'encadrant_id' => Salarie::factory(),
        ];

    }

    // État : stagiaire archivé
        public function archive(){
            return $this->state(fn() => [
                'status' => 'archivé',
            ]);
        }
}
