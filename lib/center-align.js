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
        // For a single line, read to the end of text, subtract that character number off of
        // preferred line wrap, divide by two, insert this amount of spaces into the beginning of
        // line
    }
};
