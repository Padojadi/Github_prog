import { Label } from "@/components/ui/label";
import { Check, ChevronDown, X } from "lucide-react";
import React, { forwardRef, useEffect, useState } from "react";
import { Command as CommandPrimitive, useCommandState } from "cmdk";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
// import { se } from "date-fns/locale";
import { TInstitutionType } from "../types";

export interface ComboboxProps {
  value?: TInstitutionType | string | null;
  defaultOptions?: TInstitutionType[];
  name?: string;
  /** manually controlled options */
  options?: TInstitutionType[];
  placeholder?: string;
  /** Loading component. */
  loadingIndicator?: React.ReactNode;
  /** Empty component. */
  emptyIndicator?: React.ReactNode;
  /** Debounce time for async search. Only work with `onSearch`. */
  delay?: number;
  /**
   * Only work with `onSearch` prop. Trigger search when `onFocus`.
   * For example, when user click on the input, it will trigger the search to get initial options.
   **/
  triggerSearchOnFocus?: boolean;
  /** async search */
  onSearch?: (value: string) => Promise<TInstitutionType[]>;
  /**
   * sync search. This search will not showing loadingIndicator.
   * The rest props are the same as async search.
   * i.e.: creatable, groupBy, delay.
   **/
  onSearchSync?: (value: string) => TInstitutionType[];
  onChange?: (options: TInstitutionType | string | null) => void;
  /** Limit the maximum number of selected options. */
  /** Hide the placeholder when there are options selected. */
  hidePlaceholderWhenSelected?: boolean;
  disabled?: boolean;
  className?: string;
  badgeClassName?: string;
  /**
   * First item selected is a default behavior by cmdk. That is why the default is true.
   * This is a workaround solution by add a dummy item.
   *
   * @reference: https://github.com/pacocoursey/cmdk/issues/171
   */
  selectFirstItem?: boolean;
  /** Allow user to create option when there is no option matched. */
  creatable?: boolean;
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
  /** Props of `CommandInput` */
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandInput>,
    "value" | "placeholder" | "disabled"
  >;
  /** hide the clear all button. */
  hideClearAllButton?: boolean;
  error?: boolean;
  loading?: boolean;
}

export interface ComboboxRef {
  selectedValue: TInstitutionType | string | null;
  input: HTMLInputElement;
  focus: () => void;
  reset: () => void;
}

function removePickedOption(
  options: TInstitutionType[],
  picked: string | null
) {
  if (!picked) return options;
  let cloneOption = [...options];

  cloneOption = cloneOption.filter((val) => picked !== val);

  return cloneOption;
}

function isOptionsExist(options: TInstitutionType[], targetOption: string) {
  if (options.some((option) => targetOption === option)) {
    return true;
  }

  return false;
}

const CommandEmpty = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.Empty>
>(({ className, ...props }, forwardedRef) => {
  const render = useCommandState((state) => state.filtered.count === 0);

  if (!render) return null;

  return (
    <div
      ref={forwardedRef}
      className={cn("py-6 text-center text-sm", className)}
      cmdk-empty=""
      role="presentation"
      {...props}
    />
  );
});

