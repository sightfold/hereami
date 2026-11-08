import { markOf, type MarkMap } from "@/utils/childScore";
import { childName } from "@/utils/children";
import { formatShortDay } from "@/utils/date";
import type { Child, Service } from "@/utils/types";

export type GridTable = { head: string[]; rows: string[][] };

const presentCell = "✓";
const absentCell = "✗";

const markCell = (status?: string) => {
  if (status === "present") return presentCell;
  return status === "absent" ? absentCell : "";
};

export const buildGrid = (children: Child[], services: Service[], map: MarkMap): GridTable => ({
  head: ["S/N", "Name", ...services.map((item) => formatShortDay(item.date)), "Total"],
  rows: children.map((child) => {
    const cells = services.map((service) => markCell(markOf(map, service.id, child.id)));
    const total = cells.filter((cell) => cell === presentCell).length;
    return [String(child.serial), childName(child), ...cells, String(total)];
  }),
});

const asLetter = (cell: string) => cell.replace(presentCell, "P").replace(absentCell, "A");

const escapeCell = (value: string) =>
  /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;

export const exportGridCsv = (table: GridTable, name: string) => {
  const csv = [table.head, ...table.rows]
    .map((row) => row.map((cell) => escapeCell(asLetter(cell))).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([`﻿${csv}\n`], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportGridPdf = async (table: GridTable, title: string, name: string) => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(14);
  doc.text(title, 14, 16);
  autoTable(doc, {
    startY: 22,
    head: [table.head],
    body: table.rows.map((row) => row.map(asLetter)),
    styles: { fontSize: 9, halign: "center" },
    columnStyles: { 1: { halign: "left" } },
    headStyles: { fillColor: [39, 39, 42] },
  });
  doc.save(`${name}.pdf`);
};
