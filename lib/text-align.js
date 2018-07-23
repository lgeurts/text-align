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

            'justify:toggle' ()
            {
                align ("justify", atom.workspace.getActiveTextEditor())
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
            replaceOldLineWithAdjustedLine (editor,
                                            currentRow,
                                            getAdjustedLine (alignmentType,
                                                             editor.preferredLineLength,
                                                             currentRowString));
        }

        setSelectionToCoverAllMovedText (editor, selectionRange);
    }
}

function getAdjustedLine (alignmentType, preferredLineLength, currentRowString)
{
    if (alignmentType == "center")
    {
        currentRowString = createPaddingForCenterAlign (preferredLineLength,
                                                        currentRowString.length)
                                                      + currentRowString;
    }

    else if (alignmentType == "right")
    {
        currentRowString = createPaddingForRightAlign (preferredLineLength,
                                                       currentRowString.length)
                                                     + currentRowString;
    }

    else if (alignmentType == "justify")
        console.log ("Fuck yea");

    return currentRowString;
}

function lineIsAcceptableToAdjust (preferredLineLength, currentRowStringLength)
{
    // Return true if text string's length is shorter than length from left side to preferredLineLength
    // or if there is no text
    return (currentRowStringLength > preferredLineLength || currentRowStringLength > 0);
}

function createPaddingForCenterAlign (preferredLineLength, currentRowStringLength)
{
    return getPaddingString (parseInt ((preferredLineLength - currentRowStringLength) / 2));
}

function createPaddingForRightAlign (preferredLineLength, currentRowStringLength)
{
    return getPaddingString (preferredLineLength - currentRowStringLength);
}

function getPaddingString (spacesToInsert)
{
    let paddingString = "";

    for (;spacesToInsert > 0; spacesToInsert--)
        paddingString += " ";

    return paddingString;
}

function replaceOldLineWithAdjustedLine (editor, currentRow, currentRowString)
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