const ComboboxCreatable = forwardRef<ComboboxRef, ComboboxProps>(
  (
    {
      value,
      onChange,
      placeholder,
      defaultOptions: arrayDefaultOptions = [],
      options: arrayOptions = [],
      delay,
      name,
      onSearch,
      onSearchSync,
      loadingIndicator,
      emptyIndicator,
      hidePlaceholderWhenSelected,
      disabled,
      error,
      loading,
      className,
      badgeClassName,
      selectFirstItem = true,
      creatable = false,
      triggerSearchOnFocus = false,
      commandProps,
      inputProps,
      hideClearAllButton = false,
    }: ComboboxProps,
    ref: React.Ref<ComboboxRef>
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [onScrollbar, setOnScrollbar] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null); // Added this

    const [selected, setSelected] = React.useState<
      TInstitutionType | string | null
    >(arrayOptions?.find((v) => v === value) || null);
    const [options, setOptions] =
      React.useState<TInstitutionType[]>(arrayDefaultOptions);
    const [inputValue, setInputValue] = React.useState("");
    const debouncedSearchTerm = useDebounce(inputValue, delay || 500);

    React.useImperativeHandle(
      ref,
      () => ({
        selectedValue: selected,
        input: inputRef.current as HTMLInputElement,
        focus: () => inputRef?.current?.focus(),
        reset: () => setSelected(null),
      }),
      [selected]
    );

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        inputRef.current.blur();
      }
    };

    const handleUnselect = React.useCallback(
      (option: TInstitutionType) => {
        setSelected(null);
        onChange?.(null);
      },
      [onChange, selected]
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current;
        if (input) {
          // This is not a default behavior of the <input /> field
          if (e.key === "Escape") {
            input.blur();
          }
        }
      },
      [handleUnselect, selected]
    );

    useEffect(() => {
      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchend", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchend", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchend", handleClickOutside);
      };
    }, [open]);

    useEffect(() => {
      if (value) {
        setSelected(arrayOptions?.find((option) => option === value) || null);
      }
    }, [value]);

    useEffect(() => {
      /** If `onSearch` is provided, do not trigger options updated. */
      if (!arrayOptions || onSearch) {
        return;
      }
      const newOption = arrayOptions || [];
      if (JSON.stringify(newOption) !== JSON.stringify(options)) {
        setOptions(newOption);
      }
    }, [arrayDefaultOptions, arrayOptions, onSearch, options]);

    useEffect(() => {
      /** sync search */

      const doSearchSync = () => {
        const res = onSearchSync?.(debouncedSearchTerm);
        setOptions(res || []);
      };

      const exec = async () => {
        if (!onSearchSync || !open) return;

        if (triggerSearchOnFocus) {
          doSearchSync();
        }

        if (debouncedSearchTerm) {
          doSearchSync();
        }
      };

      void exec();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, open, triggerSearchOnFocus]);

    useEffect(() => {
      /** async search */

      const doSearch = async () => {
        setIsLoading(true);
        const res = await onSearch?.(debouncedSearchTerm);
        setOptions(res || []);
        setIsLoading(false);
      };

      const exec = async () => {
        if (!onSearch || !open) return;

        if (triggerSearchOnFocus) {
          await doSearch();
        }

        if (debouncedSearchTerm) {
          await doSearch();
        }
      };

      void exec();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, open, triggerSearchOnFocus]);

    const CreatableItem = () => {
      if (!creatable) return undefined;
      if (isOptionsExist(options, inputValue) || selected === inputValue) {
        return undefined;
      }

      const Item = (
        <CommandItem
          value={inputValue}
          className="cursor-pointer"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onSelect={(value: string) => {
            setInputValue("");
            const newOptions = value;
            setSelected(newOptions);
            onChange?.(newOptions);
          }}
        >
          {`Create "${inputValue}"`}
        </CommandItem>
      );

      // For normal creatable
      if (!onSearch && inputValue.length > 0) {
        return Item;
      }

      // For async search creatable. avoid showing creatable item before loading at first.
      if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
        return Item;
      }

      return undefined;
    };

    const EmptyItem = React.useCallback(() => {
      if (!emptyIndicator) return undefined;

      // For async search that showing emptyIndicator
      if (onSearch && !creatable && Object.keys(options).length === 0) {
        return (
          <CommandItem value="-" disabled>
            {emptyIndicator}
          </CommandItem>
        );
      }

      return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
    }, [creatable, emptyIndicator, onSearch, options]);

    const selectables = React.useMemo<TInstitutionType[]>(
      () => removePickedOption(options, selected),
      [options, selected]
    );

    /** Avoid Creatable Selector freezing or lagging when paste a long string. */
    const commandFilter = React.useCallback(() => {
      if (commandProps?.filter) {
        return commandProps.filter;
      }

      if (creatable) {
        return (value: string, search: string) => {
          return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
        };
      }
      // Using default filter in `cmdk`. We don't have to provide it.
      return undefined;
    }, [creatable, commandProps?.filter]);

    return (
      <Command
        ref={dropdownRef}
        {...commandProps}
        onKeyDown={(e) => {
          handleKeyDown(e);
          commandProps?.onKeyDown?.(e);
        }}
        className={cn(
          "h-auto overflow-visible bg-transparent",
          commandProps?.className
        )}
        shouldFilter={
          commandProps?.shouldFilter !== undefined
            ? commandProps.shouldFilter
            : !onSearch
        } // When onSearch is provided, we don't want to filter the options. You can still override it.
        filter={commandFilter()}
      >
        <div
          className={cn(
            "min-h-10 rounded-md border border-border text-base md:text-sm ring-offset-background-200 focus-within:ring-2 focus-within:ring-foreground-950 focus-within:ring-offset-2",
            {
              "px-3 py-2": selected,
              "cursor-text": !disabled && selected,
              "border-red-500 dark:border-red-600": error,
            },
            className
          )}
          onClick={() => {
            if (disabled) return;
            inputRef?.current?.focus();
          }}
        >
          <div className="relative flex gap-1 items-center">
            {
              selected && (
                // <Badge
                //   key={selected}
                //   className={cn(
                //     "",
                //     "data-[disabled]:bg-neutral-500 dark:data-[disabled]:bg-neutral-400 data-[disabled]:text-neutral-100 dark:data-[disabled]:text-neutral-800 data-[disabled]:hover:bg-neutral-500 dark:data-[disabled]:hover:bg-neutral-400",
                //     "data-[fixed]:bg-neutral-500 dark:data-[fixed]:bg-neutral-400 data-[fixed]:text-neutral-100 dark:data-[fixed]:text-neutral-800 data-[fixed]:hover:bg-neutral-500 dark:data-[fixed]:hover:bg-neutral-400",
                //     badgeClassName
                //   )}
                //   data-disabled={disabled || undefined}
                // >
                <div>{selected}</div>
              )

              // </Badge>
            }
            {/* Avoid having the "Search" Icon */}
            {/* {!selected && ( */}
            <CommandPrimitive.Input
              {...inputProps}
              name={name}
              ref={inputRef}
              value={inputValue}
              disabled={disabled}
              onValueChange={(value) => {
                setInputValue(value);
                inputProps?.onValueChange?.(value);
              }}
              onBlur={(event) => {
                if (!onScrollbar) {
                  setOpen(false);
                }
                inputProps?.onBlur?.(event);
              }}
              onFocus={(event) => {
                setOpen(true);
                triggerSearchOnFocus && onSearch?.(debouncedSearchTerm);
                inputProps?.onFocus?.(event);
              }}
              placeholder={
                hidePlaceholderWhenSelected && selected ? "" : placeholder
              }
              className={cn(
                "flex-1 bg-transparent outline-none placeholder:text-muted-foreground border-none focus:border-transparent focus:ring-transparent",
                {
                  "w-full": hidePlaceholderWhenSelected,
                  "px-3 py-2": !selected,
                  "ml-1": selected,
                },
                inputProps?.className
              )}
            />
            {/* )} */}
            <button
              type="button"
              onClick={() => {
                setSelected(null);
                onChange?.(null);
              }}
              className={cn(
                "absolute right-0 h-6 w-6 p-0",
                (hideClearAllButton || disabled || !selected) && "hidden"
              )}
            >
              <X />
            </button>
          </div>
        </div>
        <div className="relative">
          {open && (
            <CommandList
              className="absolute top-1 z-10 w-full rounded-md border border-neutral-200 bg-white text-neutral-950 shadow-md outline-none animate-in dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50"
              onMouseLeave={() => {
                setOnScrollbar(false);
              }}
              onMouseEnter={() => {
                setOnScrollbar(true);
              }}
              onMouseUp={() => {
                inputRef?.current?.focus();
              }}
            >
              {isLoading || loading ? (
                <>{loadingIndicator}</>
              ) : (
                <>
                  {EmptyItem()}
                  {CreatableItem()}
                  {!selectFirstItem && (
                    <CommandItem value="-" className="hidden" />
                  )}

                  <CommandGroup className="h-full overflow-auto">
                    <>
                      {selectables.map((option) => {
                        return (
                          <CommandItem
                            key={option}
                            value={option}
                            // disabled={option.disable}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onSelect={() => {
                              setInputValue("");
                              const newOptions = option;
                              setSelected(newOptions);
                              onChange?.(newOptions);
                            }}
                            className={cn(
                              "cursor-pointer"
                              // option.disable &&
                              //   "cursor-default text-muted-foreground"
                            )}
                          >
                            {option}
                          </CommandItem>
                        );
                      })}
                    </>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          )}
        </div>
      </Command>
    );
  }
);

ComboboxCreatable.displayName = "ComboboxCreatable";
export { ComboboxCreatable };
