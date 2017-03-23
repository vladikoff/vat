
# VAT API Reference

## Version 0.0.9

* [register](#registertypename-schema)
* [unregister](#unregistertypename)
* [validate](#validatedata-schema)
* [any](#any)
  * [any.allow](#anyallowvalues)
  * [any.as](#anyasname)
  * [any.clone](#anyclone)
  * [any.extend](#anyextendsrc)
  * [any.optional](#anyoptional)
  * [any.required](#anyrequired)
  * [any.strict](#anystrict)
  * [any.test](#anytestvalidator)
  * [any.transform](#anytransformtransformer)
  * [any.valid](#anyvalidvaues)
  * [any.validate](#anyvalidatevalue)
* [boolean](#boolean)
* [number](#number)
  * [number.max](#numbermaxlimit)
  * [number.min](#numberminlimit)
* [string](#string)
  * [string.len](#stringlenlimit)
  * [string.max](#stringmaxlimit)
  * [string.min](#stringminlimit)


## `register(typeName, schema)`
Register a type to be validated with a schema.

* `typeName` |String| name of type
* `schema` |Schema| schema used to validate

After registration, `schema` is accessible using a function shortcut: `vat.<typeName>()`.

```js
const hexSchema = vat.string().test((val) => {
  return /[a-f0-9]+/.test(val);
});
vat.register('hex', hexSchema);
...
// Use the registered type
const userSchema = {
  id: vat.hex().required(),
  name: vat.string()
};
```

## `unregister(typeName)`
Unregister a type.

* `typeName` |String| name of type

```js
vat.unregister('hex');
```

## `validate(data, schema, options)`
Validate data against the schema.

* `data` |Variant| value to be validated
* `schema` |Schema| schema to use to validate
* `options` |Object| Optional options
  * `options.allowUnknown` |Boolean| when true, allows object to contain unknown keys. Defaults to false.

Returns an object containing:
* |Error| result.error - any error thrown. If validating an object, `error` will
  contain a `key` field that contains the name of the invalid field.
  See [Validation Errors](#validation-errors)
* |Variant| result.value - transformed data

```js
// user and userSchema are set up elsewhere
let result = vat.validate(user, userSchema)
// result.error contains any errors that occurred
// result.value contains transformed data
```

## `any()`
Matches any value.

Returns a Schema.

```js
const matchesAnything = vat.any();
```
### `any.allow(...values)`
Explicitly allow a value, before any conversion. Accepts one or more arguments.

* `values` |Variant| list of allowed values

Returns a Schema.

```js
const allowNullSchema = vat.string().allow(null);
```

### `any.as(name)`
Export the result as `name` in the results.

* `name` |String| where value is stored in return object

Returns a Schema.

```js
// `hex` was registered via `register`
const userSchema = {
  id: vat.hex().as('userId'),
  name: vat.string()
};
...
let result = vat.validate({
  id: 'deadbeef',
  name: 'Ham Burger'
}, userSchema);
// result.value contains two fields:
// result.value.userId === 'deadbeef';
// result.value.name === 'Ham Burger';
```

### `any.clone()`
Create a clone of the current schema. Combine with [extend](#anyextendsrc)
to produce a modified schema that will not affect usage elsewhere.

Returns a Schema

```js
var clonedSchema = vat.any().clone();
// new functions and properties can be added to
// clonedSchema w/o affecting vat.any();
```

### `any.extend(src)`
Mix functions into the current schema. __MODIFIES THE CURRENT SCHEMA__.

Returns a Schema

```js
vat.any().extend({
  equal(expected) {
    return this.test((val) => {
      return val === expected;
    });
  },

  notEqual(forbidden) {
    return this.test((val) => {
      return val !== forbidden;
    });
  }
}));
// All callers of `vat.any()` can now make use of `equal` and `notEqual`
```

### `any.optional()`
Mark the field as optional. All fields are optional by default.

Returns a Schema.
```js
const optionalSchema = vat.any().optional();
```

### `any.required()`
Mark the field as required. Fields are optional by default.

Returns a Schema.

```js
const requiredSchema = vat.any().required();
```
### `any.strict()`
Remove current transforms.

Returns a Schema.

```js
const strictlyBooleanSchema = vat.boolean().strict();
// strictlyBooleanSchema will fail with the strings `true` and `false`
// instead of the default behavior of being transformed to
// the boolean equivalent.
```

### `any.test(validator)`
Add a validation test function or RegExp. Function will be called with
value being validated.

* `validator` |Function_or_RegExp| validation function or RegExp

Returns a Schema.

```js
// hexSchema and altHexSchema only allow hex strings.
const hexSchema = vat.string().test((val) => {
  return /[a-f0-9]+/.test(val);
});
const altHexSchema = vat.string().test(/[a-f0-9]+/);
```

### `any.transform(transformer)`
Add a transformer. A transformer is a function that accepts
a value and returns another value. Validation will occur with
the transformed value.

* `transformer` |Function| transformation function

Returns a Schema.

```js
const schema = vat.string().transform((val) => {
  // remove all whitespace from string
  return val && val.replace && val.replace(/\s/g, '');
});
```

### `any.valid(...values)`
Create an exclusive allowed list of values. Accepts one
or more arguments.

* `values` |Variant| list of allowed values

Returns a Schema.

```js
// only accept binary digits
const schema = vat.number().valid(0, 1);
```
### `any.validate(value)`
Validate a value.

*  `value` |Variant| value to validate

Returns an object containing:
* |Error| result.error - any error thrown.
* |Variant| result.value - transformed value. If no transformation occurs,
  the same as `value`.

```js
const hexSchema = vat.any().test((val) => {
  return /[a-f0-9]+/.test(val);
});
...
let result = hexSchema.validate(<value>);
// result.error contains any errors that occurred
// result.value contains transformed value. The same as `value` if
//   no transformation is made.
```
## `boolean()`
Accepts a boolean type or one of the strings `true` or `false`

Returns a Schema.

```js
const matchesBooleans = vat.boolean();
// success for the Boolean types true, false.
// success for the String types 'true', 'false'.
```

## `number()`
Accepts a number type, or a string that converts to an integer or float.

Returns a Schema.

```js
const matchesNumbers = vat.number();
// success for the Number types 0, 100, -1.124, etc.
// success for the String types "0", "100", "-1.124", etc.
```

### `number.max(limit)`
Specifies the maximum allowed value (inclusive).

*  `limit ` |Number| maximum allowed value (inclusive)

Returns a Schema.

```js
const maxSchema = vat.number().max(100);
// numbers in the range [-Infinity, 100] are accepted.
```
### `number.min(limit)`
Specifies the minimum allowed value (inclusive).

*  `limit ` |Number| minimum allowed value (inclusive)

Returns a Schema.

```js
const minSchema = vat.number().min(100);
// numbers in the range [100, +Infinity] are accepted.
```
## `string()`
Accepts a string. Strings are trimmed unless `strict()` is applied.

Returns a Schema.

```js
const matchesStrings = vat.string();
// Success for "", " ", "this is a string", etc.
```

### `string.len(limit)`
Specifies the exact string length required.

*  `limit ` |Number| required length

Returns a Schema.

```js
const exactLengthSchema = vat.string().len(9);
// string must be exactly 9 characters long
```

### `string.max(limit)`
Specifies the maximum number of characters allowed (inclusive).

*  `limit ` |Number| maximum allowed length (inclusive)

Returns a Schema.

```js
const maxLengthSchema = vat.string().max(100);
// string must be at most 100 characters long
```
### `string.min(limit)`
Specifies the minimum number of characters allowed (inclusive).

*  `limit ` |Number| minimum allowed length (inclusive)

Returns a Schema.

```js
const minLengthSchema = vat.string().min(1);
// string must be at least one character long
```

## Validation Errors
### `ReferenceError`
Returned in the following cases:

* Vat.validate is called without a schema.
* A required field is missing or undefined.
* An unknown key is present and `allowUnknown` is `false`.

If validating an object, the returned error will contain a `key` field that
contains the name of the failed item.

### `TypeError`
Returned if a field is defined but does not pass validation.

If validating an object, the returned error will contain a `key` field that
contains the name of the failed item.
