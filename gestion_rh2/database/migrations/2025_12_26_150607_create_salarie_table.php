<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use League\CommonMark\Reference\Reference;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('salarie', function (Blueprint $table) {
            $table->id();
            $table->string('cin')->nullable()->unique();
            $table->string('nom');
            $table->string('prenom');
            $table->enum('sexe', ['homme', 'femme'])->default('homme')->nullable();
            $table->string('cv')->nullable();
            $table->string('photo')->nullable();
            $table->string('adresse')->nullable();
            $table->string('email')->unique();
            $table->string('password')->nullable();
            $table->string('telephone')->nullable();
            $table->string('poste')->nullable();
            $table->date('date_embauche')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('github')->nullable();
            $table->enum('role', ['RH', 'SALARIE', 'CHEF_SERVICE'])->default('SALARIE');
            $table->enum('status', ['actif', 'en-congé', 'suspendu', 'démissioné', 'archivé'])->default('actif')->nullable();
            $table->foreignId('societe_id')->references('id')->on('societe')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('service_id')->references('id')->on('service')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salarie');
    }
};
