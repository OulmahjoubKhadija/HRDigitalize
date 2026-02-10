<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use League\CommonMark\Reference\Reference;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('salarie', function (Blueprint $table) {
    $table->id();

    $table->foreignId('user_id')
        ->nullable()
        ->constrained('users')
        ->nullOnDelete();

    $table->string('cin')->nullable()->unique();
    $table->string('nom');
    $table->string('prenom');
    $table->enum('sexe', ['homme', 'femme'])->nullable()->default('homme');
    $table->string('cv')->nullable();
    $table->string('photo')->nullable();
    $table->string('adresse')->nullable();
    $table->string('email')->unique();
    $table->string('telephone')->nullable();
    $table->string('poste')->nullable();
    $table->date('date_embauche')->nullable();
    $table->string('linkedin')->nullable();
    $table->string('github')->nullable();
    $table->enum('role', ['RH', 'SALARIE', 'CHEF_SERVICE'])->default('SALARIE');
    $table->enum('status', ['actif', 'en_conge', 'demissionne', 'archive','suspendu','licencie'])->nullable()->default('actif');

    $table->foreignId('societe_id')
        ->constrained('societe')
        ->cascadeOnDelete()
        ->cascadeOnUpdate();

    $table->foreignId('service_id')
        ->constrained('service')
        ->cascadeOnDelete()
        ->cascadeOnUpdate();

    $table->timestamps();
});

    }

    public function down(): void
    {
        Schema::dropIfExists('salarie');
    }
};
