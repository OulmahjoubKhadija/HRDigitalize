<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ActivationCodeStagiaireMail extends Mailable
{
    use SerializesModels;

    public $code;
    public $email;

    public function __construct($code, $email)
    {
        $this->code = $code;
        $this->email = $email;
    }

    public function build()
    {
        return $this->subject('Activation de votre compte stagiaire')
                    ->view('emails.activation-code-stagiaire');
    }
}
