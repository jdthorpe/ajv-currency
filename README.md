## Currency string validation and parsing for AJV

This module exports a single function which adds the currency
validation keywords `'currency-en'`, `'currency-eu'`, and `'currency'` and
the currency parsing keywords `'currency-en-value'`, `'currency-eu-value'`,
and `'currency-value'` to [Ajv](https://github.com/epoberezkin/ajv)
instance, like so:

```JavaScript
// Create an ajv instance
var Ajv = require("ajv");
var ajv = new Ajv();

// Add the currency keywords to the instance
require("ajv-currency")(ajv);
```

### Validation

With the keywords added to out ajv instance, English (`-en`) and European
(`-eu`) style strings can be validated like so:
```JavaScript
ajv.validate({"currency-en":true},"$1,234,567.89");        // true
ajv.validate({"currency-en":true},"$-1,234,567.89");       // true
ajv.validate({"currency-eu":true},"\u20ac1.234.567,89");   // true
ajv.validate({"currency-eu":true},"\u20ac(1.234.567,89)"); // true
ajv.validate({"currency-eu":true},"(\u00a51.234.567,89)"); // true

ajv.validate({"currency-en":true},"$12,34,567.89");       // false
ajv.validate({"currency-en":true},"$-1,234,56789");       // false
ajv.validate({"currency-eu":true},"\u20ac1.2345.67,89");  // false
ajv.validate({"currency-eu":true},"\u20ac(1.234567,89)"); // false
ajv.validate({"currency-eu":true},"(\u00a51234.567,89)"); // false
```

Alternatively, the decimal, separator, and (optionally) the symbol may be
specified with the keyword `"currency"` like so: 

```JavaScript
ajv.validate({"currency":{"separator":",","decimal":"."}},"$1,234,567.89"); // true
ajv.validate({"currency":{"separator":".","decimal":","}},"$1.234.567,89"); // true
```

and defaults for decimal, separator, and currency may be specified when
loading the plug in:

```JavaScript
var ajv = new Ajv();
require("ajv-currency")(ajv,{"separator":",","decimal":"."}); // same as the default

ajv.validate({"currency":true},"$1,234,567.89"); // true
ajv.validate({"currency":true},"$1.234.567,89"); // false

// Defaults can be overridden in the schema:
ajv.validate({"currency":{"separator":".","decimal":","}},"$1.234.567,89"); // true
```

The extended (perl style) regular expressions library
[xregexp](http://xregexp.com/) is used rather than JavaScript's Regular
Expressions to take advantage of the included [unicode currency
range](https://stackoverflow.com/a/4180379/1519199) item (\p{Sc}), and by
default, the any of the Unicode currency symbols may appear at the start of
the number string. 

```JavaScript
// Create a custom validator
var weird_ccy_validator = 
	ajv.compile({ 
		"currency":{
		   	"decimal":"v",
			"separator":"_",
			"symbol":"\u20ac" // the euro symbol (€) 
		},
	})

weird_ccy_validator("\u20ac(1_234_567v89)"); // true: euro symbol
weird_ccy_validator("(1_234_567v89)");       // true: currency symbol is not required
weird_ccy_validator("$(1_234_567v89)");      // false: wrong currency symbol
```

### String Parsing

In addition to validation, string to attributes can be parsed and replaced
with the numeric value, using any of the `-value` keywords, like so:

```JavaScript
// Coerce (parse) an currency string in the English format
var parse_amount = 
	ajv.compile({ 
		type:"object",
		"properties":{
			"amount":{
				"currency-en-value":true
			}
		},
	});
var x = {amount:"\u20ac(1,234,567.89)"}
parse_amount(x) // true
x.amount // -1234567.89

// Coerce (parse) an currency string with a strange format
var parse_weird_amount = 
	ajv.compile({ 
		"properties":{ 
			"amount":{
				"currency-value":{
					"decimal":"v",
					"separator":"_",
					"symbol":"\u20ac" // Optional: see note above.
				}
			}
		},
	})

var x = {amount:"\u20ac(1_234_567v89)"}
parse_weird_amount(x); // true
x.amount // -1234567.89
```




