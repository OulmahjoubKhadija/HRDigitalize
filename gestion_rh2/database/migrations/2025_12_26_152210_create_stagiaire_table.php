<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stagiaire', function (Blueprint $table) {
    $table->id();

    // Account link
    $table->foreignId('user_id')->nullable()
          ->constrained()
          ->onDelete('cascade');

    // Identity
    $table->string('nom');
    $table->string('prenom');
    $table->string('cin')->nullable()->unique();
    $table->enum('sexe', ['homme', 'femme'])->nullable();
    $table->string('photo')->nullable();

    // Contact
    $table->string('email')->unique();
    $table->string('telephone')->nullable();
    $table->string('adresse')->nullable();

    // Academic
    $table->string('filiere')->nullable();

    // Stage documents
    $table->string('cv')->nullable();
    $table->string('demande_stage')->nullable();
    $table->string('fiche_reussite')->nullable();
    $table->string('accord_stage')->nullable();
    $table->string('entreprise_accueil')->nullable();

    // Stage period
    $table->date('date_debut')->nullable();
    $table->date('date_fin')->nullable();

    // Stage status
    $table->enum('status', [
        'en-stage',
        'fin-stage',
        'interrompu',
        'archive'
    ])->default('en-stage');

    // Relations
    $table->foreignId('societe_id')->references('id')->on('societe')->onDelete('cascade')->onUpdate('cascade');
    $table->foreignId('service_id')->references('id')->on('service')->onDelete('cascade')->onUpdate('cascade');
    $table->foreignId('encadrant_id')->references('id')->on('salarie')->onDelete('cascade')->onUpdate('cascade');
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stagiaire');
    }
};
