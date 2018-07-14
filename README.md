# Center Align
An [Atom](https://atom.io) text editor package that center aligns text between
the left side of the text editor and the preferredLineLength.

## Before Single Line
![Before Single Line](./Screenshots/Before-Single-Line.png)

## After Single Line
![After Single Line](./Screenshots/After-Single-Line.png)

## Before Selection
![Before Selection](./Screenshots/Before-Selection.png)

## After Selection
![After Selection](./Screenshots/After-Selection.png)

## Description:

* If no selection is made, text on the line of the cursor is centered.  
* If a selection is made, all text within the selection will be centered
* This is most useful when centering items in academic papers, such as titles
and works cited headings, but it can be used to center align entire documents of
text as well.

## Future Features:

* Currently, there is no way to "batch undo" this.  If there is a way to do
this, please let me know or submit a pull request.  If I can't figure out an
elegant solution, I may have to include some sort of left-justify algorithm to
undo it.

## Bug(s)

* Not working with certain elements in code (like brackets and braces)

## TODO:

* Find a way to implement this where undoing it will only take one command z
* Release
