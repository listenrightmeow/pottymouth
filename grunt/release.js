module.exports = function(grunt) {
  var cwd = process.cwd();

  grunt.registerTask('release', '', function() {
    var done = this.async(),
        http = require('https'),
        fs = require('fs'),
        file = fs.createWriteStream(cwd + '/dist/badwords.json'),
        dictionary = grunt.option('dictionary'),
        callback = function() {
          return grunt.task.run('build');
        };

    if (!!dictionary) {
      http.get(dictionary, function(response) {
        var body = '';

        response.on('data', function(chunk) {
          body += chunk;
        });

        response.on('end', function() {
          var filetype = grunt.option('filetype'),
              data = filetype === 'json' ? file : {};

          if (filetype === 'json') {
            response.pipe(body);
            file.end();
          } else {
            var terms = (filetype === 'txt') ? body.split('\n') : JSON.stringify(body);

            for (var i = terms.length - 1; i >= 0; i--) {
              data[terms[i]] = 1;

              if (i === 0) {
                file.write(JSON.stringify(data));
                file.end();
              }
            };
          }

        });

        file.on('finish', function() {
          file.close(callback);
        });
      }).on('error', function(err) {
        fs.unlink(file);
        throw new Error('File not found: ' + dictionary);
      });
    } else {
      callback();
    }
  });
};