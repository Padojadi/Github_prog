"use client";
import { createSlateEditor, Value } from "@udecode/plate";
import { ParagraphElementStatic } from "../plate-ui/static-components/paragraph-element-static";
import { HeadingElementStatic } from "../plate-ui/static-components/heading-element-static";
import { EditorStatic } from "../plate-ui/editor-static";
import { BlockquotePlugin } from "@udecode/plate-block-quote/react";
import { HorizontalRulePlugin } from "@udecode/plate-horizontal-rule/react";
import { LinkPlugin } from "@udecode/plate-link/react";
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  MediaEmbedPlugin,
  PlaceholderPlugin,
  VideoPlugin,
} from "@udecode/plate-media/react";
import { TogglePlugin } from "@udecode/plate-toggle/react";
import { ColumnPlugin, ColumnItemPlugin } from "@udecode/plate-layout/react";
import { MentionPlugin } from "@udecode/plate-mention/react";
import {
  TablePlugin,
  TableRowPlugin,
  TableCellPlugin,
  TableCellHeaderPlugin,
} from "@udecode/plate-table/react";
import { DatePlugin } from "@udecode/plate-date/react";
import {
  BasicMarksPlugin,
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from "@udecode/plate-basic-marks/react";
import { HighlightPlugin } from "@udecode/plate-highlight/react";
import { KbdPlugin } from "@udecode/plate-kbd/react";

import { BlockquoteElementStatic } from "../plate-ui/static-components/blockquote-element-static";
import { HrElementStatic } from "../plate-ui/static-components/hr-element-static";
import { ImageElementStatic } from "../plate-ui/static-components/image-element-static";
import { LinkElementStatic } from "../plate-ui/static-components/link-element-static";
import { ToggleElementStatic } from "../plate-ui/static-components/toggle-element-static";
import { ColumnGroupElementStatic } from "../plate-ui/static-components/column-group-element-static";
import { ColumnElementStatic } from "../plate-ui/static-components/column-element-static";
import { MentionElementStatic } from "../plate-ui/static-components/mention-element-static";
import { TableElementStatic } from "../plate-ui/static-components/table-element-static";
import { TableRowElementStatic } from "../plate-ui/static-components/table-row-element-static";
import {
  TableCellElementStatic,
  TableCellHeaderStaticElement,
} from "../plate-ui/static-components/table-cell-element-static";
import { DateElementStatic } from "../plate-ui/static-components/date-element-static";
import { HighlightLeafStatic } from "../plate-ui/static-components/highlight-leaf-static";
import { KbdLeafStatic } from "../plate-ui/static-components/kbd-leaf-static";
import { DeletePlugin } from "@udecode/plate-select";
import { LineHeightPlugin } from "@udecode/plate-line-height/react";
import { CaptionPlugin } from "@udecode/plate-caption/react";
import { BaseTablePlugin } from "@udecode/plate-table";
import { BaseHeadingPlugin, BaseTocPlugin } from "@udecode/plate-heading";
import { BaseListPlugin, BaseTodoListPlugin } from "@udecode/plate-list";
import { BaseDatePlugin } from "@udecode/plate-date";
import {
  BaseFontBackgroundColorPlugin,
  BaseFontColorPlugin,
  BaseFontSizePlugin,
} from "@udecode/plate-font";
import { BaseAlignPlugin } from "@udecode/plate-alignment";
import { BaseIndentPlugin } from "@udecode/plate-indent";
import { BaseIndentListPlugin } from "@udecode/plate-indent-list";
import { BaseAutoformatPlugin } from "@udecode/plate-autoformat";
import { BaseEmojiPlugin } from "@udecode/plate-emoji";
import { BaseImagePlugin } from "@udecode/plate-media";
import { ParagraphPlugin } from "@udecode/plate/react";
// Import your desired plugins

interface PlateStaticProps {
  value: Value;
}

const components = {
  p: ParagraphElementStatic,
  h1: HeadingElementStatic,
  h2: HeadingElementStatic,
  h3: HeadingElementStatic,
  h4: HeadingElementStatic,
  h5: HeadingElementStatic,
  h6: HeadingElementStatic,
  [BlockquotePlugin.key]: BlockquoteElementStatic,
  [HorizontalRulePlugin.key]: HrElementStatic,
  [ImagePlugin.key]: ImageElementStatic,
  [LinkPlugin.key]: LinkElementStatic,
  [TogglePlugin.key]: ToggleElementStatic,
  [ColumnPlugin.key]: ColumnGroupElementStatic,
  [ColumnItemPlugin.key]: ColumnElementStatic,
  [MentionPlugin.key]: MentionElementStatic,
  [TablePlugin.key]: TableElementStatic,
  [TableRowPlugin.key]: TableRowElementStatic,
  [TableCellPlugin.key]: TableCellElementStatic,
  [TableCellHeaderPlugin.key]: TableCellHeaderStaticElement,
  [DatePlugin.key]: DateElementStatic,
  [HighlightPlugin.key]: HighlightLeafStatic,
  [KbdPlugin.key]: KbdLeafStatic,
};

const plugins = [
  BaseHeadingPlugin,
  BlockquotePlugin,
  BasicMarksPlugin,
  HorizontalRulePlugin,
  LinkPlugin,
  ParagraphPlugin,
  BaseTablePlugin,
  BaseTodoListPlugin,
  BaseListPlugin,
  BaseDatePlugin,
  BaseTocPlugin,
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  CodePlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  BaseFontColorPlugin,
  BaseFontBackgroundColorPlugin,
  BaseFontSizePlugin,
  HighlightPlugin,
  BaseAlignPlugin,
  BaseIndentPlugin,
  BaseIndentListPlugin,
  LineHeightPlugin,
  BaseAutoformatPlugin,
  BaseEmojiPlugin,

  DeletePlugin,
  BaseImagePlugin,
  MediaEmbedPlugin,
  VideoPlugin,
  AudioPlugin,
  FilePlugin,
  CaptionPlugin,
  PlaceholderPlugin,
];

export default function PlateStatic({ value }: PlateStaticProps) {
  const editor = createSlateEditor({
    value: value,
    plugins: plugins,
  });

  return (
    <EditorStatic
      editor={editor}
      // value={value}
      components={components}
      // style={{ padding: 16 }}
      className="scrollbar-thin scrollbar-thumb-primary/90 scrollbar-track-primary/10 scrollbar-thumb-rounded-full scrollbar-track-rounded-full hover:scrollbar-thumb-primary"
    />
  );
}
