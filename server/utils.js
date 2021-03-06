var exports = module.exports = {};

exports.capitaliseFirstLetter = function(string) {
    return string.charAt(0)
        .toUpperCase() + string.slice(1);
  }
  
exports.jsFileString = function(model_name) {
    return '' + 'module.exports = function(' + exports.capitaliseFirstLetter(model_name) + ') {\n' + '\t\n' + '};';
  }

exports.show = function(err, models) {
    if (err) {
      console.error(err);
    } else {
      console.log(models);
      if (models) {
        models.forEach(function(m) {
          console.dir(m);
        });
      }
    }
  };  