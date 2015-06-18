module.exports = {
  badwords: {
    src: 'badwords.json',
    dest: 'dist/badwords.json',
    options: {
      process: function (content, srcpath) {
        return content.replace(/[\s]/g,'');
      },
    },
  }
}