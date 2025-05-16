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
    // Get the filter parameters from the request
    const { class_id, student_id, status, start_date, end_date } =
      await req.json();

    if (!class_id) {
      throw new Error("class_id is required");
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
      .eq("class_id", class_id);

    if (studentsError) throw studentsError;

    // Filter students if student_id is provided
    const filteredStudents = student_id
      ? students.filter((student) => student.id === student_id)
      : students;

    // Get attendance records for the filtered students
    let query = supabaseClient
      .from("attendance")
      .select("*")
      .in(
        "student_id",
        filteredStudents.map((student) => student.id),
      );

    // Apply date range filter if provided
    if (start_date) {
      query = query.gte("date", start_date);
    }
    if (end_date) {
      query = query.lte("date", end_date);
    }

    // Apply status filter if provided
    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    // Order by date descending
    query = query.order("date", { ascending: false });

    const { data: attendanceRecords, error: attendanceError } = await query;

    if (attendanceError) throw attendanceError;

    // Combine student data with attendance records
    const records = attendanceRecords.map((record) => {
      const student = students.find((s) => s.id === record.student_id);
      return {
        id: record.id,
        studentName: student ? student.name : "Unknown Student",
        studentId: record.student_id,
        date: record.date,
        status: record.status,
      };
    });

    // Calculate attendance statistics
    const totalRecords = records.length;
    const presentCount = records.filter((r) => r.status === "present").length;
    const absentCount = records.filter((r) => r.status === "absent").length;
    const lateCount = records.filter((r) => r.status === "late").length;

    // Calculate absence patterns
    const absencePatterns = filteredStudents
      .map((student) => {
        const studentRecords = attendanceRecords
          .filter((record) => record.student_id === student.id)
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );

        let consecutiveAbsences = 0;
        for (const record of studentRecords) {
          if (record.status === "absent") {
            consecutiveAbsences++;
          } else {
            break;
          }
        }

        const lastAbsentRecord = studentRecords.find(
          (record) => record.status === "absent",
        );

        return {
          studentName: student.name,
          studentId: student.id,
          consecutiveAbsences,
          lastAbsentDate: lastAbsentRecord
            ? lastAbsentRecord.date
            : "No absences",
        };
      })
      .filter((pattern) => pattern.consecutiveAbsences > 0)
      .sort((a, b) => b.consecutiveAbsences - a.consecutiveAbsences);

    return new Response(
      JSON.stringify({
        records,
        statistics: {
          totalRecords,
          presentCount,
          absentCount,
          lateCount,
        },
        absencePatterns,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 200,
      },
    );
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
