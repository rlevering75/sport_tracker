"use client";

import { useState, useTransition, useRef } from "react";

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
  tsPct: string | null;
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
  | "stl_100" | "blk_100" | "bpm" | "dbpm" | "ts_pct"
  | "mvps" | "championships" | "all_nba_total" | "finals_mvps" | "dpoy";

const COLUMNS: { label: string; key: SortKey }[] = [
  { label: "PTS",    key: "pts_100"         },
  { label: "AST",    key: "ast_100"         },
  { label: "REB",    key: "reb_100"         },
  { label: "STL",    key: "stl_100"         },
  { label: "BLK",    key: "blk_100"         },
  { label: "PTS+",   key: "pts_created_100" },
  { label: "TS%",    key: "ts_pct"          },
  { label: "BPM",    key: "bpm"             },
  { label: "Rings",  key: "championships"   },
  { label: "DBPM",   key: "dbpm"            },
  { label: "Awards", key: "mvps"            },
];

const LIMIT = 50;

function fmt(v: string | number | null, decimals = 1) {
  if (v === null || v === undefined || String(v).trim() === "") return "—";
  const n = Number(v);
  return isNaN(n) ? "—" : n.toFixed(decimals);
}


function buildUrl(sort: string, q: string, offset: number) {
  let url = `/api/allstars?sort=${sort}&order=desc&limit=${LIMIT}&offset=${offset}`;
  if (q.trim()) url += `&q=${encodeURIComponent(q.trim())}`;
  return url;
}

