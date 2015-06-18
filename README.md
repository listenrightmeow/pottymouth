pottymouth
==========

[![FUCK](http://img.youtube.com/vi/http://img.youtube.com/vi/m0NGZd_jBcA/0.jpg/0.jpg)](https://www.youtube.com/watch?v=m0NGZd_jBcA)


####Filter badwords and profanity a little smarter
- No dependencies
- AMD, Node and browser ready

Pottymouth will catch badwords like 'sh!!!t', 'b000000bs', 'phuck' or any variation of words of the sort. Pottymouth will catch nested badwords. Pottymouth tries to be smart to not filter names like 'Cassandra' but names like 'Fatima' unfortunately will be caught in the crossfire.

####Installation

NPM, Bower & Git
```
npm install pottymouth
bower install pottymouth
git clone https://github.com/listenrightmeow/pottymouth
```

####Usage

Pottymouth exposes 3 public endpoint-api methods for validation.
Pottymouth exposes 2 public endpoint-api methods to retrieve and set custom threshold values used in validation calculation.

#####AMD

If loading pottymouth in an AMD environment, [json](https://github.com/millermedeiros/requirejs-plugins) plugin by [millermedeiros](https://github.com/millermedeiros) is required.

Currently, almond is not supported.

#####threshold

Default : 0.5. Float/Integer

```js
pottymouth.validate.threshold.set(integer/float)
pottymouth.validate.threshold.get()
```

threshold.set will throw an exception if a non-number is passed as an argument.

#####public methods

Full

This method will validate input with both dictionary and regex methods. If dictionary fails, regex is not called and the boolean is returned immediately.

```js
pottymouth.validate.full('b00bies');
```

Dictionary
```js
pottymouth.validate.dictionary('b00bies');
```

Regex
```js
pottymouth.validate.regex('b00bies');
```

#####dictionary

Will do a quick object lookup for custom badwords.
Dictionary is an easy way to add word violations without having to write a comprehensive regex.

If loading pottymouth in an AMD environment, define a config path entry with a location to the badwords.json file. Pottymouth requires badwords before the class is instantiated.

If loading pottymouth in a Node environment, make sure that pottymouth and badwords remain in the same directory together.

If loading pottymouth in a browser in a non-AMD environment, you will be required to define badmouth with either a url to badwords.json or your can set this class variable to the badwords object itself.

If badwords contains the word as an object key, true will be returned regardless of the threshold set.

```js
pottymouth.validate.dictionary('assmunchies');
```

#####regex

Will match global and case-insensitive regex matches against the user input.

User input may potentially have multiple-nested bad words. This method will iterate over an array of pre-defined regex strings and add will add the number of consecutive characters matched to a score. If the score at anypoint exceeds the class threshold, the method will immediately stop propagation and return true.

Default class threshold is 0.5. Threshold will then be used to evaluate user input * threshold.

Pass
```js
pottymouth.validate.threshold.set(0.5);
pottymouth.validate.regex('assmunchies');
```

The example above would not be filtered. 'ass' (3 characters) does not exceed the threshold of 'assmunchies' (11 characters) set at 0.5.

Fail
```js
pottymouth.validate.threshold.set(0.5);
pottymouth.validate.regex('sh!!!!tface');
```

The example above would be fintered. 'sh!!!!t' (7 characters) does exceed the threshold of 'sh!!!!tface' (11 characters) set at 0.5.