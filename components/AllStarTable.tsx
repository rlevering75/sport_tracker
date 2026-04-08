"use client";

import { useState, useTransition } from "react";

type Row = {
  rank: number | null;
  name: string;
  yearsActive: string | null;
  allstarSeasons: number | null;
  pts100: string | null;
  ast100: string | null;
  reb100: string | null;
  stl100: string | null;
  blk100: string | null;
  ptsCreated100: string | null;
  bpm: string | null;
  dbpm: string | null;
  mvps: number | null;
  finalsMvps: number | null;
  championships: number | null;
  allNbaTotal: number | null;
  dpoy: number | null;
};

type SortKey =
  | "pts_created_100" | "pts_100" | "ast_100" | "reb_100"
  | "stl_100" | "blk_100" | "bpm" | "dbpm"
  | "mvps" | "championships" | "all_nba_total";

const COLUMNS: { label: string; key: SortKey; numeric?: boolean }[] = [
  { label: "PTS",    key: "pts_100",         numeric: true },
  { label: "AST",    key: "ast_100",         numeric: true },
  { label: "REB",    key: "reb_100",         numeric: true },
  { label: "STL",    key: "stl_100",         numeric: true },
  { label: "BLK",    key: "blk_100",         numeric: true },
  { label: "PTS+",   key: "pts_created_100", numeric: true },
  { label: "BPM",    key: "bpm",             numeric: true },
  { label: "DBPM",   key: "dbpm",            numeric: true },
  { label: "Rings",  key: "championships",   numeric: true },
  { label: "Awards", key: "mvps",            numeric: false },
];

function fmt(v: string | number | null, decimals = 1) {
  if (v === null || v === undefined || String(v).trim() === "") return "—";
  const n = Number(v);
  return isNaN(n) ? "—" : n.toFixed(decimals);
}

function badges(row: Row) {
  const b: string[] = [];
  if ((row.mvps ?? 0) > 0)       b.push(`${row.mvps}× MVP`);
  if ((row.finalsMvps ?? 0) > 0) b.push(`${row.finalsMvps}× FMVP`);
  if ((row.dpoy ?? 0) > 0)       b.push(`${row.dpoy}× DPOY`);
  return b;
}

export default function AllStarTable({ initialRows }: { initialRows: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [sortKey, setSortKey] = useState<SortKey>("pts_created_100");
  const [isPending, startTransition] = useTransition();

  function handleSort(key: SortKey) {
    setSortKey(key);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/allstars?sort=${key}&order=desc&limit=10`);
        const data = await res.json();
        setRows(data.rows ?? []);
      } catch {
        // keep current rows on error
      }
    });
  }

  return (
    <div className={`glass rounded-2xl overflow-x-auto transition-opacity duration-200 ${isPending ? "opacity-50" : "opacity-100"}`}>
      {/* Header */}
      <div className="min-w-[1040px] grid grid-cols-14 gap-2 px-5 py-3 bg-white/5 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-white/10">
        <span className="col-span-1 text-center">#</span>
        <span className="col-span-3">Player</span>
        {COLUMNS.map((col) => (
          <button
            key={col.key}
            onClick={() => handleSort(col.key)}
            className={`col-span-1 text-center flex items-center justify-center gap-1 hover:text-white transition-colors cursor-pointer select-none ${
              sortKey === col.key
                ? col.key === "pts_created_100"
                  ? "text-blue-400"
                  : "text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>{col.label}</span>
            {sortKey === col.key ? (
              <span className="text-[10px]">▼</span>
            ) : (
              <span className="text-[10px] opacity-30">▼</span>
            )}
          </button>
        ))}
      </div>

      <div className="min-w-[1040px] [&>*:last-child]:border-b-0">
        {rows.map((p, i) => {
          const badgeList = badges(p);
          return (
            <div
              key={p.name}
              className="grid grid-cols-14 gap-2 px-5 py-4 hover:bg-white/5 transition-colors border-b border-white/5"
            >
              {/* Rank */}
              <span className="col-span-1 text-center text-slate-500 font-mono text-sm self-center">
                {i + 1}
              </span>

              {/* Player info */}
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {p.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-white font-medium text-sm leading-tight">{p.name}</p>
                  <p className="text-slate-500 text-xs">
                    {p.yearsActive} · {p.allstarSeasons}× AS
                  </p>
                </div>
              </div>

              {/* Per-100 stats */}
              <span className={`col-span-1 text-center text-sm self-center font-mono ${sortKey === "pts_100" ? "text-white font-bold" : "text-slate-200"}`}>
                {fmt(p.pts100)}
              </span>
              <span className={`col-span-1 text-center text-sm self-center font-mono ${sortKey === "ast_100" ? "text-white font-bold" : "text-slate-200"}`}>
                {fmt(p.ast100)}
              </span>
              <span className={`col-span-1 text-center text-sm self-center font-mono ${sortKey === "reb_100" ? "text-white font-bold" : "text-slate-200"}`}>
                {fmt(p.reb100)}
              </span>
              <span className={`col-span-1 text-center text-sm self-center font-mono ${sortKey === "stl_100" ? "text-white font-bold" : "text-slate-200"}`}>
                {fmt(p.stl100)}
              </span>
              <span className={`col-span-1 text-center text-sm self-center font-mono ${sortKey === "blk_100" ? "text-white font-bold" : "text-slate-200"}`}>
                {fmt(p.blk100)}
              </span>

              {/* Points Created */}
              <span className="col-span-1 text-center self-center">
                <span className={`font-bold text-sm px-2 py-0.5 rounded font-mono ${sortKey === "pts_created_100" ? "bg-blue-600/30 text-blue-200" : "bg-blue-600/10 text-blue-400"}`}>
                  {fmt(p.ptsCreated100)}
                </span>
              </span>

              {/* BPM */}
              <span className={`col-span-1 text-center text-sm self-center font-mono ${
                sortKey === "bpm" || sortKey === "dbpm"
                  ? "text-white font-bold"
                  : Number(p.bpm) >= 5
                  ? "text-green-400"
                  : Number(p.bpm) >= 0
                  ? "text-slate-300"
                  : "text-red-400"
              }`}>
                {Number(p.bpm) > 0 ? "+" : ""}{fmt(sortKey === "dbpm" ? p.dbpm : p.bpm)}
              </span>

              {/* Championships */}
              <span className={`col-span-1 text-center text-sm self-center font-mono font-bold ${
                sortKey === "championships"
                  ? "text-yellow-300"
                  : (p.championships ?? 0) > 0
                  ? "text-yellow-400"
                  : "text-slate-600"
              }`}>
                {(p.championships ?? 0) > 0 ? p.championships : "—"}
              </span>

              {/* Awards */}
              <div className="col-span-1 flex flex-wrap gap-1 self-center justify-center">
                {badgeList.slice(0, 2).map((b) => (
                  <span key={b} className="text-[10px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded font-medium whitespace-nowrap">
                    {b}
                  </span>
                ))}
                {(p.allNbaTotal ?? 0) > 0 && (
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-medium">
                    {p.allNbaTotal}× All-NBA
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
