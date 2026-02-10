<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service', function (Blueprint $table) {
            $table->id();
            $table->foreignId('societe_id')->references('id')->on('societe')->onDelete('cascade')->onUpdate('cascade');
            $table->string('nom');
            $table->boolean('is_archived')->default(false); 
            $table->timestamp('archived_at')->nullable(); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service');
    }
};
