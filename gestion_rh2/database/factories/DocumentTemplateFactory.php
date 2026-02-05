<?php

namespace Database\Factories;

use App\Models\DocumentTemplate;
use App\Models\Societe;
use App\Models\TypeDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DocumentTemplate>
 */
class DocumentTemplateFactory extends Factory
{
    protected $model = DocumentTemplate::class;

    public function definition()
    {
        return [
            'variable_json' => [
                'nom',
                'prenom',
                'cin',
                'date',
                'societe',
            ],
            'template_path' => 'templates/' . $this->faker->uuid . '.dox',
            'societe_id' => Societe::factory(),
            'type_document_id' => TypeDocument::factory(),
        ];
    }
}
