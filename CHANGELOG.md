<a name="0.0.5"></a>
## 0.0.5 (2016-03-14)


### Refactor

* **api:** Rename `as` to `renameTo` for clarity. ([781ef75](https://github.com/shane-tomlinson/vat/commit/781ef75))



<a name="0.0.4"></a>
## 0.0.4 (2016-03-11)


### Bug Fixes

* **rules:** Perform transformations before checking `valid` and `allowed` ([2005f10](https://github.com/shane-tomlinson/vat/commit/2005f10))

### Features

* **api:** `allow` and `valid` accept multiple arguments. ([e349764](https://github.com/shane-tomlinson/vat/commit/e349764))



<a name="0.0.3"></a>
## 0.0.3 (2016-03-09)


### Bug Fixes

* **API:** required checks should occur before any other validators. ([7087573](https://github.com/shane-tomlinson/vat/commit/7087573))
* **build:** Fix grunt-bump, change pushTo to `origin` ([c8fff5a](https://github.com/shane-tomlinson/vat/commit/c8fff5a))

### Features

* **build:** Prepare for automated release. ([e221f06](https://github.com/shane-tomlinson/vat/commit/e221f06))



<a name="0.0.2"></a>

## 0.0.2 (2016-03-08)


### Bug Fixes

* **test:** Fix undefined optional values with schemas that use test. ([273a7f7](https://github.com/shane-tomlinson/vat/commit/273a7f7))

### chore

* **formatting:** Convert to ES6 object shorthand ([42e35b8](https://github.com/shane-tomlinson/vat/commit/42e35b8))

### Features

* **api:** All fields are optional by default. ([cae9923](https://github.com/shane-tomlinson/vat/commit/cae9923))
* **API:** Add `register` and `unregister` functions to allow custom types. ([04c376f](https://github.com/shane-tomlinson/vat/commit/04c376f))
* **API:** Make objects immutable. ([fd74b0d](https://github.com/shane-tomlinson/vat/commit/fd74b0d))
* **test:** Add support for CircleCI ([5533817](https://github.com/shane-tomlinson/vat/commit/5533817))

### Refactor

* **api:** A schema is now an object, validate must be called to validate. ([682dd7e](https://github.com/shane-tomlinson/vat/commit/682dd7e))
* **api:** Rename `use` to `test` ([bd8c472](https://github.com/shane-tomlinson/vat/commit/bd8c472))
* **formatting:** Simplify modules w/ ES6 shorthand ([5bd891a](https://github.com/shane-tomlinson/vat/commit/5bd891a))
* **rules:** The required check now uses `test`. ([16bba5d](https://github.com/shane-tomlinson/vat/commit/16bba5d))
* **test:** Extract individual test modules for each type. ([1d076d8](https://github.com/shane-tomlinson/vat/commit/1d076d8))



<a name="0.0.1"></a>
## 0.0.1 (2016-02-29)


### Bug Fixes

* **build:** Pass the correct options to browserify for UMD modules. ([0c84db1](https://github.com/shane-tomlinson/vat/commit/0c84db1))

### chore

* **build:** Bump package version number ([f7bf386](https://github.com/shane-tomlinson/vat/commit/f7bf386))
* **build:** Update bower.json to ignore lib and Gruntfile.js ([2bb61ba](https://github.com/shane-tomlinson/vat/commit/2bb61ba))
* **test:** No need for index.html ([2c3609e](https://github.com/shane-tomlinson/vat/commit/2c3609e))

### Features

* **api:** Expose `any` ([a977240](https://github.com/shane-tomlinson/vat/commit/a977240))
* **build:** Replace webpack with browserify ([ceb9997](https://github.com/shane-tomlinson/vat/commit/ceb9997))
* **build:** Start to add bower support. ([7acb90f](https://github.com/shane-tomlinson/vat/commit/7acb90f))
* **docs:** Add a README.md shell ([587367b](https://github.com/shane-tomlinson/vat/commit/587367b))
* **transform:** Trim strings by default. ([f1b9206](https://github.com/shane-tomlinson/vat/commit/f1b9206))



