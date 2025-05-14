import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Send,
  Sparkles,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Copy,
  Edit,
  Save,
  Trash,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Message {
  id: string;
  studentName: string;
  parentName: string;
  content: string;
  timestamp: string;
  status: "sent" | "draft" | "template";
}

interface MessageDraftingProps {
  studentData?: Array<{
    id: string;
    name: string;
    parentName: string;
    parentContact: string;
  }>;
}

const MessageDrafting = ({
  studentData = defaultStudentData,
}: MessageDraftingProps) => {
  const [activeTab, setActiveTab] = useState("draft");
  const [prompt, setPrompt] = useState("");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [messageContent, setMessageContent] = useState("");

  // Generate message draft using OpenAI
  const generateDraft = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt for the message");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-message_drafting",
        {
          body: { prompt },
        },
      );

      clearInterval(interval);
      setProgress(100);

      if (error) throw new Error(error.message);

      setGeneratedMessage(data.message);
      setSuccess("Message draft generated successfully!");

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(`Failed to generate message: ${err.message}`);
    } finally {
      setIsGenerating(false);
      setProgress(100);
    }
  };

  // Save the generated message as a draft or send it
  const saveMessage = (status: "draft" | "sent") => {
    if (!generatedMessage.trim() || !selectedStudent) {
      setError("Please generate a message and select a student");
      return;
    }

    const student = studentData.find((s) => s.id === selectedStudent);
    if (!student) {
      setError("Selected student not found");
      return;
    }

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      studentName: student.name,
      parentName: student.parentName,
      content: generatedMessage,
      timestamp: new Date().toISOString(),
      status,
    };

    setMessages([newMessage, ...messages]);
    setSuccess(
      status === "sent"
        ? "Message sent successfully!"
        : "Message saved as draft!",
    );

    // Clear form after saving
    if (status === "sent") {
      setPrompt("");
      setGeneratedMessage("");
      setSelectedStudent("");
    }

    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  // Start editing a message
  const startEditing = (message: Message) => {
    setEditingMessage(message);
    setMessageContent(message.content);
    setActiveTab("history");
  };

  // Save edited message
  const saveEditedMessage = () => {
    if (!editingMessage) return;

    const updatedMessages = messages.map((msg) =>
      msg.id === editingMessage.id ? { ...msg, content: messageContent } : msg,
    );

    setMessages(updatedMessages);
    setEditingMessage(null);
    setMessageContent("");
    setSuccess("Message updated successfully!");

    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  // Delete a message
  const deleteMessage = (id: string) => {
    setMessages(messages.filter((msg) => msg.id !== id));
    if (editingMessage?.id === id) {
      setEditingMessage(null);
      setMessageContent("");
    }
    setSuccess("Message deleted successfully!");

    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  // Copy message to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess("Copied to clipboard!");

    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Parent Communication
        </CardTitle>
        <CardDescription>
          Draft and send messages to parents about student attendance
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="draft">
              <Sparkles className="h-4 w-4 mr-2" />
              Draft Message
            </TabsTrigger>
            <TabsTrigger value="history">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="draft" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="student">Select Student</Label>
                <Select
                  value={selectedStudent}
                  onValueChange={setSelectedStudent}
                >
                  <SelectTrigger id="student">
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {studentData.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} (Parent: {student.parentName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">
                  What would you like to communicate?
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="E.g., Draft a message informing the parent about their child's 3 consecutive absences and requesting a meeting"
                  className="min-h-[100px]"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Provide key points or context for the message. The AI will
                  draft a professional message based on your input.
                </p>
              </div>

              <Button
                onClick={generateDraft}
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Message Draft
                  </>
                )}
              </Button>

              {isGenerating && <Progress value={progress} className="h-1" />}

              {error && (
                <Alert className="bg-red-50 border-red-200 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {generatedMessage && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="generated-message">Generated Message</Label>
                    <div className="relative">
                      <Textarea
                        id="generated-message"
                        className="min-h-[200px] pr-10"
                        value={generatedMessage}
                        onChange={(e) => setGeneratedMessage(e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(generatedMessage)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      You can edit this message before saving or sending.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => saveMessage("draft")}
                      className="flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save as Draft
                    </Button>
                    <Button
                      onClick={() => saveMessage("sent")}
                      className="flex-1"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {editingMessage ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    Editing message for {editingMessage.studentName}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingMessage(null)}
                  >
                    Cancel
                  </Button>
                </div>

                <Textarea
                  className="min-h-[200px]"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingMessage(null)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={saveEditedMessage}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Message History</h3>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Messages</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="draft">Drafts</SelectItem>
                      <SelectItem value="template">Templates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <Card key={message.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">
                                To: {message.parentName} (Parent of{" "}
                                {message.studentName})
                              </CardTitle>
                              <CardDescription>
                                {new Date(message.timestamp).toLocaleString()}
                              </CardDescription>
                            </div>
                            <div>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${message.status === "sent" ? "bg-green-100 text-green-800" : message.status === "draft" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}
                              >
                                {message.status.charAt(0).toUpperCase() +
                                  message.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(message.content)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(message)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMessage(message.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No messages found. Draft a new message to get started.
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Default mock data
const defaultStudentData = [
  {
    id: "S001",
    name: "John Smith",
    parentName: "David Smith",
    parentContact: "+1234567890",
  },
  {
    id: "S002",
    name: "Emily Johnson",
    parentName: "Sarah Johnson",
    parentContact: "+1234567891",
  },
  {
    id: "S003",
    name: "Michael Brown",
    parentName: "Robert Brown",
    parentContact: "+1234567892",
  },
  {
    id: "S004",
    name: "Sarah Davis",
    parentName: "Jennifer Davis",
    parentContact: "+1234567893",
  },
  {
    id: "S005",
    name: "David Wilson",
    parentName: "Thomas Wilson",
    parentContact: "+1234567894",
  },
];

const defaultMessages: Message[] = [
  {
    id: "msg_1",
    studentName: "John Smith",
    parentName: "David Smith",
    content:
      "Dear Mr. Smith,\n\nI hope this message finds you well. I wanted to inform you that John has been consistently attending all classes this month and has shown great improvement in participation. Keep encouraging this excellent attendance!\n\nBest regards,\nMs. Johnson",
    timestamp: "2023-06-15T10:30:00Z",
    status: "sent",
  },
  {
    id: "msg_2",
    studentName: "Emily Johnson",
    parentName: "Sarah Johnson",
    content:
      "Dear Mrs. Johnson,\n\nI'm writing to express concern about Emily's recent absences. She has missed 3 consecutive classes, which may impact her academic progress. Could we schedule a brief meeting to discuss this matter?\n\nThank you,\nMr. Williams",
    timestamp: "2023-06-10T14:15:00Z",
    status: "sent",
  },
  {
    id: "msg_3",
    studentName: "Michael Brown",
    parentName: "Robert Brown",
    content:
      "Dear Mr. Brown,\n\nThis is a reminder that Michael arrived late to class three times this week. While we understand occasional delays, consistent tardiness disrupts the learning environment. Please ensure Michael arrives on time for future classes.\n\nRegards,\nMs. Thompson",
    timestamp: "2023-06-08T09:45:00Z",
    status: "draft",
  },
];

export default MessageDrafting;
