'use babel';

import { CompositeDisposable } from 'atom';

export default
{
    subscriptions: null,

    activate()
    {
        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'center-align:toggle': () => this.centerAlign()
        }));
    },

    deactivate()
    {
        this.subscriptions.dispose();
    },

    centerAlign()
    {
        let editor;

        if (editor = atom.workspace.getActiveTextEditor())
        {
            let initialState = editor.createCheckpoint();

            let startingRow = editor.getSelectedBufferRange().start.row
            let endingRow = editor.getSelectedBufferRange().end.row

            for (; startingRow <= endingRow; startingRow++)
            {
                // Get current line's content
                let currentRowString = editor.lineTextForBufferRow (startingRow);

                // Trim all leading and trailing whitespace
                currentRowString = currentRowString.trim();

                // If line trimmed of trailing and leading whitespace is longer than preferred line
                // length, do not pad the line with whitespace.  If line
                // contains no text (used for spacing), skip.
                if (currentRowString.length > editor.preferredLineLength || currentRowString.length > 0)
                {
                    // Create a string with correct leading padding to center the text
                    let spacesToInsert = parseInt ((editor.preferredLineLength - currentRowString.length) / 2);
                    let paddingString = "";

                    for (;spacesToInsert > 0; spacesToInsert--)
                        paddingString += " ";

                    currentRowString = paddingString + currentRowString;

                    // Replace old text with centered text
                    editor.setCursorBufferPosition ([startingRow, 0]);
                    editor.moveToEndOfLine();
                    editor.deleteToBeginningOfLine();
                    editor.insertText (currentRowString);
                }
            }

            // This allows for one simple undo to undo all the changes made
            editor.groupChangesSinceCheckpoint (initialState);
        }
    }
};
