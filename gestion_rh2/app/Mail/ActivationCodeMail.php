<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ActivationCodeMail extends Mailable
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
        return $this->subject('Activation de votre compte')
                    ->view('emails.activation-code');
    }
}
