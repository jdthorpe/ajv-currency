"use strict";
var currency_parser_1 = require("currency-parser");
module.exports = function add_ajv_Keywords(x) {
    // ------------------------------
    // string validators
    // ------------------------------
    x.addKeyword('currency-en', {
        "type": 'string',
        "compile": function () {
            return function (data) { return currency_parser_1.english_currency_regex.test(data); };
        }
    });
    x.addKeyword('currency-eu', {
        "type": 'string',
        "compile": function () {
            return function (data) { return currency_parser_1.euro_currency_regex.test(data); };
        }
    });
    x.addKeyword('currency', {
        "type": 'string',
        "compile": function (schema) {
            var regex = currency_parser_1.currency_regex(schema);
            return function (data) { return regex.test(data); };
        },
        "metaSchema": {
            "type": "object",
            "properties": {
                "decimal": {
                    "type": 'string',
                    "minLength": 1,
                },
                "separator": {
                    "type": 'string',
                    "minLength": 1,
                },
                "symbol": {
                    "type": 'string',
                    "minLength": 1,
                },
            },
            required: ["decimal", "separator",],
        },
    });
    // ------------------------------
    // string parsers
    // ------------------------------
    x.addKeyword('currency-en-value', {
        "modifying": true,
        "type": 'string',
        "compile": function () {
            return function (data, path, parent, key) {
                try {
                    parent[key] = currency_parser_1.english_currency_parser(data);
                    return true;
                }
                catch (err) {
                    return false;
                }
            };
        }
    });
    x.addKeyword('currency-eu-value', {
        "modifying": true,
        "type": 'string',
        "compile": function () {
            return function (data, path, parent, key) {
                try {
                    parent[key] = currency_parser_1.euro_currency_parser(data);
                    return true;
                }
                catch (err) {
                    return false;
                }
            };
        }
    });
    x.addKeyword('currency-value', {
        "modifying": true,
        "type": 'string',
        "compile": function (schema) {
            var parser = currency_parser_1.currency_parser(schema);
            return function (data, path, parent, key) {
                try {
                    parent[key] = parser(data);
                    return true;
                }
                catch (err) {
                    return false;
                }
            };
        },
        "metaSchema": {
            "type": "object",
            "properties": {
                "decimal": {
                    "type": 'string',
                    "minLength": 1,
                },
                "separator": {
                    "type": 'string',
                    "minLength": 1,
                },
                "symbol": {
                    "type": 'string',
                    "minLength": 1,
                },
            },
            "required": ["decimal", "separator",],
        },
    });
};
