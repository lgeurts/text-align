module.exports =
{
    activate ()
    {
        atom.commands.add ('atom-text-editor:not([mini])',
        {
            'left-align:toggle' ()
            {
                align ("left", atom.workspace.getActiveTextEditor())
            },

            'center-align:toggle' ()
            {
                align ("center", atom.workspace.getActiveTextEditor())
            },

            'right-align:toggle' ()
            {
                align ("right", atom.workspace.getActiveTextEditor())
            },
        })
    }
}

function align (alignmentType, editor)
{
    const initialStatePtr = editor.createCheckpoint();

    adjustAllLinesOfText (alignmentType, editor);

    // This allows for one simple undo to undo all the changes made
    editor.groupChangesSinceCheckpoint (initialStatePtr);
}

function adjustAllLinesOfText (alignmentType, editor)
{
    let selectionRange = editor.getSelectedBufferRange();
    let currentRow = selectionRange.start.row;

    for (; currentRow <= selectionRange.end.row; currentRow++)
    {
        // Get whitespace-trimmed version of current line's text
        let currentRowString = editor.lineTextForBufferRow (currentRow).trim();

        // If line trimmed of trailing and leading whitespace is longer than preferred line
        // length, do not pad the line with whitespace.  If line contains no text (used for
        // spacing), skip.
        if (lineIsAcceptableToAdjust (editor.preferredLineLength, currentRowString.length))
        {
            // Only insert padding if not left aligning
            if (alignmentType == "center" || alignmentType == "right")
            {
                currentRowString = createProperPaddingString (alignmentType,
                                                              editor.preferredLineLength,
                                                              currentRowString.length)
                                                              + currentRowString;
            }

            else if (alignmentType == "justify")
                console.log ("Fuck yea");

            replaceOldLineAdjustedLine (editor, currentRow, currentRowString);
            setSelectionToCoverAllMovedText (editor, selectionRange);
        }
    }
}

function lineIsAcceptableToAdjust (preferredLineLength, currentRowStringLength)
{
    return (currentRowStringLength > preferredLineLength || currentRowStringLength > 0);
}

function createProperPaddingString (alignmentType, preferredLineLength, currentRowStringLength)
{
    // Create a string with correct leading whitespace to properly pad the text
    let spacesToInsert;

    if (alignmentType == "center")
        spacesToInsert = parseInt ((preferredLineLength - currentRowStringLength) / 2);

    else // "right"
        spacesToInsert = preferredLineLength - currentRowStringLength;

    let paddingString = "";

    for (;spacesToInsert > 0; spacesToInsert--)
        paddingString += " ";

    return paddingString;
}

function replaceOldLineAdjustedLine (editor, currentRow, currentRowString)
{
    editor.setCursorBufferPosition ([currentRow, 0]);
    editor.moveToEndOfLine();
    editor.deleteToBeginningOfLine();
    editor.insertText (currentRowString);
}

function setSelectionToCoverAllMovedText (editor, selectionRange)
{
    selectionRange.start.column = 0;
    selectionRange.end.column = editor.preferredLineLength;
    editor.setSelectedBufferRange (selectionRange);
}
