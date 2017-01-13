'use strict';

let {
    n, view
} = require('kabanery');

let InputList = require('kabanery-dynamic-listview/lib/inputList');

let {
    reduce, map
} = require('bolzano');

// used to define variables
module.exports = view(({
    title,
    variables = [], onchange = v => v
}, {
    update
}) => {
    return n('div', {
        'class': 'lambda-variable'
    }, [
        InputList({
            listData: map(variables, (variable) => {
                return {
                    value: variable
                };
            }),
            title,
            onchange: (v) => {
                // TODO check variable definition
                onchange(reduce(v, (prev, item) => {
                    item.value && prev.push(item.value.trim());
                    return prev;
                }, []));

                update('variables', map(v, (item) => item.value));
            }
        })
    ]);
});
