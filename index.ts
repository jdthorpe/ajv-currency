import {
    // constants:
    currency_regex, 
    currency_parser,
    english_currency_parser,
    euro_currency_parser,
    english_currency_regex,
    euro_currency_regex,
    // schema:
    currency_regex_options
    } from "currency-parser"

//-- const AJV = require('ajv');

export = function add_ajv_Keywords(x:any):void{

    // ------------------------------
    // string validators
    // ------------------------------

    x.addKeyword('currency-en', { 
        "type": 'string', 
        "compile": function () {
            return (data:string) => { return english_currency_regex.test(data)};
        }
    });

    x.addKeyword('currency-eu', { 
        "type": 'string', 
        "compile": function () {
            return (data:string) => { return euro_currency_regex.test(data)};
        }
    });

    x.addKeyword('currency', { 
        "type": 'string', 
        "compile": function (schema:currency_regex_options) {
            const regex = currency_regex(schema);
            return (data:string) => { return regex.test(data)};
        },
        "metaSchema":{
            "type":"object",
            "properties":{
                "decimal":{
                    "type":'string',
                    "minLength":1,
                },
                "separator":{
                    "type":'string',
                    "minLength":1,
                },
                "symbol":{
                    "type":'string',
                    "minLength":1,
                },
            },
            required:[ "decimal", "separator", ],
        },
    });

    // ------------------------------
    // string parsers
    // ------------------------------

    x.addKeyword('currency-en-value', { 
        "modifying": true,
        "type": 'string', 
        "compile": function () {
            return (data:string,path:string[],parent:any,key:string) => { 
                try{
                    parent[key] = english_currency_parser(data);
                    return true;
                }catch(err){
                    return false;
                }
            };
        }
    });

    x.addKeyword('currency-eu-value', { 
        "modifying": true,
        "type": 'string', 
        "compile": function () {
            return (data:string,path:string[],parent:any,key:string) => { 
                try{
                    parent[key] = euro_currency_parser(data);
                    return true;
                }catch(err){
                    return false;
                }
            };
        }
    });

    x.addKeyword('currency-value', { 
        "modifying": true,
        "type": 'string', 
        "compile": function (schema:currency_regex_options) {
            const parser = currency_parser(schema);
            return (data:string,path:string[],parent:any,key:string) => {  
                try{
                    parent[key] = parser(data);
                    return true;
                }catch(err){
                    return false;
                }
            };
        },
        "metaSchema":{
            "type":"object",
            "properties":{
                "decimal":{
                    "type":'string',
                    "minLength":1,
                },
                "separator":{
                    "type":'string',
                    "minLength":1,
                },
                "symbol":{
                    "type":'string',
                    "minLength":1,
                },
            },
            "required":[ "decimal", "separator", ],
        },
    });

}

