module.exports.getConcatSelector = function (ruleset) {
  var selector = '';

  if (ruleset.first('atkeyword')){
    selector = ruleset.toString();
  } else {
    selector = ruleset.first('selector').toString();
  }

  selector = selector.replace(/(\r\n|\n|\r)/gm,"");
  selector = selector.replace(/\s\s+/g, ' ');

  return selector.trim();
};
