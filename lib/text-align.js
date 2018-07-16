'use babel';

import { CompositeDisposable } from 'atom';

export default
{
    subscriptions: null,

    activate()
    {
        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles these views
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'left-align:toggle': () => this.align("left")
        }));

        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'center-align:toggle': () => this.align("center")
        }));

        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'right-align:toggle': () => this.align("right")
        }));
    },

    deactivate()
    {
        this.subscriptions.dispose();
    },

    align (alignmentType)
    {
        let editor;

        if (editor = atom.workspace.getActiveTextEditor())
        {
            const initialStatePtr = editor.createCheckpoint();

            const selectionRange = editor.getSelectedBufferRange();
            let currentRow = selectionRange.start.row;

            for (; currentRow <= selectionRange.end.row; currentRow++)
            {
                // Get whitespace-trimmed version of current line's text
                let currentRowString = editor.lineTextForBufferRow (currentRow).trim();

                // If line trimmed of trailing and leading whitespace is longer than preferred line
                // length, do not pad the line with whitespace.  If line
                // contains no text (used for spacing), skip.
                if (currentRowString.length > editor.preferredLineLength || currentRowString.length > 0)
                {
                    // Only insert padding if not left aligning
                    if (alignmentType != "left")
                    {
                        // Create a string with correct leading whitespace to properly pad the text
                        let spacesToInsert;

                        if (alignmentType == "center")
                            spacesToInsert = parseInt ((editor.preferredLineLength - currentRowString.length) / 2);

                        else
                            spacesToInsert = editor.preferredLineLength - currentRowString.length;

                        let paddingString = "";

                        for (;spacesToInsert > 0; spacesToInsert--)
                            paddingString += " ";

                        currentRowString = paddingString + currentRowString;
                    }

                    // Replace old text with adjusted text
                    editor.setCursorBufferPosition ([currentRow, 0]);
                    editor.moveToEndOfLine();
                    editor.deleteToBeginningOfLine();
                    editor.insertText (currentRowString);
                    editor.setSelectedBufferRange (selectionRange);
                }
            }

            // This allows for one simple undo to undo all the changes made
            editor.groupChangesSinceCheckpoint (initialStatePtr);
        }
    }
};
