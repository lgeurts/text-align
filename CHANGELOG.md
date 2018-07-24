## v0.3.0
- Now supports `justify`.  Text will be spaced out as evenly as possible so that
the text spans from the left side of the editor to the preferredLineLength.
- Massive refactoring of the code, but this may have come at the cost of
efficiency.  I absolutely welcome any pull requests that might lead to more
efficient solutions.

## v0.2.2
- After algorithm runs, selection now covers all of the text moved.  Prior, the
selection might not cover the moved text, as the selection was being reset
back to its original place and not the new location, however, this didn't
cause any bugs, as the algorithm doesn't care if the selection covers the
whole line or not, it adjusts all text on any line even being touched by the
selection.  So this is not a bug fix, but more of an aesthetic fix.

## v0.2.1 (Skipped - publishing errors)

## v0.2.0

- `center-align` package converted to `text-align`.  Adds left and right align
options to center align.

## v0.1.0

- Initial release of `center-align` (no longer available)
