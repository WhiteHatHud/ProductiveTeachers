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
    // Get the school_id and class_id from the request
    const { school_id, class_id } = await req.json();

    if (!school_id || !class_id) {
      throw new Error("school_id and class_id are required");
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

    // Get students for the specified school and class
    const { data: students, error } = await supabaseClient
      .from("students")
      .select("*")
      .eq("school_id", school_id)
      .eq("class_id", class_id)
      .order("name");

    if (error) throw error;

    return new Response(JSON.stringify({ students }), {
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
