"use client";

import { useEffect } from "react";
import { usePlanStore } from "@/store/use-plan-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";

const actionLabels: Record<string, string> = {
  generado: "Generado",
  aprobado: "Aprobado",
  editado: "Editado",
  rechazado: "Rechazado",
  replanificado: "Replanificado",
};

export default function HistorialPage() {
  const { history, fetchHistory } = usePlanStore();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Trazabilidad"
        title="Historial"
        description="Cada versión del plan y cada decisión humana queda registrada."
      />

      <Card className="py-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Fecha</TableHead>
                <TableHead>Versión</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prompt usado</TableHead>
                <TableHead className="pr-6">Nota</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    Todavía no hay eventos registrados.
                  </TableCell>
                </TableRow>
              )}
              {history.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="whitespace-nowrap py-4 pl-6 text-sm text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleString("es-CO")}
                  </TableCell>
                  <TableCell className="text-xs font-medium tabular-nums">
                    v{entry.version}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {actionLabels[entry.action] ?? entry.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">
                    {entry.approvalStatus}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                    {entry.promptUsed}
                  </TableCell>
                  <TableCell className="max-w-xs truncate pr-6 text-xs text-muted-foreground">
                    {entry.userNote ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
