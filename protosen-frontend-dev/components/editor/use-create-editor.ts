"use client";

import { withProps } from "@udecode/cn";

import {
  usePlateEditor,
  ParagraphPlugin,
  PlateElement,
  PlateLeaf,
} from "@udecode/plate/react";
import { BlockquotePlugin } from "@udecode/plate-block-quote/react";

import { TocPlugin } from "@udecode/plate-heading/react";
import { HorizontalRulePlugin } from "@udecode/plate-horizontal-rule/react";
import { LinkPlugin } from "@udecode/plate-link/react";
import { ImagePlugin, MediaEmbedPlugin } from "@udecode/plate-media/react";
import { TogglePlugin } from "@udecode/plate-toggle/react";
import { ColumnPlugin, ColumnItemPlugin } from "@udecode/plate-layout/react";
import {
  ListPlugin,
  BulletedListPlugin,
  NumberedListPlugin,
  ListItemPlugin,
  TodoListPlugin,
} from "@udecode/plate-list/react";
import {
  MentionPlugin,
  MentionInputPlugin,
} from "@udecode/plate-mention/react";
import {
  TablePlugin,
  TableRowPlugin,
  TableCellPlugin,
  TableCellHeaderPlugin,
} from "@udecode/plate-table/react";
import { DatePlugin } from "@udecode/plate-date/react";
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  CodePlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
} from "@udecode/plate-basic-marks/react";
import {
  FontColorPlugin,
  FontBackgroundColorPlugin,
  FontSizePlugin,
} from "@udecode/plate-font/react";
import { HighlightPlugin } from "@udecode/plate-highlight/react";
import { KbdPlugin } from "@udecode/plate-kbd/react";
import { AlignPlugin } from "@udecode/plate-alignment/react";
import { CursorOverlayPlugin } from "@udecode/plate-selection/react";
import { EmojiInputPlugin, EmojiPlugin } from "@udecode/plate-emoji/react";
import emojiMartData from "@emoji-mart/data";
import { SoftBreakPlugin } from "@udecode/plate-break/react";
import { DndPlugin } from "@udecode/plate-dnd";
import { TrailingBlockPlugin } from "@udecode/plate-trailing-block";
import { NormalizeTypesPlugin } from "@udecode/plate-normalizers";
import { ResetNodePlugin } from "@udecode/plate-reset-node/react";
import { DeletePlugin } from "@udecode/plate-select";
import { SlashPlugin } from "@udecode/plate-slash-command/react";
import { DocxPlugin } from "@udecode/plate-docx";
import { MarkdownPlugin } from "@udecode/plate-markdown";
import { JuicePlugin } from "@udecode/plate-juice";
import { HEADING_KEYS, HEADING_LEVELS } from "@udecode/plate-heading";
import { FixedToolbarPlugin } from "@/components/plate-ui/fixed-toolbar-plugin";
import { FloatingToolbarPlugin } from "@/components/plate-ui/floating-toolbar-plugin";

import { BlockquoteElement } from "@/components/plate-ui/blockquote-element";
import { HrElement } from "@/components/plate-ui/hr-element";
import { ImageElement } from "@/components/plate-ui/image-element";
import { LinkElement } from "@/components/plate-ui/link-element";
import { ToggleElement } from "@/components/plate-ui/toggle-element";
import { ColumnGroupElement } from "@/components/plate-ui/column-group-element";
import { ColumnElement } from "@/components/plate-ui/column-element";
import { HeadingElement } from "@/components/plate-ui/heading-element";
import { ListElement } from "@/components/plate-ui/list-element";
import { MediaEmbedElement } from "@/components/plate-ui/media-embed-element";
import { ParagraphElement } from "@/components/plate-ui/paragraph-element";
import { TableElement } from "@/components/plate-ui/table-element";
import { TableRowElement } from "@/components/plate-ui/table-row-element";
import {
  TableCellElement,
  TableCellHeaderElement,
} from "@/components/plate-ui/table-cell-element";
import { TodoListElement } from "@/components/plate-ui/todo-list-element";
import { DateElement } from "@/components/plate-ui/date-element";
import { HighlightLeaf } from "@/components/plate-ui/highlight-leaf";
import { KbdLeaf } from "@/components/plate-ui/kbd-leaf";
import { withPlaceholders } from "@/components/plate-ui/placeholder";
import { EmojiInputElement } from "@/components/plate-ui/emoji-input-element";
import { linkPlugin } from "../plate-ui/plugins/link-plugin";
import { CursorOverlay } from "../plate-ui/cursor-overlay";
import { INDENT_LIST_KEYS, ListStyleType } from "@udecode/plate-indent-list";
import { CalloutPlugin } from "@udecode/plate-callout/react";
import { NodeIdPlugin } from "@udecode/plate-node-id";
import { autoformatPlugin } from "../plate-ui/plugins/autoformat-plugin";
import { basicNodesPlugins } from "../plate-ui/plugins/basic-nodes-plugins";
import { blockMenuPlugins } from "../plate-ui/plugins/block-menu-plugins";
import { mediaPlugins } from "../plate-ui/plugins/media-plugins";
import { exitBreakPlugin } from "../plate-ui/plugins/exit-break-plugin";
import { indentListPlugins } from "../plate-ui/plugins/indent-list-plugins";
import { lineHeightPlugin } from "../plate-ui/plugins/line-height-plugins";
import { nanoid } from "@udecode/plate";
import { CsvPlugin } from "@udecode/plate-csv";

