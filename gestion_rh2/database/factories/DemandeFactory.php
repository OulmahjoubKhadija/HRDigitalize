<?php

namespace Database\Factories;

use App\Models\Demande;
use App\Models\Salarie;
use App\Models\TypeDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Demande>
 */
class DemandeFactory extends Factory
{
    protected $model = Demande::class;

    public function definition(): array
    {
        $dateDemande = $this->faker->dateTimeBetween('-1 month', 'now');

        return [
            'demandeur_id' => Salarie::factory(),
            'type_document_id' => TypeDocument::factory(),
            'status' => $this->faker->randomElement([
                'en-attente',
                'approuvee',
                'refusee',
            ]),
            'format' => $this->faker->randomElement(['pdf', 'docx']),
            'cible_id' => $this->faker->numberBetween(1,500),
            'date_demande' => $dateDemande,
            'date_validation' => $this->faker->boolean(60) ? $this->faker->dateTimeBetween($dateDemande, 'now') : null,
            'commentaire_rh' => $this->faker->boolean(50) ? $this->faker->sentence() : null,
        ];
    }
}
