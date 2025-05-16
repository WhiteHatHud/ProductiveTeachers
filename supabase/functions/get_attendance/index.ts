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
    // Get the class_id and date from the request
    const { class_id, date } = await req.json();

    if (!class_id || !date) {
      throw new Error("class_id and date are required");
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

    // Get students for the class
    const { data: students, error: studentsError } = await supabaseClient
      .from("students")
      .select("*")
      .eq("class_id", class_id)
      .order("name");

    if (studentsError) throw studentsError;

    // Get attendance records for the specified date and students
    const studentIds = students.map((student) => student.id);
    const { data: attendanceRecords, error: attendanceError } =
      await supabaseClient
        .from("attendance")
        .select("*")
        .in("student_id", studentIds)
        .eq("date", date);

    if (attendanceError) throw attendanceError;

    // Combine student data with attendance records
    const combinedData = students.map((student) => {
      const attendanceRecord = attendanceRecords.find(
        (record) => record.student_id === student.id,
      );

      // Get the last 5 attendance records for this student to calculate consecutive absences
      const getLastAttendancePromise = supabaseClient
        .from("attendance")
        .select("*")
        .eq("student_id", student.id)
        .order("date", { ascending: false })
        .limit(5);

      return {
        id: student.id,
        name: student.name,
        status: attendanceRecord ? attendanceRecord.status : "absent", // Default to absent if no record
        attendanceId: attendanceRecord ? attendanceRecord.id : null,
        lastAttendancePromise: getLastAttendancePromise,
      };
    });

    // Resolve all promises to get last attendance data
    const resolvedData = await Promise.all(
      combinedData.map(async (item) => {
        const { data: lastAttendance } = await item.lastAttendancePromise;

        // Calculate consecutive absences
        let consecutiveAbsences = 0;
        for (const record of lastAttendance || []) {
          if (record.status === "absent") {
            consecutiveAbsences++;
          } else {
            break;
          }
        }

        // Calculate total absences
        const absenceCount = (lastAttendance || []).filter(
          (record) => record.status === "absent",
        ).length;

        // Get the last attendance date and format it
        const lastAttendanceDate =
          lastAttendance && lastAttendance.length > 0
            ? new Date(lastAttendance[0].date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "No records";

        return {
          id: item.id,
          name: item.name,
          status: item.status,
          attendanceId: item.attendanceId,
          absenceCount,
          consecutiveAbsences,
          lastAttendance: lastAttendanceDate,
        };
      }),
    );

    return new Response(JSON.stringify({ students: resolvedData }), {
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
