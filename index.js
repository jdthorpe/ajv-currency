"use strict";
var currency_parser_1 = require("currency-parser");
module.exports = function (x, // an Ajv Instance
    options) {
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
            var regex;
            if (typeof schema === "object") {
                regex = currency_parser_1.currency_regex(schema);
            }
            else if (options !== undefined) {
                regex = currency_parser_1.currency_regex(options);
            }
            else {
                regex = currency_parser_1.english_currency_regex;
            }
            return function (data) { return regex.test(data); };
        },
        "metaSchema": {
            "oneOf": [
                { "type": "boolean" },
                {
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
                    "dependencies": {
                        "decimal": ["separator",],
                        "separator": ["decimal",],
                        "symbol": ["decimal",],
                    }
                }
            ],
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
            var parser;
            if (typeof schema === "object") {
                parser = currency_parser_1.currency_parser(schema);
            }
            else if (options !== undefined) {
                parser = currency_parser_1.currency_parser(options);
            }
            else {
                parser = currency_parser_1.english_currency_parser;
            }
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
            "oneOf": [
                { "type": "boolean" },
                {
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
                    "dependencies": {
                        "decimal": ["separator",],
                        "separator": ["decimal",],
                        "symbol": ["decimal",],
                    }
                }
            ],
        },
    });
};
