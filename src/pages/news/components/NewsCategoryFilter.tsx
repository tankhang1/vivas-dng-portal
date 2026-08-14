import { useState } from "react";
import { Button } from "../../../shared/components/ui";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import type { CategoryItem } from "@/features/category-news/types/get-categories.response";

type NewsCategoryFilterProps = {
  categories?: CategoryItem[];
  value?: number;
  onChange: (value: number | undefined) => void;
  className?: string;
};

export function NewsCategoryFilter({
  categories,
  value,
  onChange,
  className,
}: NewsCategoryFilterProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    value === undefined
      ? "Tất cả danh mục"
      : (categories?.find((category) => category.id === value)?.name ??
        String(value));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[220px] justify-between font-normal", className)}
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] bg-white p-0">
        <Command>
          <CommandInput placeholder="Tìm danh mục..." />
          <CommandList>
            <CommandEmpty>Không tìm thấy danh mục.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="Tất cả danh mục"
                onSelect={() => {
                  onChange(undefined);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === undefined ? "opacity-100" : "opacity-0",
                  )}
                />
                Tất cả danh mục
              </CommandItem>
              {categories?.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.name}
                  onSelect={() => {
                    onChange(category.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
