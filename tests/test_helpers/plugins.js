module.exports.nodeError = {
  message: 'A terrible thing happened to your stylesheet.',
  test: function(file){
    return [{
      rule: file.ast.first('ruleset')
    }];
  }
};

module.exports.fileError = {
  message: 'A terrible thing happened to your stylesheet.',
  test: function(file){
    return [{
      file: file
    }];
  }
};

module.exports.nodeErrorMessage = {
  message: function(error) {
    return 'A terrible thing happened to your stylesheet and ' + error.data.rule + '.';
  },
  test: function(file){
    return [{
      rule: file.ast.first('ruleset'),
      message: 'that is a big bummer'
    }];
  }
};

module.exports.fileErrorMessage = {
  message: function(error) {
    return 'A terrible thing happened to your stylesheet and ' + error.data.rule + '.';
  },
  test: function(file){
    return [{
      file: file,
      message: 'that must make you really sad'
    }];
  }
};

