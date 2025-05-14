import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronDown, Download, Filter } from "lucide-react";

interface AttendanceRecord {
  id: string;
  studentName: string;
  studentId: string;
  date: string;
  status: "present" | "absent" | "late";
}

interface AttendanceHistoryProps {
  records?: AttendanceRecord[];
  onFilterChange?: (filters: any) => void;
}

const AttendanceHistory = ({
  records = defaultRecords,
  onFilterChange,
}: AttendanceHistoryProps) => {
  const [activeTab, setActiveTab] = useState("records");
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Filter records based on selected filters
  const filteredRecords = records.filter((record) => {
    if (selectedStudent !== "all" && record.studentId !== selectedStudent)
      return false;
    if (selectedStatus !== "all" && record.status !== selectedStatus)
      return false;
    return true;
  });

  // Calculate attendance statistics
  const totalRecords = records.length;
  const presentCount = records.filter((r) => r.status === "present").length;
  const absentCount = records.filter((r) => r.status === "absent").length;
  const lateCount = records.filter((r) => r.status === "late").length;

  const attendanceRate =
    totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

  // Get unique students for the dropdown
  const uniqueStudents = Array.from(new Set(records.map((r) => r.studentId)));

  return (
    <div className="bg-background w-full p-6 rounded-lg">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Attendance History</h1>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1">
            <DatePickerWithRange className="w-full" />
          </div>

          <div className="w-[200px]">
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Select Student" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                {uniqueStudents.map((id) => (
                  <SelectItem key={id} value={id}>
                    {records.find((r) => r.studentId === id)?.studentName || id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-[200px]">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="secondary" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="records">Attendance Records</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((record) => (
                        <TableRow key={`${record.id}-${record.date}`}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.studentName}</TableCell>
                          <TableCell>{record.studentId}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                record.status === "present"
                                  ? "default"
                                  : record.status === "absent"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {record.status.charAt(0).toUpperCase() +
                                record.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6">
                          No attendance records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Attendance Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{attendanceRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Overall attendance rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Present</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{presentCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total present records
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Absent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{absentCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total absent records
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Late</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{lateCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total late records
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Absence Patterns</CardTitle>
                <CardDescription>
                  Students with consecutive absences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Consecutive Absences</TableHead>
                      <TableHead>Last Absent Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {absencePatterns.map((pattern) => (
                      <TableRow key={pattern.studentId}>
                        <TableCell>{pattern.studentName}</TableCell>
                        <TableCell>{pattern.studentId}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              pattern.consecutiveAbsences >= 4
                                ? "destructive"
                                : "default"
                            }
                          >
                            {pattern.consecutiveAbsences}
                          </Badge>
                        </TableCell>
                        <TableCell>{pattern.lastAbsentDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AttendanceHistory;

// Mock data for demonstration
const defaultRecords: AttendanceRecord[] = [
  {
    id: "1",
    studentName: "John Doe",
    studentId: "S001",
    date: "2023-05-01",
    status: "present",
  },
  {
    id: "2",
    studentName: "John Doe",
    studentId: "S001",
    date: "2023-05-08",
    status: "present",
  },
  {
    id: "3",
    studentName: "John Doe",
    studentId: "S001",
    date: "2023-05-15",
    status: "absent",
  },
  {
    id: "4",
    studentName: "John Doe",
    studentId: "S001",
    date: "2023-05-22",
    status: "absent",
  },
  {
    id: "5",
    studentName: "Jane Smith",
    studentId: "S002",
    date: "2023-05-01",
    status: "present",
  },
  {
    id: "6",
    studentName: "Jane Smith",
    studentId: "S002",
    date: "2023-05-08",
    status: "late",
  },
  {
    id: "7",
    studentName: "Jane Smith",
    studentId: "S002",
    date: "2023-05-15",
    status: "present",
  },
  {
    id: "8",
    studentName: "Jane Smith",
    studentId: "S002",
    date: "2023-05-22",
    status: "present",
  },
  {
    id: "9",
    studentName: "Mike Johnson",
    studentId: "S003",
    date: "2023-05-01",
    status: "absent",
  },
  {
    id: "10",
    studentName: "Mike Johnson",
    studentId: "S003",
    date: "2023-05-08",
    status: "absent",
  },
  {
    id: "11",
    studentName: "Mike Johnson",
    studentId: "S003",
    date: "2023-05-15",
    status: "absent",
  },
  {
    id: "12",
    studentName: "Mike Johnson",
    studentId: "S003",
    date: "2023-05-22",
    status: "present",
  },
];

const absencePatterns = [
  {
    studentName: "Mike Johnson",
    studentId: "S003",
    consecutiveAbsences: 3,
    lastAbsentDate: "2023-05-15",
  },
  {
    studentName: "John Doe",
    studentId: "S001",
    consecutiveAbsences: 2,
    lastAbsentDate: "2023-05-22",
  },
  {
    studentName: "Sarah Williams",
    studentId: "S004",
    consecutiveAbsences: 4,
    lastAbsentDate: "2023-05-22",
  },
];
