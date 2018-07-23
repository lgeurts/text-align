var alignmentType = "";

module.exports =
{
    activate ()
    {
        this.commandsDisposable = atom.commands.add('atom-text-editor:not([mini])',
        {
            'left-align:toggle' ()
            {
                alignmentType = "left";
                align (atom.workspace.getActiveTextEditor())
            },

            'center-align:toggle' ()
            {
                alignmentType = "center";
                align (atom.workspace.getActiveTextEditor())
            },

            'right-align:toggle' ()
            {
                alignmentType = "right";
                align (atom.workspace.getActiveTextEditor())
            },

            'justify:toggle' ()
            {
                alignmentType = "justify";
                align (atom.workspace.getActiveTextEditor())
            },
        })
    },

    deactivate ()
    {
        this.commandsDisposable.dispose()
    }
}

function align (editor)
{
    const initialStatePtr = editor.createCheckpoint();

    adjustAllLinesOfText (editor);

    // This allows for one simple undo to undo all the changes made
    editor.groupChangesSinceCheckpoint (initialStatePtr);
}

function adjustAllLinesOfText (editor)
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
                                            getAdjustedLine (editor.preferredLineLength, currentRowString));
        }

        setSelectionToCoverAllMovedText (editor, selectionRange);
    }
}

function lineIsAcceptableToAdjust (preferredLineLength, currentRowStringLength)
{
    // Return true if text string's length is shorter than length from left side to preferredLineLength
    // or if there is no text
    return (currentRowStringLength > preferredLineLength || currentRowStringLength > 0);
}

function replaceOldLineWithAdjustedLine (editor, currentRow, currentRowString)
{
    editor.setCursorBufferPosition ([currentRow, 0]);
    editor.moveToEndOfLine();
    editor.deleteToBeginningOfLine();
    editor.insertText (currentRowString);
}

function getAdjustedLine (preferredLineLength, currentRowString)
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
        currentRowString = getJustifiedRow (preferredLineLength, currentRowString);

    // if it is "left", we do nothing to the line of text

    return currentRowString;
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

function getJustifiedRow (preferredLineLength, currentRowString)
{
    console.log (currentRowString);

    return currentRowString;
}

function setSelectionToCoverAllMovedText (editor, selectionRange)
{
    selectionRange.start.column = 0;
    selectionRange.end.column = editor.preferredLineLength;
    editor.setSelectedBufferRange (selectionRange);
}
