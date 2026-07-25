"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, User, Calendar } from "lucide-react";
import { formatDateFnsLocale } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { PersonalInfosSection } from "./personal-infos-section";
import { ParticipationInfosSection } from "./participation-infos-section";
import { TimelineItem } from "../conference-details/timeline";
import { useGetConferenceRegistrationById } from "../../hooks/use-get-registrations";
import {
  TabsContentNew,
  TabsListNew,
  TabsNew,
  TabsTriggerNew,
} from "@/components/ui/tabs-new";
import LoadingComponent from "@/components/loadingComponent";
import StatusActionPanelRegistration from "./status-action-panel";

export function ConferenceRegistrationDetailsSection({
  registrationId,
}: {
  registrationId: string;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const { data, isLoading } = useGetConferenceRegistrationById(registrationId);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">
            Détails de l'inscription
          </h1>
        </div>
      </div>

      {isLoading ? (
        <LoadingComponent />
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-border">
              <CardHeader className="bg-muted/30 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">
                      {data?.data.lastName} {data?.data.firstName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span className="text-sm">
                        {formatDateFnsLocale(data.data.createdAt)}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 dark:bg-slate-950">
                <TabsNew
                  defaultValue="personal"
                  className="w-full"
                  onValueChange={setActiveTab}
                >
                  <TabsListNew className="w-full justify-start rounded-none border-b border-border bg-transparent h-12 p-0">
                    <TabsTriggerNew
                      value="personal"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none h-12 px-6"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Informations personnelles
                    </TabsTriggerNew>
                    <TabsTriggerNew
                      value="conference"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none h-12 px-6"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Détails de la conférence
                    </TabsTriggerNew>
                    {/* <TabsTrigger
                    value="payment"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none h-12 px-6"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payment Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="notes"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none h-12 px-6"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Notes & Comms
                  </TabsTrigger> */}
                  </TabsListNew>

                  <TabsContentNew value="personal" className="p-6 pt-4">
                    {data && <PersonalInfosSection registration={data?.data} />}
                  </TabsContentNew>

                  <TabsContentNew value="conference" className="p-6 pt-4">
                    {data && (
                      <ParticipationInfosSection registration={data?.data} />
                    )}
                  </TabsContentNew>

                  {/* <TabsContent value="payment" className="p-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Payment Status
                        </h3>
                        <p className="mt-1 capitalize">
                          {registration.paymentStatus}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Payment Method
                        </h3>
                        <p className="mt-1 capitalize">
                          {registration.paymentMethod.replace("_", " ")}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Amount
                        </h3>
                        <p className="mt-1 font-medium">
                          {registration.paymentAmount} €
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Transaction ID
                        </h3>
                        <p className="mt-1 font-mono text-sm">
                          {registration.transactionId}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Invoice Number
                        </h3>
                        <p className="mt-1">{registration.invoiceNumber}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Actions
                        </h3>
                        <div className="mt-2 space-x-2">
                          <Button size="sm" variant="outline">
                            Send Payment Reminder
                          </Button>
                          <Button size="sm" variant="outline">
                            View Invoice
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent> */}

                  {/* <TabsContent value="notes" className="p-6 pt-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Admin Notes
                      </h3>
                      <div className="space-y-3">
                        {registration.notes.map((note) => (
                          <div
                            key={note.id}
                            className="bg-muted/30 p-3 rounded-md"
                          >
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>{note.author}</span>
                              <span>
                                {formatDate(new Date(note.timestamp))}
                              </span>
                            </div>
                            <p className="text-sm">{note.text}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3">
                        <textarea
                          className="w-full p-3 rounded-md border border-input bg-background min-h-[100px]"
                          placeholder="Add a new note..."
                        />
                        <div className="mt-2 text-right">
                          <Button size="sm">Add Note</Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Communication History
                      </h3>
                      <div className="space-y-3">
                        {registration.communications.map((comm) => (
                          <div
                            key={comm.id}
                            className="bg-muted/30 p-3 rounded-md"
                          >
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span className="capitalize">{comm.type}</span>
                              <span>
                                {formatDate(new Date(comm.timestamp))}
                              </span>
                            </div>
                            <p className="text-sm font-medium">
                              {comm.subject}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3">
                        <Button size="sm" variant="outline" className="w-full">
                          Send New Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent> */}
                </TabsNew>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <StatusActionPanelRegistration
              registrationId={data.data.id}
              currentStatus={data.data.subscriptionStatus}
              statusHistory={data.data.subscriptionStatusHistory}
            />
          </div>
        </div>
      ) : (
        <div className="text-center">Aucun résultat</div>
      )}
    </div>
  );
}
