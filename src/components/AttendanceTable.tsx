import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Calendar,
  Clock,
  AlertCircle,
  Check,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  status: "present" | "absent" | "late";
  absenceCount: number;
  consecutiveAbsences: number;
  lastAttendance: string;
}

interface AttendanceTableProps {
  students?: Student[];
  date?: Date;
  onStatusChange?: (
    studentId: string,
    status: "present" | "absent" | "late",
  ) => void;
  onSave?: () => void;
}

const AttendanceTable = ({
  students = defaultStudents,
  date = new Date(),
  onStatusChange = () => {},
  onSave = () => {},
}: AttendanceTableProps) => {
  const [attendanceData, setAttendanceData] = useState<Student[]>(students);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [classId, setClassId] = useState<string | null>(null);

  const handleStatusChange = (
    studentId: string,
    status: "present" | "absent" | "late",
  ) => {
    const updatedData = attendanceData.map((student) => {
      if (student.id === studentId) {
        return { ...student, status };
      }
      return student;
    });

    setAttendanceData(updatedData);
    onStatusChange(studentId, status);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "late":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAbsenceIndicator = (consecutiveAbsences: number) => {
    if (consecutiveAbsences >= 4) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AlertCircle className="h-5 w-5 text-red-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Alert: {consecutiveAbsences} consecutive absences</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else if (consecutiveAbsences >= 2) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Warning: {consecutiveAbsences} consecutive absences</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return null;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Class Attendance</CardTitle>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600">{formatDate(date)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading attendance data...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : attendanceData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {classId
              ? "No students found in this class."
              : "Please select a class to view attendance."}
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="w-[150px]">Status</TableHead>
                    <TableHead className="w-[120px]">Present</TableHead>
                    <TableHead className="w-[120px]">Absent</TableHead>
                    <TableHead className="w-[120px]">Late</TableHead>
                    <TableHead className="w-[180px]">Last Attendance</TableHead>
                    <TableHead className="w-[100px]">Absences</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {student.name}
                          {getAbsenceIndicator(student.consecutiveAbsences)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(student.status)}>
                          {student.status.charAt(0).toUpperCase() +
                            student.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Switch
                            checked={student.status === "present"}
                            onCheckedChange={() =>
                              handleStatusChange(student.id, "present")
                            }
                          />
                          <Check
                            className={`ml-2 h-4 w-4 ${student.status === "present" ? "text-green-500" : "text-gray-300"}`}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Switch
                            checked={student.status === "absent"}
                            onCheckedChange={() =>
                              handleStatusChange(student.id, "absent")
                            }
                          />
                          <X
                            className={`ml-2 h-4 w-4 ${student.status === "absent" ? "text-red-500" : "text-gray-300"}`}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Switch
                            checked={student.status === "late"}
                            onCheckedChange={() =>
                              handleStatusChange(student.id, "late")
                            }
                          />
                          <Clock
                            className={`ml-2 h-4 w-4 ${student.status === "late" ? "text-yellow-500" : "text-gray-300"}`}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {student.lastAttendance}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {student.absenceCount}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={onSave}>Save Attendance</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Default mock data
const defaultStudents: Student[] = [
  {
    id: "S001",
    name: "John Smith",
    status: "present",
    absenceCount: 2,
    consecutiveAbsences: 0,
    lastAttendance: "May 15, 2023",
  },
  {
    id: "S002",
    name: "Emily Johnson",
    status: "absent",
    absenceCount: 5,
    consecutiveAbsences: 2,
    lastAttendance: "May 8, 2023",
  },
  {
    id: "S003",
    name: "Michael Brown",
    status: "late",
    absenceCount: 1,
    consecutiveAbsences: 0,
    lastAttendance: "May 15, 2023",
  },
  {
    id: "S004",
    name: "Sarah Davis",
    status: "absent",
    absenceCount: 8,
    consecutiveAbsences: 4,
    lastAttendance: "May 1, 2023",
  },
  {
    id: "S005",
    name: "David Wilson",
    status: "present",
    absenceCount: 0,
    consecutiveAbsences: 0,
    lastAttendance: "May 15, 2023",
  },
];

export default AttendanceTable;
