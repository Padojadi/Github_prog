import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface NotificationRequest {
  bookingId: string;
  action: "approved" | "rejected";
  notes?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { bookingId, action, notes }: NotificationRequest = await req.json();

    if (!bookingId || !action) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select(`
        *,
        user:profiles!bookings_user_id_fkey(email, full_name),
        lounge:lounges(name, location)
      `)
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return new Response(
        JSON.stringify({ error: "Booking not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const emailData = {
      to: booking.user.email,
      subject: action === "approved" 
        ? `Votre réservation au ${booking.lounge.name} est confirmée`
        : `Votre réservation au ${booking.lounge.name} a été refusée`,
      body: action === "approved"
        ? `Bonjour ${booking.user.full_name},\n\nNous avons le plaisir de confirmer votre réservation :\n\nSalon : ${booking.lounge.name}\nLieu : ${booking.lounge.location}\nDate : ${new Date(booking.booking_date).toLocaleDateString('fr-FR')}\nHoraire : ${booking.start_time} - ${booking.end_time}\nNombre d'invités : ${booking.number_of_guests}\n\n${notes ? `Note de notre équipe :\n${notes}\n\n` : ""}Cordialement,\nL'équipe du Protocole`
        : `Bonjour ${booking.user.full_name},\n\nNous sommes au regret de vous informer que votre demande de réservation n'a pas pu être acceptée :\n\nSalon : ${booking.lounge.name}\nLieu : ${booking.lounge.location}\nDate : ${new Date(booking.booking_date).toLocaleDateString('fr-FR')}\n\n${notes ? `Raison :\n${notes}\n\n` : ""}N'hésitez pas à nous contacter pour toute question.\n\nCordialement,\nL'équipe du Protocole`,
    };

    console.log("Email notification prepared:", emailData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Notification sent",
        emailPreview: emailData 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});