import { useEffect, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface FilterGroup {
  key: string;
  label: string;
  options: { value: string; label: string; count: number }[];
}

interface Props {
  groups: FilterGroup[];
  /** id of the element containing the filterable `[data-item]` elements. */
  target: string;
  /** Word for the counter, e.g. "entries". */
  noun?: string;
}

type Selection = Record<string, string[]>;

function readUrl(groups: FilterGroup[]): Selection {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(
    groups.map((g) => [
      g.key,
      params.get(g.key)?.split(",").filter(Boolean) ?? [],
    ]),
  );
}

function writeUrl(selection: Selection) {
  const params = new URLSearchParams();
  for (const [key, values] of Object.entries(selection)) {
    if (values.length) params.set(key, values.join(","));
  }
  const query = params.toString();
  history.replaceState(
    null,
    "",
    query ? `?${query}` : window.location.pathname,
  );
}

/**
 * One-line filter bar for a static grid: a dropdown checklist per filter.
 * Items are server-rendered with `data-f-<key>="value value"` attributes;
 * within a filter any checked value matches (OR), across filters all must
 * match (AND). The selection is kept in the URL so filtered views can be
 * shared.
 */
export default function FilterBar({ groups, target, noun = "entries" }: Props) {
  const [selection, setSelection] = useState<Selection>({});
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => setSelection(readUrl(groups)), []);

  useEffect(() => {
    const root = document.getElementById(target);
    if (!root) return;
    const items = [...root.querySelectorAll<HTMLElement>("[data-item]")];
    let visible = 0;
    for (const item of items) {
      const match = Object.entries(selection).every(([key, values]) => {
        if (!values.length) return true;
        const have = (item.getAttribute(`data-f-${key}`) ?? "").split(" ");
        return values.some((v) => have.includes(v));
      });
      item.hidden = !match;
      if (match) visible++;
    }
    root
      .querySelector<HTMLElement>("[data-empty]")
      ?.toggleAttribute("hidden", visible > 0);
    setShown(visible);
    if (Object.keys(selection).length) writeUrl(selection);
  }, [selection, target]);

  const toggle = (key: string, value: string) =>
    setSelection((s) => {
      const current = s[key] ?? [];
      return {
        ...s,
        [key]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });

  const active = Object.values(selection).some((v) => v.length);

  return (
    <div className="mb-8 flex flex-wrap items-center gap-2">
      {groups.map((group) => {
        const picked = selection[group.key] ?? [];
        const summary =
          picked.length === 1
            ? `${group.label}: ${group.options.find((o) => o.value === picked[0])?.label ?? picked[0]}`
            : picked.length > 1
              ? `${group.label} · ${picked.length}`
              : group.label;
        return (
          <Popover key={group.key}>
            <PopoverTrigger
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                picked.length
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background hover:bg-secondary",
              )}
            >
              {summary}
              <ChevronDown className="size-3.5 opacity-60" aria-hidden />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-1.5">
              <ul role="listbox" aria-multiselectable aria-label={group.label}>
                {group.options.map((o) => {
                  const on = picked.includes(o.value);
                  return (
                    <li key={o.value}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={on}
                        onClick={() => toggle(group.key, o.value)}
                        className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm hover:bg-secondary"
                      >
                        <span
                          className={cn(
                            "flex size-4 shrink-0 items-center justify-center rounded border",
                            on
                              ? "border-foreground bg-foreground text-background"
                              : "border-border",
                          )}
                        >
                          {on && <Check className="size-3" aria-hidden />}
                        </span>
                        <span className="flex-1">{o.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {o.count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </PopoverContent>
          </Popover>
        );
      })}
      {active && (
        <button
          type="button"
          onClick={() =>
            setSelection(Object.fromEntries(groups.map((g) => [g.key, []])))
          }
          className="px-2 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Clear
        </button>
      )}
      {shown !== null && (
        <span className="ml-auto text-sm text-muted-foreground">
          {shown} {noun}
        </span>
      )}
    </div>
  );
}
