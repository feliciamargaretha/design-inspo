import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
 * Filter chips for a static grid. Items are server-rendered with
 * `data-f-<key>="value value"` attributes; within a group any selected value
 * matches (OR), across groups all must match (AND).
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

  const active = Object.values(selection).some((v) => v.length);

  return (
    <div className="mb-8 space-y-4">
      {groups.map((group) => (
        <div
          key={group.key}
          className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4"
        >
          <span className="w-32 shrink-0 pt-1.5 text-sm font-medium text-muted-foreground">
            {group.label}
          </span>
          <ToggleGroup
            type="multiple"
            variant="outline"
            size="sm"
            value={selection[group.key] ?? []}
            onValueChange={(values) =>
              setSelection((s) => ({ ...s, [group.key]: values }))
            }
            className="flex flex-wrap justify-start gap-1.5 shadow-none"
          >
            {group.options.map((o) => (
              <ToggleGroupItem
                key={o.value}
                value={o.value}
                className="rounded-full! border px-3 data-[state=on]:border-foreground data-[state=on]:bg-foreground data-[state=on]:text-background"
              >
                {o.label}
                <span className="ml-1 text-xs opacity-60">{o.count}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      ))}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        {shown !== null && (
          <span>
            {shown} {noun}
          </span>
        )}
        {active && (
          <button
            type="button"
            onClick={() =>
              setSelection(Object.fromEntries(groups.map((g) => [g.key, []])))
            }
            className="underline underline-offset-4 hover:text-foreground"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
