# markov.js

A JavaScript Markov Chain for generating text.

## Usage

There is a demo file provided, but usage is fairly simple.

```javascript

	var stats = markov.train("*Some long text*");
	var sentence = markov.generate(stats);

```