"use client";

import type React from "react";
import { useEffect, useId, useState } from "react";
import Select from "react-select";
import type { IFetchAction, IPerson } from "@/lib/types";
import Tooltip from "./tooltip";

interface InputSelectProps {
	label: string;
	name: string;
	id?: string;
	type?: string;
	required?: boolean;
	placeholder?: string;
	tooltip?: string;
	disabled?: boolean;
	className?: string;
	initialPersonCard?: string;
	onChange: (value: null) => void;
	fetchActivePersonsCards: IFetchAction;
}

interface IOption {
	label: string;
	value: string;
}

const PersonCardSelect: React.FC<InputSelectProps> = ({
	className,
	label,
	name,
	id,
	required = false,
	tooltip,
	disabled = false,
	initialPersonCard,
	fetchActivePersonsCards,
	onChange,
}) => {
	const [personsCards, setPersonsCards] = useState([]);
	useEffect(() => {
		const fetchPersons = async () => {
			try {
				const res = await fetchActivePersonsCards();
				const data = res?.data?.rows.map((item: IPerson) => {
					const person = Object.fromEntries(Object.entries(item));
					return {
						value: person.id,
						label: `${person.firstName} ${person.lastName}`,
						_sourceType: person._sourceType || "base",
					};
				});
				setPersonsCards(data);
			} catch (error) {
				console.error("Error fetching PersonsCards:", error);
			}
		};

		fetchPersons();
	}, [fetchActivePersonsCards]);

	return (
		<div className={className}>
			<label className="block text-sm font-medium mb-1" htmlFor={id}>
				{label} {required && <span className="text-rose-500">*</span>}
			</label>
			{tooltip ? (
				<Tooltip className="ml-2" bg="dark" size="md">
					<div className="text-sm text-slate-200">{tooltip}</div>
				</Tooltip>
			) : null}
			<Select
				placeholder="Selectionner une carte ..."
				onChange={onChange}
				isDisabled={disabled}
				noOptionsMessage={() => "Aucune option"}
				name={name}
				id={id}
				instanceId={useId()}
				className="w-full"
				required={required}
				options={personsCards}
			/>
		</div>
	);
};

export default PersonCardSelect;
