# vat
vat - *V*alidate *a*nd *T*ransform using schemas.

vat is a [joi](https://github.com/spumko/joi) inspired library for
data transformation and validation. vat's tiny size (< 2kb gzipped) and extensibility
makes it perfect to embed in web pages.

## Usage
### Simple
A simple single value schema:

```js
let ageSchema = vat.number().min(0).required();
...
let age = getAge();
let result = ageSchema.validate(age);
// result.error is populated with any errors that are returned
// result.value is populated with any transformed values that are returned.
```

The [number schema](blob/master/docs/api.md#number) will accept any number
or string that can be converted to a number and return its number equivalent.

If `getAge` return the string `"24"`, vat will set `result.value` to
the number `24`. If `getAge` returns the number `12`, `result.value` will be
the number `12`.

If `getAge` returns a string that cannot be converted into a number, or a
string/number that is < 0, `result.error` will contain a
`[TypeError](blob/master/docs/api.md#typeerror)`.

### Complex types
Complex schemas can be created too:

```js
let userSchema = {
  user_id: vat.string().len(16).required().as('userId'),
  name: vat.string().required(),
  age: vat.number.min(0).required()
};

let userData = getUserData()
let result = vat.validate(userData, userSchema);
// result.error will contain any errors. If an error occurred, result.error.key
// will contain the name of the field that caused the error.
// result.value will contain an object with the transformed values.
```

Complex schema are used in conjunction with [vat.validate](blob/master/docs/api.md#validatedata-schema).
In this example, the input data should contain 3 fields: `user_id`, `name`, and `age`.
If validation succeeds, `result.value` will contain 3 fields: `userId`, `name`, and `age`.
If validation fails, `result.error` will contain the type of validation error, and
`result.error.key` will contain the name of the field that caused the error.

## API
See the [API docs](docs/api.md).

## Extend vat
### Add a new type
vat allows new types to be registered with [vat.register](blob/master/docs/api.md#registertypename-schema).

```js
const hexSchema = vat.string().test((val) => {
  return /^[0-9a-f]+$/gI.test(val);
});
vat.register('hex', hexSchema);
...

// use the hex schema from the function shortcut.
let result = vat.hex().validate('deadbeef')
```

### Extend an existing type
vat allows new functions to be added to existing types.

```js
let numberSchema = vat.number();
numberSchema.less = function (limit) {
  return this.test((val) => {
    return val < limit;
  });
};
// less is now available to all callers of `vat.number()`
```

## Installation

### bower
> bower install vat

vat is available in &lt;bower_directory&gt;/vat/vat.min.js.
vat can be used with both CommonJS and AMD module loaders and is
available under the window.VAT namespace otherwise.

### npm
TBD


## Author
* Shane Tomlinson
* shane@shanetomlinson.com
* https://shanetomlinson.com
* http://github.com/shane-tomlinson
* @shane_tomlinson

## Get involved

Any and all pull requests will be reviewed and considered.

Specific needs:

* New types packaged as plugins. In particular:
  * email
  * guid
  * dates (esp ISO8601)
  * credit card numbers

## Credit
Thanks go to the developers of [joi](https://github.com/hapijs/joi), it's
a beautiful library to work with.

Thanks also go to [Phil Booth](https://github.com/philbooth) and
[Vijay Budhram](https://github.com/vbudhram) for their extensive feedback
when defining the initial API.

## License
This software is available under version 2.0 of the MPL:

  https://www.mozilla.org/MPL/

