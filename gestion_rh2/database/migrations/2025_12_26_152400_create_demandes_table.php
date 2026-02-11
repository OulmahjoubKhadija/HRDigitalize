
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
        Schema::create('demandes', function (Blueprint $table) {
            $table->id();

            // Demandeur (Salarie OR Stagiaire)
            $table->unsignedBigInteger('demandeur_id');
            $table->string('demandeur_type');

            // Type de document demandé
            $table->foreignId('type_document_id')->constrained('type_documents')->cascadeOnDelete();

            // Personne concernnée par le document
            $table->unsignedBigInteger('cible_id');
            $table->string('cible_type');
            
            $table->enum('status', ['en-attente', 'approuvee', 'refusee'])->default('en-attente');

            $table->enum('format', ['pdf','docx'])->default('pdf');

            $table->date('date_demande');
            $table->date('date_validation')->nullable();
            $table->text('commentaire_rh')->nullable();

            $table->timestamps();

            // Indexes for performance
            $table->index(['demandeur_id', 'demandeur_type']);
            $table->index(['cible_id', 'cible_type']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demandes');
    }
};
