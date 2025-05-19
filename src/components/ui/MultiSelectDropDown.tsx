import * as Popover from "@radix-ui/react-popover";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check, ChevronDown } from "lucide-react";

type MultiSelectDropDownProps = {
  label?: string;
  options: string[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
};

export default function MultiSelectDropDown({
  label = "Select Items",
  options,
  value,
  onChange,
  placeholder = "Select...",
}: MultiSelectDropDownProps) {
  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>

      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="w-full flex justify-between items-center border px-3 py-2 rounded-md text-sm bg-white"
          >
            <span>{value.length > 0 ? value.join(", ") : placeholder}</span>
            <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="rounded-md border bg-white shadow-lg w-100 z-50"
            // sideOffset={5}
          >
            {options.map((option) => (
              <div
                key={option}
                className="flex items-center gap-2 py-2 px-2 hover:bg-gray-100 rounded cursor-pointer border-b border-b-[var(--border-color)]"
                onClick={() => toggleOption(option)}
              >
                <Checkbox.Root
                  checked={value.includes(option)}
                  className="w-4 h-4 border rounded flex items-center justify-center"
                >
                  <Checkbox.Indicator>
                    <Check className="w-3 h-3" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <span className="text-sm">{option}</span>
              </div>
            ))}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
