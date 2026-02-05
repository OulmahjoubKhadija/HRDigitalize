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
        Schema::create('societe', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('adresse');
            $table->string('logo')->nullable();;
            $table->string('telephone');
            $table->string('fax')->nullable();
            $table->string('activite')->nullable();;
            $table->string('if')->nullable();;
            $table->string('cnss')->nullable();;
            $table->string('rc')->nullable();;
            $table->string('ice')->nullable();;
            $table->string('patente')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('societe');
    }
};
