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

export = function(x:any, // an Ajv Instance
                  options:currency_regex_options):void{

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
        "compile": function (schema?:currency_regex_options) {
            var regex:RegExp;
            if(typeof schema ===  "object"){
                regex = currency_regex(schema);
            }else if(options !== undefined){
                regex = currency_regex(options);
            }else{
                regex = english_currency_regex
            }
            return (data:string) => { return regex.test(data)};
        },
        "metaSchema":{
            "oneOf":[
                {"type":"boolean"},
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
        "compile": function (schema?:currency_regex_options) {
            var parser:{(x:string):number};
            if(typeof schema ===  "object"){
                parser = currency_parser(schema);
            }else if(options !== undefined){
                parser = currency_parser(options);
            }else{
                parser = english_currency_parser;
            }
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
            "oneOf":[
                {"type":"boolean"},
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

}

