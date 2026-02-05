<?php

namespace Database\Factories;

use App\Models\TypeDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TypeDocument>
 */
class TypeDocumentFactory extends Factory
{
    protected $model = TypeDocument::class;

    public function definition(): array
    {
        return [
            'nom' => $this->faker->randomElement([
                'Attestation de travail',
                'Certificat de travail',
                'Demande de congé',
                "Fiche d'absence",
                'Fiche de déplacement',
                'Attestation de stage'
            ]),
            'description' => $this->faker->boolean(70) ? $this->faker->sentence() : null,
            'cible' => $this->faker->randomElement(['salarie', 'stagiaire']),
            'cree_par' => $this->faker->randomElement(['RH', 'SALARIE']),
        ];
    }
}
