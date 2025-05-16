import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Calendar,
  ChevronDown,
  FileSpreadsheet,
  History,
  Settings,
  User,
  CreditCard,
  LogOut,
  Shield,
} from "lucide-react";
import AttendanceTable from "./AttendanceTable";
import GoogleSheetsIntegration from "./GoogleSheetsIntegration";
import AttendanceHistory from "./AttendanceHistory";
import NotificationSettings from "./NotificationSettings";
import { getCurrentUser, logout, isAdmin } from "@/lib/auth";
import { Link } from "react-router-dom";
import SchoolClassSelector from "./SchoolClassSelector";

const Home = () => {
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsAdminUser(isAdmin());
  }, []);


  // Declare missing states
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());


  // Mock data for attendance summary
  const attendanceSummary = {
    present: 18,
    absent: 3,
    late: 2,
    total: 23,
    percentagePresent: 78,
  };

  // Mock data for notification alerts
  const notificationAlerts = [
    {
      id: 1,
      student: "Emma Johnson",
      weeks: 2,
      status: "Notification Sent",
      date: "2023-06-15",
    },
    {
      id: 2,
      student: "Michael Chen",
      weeks: 3,
      status: "Notification Sent",
      date: "2023-06-10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Attendance Tracker</h1>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="hidden md:flex"
            >
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || "user"}`}
                      alt="User"
                    />
                    <AvatarFallback>
                      {user?.name?.substring(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block">
                    {user?.name || "User"}
                  </span>
                  <span className="hidden md:inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {user?.role || "User"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <Link to="/payment">Subscription</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4" />
                  <Link to="/data-security">Data Security</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 md:hidden">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Present
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {attendanceSummary.present}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {attendanceSummary.percentagePresent}% of total
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Absent
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {attendanceSummary.absent}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(
                        (attendanceSummary.absent / attendanceSummary.total) *
                          100,
                      )}
                      % of total
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Late</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {attendanceSummary.late}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(
                        (attendanceSummary.late / attendanceSummary.total) *
                          100,
                      )}
                      % of total
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Students
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {attendanceSummary.total}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      In current class
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Google Sheets Integration */}
            <div className="flex flex-col md:flex-row gap-6">
              <Card className="w-full md:w-1/3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5" />
                    Google Sheets
                  </CardTitle>
                  <CardDescription>
                    Import or export attendance data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GoogleSheetsIntegration />
                </CardContent>
              </Card>

              {/* Notification Alerts */}
              <Card className="w-full md:w-2/3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Absence Notifications
                  </CardTitle>
                  <CardDescription>
                    Recent notifications sent to parents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {notificationAlerts.length > 0 ? (
                    <div className="space-y-4">
                      {notificationAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="flex items-center justify-between border-b pb-2"
                        >
                          <div>
                            <p className="font-medium">{alert.student}</p>
                            <p className="text-sm text-muted-foreground">
                              Absent for {alert.weeks} consecutive weeks
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                              {alert.status}
                            </span>
                            <p className="text-xs text-muted-foreground mt-1">
                              {alert.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No recent notifications
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* School and Class Selector */}
            <div className="mb-6">
              <SchoolClassSelector
                onSelectionChange={(schoolId, classId) => {
                  console.log("Selected School ID:", schoolId);
                  console.log("Selected Class ID:", classId);
                  setSelectedSchoolId(schoolId);
                  setSelectedClassId(classId);
                }}
              />
            </div>

            {/* Attendance Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Today's Attendance
                    </CardTitle>
                    <CardDescription>
                      Mark attendance for current class
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Change Date
                    </Button>
                    <Button size="sm">Save Attendance</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AttendanceTable date={currentDate} classId={selectedClassId} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Attendance History
                </CardTitle>
                <CardDescription>
                  View and analyze past attendance records
                </CardDescription>
              </CardHeader>
                <CardContent>
                <AttendanceHistory
                  schoolId={selectedSchoolId}
                  classId={selectedClassId}
                />
                </CardContent>
            </Card>
          </TabsContent>
        
          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure WhatsApp notification settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Home;
