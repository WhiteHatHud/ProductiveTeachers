import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Send, Settings, MessageSquare, Bell } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";

interface NotificationSettingsProps {
  onSave?: (settings: NotificationSettings) => void;
  initialSettings?: NotificationSettings;
}

interface NotificationSettings {
  absenceThreshold: number;
  enableNotifications: boolean;
  notificationTemplate: string;
  notificationChannel: string;
  reminderFrequency: string;
}

const NotificationSettings = ({
  onSave = () => {},
  initialSettings = {
    absenceThreshold: 2,
    enableNotifications: true,
    notificationTemplate:
      "Dear Parent/Guardian,\n\nThis is to inform you that {{studentName}} has been absent from class for {{absenceDays}} consecutive weeks. Please contact us regarding this absence.\n\nRegards,\nSchool Administration",
    notificationChannel: "whatsapp",
    reminderFrequency: "weekly",
  },
}: NotificationSettingsProps) => {
  const [activeTab, setActiveTab] = useState("general");
  const [previewData, setPreviewData] = useState({
    studentName: "John Doe",
    absenceDays: "2",
  });
  const [testStatus, setTestStatus] = useState<null | "success" | "error">(
    null,
  );

  const form = useForm<NotificationSettings>({
    defaultValues: initialSettings,
  });

  const handleSubmit = (data: NotificationSettings) => {
    onSave(data);
    setTestStatus("success");
    setTimeout(() => setTestStatus(null), 3000);
  };

  const getPreviewMessage = () => {
    let message =
      form.watch("notificationTemplate") ||
      initialSettings.notificationTemplate;
    Object.entries(previewData).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{{${key}}}`, "g"), value);
    });
    return message;
  };

  const handleTestNotification = () => {
    setTestStatus("success");
    setTimeout(() => setTestStatus(null), 3000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Configure WhatsApp notification settings for student absences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="general">
              <Bell className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="templates">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message Templates
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Send className="h-4 w-4 mr-2" />
              Preview & Test
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <TabsContent value="general" className="space-y-4">
                <FormField
                  control={form.control}
                  name="enableNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Enable Notifications
                        </FormLabel>
                        <FormDescription>
                          Turn on/off all absence notifications
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="absenceThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Absence Threshold (weeks)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Number of consecutive weeks absent before sending
                        notification
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notificationChannel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notification Channel</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select channel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose how notifications will be sent
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reminderFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reminder Frequency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="once">Once only</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How often to send reminders after the initial
                        notification
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="templates" className="space-y-4">
                <FormField
                  control={form.control}
                  name="notificationTemplate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notification Template</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter message template"
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Use {{ studentName }} and {{ absenceDays }} as
                        placeholders
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Message Preview</h3>
                  <div className="bg-gray-50 p-4 rounded-md border whitespace-pre-wrap">
                    {getPreviewMessage()}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Test Data</h4>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Student Name"
                            value={previewData.studentName}
                            onChange={(e) =>
                              setPreviewData({
                                ...previewData,
                                studentName: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="Absence Days"
                            value={previewData.absenceDays}
                            onChange={(e) =>
                              setPreviewData({
                                ...previewData,
                                absenceDays: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleTestNotification}
                        className="w-full"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Test Notification
                      </Button>
                    </div>
                  </div>

                  {testStatus === "success" && (
                    <Alert className="bg-green-50 border-green-200 text-green-800">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Test notification sent successfully!
                      </AlertDescription>
                    </Alert>
                  )}

                  {testStatus === "error" && (
                    <Alert className="bg-red-50 border-red-200 text-red-800">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Failed to send test notification. Please try again.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>

              <div className="flex justify-end pt-4">
                <Button type="submit">Save Settings</Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 text-sm text-gray-500">
        Changes will apply to all future notifications
      </CardFooter>
    </Card>
  );
};

export default NotificationSettings;
