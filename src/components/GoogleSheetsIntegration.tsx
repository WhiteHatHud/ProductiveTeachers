import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileSpreadsheet,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface GoogleSheetsIntegrationProps {
  onImport?: (data: any[]) => void;
  onExport?: (data: any[]) => void;
}

const GoogleSheetsIntegration = ({
  onImport = () => {},
  onExport = () => {},
}: GoogleSheetsIntegrationProps) => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "success" | "error"
  >("idle");
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [sheetUrl, setSheetUrl] = useState<string>("");

  // Mock data for sheet preview
  const mockSheets = ["Attendance", "Students", "Classes", "Reports"];
  const mockPreviewData = [
    { id: "001", name: "John Doe", email: "john@example.com" },
    { id: "002", name: "Jane Smith", email: "jane@example.com" },
    { id: "003", name: "Bob Johnson", email: "bob@example.com" },
  ];

  const handleImport = () => {
    setSyncStatus("syncing");

    // Simulate import progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setImportProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setSyncStatus("success");
        onImport(mockPreviewData);
        setTimeout(() => {
          setIsImportDialogOpen(false);
          setSyncStatus("idle");
          setImportProgress(0);
        }, 1000);
      }
    }, 300);
  };

  const handleExport = () => {
    setSyncStatus("syncing");

    // Simulate export progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setExportProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setSyncStatus("success");
        onExport(mockPreviewData);
        setTimeout(() => {
          setIsExportDialogOpen(false);
          setSyncStatus("idle");
          setExportProgress(0);
        }, 1000);
      }
    }, 300);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Google Sheets Integration
        </CardTitle>
        <CardDescription>
          Import student data from Google Sheets or export attendance records
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => setIsImportDialogOpen(true)}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Upload className="h-4 w-4" />
            Import Student Data
          </Button>

          <Button
            onClick={() => setIsExportDialogOpen(true)}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            Export Attendance Records
          </Button>
        </div>

        {syncStatus === "success" && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Last sync completed successfully
            </AlertDescription>
          </Alert>
        )}

        {syncStatus === "error" && (
          <Alert className="bg-red-50 text-red-800 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Sync failed. Please try again.</AlertDescription>
          </Alert>
        )}
      </CardContent>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Student Data</DialogTitle>
            <DialogDescription>
              Connect to Google Sheets to import student information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sheet-url">Google Sheet URL</Label>
              <Input
                id="sheet-url"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sheet-name">Select Sheet</Label>
              <Select value={selectedSheet} onValueChange={setSelectedSheet}>
                <SelectTrigger id="sheet-name">
                  <SelectValue placeholder="Select a sheet" />
                </SelectTrigger>
                <SelectContent>
                  {mockSheets.map((sheet) => (
                    <SelectItem key={sheet} value={sheet}>
                      {sheet}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSheet && (
              <div className="border rounded-md p-3">
                <h4 className="text-sm font-medium mb-2">Preview</h4>
                <div className="text-xs overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left">ID</th>
                        <th className="px-3 py-2 text-left">Name</th>
                        <th className="px-3 py-2 text-left">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockPreviewData.map((row) => (
                        <tr key={row.id}>
                          <td className="px-3 py-2">{row.id}</td>
                          <td className="px-3 py-2">{row.name}</td>
                          <td className="px-3 py-2">{row.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {syncStatus === "syncing" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Importing data...</span>
                </div>
                <Progress value={importProgress} className="h-1" />
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsImportDialogOpen(false)}
              disabled={syncStatus === "syncing"}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!selectedSheet || syncStatus === "syncing"}
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Attendance Records</DialogTitle>
            <DialogDescription>
              Sync attendance data to your Google Sheet
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="export-sheet-url">Google Sheet URL</Label>
              <Input
                id="export-sheet-url"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="export-sheet-name">Select Sheet</Label>
              <Select value={selectedSheet} onValueChange={setSelectedSheet}>
                <SelectTrigger id="export-sheet-name">
                  <SelectValue placeholder="Select a sheet" />
                </SelectTrigger>
                <SelectContent>
                  {mockSheets.map((sheet) => (
                    <SelectItem key={sheet} value={sheet}>
                      {sheet}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="export-date-range">Date Range</Label>
              <Select defaultValue="current-week">
                <SelectTrigger id="export-date-range">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-week">Current Week</SelectItem>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {syncStatus === "syncing" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Exporting data...</span>
                </div>
                <Progress value={exportProgress} className="h-1" />
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsExportDialogOpen(false)}
              disabled={syncStatus === "syncing"}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={!selectedSheet || syncStatus === "syncing"}
            >
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoogleSheetsIntegration;
