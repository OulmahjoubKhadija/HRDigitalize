<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Societe>
 */
class SocieteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom' => fake()->company(),
            'adresse' => fake()->address(),
            'email' => fake()->unique()->safeEmail(),
            'logo' => fake()->imageUrl(),
            'telephone' => fake()->phoneNumber(),
            'fax' => fake()->optional()->phoneNumber(),
            'activite' => fake()->catchPhrase(),
            'if' => fake()->numerify('########'),
            'cnss' => fake()->numerify('######'),
            'rc' => fake()->numerify('######'),
            'ice' => fake()->numerify('###############'),
            'patente' => fake()->optional()->numerify('#####'),
        ];
    }
}
