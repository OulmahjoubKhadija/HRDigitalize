<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password')->nullable();
            $table->string('registration_code', 8)->unique()->nullable();
            $table->timestamp('activation_expires_at')->nullable();
            $table->boolean('is_active')->default(false);
            $table->string('role');
            $table->boolean('is_profile_completed')->default(false);
            $table->boolean('is_archived')->default(false);
            $table->timestamp('archived_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['salarie_id']); 
            $table->dropColumn('salarie_id');
        });
    }
};

