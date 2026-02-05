<?php

namespace Database\Factories;

use App\Models\DocumentGenere;
use App\Models\Demande;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DocumentGenere>
 */
class DocumentGenereFactory extends Factory
{
    protected $model = DocumentGenere::class;

    public function definition()
    {
        $format = $this->faker->randomElement(['pdf', 'docx']);

        return [
            'demande_id' => Demande::factory(),
            'format' => $format,
            'fichier_genere' => $format === 'docx' ? 'generated/' . $this->faker->uuid . '.docx' : null,
            'fichier_pdf' => $format === 'pdf' ? 'generated/' . $this->faker->uuid . '.pdf' : null,
        ];
    }
}
