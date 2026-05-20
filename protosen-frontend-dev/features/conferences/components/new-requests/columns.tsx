"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Check, XCircle } from "lucide-react";
import React from "react";
import { BsFilter } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
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
import { FilterAutocomplete } from "@/features/others/components/filter-autocomplete";
import { cn } from "@/lib/utils";
import { translateConferenceStatus } from "../../lib/utils";
import type { Conference } from "../../types";
import { ActionColumn } from "./actions-column";
import StatusBadge from "./status-badge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Conference>[] = [
	{
		accessorKey: "firstName",
		header: ({ column }) => {
			return (
				<div className="flex justify-between">
					<Button variant="ghost" onClick={column.getToggleSortingHandler()}>
						Prénom
						{{
							asc: " 🔼",
							desc: " 🔽",
						}[column.getIsSorted() as string] ?? null}
					</Button>
					<FilterAutocomplete column={column} />
				</div>
			);
		},
	},
	{
		accessorKey: "lastName",
		header: ({ column }) => {
			return (
				<div className="flex justify-between">
					<Button variant="ghost" onClick={column.getToggleSortingHandler()}>
						Nom
						{{
							asc: " 🔼",
							desc: " 🔽",
						}[column.getIsSorted() as string] ?? null}
					</Button>
					<FilterAutocomplete column={column} />
				</div>
			);
		},
	},
	{
		accessorKey: "title",
		header: ({ column }) => {
			return (
				<div className="flex justify-between">
					<Button variant="ghost" onClick={column.getToggleSortingHandler()}>
						Titre
						{{
							asc: " 🔼",
							desc: " 🔽",
						}[column.getIsSorted() as string] ?? null}
					</Button>
					<FilterAutocomplete column={column} />
				</div>
			);
		},
	},
	{
		id: "status",
		accessorFn: (row) => row.statusHistories?.[0]?.status,
		header: ({ column }) => {
			const [open, setOpen] = React.useState(false);
			const columnFilterValue = column.getFilterValue();

			const sortedUniqueValues = React.useMemo(
				() => Array.from(column.getFacetedUniqueValues().keys()).sort(),
				[column.getFacetedUniqueValues],
			);
			return (
				<div className="flex justify-between">
					<Button variant="ghost" onClick={column.getToggleSortingHandler()}>
						Statut
						{{
							asc: " 🔼",
							desc: " 🔽",
						}[column.getIsSorted() as string] ?? null}
					</Button>
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger>
							<BsFilter size={20} />
						</PopoverTrigger>
						<PopoverContent className="p-0 w-[200px]">
							<Command
								className="[&_[cmdk-input-wrapper]]:border-b-0"
								value={((columnFilterValue as string) ?? "") as string}
							>
								<div className="flex border-b px-1 items-center">
									<CommandInput
										className="border-transparent focus:border-transparent focus:ring-transparent"
										placeholder={`Rechercher... (${
											column.getFacetedUniqueValues().size
										})`}
									/>
									<Button
										variant={"ghost"}
										size="icon"
										className=""
										onClick={() => column.setFilterValue("")}
									>
										<XCircle className="size-4" />
									</Button>
								</div>

								<CommandList>
									<CommandEmpty>Aucun résultat</CommandEmpty>
									<CommandGroup>
										{sortedUniqueValues.map((item) => (
											<CommandItem
												key={item}
												value={item}
												onSelect={() => {
													column.setFilterValue(item);
													setOpen(false);
												}}
											>
												{translateConferenceStatus(item)}
												<Check
													className={cn(
														"ml-auto",
														columnFilterValue === item
															? "opacity-100"
															: "opacity-0",
													)}
												/>
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
				</div>
			);
		},
		cell: ({ row }) => (
			<StatusBadge
				status={row.original.statusHistories?.[0]?.status}
				rejectReason={row.original.statusHistories?.[0]?.rejectionReason}
			/>
		),
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => {
			return (
				<div className="flex justify-between">
					<Button variant="ghost" onClick={column.getToggleSortingHandler()}>
						Créé le
						{{
							asc: " 🔼",
							desc: " 🔽",
						}[column.getIsSorted() as string] ?? null}
					</Button>
					<FilterAutocomplete column={column} />
				</div>
			);
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const conference = row.original;

			return (
				<div>
					<ActionColumn currentItem={conference} />
				</div>
			);
		},
	},
];
