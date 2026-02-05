
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
            $table->foreignId('demandeur_id')->constrained('salarie')->cascadeOnDelete();
            $table->foreignId('type_document_id')->constrained('type_documents')->cascadeOnDelete();

            $table->enum('status', ['en-attente', 'approuvee', 'refusee'])->default('en-attente');
            $table->enum('format', ['pdf','docx'])->default('pdf');
            $table->unsignedBigInteger('cible_id');

            $table->date('date_demande');
            $table->date('date_validation')->nullable();
            $table->text('commentaire_rh')->nullable();
            $table->timestamps();
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