export default function AllStarTable({
  initialRows,
  initialTotal,
}: {
  initialRows: Row[];
  initialTotal: number;
}) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [total, setTotal] = useState(initialTotal);
  const [loaded, setLoaded] = useState(initialRows.length);
  const [sortKey, setSortKey] = useState<SortKey>("pts_created_100");
  const [search, setSearch] = useState("");

  const [isSorting, startSort] = useTransition();
  const [isSearching, startSearch] = useTransition();
  const [isLoadingMore, startLoadMore] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const isPending = isSorting || isSearching;
  const hasMore = loaded < total;

  function handleSort(key: SortKey) {
    setSortKey(key);
    startSort(async () => {
      try {
        const res = await fetch(buildUrl(key, search, 0));
        const data = await res.json();
        setRows(data.rows ?? []);
        setTotal(data.total ?? 0);
        setLoaded(data.rows?.length ?? 0);
      } catch {}
    });
  }

  function handleSearchChange(q: string) {
    setSearch(q);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startSearch(async () => {
        try {
          const res = await fetch(buildUrl(sortKey, q, 0));
          const data = await res.json();
          setRows(data.rows ?? []);
          setTotal(data.total ?? 0);
          setLoaded(data.rows?.length ?? 0);
        } catch {}
      });
    }, 300);
  }

  function handleShowMore() {
    startLoadMore(async () => {
      try {
        const res = await fetch(buildUrl(sortKey, search, loaded));
        const data = await res.json();
        setRows(prev => [...prev, ...(data.rows ?? [])]);
        setTotal(data.total ?? 0);
        setLoaded(prev => prev + (data.rows?.length ?? 0));
      } catch {}
    });
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search players..."
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors text-xs"
            >
              ✕
            </button>
          )}
        </div>
        <span className="text-slate-500 text-sm whitespace-nowrap">
          {search ? `${total} result${total !== 1 ? "s" : ""}` : `${total} players`}
        </span>
      </div>

      {/* Table */}
      <div className={`glass rounded-2xl overflow-x-auto transition-opacity duration-200 ${isPending ? "opacity-50" : "opacity-100"}`}>
        {/* Header */}
        <div className="min-w-[1120px] grid grid-cols-15 gap-2 px-5 py-3 bg-white/5 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-white/10">
          <span className="col-span-1 text-center">#</span>
          <span className="col-span-3">Player</span>
          {COLUMNS.map((col) => (
            <button
              key={col.key}
              onClick={() => handleSort(col.key)}
              className={`col-span-1 text-center flex items-center justify-center gap-1 hover:text-white transition-colors cursor-pointer select-none ${
                sortKey === col.key
                  ? col.key === "pts_created_100" ? "text-blue-400" : "text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>{col.label}</span>
              <span className={`text-[10px] ${sortKey === col.key ? "" : "opacity-30"}`}>▼</span>
            </button>
          ))}
        </div>

        {/* Rows */}
        <div className="min-w-[1120px] [&>*:last-child]:border-b-0">
          {rows.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-500 text-sm">
              No players found matching &ldquo;{search}&rdquo;
            </div>
          ) : rows.map((p, i) => {
            return (
              <div
                key={`${p.name}-${i}`}
                className="grid grid-cols-15 gap-2 px-5 py-3.5 hover:bg-white/5 transition-colors border-b border-white/5"
              >
                {/* Rank */}
                <span className="col-span-1 text-center text-slate-500 font-mono text-sm self-center">
                  {i + 1}
                </span>

                {/* Player */}
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {p.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm leading-tight">{p.name}</p>
                    <p className="text-slate-500 text-xs">{p.yearsActive} · {p.allNbaTotal ?? 0}× All-NBA</p>
                  </div>
                </div>

                {/* PTS */}
                <span className={`col-span-1 text-center text-sm self-center font-mono ${sortKey === "pts_100" ? "text-white font-bold" : "text-slate-200"}`}>
                  {fmt(p.pts100)}
                </span>
                {/* AST */}
                <span className={`col-span-1 text-center text-sm self-center font-mono ${sortKey === "ast_100" ? "text-white font-bold" : "text-slate-200"}`}>
                  {fmt(p.ast100)}
                </span>
                {/* REB */}
                <span className={`col-span-1 text-center text-sm self-center font-mono ${sortKey === "reb_100" ? "text-white font-bold" : "text-slate-200"}`}>
                  {fmt(p.reb100)}
                </span>
                {/* STL */}
                <span className={`col-span-1 text-center text-sm self-center font-mono ${sortKey === "stl_100" ? "text-white font-bold" : "text-slate-200"}`}>
                  {fmt(p.stl100)}
                </span>
                {/* BLK */}
                <span className={`col-span-1 text-center text-sm self-center font-mono ${sortKey === "blk_100" ? "text-white font-bold" : "text-slate-200"}`}>
                  {fmt(p.blk100)}
                </span>

                {/* PTS+ */}
                <span className="col-span-1 text-center self-center">
                  <span className={`font-bold text-sm px-2 py-0.5 rounded font-mono ${sortKey === "pts_created_100" ? "bg-blue-600/30 text-blue-200" : "bg-blue-600/10 text-blue-400"}`}>
                    {fmt(p.ptsCreated100)}
                  </span>
                </span>

                {/* TS% */}
                <span className={`col-span-1 text-center text-sm self-center font-mono ${
                  sortKey === "ts_pct" ? "text-white font-bold"
                  : Number(p.tsPct) >= 60 ? "text-green-400"
                  : Number(p.tsPct) >= 55 ? "text-slate-200"
                  : "text-slate-400"
                }`}>
                  {p.tsPct ? `${fmt(p.tsPct)}%` : "—"}
                </span>

                {/* BPM */}
                <span className={`col-span-1 text-center text-sm self-center font-mono ${
                  sortKey === "bpm" ? "text-white font-bold"
                  : Number(p.bpm) >= 5 ? "text-green-400"
                  : Number(p.bpm) >= 0 ? "text-slate-300"
                  : "text-red-400"
                }`}>
                  {Number(p.bpm) > 0 ? "+" : ""}{fmt(p.bpm)}
                </span>

                {/* Rings */}
                <span className={`col-span-1 text-center text-sm self-center font-mono font-bold ${
                  sortKey === "championships" ? "text-yellow-300"
                  : (p.championships ?? 0) > 0 ? "text-yellow-400"
                  : "text-slate-600"
                }`}>
                  {(p.championships ?? 0) > 0 ? p.championships : "—"}
                </span>

                {/* DBPM */}
                <span className={`col-span-1 text-center text-sm self-center font-mono ${
                  sortKey === "dbpm" ? "text-white font-bold"
                  : Number(p.dbpm) >= 2 ? "text-green-400"
                  : Number(p.dbpm) >= 0 ? "text-slate-300"
                  : "text-red-400"
                }`}>
                  {Number(p.dbpm) > 0 ? "+" : ""}{fmt(p.dbpm)}
                </span>

                {/* Awards: MVP / Finals MVP / DPOY */}
                <div className="col-span-1 flex flex-wrap gap-1 self-center justify-center">
                  {(p.mvps ?? 0) > 0 && (
                    <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded font-medium whitespace-nowrap">
                      {p.mvps}× MVP
                    </span>
                  )}
                  {(p.finalsMvps ?? 0) > 0 && (
                    <span className="text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded font-medium whitespace-nowrap">
                      {p.finalsMvps}× FMVP
                    </span>
                  )}
                  {(p.dpoy ?? 0) > 0 && (
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-medium whitespace-nowrap">
                      {p.dpoy}× DPOY
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Show More */}
      {hasMore && !search && (
        <div className="text-center pt-2">
          <button
            onClick={handleShowMore}
            disabled={isLoadingMore}
            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium px-8 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoadingMore
              ? "Loading..."
              : `Show More Players (${loaded} of ${total})`}
          </button>
        </div>
      )}
    </div>
  );
}
