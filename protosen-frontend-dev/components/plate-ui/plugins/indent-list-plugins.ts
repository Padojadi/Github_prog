"use client";

import { BlockquotePlugin } from "@udecode/plate-block-quote/react";
import { HEADING_LEVELS } from "@udecode/plate-heading";
import { IndentListPlugin } from "@udecode/plate-indent-list/react";
import { IndentPlugin } from "@udecode/plate-indent/react";
import { TogglePlugin } from "@udecode/plate-toggle/react";
import { ParagraphPlugin } from "@udecode/plate/react";
import { TodoLi, TodoMarker } from "@/components/plate-ui/indent-todo-marker";

export const indentListPlugins = [
  IndentPlugin.extend({
    inject: {
      targetPlugins: [
        ParagraphPlugin.key,
        ...HEADING_LEVELS,
        BlockquotePlugin.key,
        TogglePlugin.key,
      ],
    },
  }),
  IndentListPlugin.extend({
    inject: {
      targetPlugins: [
        ParagraphPlugin.key,
        ...HEADING_LEVELS,
        BlockquotePlugin.key,
        TogglePlugin.key,
      ],
    },
    options: {
      listStyleTypes: {
        todo: {
          liComponent: TodoLi,
          markerComponent: TodoMarker,
          type: "todo",
        },
      },
    },
  }),
];
