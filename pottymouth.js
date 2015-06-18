/*
pottymouth.js
https://github.com/listenrightmeow
WTFPL (http://www.wtfpl.net/txt/copying/)
*/

;(function(root, factory) {
  if(typeof define === 'function' && define.amd) {
    define(['pottymouth', 'json!badwords'], function(pottymouth, badwords) {
      return (root.pottymouth = factory(pottymouth, badwords));
    });
  } else if(typeof exports === 'object') {
    module.exports = factory(require('pottymouth'), require('badwords'));
  } else {
    root.pottymouth = factory(root.pottymouth, null);
  }
} (this, function(pottymouth, dictionary) {
  var root = this || global,
      pottymouth = {
        threshold : 0.5
      },
      validate = {},
      re = [
        '\\b(as{2,})',
        '(p([o|0]{1,})rn)',
        '(pus{2,})',
        '(sh([i|\\W|\\d]+)[t|+])',
        '((f|ph)[u|c|k|q]+)',
        '(d([i|1]+)ldo)',
        '(f([a|\\@]+)g)',
        '(bu([t|\\W]+))',
        '(b([i|\\W])a?tch)',
        '(b([o|0]{2,})bs?)',
        '((c[o|0]ck)([\\w|\\W]?)+)',
        '(cl[i|1]+t)',
        '(c(o{2,})n)',
        '(blow|cu[m|nt]+)',
        '(d([i|\\d|\\W]+)ck)',
        '(f[a|\\W]([n]+)y)',
        '(f([a|\\W]+t((a|\\W|\\d])[s|\\W|\\d]?|[f|ph].+)?))',
        '(n([i|1]+)gg)',
        '(p([e|3]+)n([i|1]{1,})s)',
        '(pis{2,})',
        '(t([i|\\W|\\d]+)(t+).+)',
        '(tw([a|\\W|\\d]t+))',
        '(b([o|0]+)n([e|\\d|\\W]+r))',
        '(wh([o|\\d|\\W]+)r([e|\\d|\\W]+))'
      ];

  validate.dictionary = function(word) {
    return !!pottymouth.badwords.context[word]
  };

  validate.regex = function(word) {
    var match = 0,
        max = Math.floor(word.length * pottymouth.threshold);

    for (var i = re.length - 1; i >= 0; i--) {
      var length,
        regex = new RegExp(re[i], 'gi'),
        word = word.replace(/[\s|\_]/g,''),
        query = word.match(regex);

      if (!query) continue;

      match = match + query[0].length;

      if (match >= max) break;
    };


    return match >= max;
  }

  pottymouth.badwords = {
    context : dictionary,
    ignore : false,
    set : function(ctx) {
      if (ctx instanceof Object) {
        this.context = ctx;
        return;
      }

      var self = this,
          xhr = new XMLHttpRequest(),
          success = function() {
            self.context = JSON.parse(this.responseText);
          },
          error = function() {
            throw new Error('badwords dictionary request failed.');
          };

      xhr.onload = success;
      xhr.open('get', ctx, true);
      xhr.send();
    }
  };

  pottymouth.validate = {
    threshold : {
      get : function() {
        return pottymouth.threshold;
      },
      set : function(ctx) {
        if (isNaN(parseInt(ctx, 10))) throw new Error('Can\'t set threshold to a non-number.');

        pottymouth.threshold = ctx < 1 ? ctx : 1;
      }
    },
    full : function(word) {
      this.preflight(word);

      if (this.dictionary(word)) {
        return true;
      } else {
        return this.regex(word);
      }
    },
    dictionary : function(word) {
      this.preflight(word);

      return validate.dictionary.call(root, word);
    },
    preflight : function(word) {
      if (!word) {
        throw new Error('validate requires a word to filter.');
      } else if (!pottymouth.badwords.ignore && !pottymouth.badwords.context) {
        throw new Error('badwords is required. set badwords before validation.');
      }
    },
    regex : function(word) {
      this.preflight(word);

      return validate.regex.call(root, word);
    }
  }

  return pottymouth;
}));