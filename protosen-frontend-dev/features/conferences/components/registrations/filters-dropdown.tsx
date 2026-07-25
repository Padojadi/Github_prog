import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Check, ChevronDown, Filter } from "lucide-react";
import { format } from "date-fns";
import { NewCalendar } from "@/components/ui/date-time-picker";
import { DateRange } from "react-day-picker";

const RegistrationFilters = () => {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);

  const clearFilters = () => {
    setDate(undefined);
  };

  const hasFilters = date;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-2 ${
            hasFilters ? "bg-primary/10 border-primary/30 text-primary" : ""
          }`}
        >
          <Filter className="h-4 w-4" />
          <span>Filtres</span>
          {hasFilters && (
            <span className="ml-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
              {date ? 1 : 0}
            </span>
          )}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-4" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Date Range</h4>
            <NewCalendar
              mode="range"
              selected={date}
              onSelect={setDate}
              className="border rounded-md"
              numberOfMonths={2}
              disabled={(date) => date > new Date()}
            />

            {date && (
              <div className="text-xs text-muted-foreground mt-1">
                {date.from && format(date.from, "PP")} -{" "}
                {date.to && format(date.to, "PP")}
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              disabled={!hasFilters}
            >
              Effacer les filtres
            </Button>
            <Button size="sm">Appliquer les filtres</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RegistrationFilters;
