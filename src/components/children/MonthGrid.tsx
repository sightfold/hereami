import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { cn } from "@/utils/cn";
import type { GridTable } from "@/utils/childExport";

const nameColumn = 1;

const stickyName = "paper sticky left-0 z-1 text-base";

const toneOf = (cell: string) => {
  if (cell === "✓") return "text-ok";
  return cell === "✗" ? "text-bad" : "";
};

const MonthGrid = ({ grid }: { grid: GridTable }) => (
  <TableContainer className="paper max-h-[70vh] rounded-md border border-line shadow-sm">
    <Table size="small" stickyHeader aria-label="Monthly register">
      <TableHead>
        <TableRow>
          {grid.head.map((label, index) => (
            <TableCell
              key={label}
              align={index === nameColumn ? "left" : "center"}
              className={cn(
                "paper border-b-2 border-rule-red font-semibold whitespace-nowrap",
                index === nameColumn && "sticky left-0 z-3",
              )}
            >
              {label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {grid.rows.map((row) => (
          <TableRow key={row[0]} hover>
            {row.map((cell, index) => (
              <TableCell
                key={grid.head[index]}
                align={index === nameColumn ? "left" : "center"}
                className={cn(
                  "border-rule-blue whitespace-nowrap",
                  toneOf(cell),
                  index === nameColumn && stickyName,
                  index === row.length - 1 && "font-semibold",
                )}
              >
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default MonthGrid;
