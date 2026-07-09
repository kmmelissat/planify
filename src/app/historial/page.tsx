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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Historial y trazabilidad</h1>
        <p className="text-sm text-muted-foreground">
          Cada versión del plan y cada decisión humana queda registrada.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Versión</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prompt usado</TableHead>
                <TableHead>Nota</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Todavía no hay eventos registrados.
                  </TableCell>
                </TableRow>
              )}
              {history.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="whitespace-nowrap text-sm">
                    {new Date(entry.createdAt).toLocaleString("es-CO")}
                  </TableCell>
                  <TableCell>v{entry.version}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {actionLabels[entry.action] ?? entry.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">
                    {entry.approvalStatus}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                    {entry.promptUsed}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
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
