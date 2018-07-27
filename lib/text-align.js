var alignmentType = "";

module.exports =
{
    activate()
    {
        this.commandsDisposable = atom.commands.add('atom-text-editor:not([mini])',
        {
            'left-align:toggle' ()
            {
                alignmentType = "left";
                manipulateText (atom.workspace.getActiveTextEditor())
            },

            'center-align:toggle' ()
            {
                alignmentType = "center";
                manipulateText (atom.workspace.getActiveTextEditor())
            },

            'right-align:toggle' ()
            {
                alignmentType = "right";
                manipulateText (atom.workspace.getActiveTextEditor())
            },

            'justify:toggle' ()
            {
                alignmentType = "justify";
                manipulateText (atom.workspace.getActiveTextEditor())
            },
        })
    },

    deactivate()
    {
        this.commandsDisposable.dispose()
    }
}

function manipulateText (editor)
{
    const initialStatePtr = editor.createCheckpoint();
    const selectionRange = editor.getSelectedBufferRange();

    adjustSelectedLinesOfText (editor, selectionRange);
    setSelectionToCoverAllMovedText (editor, selectionRange);

    editor.groupChangesSinceCheckpoint (initialStatePtr);
}

function adjustSelectedLinesOfText (editor, selectionRange)
{
    let currentRow = selectionRange.start.row;

    for (; currentRow <= selectionRange.end.row; currentRow++)
    {
        // Get whitespace-trimmed version of current line's text
        let currentRowString = editor.lineTextForBufferRow (currentRow).trim();

        if (lineIsAcceptableToAdjust (editor.preferredLineLength, currentRowString.length))
        {
            replaceOldLineWithAdjustedLine (editor,
                                            currentRow,
                                            getAdjustedLine (editor.preferredLineLength,
                                                             currentRowString));
        }
    }
}

function lineIsAcceptableToAdjust (preferredLineLength, currentRowStringLength)
{
    return (currentRowStringLength > 0 && (currentRowStringLength < preferredLineLength));
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
    if (alignmentType == "left")
        return currentRowString;

    else if (alignmentType == "center")
    {
        return createPaddingForCenterAlign (preferredLineLength, currentRowString.length)
                                          + currentRowString;
    }

    else if (alignmentType == "right")
    {
        return createPaddingForRightAlign (preferredLineLength, currentRowString.length)
                                         + currentRowString;
    }

    // The only option left is "justify", no need to check with if-statement
    return getJustifiedRow (preferredLineLength, currentRowString);
}

function createPaddingForCenterAlign (preferredLineLength, currentRowStringLength)
{
    return getPaddingString (parseInt ((preferredLineLength - currentRowStringLength) / 2));
}

function createPaddingForRightAlign (preferredLineLength, currentRowStringLength)
{
    return getPaddingString (preferredLineLength - currentRowStringLength);
}


// Source 1
function getPaddingString (spacesToInsert)
{
    return " ".repeat (spacesToInsert);
}

// Source 2
// Source 3
function getJustifiedRow (preferredLineLength, currentRowString)
{
    let spacesToDivvy = preferredLineLength - currentRowString.length;
    let locationsToAddSpaces = (currentRowString.match(/ /g) || []).length;

    let spacesToInsertBetweenWords = parseInt (spacesToDivvy / locationsToAddSpaces);
    let leftoverSpacesToInsert = spacesToDivvy % locationsToAddSpaces;

    // The + 1 accounts for the fact that the string will lose 1 space during regex split()
    let paddingString = getPaddingString (spacesToInsertBetweenWords + 1);
    currentRowString = currentRowString.split(' ').join (paddingString);

    // Insert leftover spaces into string, this is a left-biased insertion and doesn't symmetrically
    // insert these spaces over the line.
    for (let i = 1; (i < currentRowString.length) && (leftoverSpacesToInsert > 0); i++)
    {
        if (currentRowString[i - 1] == " " && currentRowString[i] != " ")
        {
            currentRowString = currentRowString.substring (0, i - 1)
                             + " "
                             + currentRowString.substring (i - 1, currentRowString.length);

            // Increment i to account for new space being added from last statement
            i++;

            leftoverSpacesToInsert--;
        }
    }

    return currentRowString;
}

function setSelectionToCoverAllMovedText (editor, selectionRange)
{
    selectionRange.start.column = 0;
    selectionRange.end.column = editor.preferredLineLength;
    editor.setSelectedBufferRange (selectionRange);
}

// I'm not a JavaScript person so I don't have a great grasp on Regex or some of the string methods.
// Here are the locations where I found some of the solutions that I cited above:
// Source 1: https://stackoverflow.com/questions/1877475/repeat-character-n-times
// Source 2: https://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string
// Source 3: https://stackoverflow.com/questions/3794919/replace-all-spaces-in-a-string-with
