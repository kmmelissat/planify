"use client";

import { useEffect } from "react";
import { useAvailabilityStore } from "@/store/use-availability-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const dayLabels: Record<string, string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};

export default function DisponibilidadPage() {
  const { blocks, constraints, isLoading, fetchAll } = useAvailabilityStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Disponibilidad</h1>
        <p className="text-sm text-muted-foreground">
          Bloques de tiempo libres y restricciones que el agente debe respetar
          al proponer un plan.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bloques de disponibilidad</CardTitle>
          <CardDescription>Tiempo libre declarado por día.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {isLoading && (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          )}
          {!isLoading && blocks.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No hay bloques de disponibilidad registrados.
            </p>
          )}
          {blocks.map((block) => (
            <div
              key={block.id}
              className="flex items-center justify-between rounded-md border px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <Badge variant="outline">{dayLabels[block.day]}</Badge>
                <span className="text-sm">
                  {block.startTime} – {block.endTime}
                </span>
              </div>
              {block.label && (
                <span className="text-xs text-muted-foreground">
                  {block.label}
                </span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Restricciones</CardTitle>
          <CardDescription>
            Horarios ocupados, tareas fijas y límites de sesión.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {!isLoading && constraints.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No hay restricciones registradas.
            </p>
          )}
          {constraints.map((constraint) => (
            <div
              key={constraint.id}
              className="flex flex-col gap-1 rounded-md border px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {constraint.type.replace(/_/g, " ")}
                </Badge>
                {constraint.day && (
                  <span className="text-xs text-muted-foreground">
                    {dayLabels[constraint.day]}
                    {constraint.startTime &&
                      ` · ${constraint.startTime}–${constraint.endTime}`}
                  </span>
                )}
                {constraint.maxSessionMinutes && (
                  <span className="text-xs text-muted-foreground">
                    Máx. {constraint.maxSessionMinutes} min/sesión
                  </span>
                )}
              </div>
              <p className="text-sm">{constraint.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
