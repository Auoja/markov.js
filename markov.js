var train = function(input) {
    var wordstats = {};
    var sentences = [];

    wordstats.__words = {};
    wordstats.__terminals = {};
    wordstats.__seedwords = [];

    if (input.constructor === Array) {
        sentences = input;
    } else {
        sentences = input.match(/[^\.!\?]+[\.!\?]+/g);
        // sentences = input.match(/\(?[A-Z][^\.]+[\.!\?]\)?(\s+|$)/g);
    }

    function isUpperCase(word) {
        var firstChar = word.charAt(0);
        return (firstChar !== firstChar.toLowerCase() && firstChar === firstChar.toUpperCase());
    }

    function getWords(sentence) {
        var words = sentence.split(' ');
        if (words[0] === '') {
            words.shift();
        }
        return words;
    }

    for (var i = 0; i < sentences.length; i++) {
        var words = getWords(sentences[i]);

        // Make sure first letter in seed word is capital and that sentence is longer than 1 word
        if (words.length > 1 && isUpperCase(words[0])) {
            wordstats.__terminals[words[words.length - 1]] = true;
            wordstats.__seedwords.push({
                word: words[0],
                length: words.length
            });

            for (var j = 0; j < words.length - 1; j++) {
                if (wordstats.__words.hasOwnProperty(words[j])) {
                    wordstats.__words[words[j]].push(words[j + 1]);
                } else {
                    wordstats.__words[words[j]] = [words[j + 1]];
                }
            }
        }
    }

    return wordstats;
};

var generator = function(wordstats) {

    var initialSeed = selectRandom(wordstats.__seedwords);
    var word = initialSeed.word;
    var sentenceTargetLength = initialSeed.length;
    var sentence = [word];

    function selectRandom(array) {
        var i = Math.floor(array.length * Math.random());
        return array[i];
    }

    while (wordstats.__words.hasOwnProperty(word)) {
        var nextWords = wordstats.__words[word];
        word = selectRandom(nextWords);
        sentence.push(word);
        if (sentence.length > sentenceTargetLength && wordstats.__terminals.hasOwnProperty(word)) {
            break;
        }
    }

    // Regenerate if sentence is too short or too long
    if (sentence.length < sentenceTargetLength || sentence.length > (sentenceTargetLength * 2)) {
        return generator(wordstats);
    }

    return sentence.join(' ');
};

module.exports = {
    train: train,
    generator: generator
};