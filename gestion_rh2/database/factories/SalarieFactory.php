<?php

namespace Database\Factories;


use App\Models\Societe;
use App\Models\Service;
use Illuminate\Support\Facades\Hash;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Salarie>
 */
class SalarieFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'cin' => fake()->unique()->regexify('[A-Z]{2}[0-9]{6}'),
            'nom' => fake()->lastName(),
            'prenom' => fake()->firstName(),
            'sexe' => fake()->randomElement(['homme', 'femme']),
            'cv' => fake()->word() . 'pdf',
            'photo' => fake()->optional()->imageUrl(),
            'adresse' => fake()->address(),
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'telephone' => fake()->phoneNumber(),
            'poste' => fake()->jobTitle(),
            'date_embauche' =>fake()->date(),
            'linkedin' => fake()->optional()->url(),
            'github' => fake()->optional()->url(),
            'role' => fake()-> randomElement(['RH', 'SALARIE', 'CHEF_SERVICE']),
            'status' => fake()->randomElement(['actif', 'en-congé', 'suspendu', 'démissioné', 'archivé']),

            'societe_id' => Societe::factory(),
            'service_id' => Service::factory(),
        ];
    }
}
