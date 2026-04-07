"use client";

import {
  Table, TableHeader, TableBody, TableRow,
  TableHead, TableCell,
} from "@/components/ui/table";
import type { Guest, GuestGroup } from "@/types";
import type { ColKey } from "../constants/guests.constants";
import { GuestTableRow, type GuestRowProps } from "./guests-table-row";

interface GuestsTableProps extends Omit<GuestRowProps, "guest" | "index"> {
  filteredGuests: Guest[];
  groups: GuestGroup[];
  searchQuery: string;
  rsvpFilter: string;
  groupFilter: string;
}

export function GuestsTable({ filteredGuests, searchQuery, rsvpFilter, groupFilter, show, ...rowProps }: GuestsTableProps) {
  return (
    <div className="bg-white rounded-xl border border-border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Nombre</TableHead>
            {show("lastName")  && <TableHead>Apellidos</TableHead>}
            {show("email")     && <TableHead className="hidden md:table-cell">@</TableHead>}
            <TableHead>Plato</TableHead>
            {show("allergies") && <TableHead className="hidden lg:table-cell">Alergias</TableHead>}
            {show("address")   && <TableHead className="hidden lg:table-cell">Dirección</TableHead>}
            {show("transport") && <TableHead className="hidden lg:table-cell">Transporte</TableHead>}
            {show("list")      && <TableHead className="hidden lg:table-cell">Lista</TableHead>}
            {show("role")      && <TableHead className="hidden md:table-cell">Rol</TableHead>}
            {show("group")     && <TableHead className="hidden md:table-cell">Grupo</TableHead>}
            <TableHead>RSVP</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredGuests.map((guest, i) => (
            <GuestTableRow key={guest.id} guest={guest} index={i} show={show} {...rowProps} />
          ))}
          {filteredGuests.length === 0 && (
            <TableRow>
              <TableCell colSpan={14} className="text-center py-12 text-brand text-[14px]">
                {searchQuery || rsvpFilter || groupFilter
                  ? "No se encontraron invitados con esos filtros"
                  : "No hay invitados aún. Usa el botón 'Añadir invitado' para empezar."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
