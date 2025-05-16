import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";
import { Database } from "../_shared/database.types.ts";

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
      status: 200,
    });
  }

  try {
    // Get the attendance data from the request
    const { student_id, date, status, attendance_id } = await req.json();

    if (!student_id || !date || !status) {
      throw new Error("student_id, date, and status are required");
    }

    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    let result;

    // If attendance_id exists, update the record, otherwise create a new one
    if (attendance_id) {
      result = await supabaseClient
        .from("attendance")
        .update({ status })
        .eq("id", attendance_id)
        .select();
    } else {
      result = await supabaseClient
        .from("attendance")
        .insert({ student_id, date, status })
        .select();
    }

    const { data, error } = result;

    if (error) throw error;

    return new Response(JSON.stringify({ attendance: data[0] }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }
});