const resetBlockTypesCommonRule = {
  types: [
    ...HEADING_LEVELS,
    BlockquotePlugin.key,
    INDENT_LIST_KEYS.todo,
    ListStyleType.Disc,
    ListStyleType.Decimal,
    CalloutPlugin.key,
  ],
  defaultType: ParagraphPlugin.key,
};

export const plugins = [
  ...basicNodesPlugins,
  HorizontalRulePlugin,
  ...blockMenuPlugins,
  linkPlugin,
  TogglePlugin,
  ColumnPlugin,
  ParagraphPlugin,
  ListPlugin,
  MentionPlugin,
  TablePlugin,
  TodoListPlugin,
  DatePlugin,
  TocPlugin,
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  CodePlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  FontColorPlugin,
  FontBackgroundColorPlugin,
  FontSizePlugin,
  HighlightPlugin,
  KbdPlugin,
  AlignPlugin.extend({
    inject: {
      targetPlugins: [
        ParagraphPlugin.key,
        ...HEADING_LEVELS,
        MediaEmbedPlugin.key,
        ImagePlugin.key,
      ],
    },
  }),
  ...indentListPlugins,
  lineHeightPlugin,
  autoformatPlugin,
  EmojiPlugin.configure({ options: { data: emojiMartData as any } }),
  exitBreakPlugin,
  SoftBreakPlugin.configure({
    options: {
      rules: [
        { hotkey: "shift+enter" },
        {
          hotkey: "enter",
          query: {
            allow: [
              BlockquotePlugin.key,
              TableCellPlugin.key,
              TableCellHeaderPlugin.key,
              CalloutPlugin.key,
            ],
          },
        },
      ],
    },
  }),
  TrailingBlockPlugin.configure({
    options: { type: "p" },
  }),
  CursorOverlayPlugin.configure({
    render: { afterEditable: CursorOverlay },
  }),
  FixedToolbarPlugin,
  FloatingToolbarPlugin,
  NormalizeTypesPlugin.configure({
    options: {
      rules: [{ path: [0], strictType: "h1" }],
    },
  }),
  ResetNodePlugin.configure({
    options: {
      rules: [
        {
          ...resetBlockTypesCommonRule,
          hotkey: "Enter",
          predicate: (editor) =>
            editor.api.isEmpty(editor.selection, { block: true }),
        },
        {
          ...resetBlockTypesCommonRule,
          hotkey: "Backspace",
          predicate: (editor) => editor.api.isAt({ start: true }),
        },

        // Usage: https://platejs.org/docs/reset-node
      ],
    },
  }),
  DeletePlugin,
  SlashPlugin,
  MarkdownPlugin,
  JuicePlugin,
  NodeIdPlugin.configure({
    options: {
      idKey: "id",
      filterInline: true,
      filterText: true,
      idCreator: () => nanoid(10),
    },
  }),
  DndPlugin.configure({ options: { enableScroller: true } }),
  ...mediaPlugins,
  CsvPlugin,
  DocxPlugin,
];
export const useCreateEditor = (initialValue?: any) => {
  return usePlateEditor({
    override: {
      components: withPlaceholders({
        [BlockquotePlugin.key]: BlockquoteElement,
        [HorizontalRulePlugin.key]: HrElement,
        [ImagePlugin.key]: ImageElement,
        [LinkPlugin.key]: LinkElement,
        [TogglePlugin.key]: ToggleElement,
        [ColumnPlugin.key]: ColumnGroupElement,
        [ColumnItemPlugin.key]: ColumnElement,
        [BoldPlugin.key]: withProps(PlateLeaf, { as: "strong" }),
        [HEADING_KEYS.h1]: withProps(HeadingElement, { variant: "h1" }),
        [HEADING_KEYS.h2]: withProps(HeadingElement, { variant: "h2" }),
        [HEADING_KEYS.h3]: withProps(HeadingElement, { variant: "h3" }),
        [HEADING_KEYS.h4]: withProps(HeadingElement, { variant: "h4" }),
        [HEADING_KEYS.h5]: withProps(HeadingElement, { variant: "h5" }),
        [HEADING_KEYS.h6]: withProps(HeadingElement, { variant: "h6" }),
        [BulletedListPlugin.key]: withProps(ListElement, { variant: "ul" }),
        [NumberedListPlugin.key]: withProps(ListElement, { variant: "ol" }),
        [ListItemPlugin.key]: withProps(PlateElement, { as: "li" }),
        [MediaEmbedPlugin.key]: MediaEmbedElement,
        [TablePlugin.key]: TableElement,
        [TableRowPlugin.key]: TableRowElement,
        [TableCellPlugin.key]: TableCellElement,
        [TableCellHeaderPlugin.key]: TableCellHeaderElement,
        [TodoListPlugin.key]: TodoListElement,
        [DatePlugin.key]: DateElement,
        [EmojiInputPlugin.key]: EmojiInputElement,
        [HighlightPlugin.key]: HighlightLeaf,
        [KbdPlugin.key]: KbdLeaf,
        [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: "s" }),
        [SubscriptPlugin.key]: withProps(PlateLeaf, { as: "sub" }),
        [SuperscriptPlugin.key]: withProps(PlateLeaf, { as: "sup" }),
        [UnderlinePlugin.key]: withProps(PlateLeaf, { as: "u" }),
        [ItalicPlugin.key]: withProps(PlateLeaf, { as: "em" }),
        [ParagraphPlugin.key]: ParagraphElement,
      }),
    },
    plugins: plugins,
    value: initialValue,
  });
};
