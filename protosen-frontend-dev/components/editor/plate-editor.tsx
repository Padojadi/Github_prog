"use client";

import { Plate } from "@udecode/plate/react";

import { useCreateEditor } from "@/components/editor/use-create-editor";
import { Editor, EditorContainer } from "@/components/plate-ui/editor";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Value } from "@udecode/plate";

interface PlateEditorProps {
  value?: any;
  onChange?: (value: any) => void;
  onBlur: (value: Value) => void;
  defaultValue?: any;
  readonly?: boolean;
  disabled?: boolean;
}

export function PlateEditor({
  value,
  onChange,
  onBlur,
  defaultValue,
  readonly,
  disabled,
}: PlateEditorProps) {
  const editor = useCreateEditor(value);

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor} onChange={onChange}>
        <EditorContainer>
          <Editor
            readOnly={readonly}
            onBlur={() => {
              onBlur(editor.children);
            }}
            defaultValue={defaultValue}
            value={value}
            disabled={disabled}
            variant="default"
            className="overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-primary/90 scrollbar-track-primary/10 scrollbar-thumb-rounded-full scrollbar-track-rounded-full hover:scrollbar-thumb-primary"
          />
        </EditorContainer>
      </Plate>
    </DndProvider>
  );
}
