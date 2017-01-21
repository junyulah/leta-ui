'use strict';

let {
    n, view
} = require('kabanery');

let SelectView = require('kabanery-select');

let {
    contain
} = require('bolzano');

let editor = require('kabanery-editor');

let fold = require('kabanery-fold');

let foldArrow = require('kabanery-fold/lib/foldArrow');

let {
    isObject
} = require('basetype');

const {
    NUMBER, BOOLEAN, STRING, JSON_TYPE, NULL, INLINE_TYPES, DEFAULT_DATA_MAP
} = require('./const');

let {
    getDataTypePath
} = require('./model');

/**
 * used to define json data
 */
module.exports = view(({
    value, onchange = id, optionsView
}) => {
    let type = getDataTypePath(value.path);

    let onValueChanged = (v) => {
        value.value = v;
        onchange(value);
    };

    let renderInputArea = () => {
        return [
            type === NUMBER && n('input type="number"', {
                style: {
                    marginTop: -10
                },
                value: value.value || DEFAULT_DATA_MAP[type],
                oninput: (e) => {
                    let num = Number(e.target.value);
                    onValueChanged(num);
                }
            }),

            type === BOOLEAN && SelectView({
                options: [
                    ['true'],
                    ['false']
                ],
                selected: value.value === true ? 'true' : 'false',
                onchange: (v) => {
                    let ret = false;
                    if (v === 'true') {
                        ret = true;
                    }

                    onValueChanged(ret);
                }
            }),

            type === STRING && n(`input type="${value.type||'text'}" placeholder="${value.placeholder || ''}"`, {
                style: {
                    marginTop: -10
                },

                value: value.value || DEFAULT_DATA_MAP[type],
                oninput: (e) => {
                    onValueChanged(e.target.value);
                }
            }),

            type === JSON_TYPE && n('div', {
                style: {
                    marginLeft: 15,
                    width: 600,
                    height: 500
                }
            }, [
                editor({
                    content: JSON.stringify(value.value, null, 4) || DEFAULT_DATA_MAP[type],
                    onchange: (v) => {
                        // TODO catch
                        try {
                            let jsonObject = JSON.parse(v);
                            onValueChanged(jsonObject);
                        } catch (err) {
                            onValueChanged(err);
                        }
                    }
                })
            ]),

            type === NULL && n('span', 'null')
        ];
    };

    return n('div', {
        style: {
            border: contain(INLINE_TYPES, type) ? '0' : '1px solid rgba(200, 200, 200, 0.4)',
            minWidth: 160
        }
    }, [
        optionsView,

        n('div', {
            style: {
                display: !type ? 'block' : contain(INLINE_TYPES, type) ? 'inline-block' : 'block'
            }
        }),

        !contain(INLINE_TYPES, type) ? fold({
            head: (ops) => n('div', {
                style: {
                    textAlign: 'right',
                    cursor: 'pointer'
                },
                'class': 'lambda-ui-hover',
                onclick: () => {
                    ops.toggle();
                }
            }, [
                ops.isHide() && n('span', {
                    style: {
                        color: '#9b9b9b',
                        paddingRight: 60
                    }
                }, abbreText(value.value)),

                foldArrow(ops)
            ]),

            body: renderInputArea,
            hide: false
        }) : renderInputArea()
    ]);
});

let abbreText = (data) => {
    let str = data;
    if (isObject(data)) {
        str = JSON.stringify(data);
    }
    if (str.length > 30) {
        return str.substring(0, 27) + '...';
    }
    return str;
};

const id = v => v;
