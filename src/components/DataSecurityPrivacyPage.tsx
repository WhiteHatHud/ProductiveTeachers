import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Lock,
  FileText,
  UserCheck,
  Server,
  ArrowLeft,
  Globe,
  AlertTriangle,
} from "lucide-react";

const DataSecurityPrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/login">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-bold">
                Data Security & Privacy
              </CardTitle>
            </div>
            <CardDescription>
              Learn how we protect your data and respect your privacy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="security" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="security">
                  <Lock className="h-4 w-4 mr-2" /> Security
                </TabsTrigger>
                <TabsTrigger value="privacy">
                  <UserCheck className="h-4 w-4 mr-2" /> Privacy
                </TabsTrigger>
                <TabsTrigger value="compliance">
                  <FileText className="h-4 w-4 mr-2" /> Compliance
                </TabsTrigger>
              </TabsList>

              <TabsContent value="security" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" /> Data Security
                    Measures
                  </h3>
                  <p>
                    We implement industry-standard security measures to protect
                    your data from unauthorized access, disclosure, alteration,
                    and destruction.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md">Encryption</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          All data is encrypted at rest and in transit using
                          AES-256 and TLS 1.2+ protocols.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md">
                          Access Controls
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Role-based access controls ensure that only authorized
                          personnel can access sensitive information.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md">
                          Regular Audits
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          We conduct regular security audits and vulnerability
                          assessments to identify and address potential security
                          issues.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md">
                          Secure Infrastructure
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Our infrastructure is hosted in secure data centers
                          with physical security measures and redundant systems.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" /> Privacy
                    Policy
                  </h3>
                  <p>
                    We are committed to protecting your privacy and ensuring
                    that your personal information is handled in a safe and
                    responsible manner.
                  </p>

                  <div className="space-y-4 mt-4">
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Data Collection</h4>
                      <p className="text-sm mt-1">
                        We collect only the information necessary to provide our
                        attendance tracking services, including names, contact
                        information, and attendance records.
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Data Usage</h4>
                      <p className="text-sm mt-1">
                        Your data is used solely for the purpose of providing
                        attendance tracking services, generating reports, and
                        sending notifications as configured in your settings.
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Data Sharing</h4>
                      <p className="text-sm mt-1">
                        We do not sell, rent, or lease your personal information
                        to third parties. Data may be shared with third-party
                        service providers only as necessary to provide our
                        services.
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Your Rights</h4>
                      <p className="text-sm mt-1">
                        You have the right to access, correct, or delete your
                        personal information at any time. You can also request a
                        copy of all data we hold about you.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="compliance" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" /> Regulatory
                    Compliance
                  </h3>
                  <p>
                    We adhere to relevant data protection regulations and
                    industry standards to ensure the proper handling of your
                    information.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">GDPR Compliance</h4>
                        <p className="text-sm mt-1">
                          We comply with the General Data Protection Regulation
                          (GDPR) for users in the European Union, ensuring your
                          rights to data access, rectification, and erasure.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Server className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Data Retention</h4>
                        <p className="text-sm mt-1">
                          We retain your data only for as long as necessary to
                          provide our services or as required by law, after
                          which it is securely deleted.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <AlertTriangle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          Data Breach Notification
                        </h4>
                        <p className="text-sm mt-1">
                          In the unlikely event of a data breach, we will notify
                          affected users and relevant authorities within 72
                          hours of discovery.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Third-Party Audits</h4>
                        <p className="text-sm mt-1">
                          We undergo regular third-party security audits to
                          verify our compliance with industry standards and best
                          practices.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Last updated: May 15, 2023
            </p>
            <Link to="/login">
              <Button>Back to Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DataSecurityPrivacyPage;
