"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useAvailabilityStore } from "@/store/use-availability-store";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { AvailabilityBlockFormDialog } from "@/components/availability/availability-block-form-dialog";
import {
  ConstraintFormDialog,
  constraintTypeLabels,
} from "@/components/availability/constraint-form-dialog";
import { dayLabels } from "@/lib/constants/weekday";
import type { AvailabilityBlock, Constraint } from "@/lib/types";

type DeleteTarget =
  | { kind: "block"; id: string; label: string }
  | { kind: "constraint"; id: string; label: string };

export default function DisponibilidadPage() {
  const {
    blocks,
    constraints,
    isLoading,
    fetchAll,
    createBlock,
    updateBlock,
    removeBlock,
    createConstraint,
    updateConstraint,
    removeConstraint,
  } = useAvailabilityStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<AvailabilityBlock | null>(null);
  const [blockDialogSession, setBlockDialogSession] = useState(0);

  const [constraintDialogOpen, setConstraintDialogOpen] = useState(false);
  const [editingConstraint, setEditingConstraint] = useState<Constraint | null>(null);
  const [constraintDialogSession, setConstraintDialogSession] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  function openCreateBlock() {
    setEditingBlock(null);
    setBlockDialogSession((s) => s + 1);
    setBlockDialogOpen(true);
  }

  function openEditBlock(block: AvailabilityBlock) {
    setEditingBlock(block);
    setBlockDialogSession((s) => s + 1);
    setBlockDialogOpen(true);
  }

  function openCreateConstraint() {
    setEditingConstraint(null);
    setConstraintDialogSession((s) => s + 1);
    setConstraintDialogOpen(true);
  }

  function openEditConstraint(constraint: Constraint) {
    setEditingConstraint(constraint);
    setConstraintDialogSession((s) => s + 1);
    setConstraintDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.kind === "block") {
        await removeBlock(deleteTarget.id);
        toast.success("Bloque eliminado.");
      } else {
        await removeConstraint(deleteTarget.id);
        toast.success("Restricción eliminada.");
      }
    } catch {
      toast.error("No se pudo eliminar. Intentá de nuevo.");
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Contexto"
        title="Disponibilidad"
        description="Bloques de tiempo libres y restricciones que el agente debe respetar al proponer un plan."
      />

      <Card className="py-6">
        <CardHeader className="px-6">
          <CardTitle className="text-xl font-semibold">
            Bloques de disponibilidad
          </CardTitle>
          <CardDescription>Tiempo libre declarado por día.</CardDescription>
          <CardAction>
            <Button onClick={openCreateBlock} size="sm" className="gap-1.5">
              <Plus className="size-4" /> Agregar bloque
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-2.5 px-6">
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
              className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Badge variant="outline">{dayLabels[block.day]}</Badge>
                <span className="text-sm">
                  {block.startTime} – {block.endTime}
                </span>
                {block.label && (
                  <span className="text-xs text-muted-foreground">
                    {block.label}
                  </span>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Acciones del bloque"
                      className="rounded-full text-muted-foreground"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEditBlock(block)}>
                    <Pencil />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() =>
                      setDeleteTarget({
                        kind: "block",
                        id: block.id,
                        label: `${dayLabels[block.day]} ${block.startTime}–${block.endTime}`,
                      })
                    }
                  >
                    <Trash2 />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="py-6">
        <CardHeader className="px-6">
          <CardTitle className="text-xl font-semibold">
            Restricciones
          </CardTitle>
          <CardDescription>
            Horarios ocupados, tareas fijas y límites de sesión.
          </CardDescription>
          <CardAction>
            <Button onClick={openCreateConstraint} size="sm" className="gap-1.5">
              <Plus className="size-4" /> Agregar restricción
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-2.5 px-6">
          {!isLoading && constraints.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No hay restricciones registradas.
            </p>
          )}
          {constraints.map((constraint) => (
            <div
              key={constraint.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-border px-4 py-3"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    {constraintTypeLabels[constraint.type]}
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
                <p className="text-sm text-foreground/90">
                  {constraint.description}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Acciones de la restricción"
                      className="shrink-0 rounded-full text-muted-foreground"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => openEditConstraint(constraint)}
                  >
                    <Pencil />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() =>
                      setDeleteTarget({
                        kind: "constraint",
                        id: constraint.id,
                        label: constraintTypeLabels[constraint.type],
                      })
                    }
                  >
                    <Trash2 />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </CardContent>
      </Card>

      <AvailabilityBlockFormDialog
        key={`block-${blockDialogSession}`}
        open={blockDialogOpen}
        onOpenChange={setBlockDialogOpen}
        block={editingBlock}
        onSubmit={async (input) => {
          if (editingBlock) await updateBlock(editingBlock.id, input);
          else await createBlock(input);
        }}
      />

      <ConstraintFormDialog
        key={`constraint-${constraintDialogSession}`}
        open={constraintDialogOpen}
        onOpenChange={setConstraintDialogOpen}
        constraint={editingConstraint}
        onSubmit={async (input) => {
          if (editingConstraint) await updateConstraint(editingConstraint.id, input);
          else await createConstraint(input);
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={
          deleteTarget?.kind === "block"
            ? "¿Eliminar este bloque?"
            : "¿Eliminar esta restricción?"
        }
        description={
          deleteTarget
            ? `Se eliminará "${deleteTarget.label}". Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
