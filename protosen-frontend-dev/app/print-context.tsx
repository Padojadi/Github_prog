"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { CardType } from "@/features/others/type-of-cards/types";

interface IOption {
	label: string;
	value: string;
}
interface PrintContextProps {
	printColor: string;
	setPrintColor: (printColor: string) => void;
	OIText: IOption | undefined;
	setOIText: (OIText: IOption | undefined) => void;
	photo: string;
	setPhoto: (photo: string) => void;
	diplomaticEntity: CardType | undefined;
	setDiplomaticEntity: (diplomaticEntity: CardType) => void;
	plaque: IOption | undefined;
	setPlaque: (plaque: IOption) => void;
	deliverDate: string;
	setDeliverDate: (deliverDate: string) => void;
	expirationDate: string;
	setExpirationDate: (expirationDate: string) => void;
	cardTitle: string;
	setCardTitle: (title: string) => void;
	resetFields: () => void;
}

const PrintContext = createContext<PrintContextProps | undefined>(undefined);

export const PrintProvider = ({
	children,
	initialState = "#AEFCAC",
}: {
	children: React.ReactNode;
	initialState?: string;
}) => {
	const [printColor, setPrintColor] = useState<string>(initialState);
	const [OIText, setOIText] = useState<IOption>();
	const [diplomaticEntity, setDiplomaticEntity] = useState<CardType>();
	const [photo, setPhoto] = useState<string>("");
	const [plaque, setPlaque] = useState<IOption>();

	const [deliverDate, setDeliverDate] = useState<string>(
		() => new Date().toISOString().split("T")[0]
	);
	const [expirationDate, setExpirationDate] = useState<string>("");
	const [cardTitle, setCardTitle] = useState<string>("");

	const resetFields = useCallback(() => {
		setPrintColor(initialState);
		setOIText(undefined);
		setDiplomaticEntity(undefined);
		setPhoto("");
		setPlaque(undefined);
		setDeliverDate(new Date().toISOString().split("T")[0]);
		setExpirationDate("");
		setCardTitle("");
	}, [initialState]);

	return (
		<PrintContext.Provider
			value={{
				printColor,
				setPrintColor,
				OIText,
				setOIText,
				diplomaticEntity,
				setDiplomaticEntity,
				photo,
				setPhoto,
				plaque,
				setPlaque,
				deliverDate,
				setDeliverDate,
				expirationDate,
				setExpirationDate,
				cardTitle,
				setCardTitle,
				resetFields,
			}}
		>
			{children}
		</PrintContext.Provider>
	);
};

export const usePrintContext = () => {
	const context = useContext(PrintContext);
	if (!context) {
		throw new Error("usePrint must be used within a PrintProvider");
	}
	return context;
};
