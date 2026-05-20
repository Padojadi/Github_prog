"use client";

import React from "react";

import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";

import { BlockquotePlugin } from "@udecode/plate-block-quote/react";
import { DatePlugin } from "@udecode/plate-date/react";
import { HEADING_KEYS } from "@udecode/plate-heading";
import { TocPlugin } from "@udecode/plate-heading/react";
import { HorizontalRulePlugin } from "@udecode/plate-horizontal-rule/react";
import { INDENT_LIST_KEYS, ListStyleType } from "@udecode/plate-indent-list";
import { LinkPlugin } from "@udecode/plate-link/react";

import { TablePlugin } from "@udecode/plate-table/react";
import {
  type PlateEditor,
  ParagraphPlugin,
  useEditorRef,
} from "@udecode/plate/react";
import {
  CalendarIcon,
  Columns3Icon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Link2Icon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  PilcrowIcon,
  PlusIcon,
  QuoteIcon,
  SquareIcon,
  TableIcon,
  TableOfContents,
} from "lucide-react";

import {
  insertBlock,
  insertInlineElement,
} from "@/components/editor/transforms";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useOpenState,
} from "./dropdown-menu";
import { ToolbarButton } from "./toolbar";

type Group = {
  group: string;
  items: Item[];
};

interface Item {
  icon: React.ReactNode;
  value: string;
  onSelect: (editor: PlateEditor, value: string) => void;
  focusEditor?: boolean;
  label?: string;
}

const groups: Group[] = [
  {
    group: "Blocs basiques",
    items: [
      {
        icon: <PilcrowIcon />,
        label: "Paragraphe",
        value: ParagraphPlugin.key,
      },
      {
        icon: <Heading1Icon />,
        label: "Titre 1",
        value: HEADING_KEYS.h1,
      },
      {
        icon: <Heading2Icon />,
        label: "Titre 2",
        value: HEADING_KEYS.h2,
      },
      {
        icon: <Heading3Icon />,
        label: "Titre 3",
        value: HEADING_KEYS.h3,
      },
      {
        icon: <TableIcon />,
        label: "Tableau",
        value: TablePlugin.key,
      },
      {
        icon: <QuoteIcon />,
        label: "Citation",
        value: BlockquotePlugin.key,
      },
      {
        icon: <MinusIcon />,
        label: "Séparateur",
        value: HorizontalRulePlugin.key,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
  {
    group: "Listes",
    items: [
      {
        icon: <ListIcon />,
        label: "Liste non ordonée",
        value: ListStyleType.Disc,
      },
      {
        icon: <ListOrderedIcon />,
        label: "Liste ordonée",
        value: ListStyleType.Decimal,
      },
      {
        icon: <SquareIcon />,
        label: "To-do list",
        value: INDENT_LIST_KEYS.todo,
      },
      // {
      //   icon: <ChevronRightIcon />,
      //   label: "Toggle list",
      //   value: TogglePlugin.key,
      // },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
  // {
  //   group: "Media",
  //   items: [
  //     {
  //       icon: <ImageIcon />,
  //       label: "Image",
  //       value: ImagePlugin.key,
  //     },
  //     {
  //       icon: <FilmIcon />,
  //       label: "Embed",
  //       value: MediaEmbedPlugin.key,
  //     },
  //     {
  //       icon: <PenToolIcon />,
  //       label: "Excalidraw",
  //       value: ExcalidrawPlugin.key,
  //     },
  //   ].map((item) => ({
  //     ...item,
  //     onSelect: (editor, value) => {
  //       insertBlock(editor, value);
  //     },
  //   })),
  // },
  {
    group: "Blocs avancés",
    items: [
      {
        icon: <TableOfContents />,
        label: "Table de contenus",
        value: TocPlugin.key,
      },
      {
        icon: <Columns3Icon />,
        label: "3 colonnes",
        value: "action_three_columns",
      },
      // {
      //   focusEditor: false,
      //   icon: <Radical />,
      //   label: "Equation",
      //   value: EquationPlugin.key,
      // },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
  {
    group: "Inline",
    items: [
      {
        icon: <Link2Icon />,
        label: "Lien",
        value: LinkPlugin.key,
      },
      {
        focusEditor: true,
        icon: <CalendarIcon />,
        label: "Date",
        value: DatePlugin.key,
      },
      // {
      //   focusEditor: false,
      //   icon: <Radical />,
      //   label: "Inline Equation",
      //   value: InlineEquationPlugin.key,
      // },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertInlineElement(editor, value);
      },
    })),
  },
];

export function InsertDropdownMenu(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const openState = useOpenState();

  return (
    <DropdownMenu modal={false} {...openState}>
      <DropdownMenuTrigger>
        <ToolbarButton pressed={openState.open} tooltip="Insérer" isDropdown>
          <PlusIcon />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="flex max-h-[500px] min-w-0 flex-col overflow-y-auto"
        align="start"
      >
        {groups.map(({ group, items: nestedItems }) => (
          <DropdownMenuGroup key={group} label={group}>
            {nestedItems.map(({ icon, label, value, onSelect }) => (
              <DropdownMenuItem
                key={value}
                className="min-w-[180px]"
                onSelect={() => {
                  onSelect(editor, value);
                  editor.tf.focus();
                }}
              >
                {icon}
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
