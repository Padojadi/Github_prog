import { BasicMarksPlugin } from "@udecode/plate-basic-marks/react";
import { BlockquotePlugin } from "@udecode/plate-block-quote/react";
import { HeadingPlugin } from "@udecode/plate-heading/react";

export const basicNodesPlugins = [
  HeadingPlugin.configure({ options: { levels: 6 } }),
  BlockquotePlugin,
  BasicMarksPlugin,
] as const;
