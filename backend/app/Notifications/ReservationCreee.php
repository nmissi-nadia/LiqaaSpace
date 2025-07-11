<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ReservationCreee extends Notification
{
    use Queueable;

    public $reservation;

    public function __construct($reservation)
    {
        $this->reservation = $reservation;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Confirmation de réservation')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Votre réservation a bien été enregistrée.')
            ->line('Salle : ' . $this->reservation->salle->nom)
            ->line('Date : ' . $this->reservation->date)
            ->line('Créneau : ' . $this->reservation->heure_debut . ' - ' . $this->reservation->heure_fin)
            ->action('Voir mes réservations', url('/')) // Mets ici le lien vers le frontend
            ->line('Merci d\'utiliser notre plateforme !');
    }
    public function toArray($notifiable)
    {
        return [
            'title' => 'Nouvelle réservation',
            'message' => 'Votre réservation pour la salle ' . $this->reservation->salle->nom . ' a été créée.',
            'salle' => $this->reservation->salle->nom,
            'date' => $this->reservation->date,
            'heure_debut' => $this->reservation->heure_debut,
            'heure_fin' => $this->reservation->heure_fin,
            'reservation_id' => $this->reservation->id,
        ];
    }
}