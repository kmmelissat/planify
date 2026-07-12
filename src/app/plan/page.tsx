"use client";

import { useEffect } from "react";
import { AlertTriangle, Check, RefreshCw, X } from "lucide-react";
import { usePlanStore } from "@/store/use-plan-store";
import { usePlanViewStore } from "@/store/use-plan-view-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarView } from "@/components/plan/calendar-view";
import { KanbanView } from "@/components/plan/kanban-view";
import { TableView } from "@/components/plan/table-view";
import { PageHeader } from "@/components/layout/page-header";

export default function PlanPage() {
  const { currentPlan, isGenerating, fetchCurrentPlan, generateNewPlan, setApprovalStatus } =
    usePlanStore();
  const { viewMode, setViewMode } = usePlanViewStore();

  useEffect(() => {
    fetchCurrentPlan();
  }, [fetchCurrentPlan]);

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Propuesta"
        title="Plan propuesto"
        description="El agente propone; tú decides. Nada queda final sin tu aprobación."
        actions={
          <Button
            onClick={() => generateNewPlan()}
            disabled={isGenerating}
            className="gap-2"
          >
            <RefreshCw className={isGenerating ? "size-4 animate-spin" : "size-4"} />
            {currentPlan ? "Pedir nueva versión" : "Generar plan"}
          </Button>
        }
      />

      {!currentPlan && !isGenerating && (
        <Card>
          <CardContent className="py-14 text-center text-sm text-muted-foreground">
            Todavía no hay un plan generado. Usa el botón &quot;Generar
            plan&quot; para pedirle una propuesta al agente.
          </CardContent>
        </Card>
      )}

      {currentPlan && (
        <>
          <Card className="py-6">
            <CardHeader className="flex flex-col gap-3 px-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2.5 text-xl font-semibold">
                  Versión {currentPlan.version}
                  <Badge variant="outline" className="capitalize">
                    {currentPlan.approvalStatus}
                  </Badge>
                </CardTitle>
                <CardDescription className="mt-1.5 max-w-2xl leading-relaxed">
                  {currentPlan.overallJustification}
                </CardDescription>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => setApprovalStatus("rechazado")}
                >
                  <X className="size-4" /> Rechazar
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setApprovalStatus("aprobado")}
                >
                  <Check className="size-4" /> Aprobar
                </Button>
              </div>
            </CardHeader>
            {currentPlan.conflicts.length > 0 && (
              <CardContent className="flex flex-col gap-2.5 px-6">
                {currentPlan.conflicts.map((conflict) => (
                  <Alert
                    key={conflict.id}
                    variant={
                      conflict.severity === "critico" ? "destructive" : "default"
                    }
                  >
                    <AlertTriangle className="size-4" />
                    <AlertTitle className="capitalize">
                      {conflict.type.replace(/_/g, " ")}
                    </AlertTitle>
                    <AlertDescription>{conflict.message}</AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            )}
          </Card>

          <Tabs
            value={viewMode}
            onValueChange={(value) =>
              setViewMode(value as typeof viewMode)
            }
          >
            <TabsList>
              <TabsTrigger value="calendario">Calendario</TabsTrigger>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="tabla">Lista priorizada</TabsTrigger>
            </TabsList>
            <TabsContent value="calendario" className="mt-5">
              <CalendarView items={currentPlan.items} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-5">
              <KanbanView items={currentPlan.items} />
            </TabsContent>
            <TabsContent value="tabla" className="mt-5">
              <Card className="py-0">
                <CardContent className="p-0">
                  <TableView items={currentPlan.items} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
