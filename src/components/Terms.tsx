import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { TermProps } from "@/lib/terms";
import { cn } from "@/lib/utils";

interface Props {
  terms: TermProps[];
  className?: string;
  size?: "sm" | "md";
}

/**
 * A row of design-vocabulary chips. Tapping or clicking one opens its
 * definition, with a link to the glossary.
 */
export default function Terms({ terms, className, size = "md" }: Props) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {terms.map((t) => (
        <li key={t.id}>
          <Popover>
            <PopoverTrigger
              className={cn(
                "inline-flex cursor-help items-center rounded-full border border-border bg-background font-medium text-foreground transition-colors hover:bg-secondary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none data-[state=open]:bg-secondary",
                size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
              )}
            >
              {t.name}
            </PopoverTrigger>
            <PopoverContent className="w-72 text-sm" align="start">
              <p className="font-semibold">{t.name}</p>
              {t.aka?.length ? (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Also: {t.aka.join(", ")}
                </p>
              ) : null}
              <p className="mt-2 leading-relaxed">{t.definition}</p>
              <a
                href={t.href}
                className="mt-3 inline-block text-xs font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                See it in the glossary
              </a>
            </PopoverContent>
          </Popover>
        </li>
      ))}
    </ul>
  );
}
