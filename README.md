## Currency string validation and parsing for AJV

This module exports a single function function which adds the currency
validation keywords `'currency-en'`, `'currency-eu'`, and `'currency'` and
the currency parsing keywords `'currency-en-value'`, `'currency-eu-value'`,
and `'currency-value'` to [Ajv](https://github.com/epoberezkin/ajv)
instance, like so:

```JavaScript
// IMPORTS
var Ajv = require("ajv"),
	add_ccy_keywords = require("./ajv-currency");

// CREATE AN AJV INSTANCE
var ajv = new Ajv();

// ADD THE CURRENCY KEYWORDS TO THE INSTANCE: 
add_ccy_keywords(ajv);
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
specified when using the keyword `"currency"`.  The extended (perl style)
regular expressions library [xregexp](http://xregexp.com/) is used rather
than JavaScript's Regular Expressions to take advantage of the included
[unicode currency range](https://stackoverflow.com/a/4180379/1519199) item
(\p{Sc}), and by default, the any of the Unicode currency symbols may
appear at the start of the number string. 

```JavaScript
// CREATE A CUSTOM VALIDATOR
var weird_ccy_validator = 
	ajv.compile({ 
		"currency":{
		   	"decimal":"v",
			"separator":"_",
			"symbol":"\u20ac" // Optional: see note above.
		},
	})

weird_ccy_validator("\u20ac(1_234_567v89)"); // true
weird_ccy_validator("$1,234.56"); // false
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




