'use strict';

var path = require('path');
var fs = require('fs');

var _ = require('lodash');
var utils = require('../utils');

// Global variables
var absPath = '/home/whitehead/Desktop/Old/work/procuratio/';
var outputPath = absPath + 'common/models';
var modelConfigPath = absPath + 'server/model-config.json';
var autoDiscoverCfg = require('../auto-discover-config.json');
var datasource = require('../datasources.json').MySQL;

var tablesObj = {};
var modelDefinition = {
  dataSource: 'MySQL',
  public: true,
  $promise: {},
  $resolved: true,
};

// Loopback mounted
module.exports = function(app) {
  console.log('Running script from boot: autodiscover.js', __dirname);

  // Get MySQL datasourceasdada
  var MySQL = app.dataSources.MySQL;
  var connector = MySQL.connector;

  var next = true;

  MySQL.on('connected', function() {
    console.log('Connected to MySQL from boot script');

    if (next) {
      MySQL.discoverSchema(
            'crm_asesor_tecnico',
            {associations: true, relations: true},
            function(err, schema) {
              if (schema !== undefined) {
                // Check for relations
                if (_.isEmpty(schema.options.relations)) {
                  // console.log('Model: ', schema.name + ' has no relations defined')
                } else {
                  // console.log('Model: ' + schema.name +  ' has defined relation/s', schema);
                }

                // Check for ForeignKeys
                _.forOwn(schema.properties, function(value, key) {
                  if (key !== 'id' && _.includes(key, 'id')) {
                    // console.log('ForeignKey found: ', key, schema);
                  }
                });

                // Add each model as valid object
                tablesObj[schema.name] = modelDefinition;

                // Write .json valid file
                var outputName = outputPath + '/' + schema.name + '.json';
                fs.writeFile(
                  outputName,
                  JSON.stringify(schema, null, 2),
                  function(err) {
                    if (err) {
                      console.log(1, err);
                    } else {
                      console.log('JSON saved to ' + outputName);
                    }
                  }
                );

                // Write .js valid file
                fs.writeFile(
                  outputPath + '/' + schema.name + '.js',
                  utils.jsFileString(schema.name),
                  function(err) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log('Created ' + schema.name + '.json file');
                    }
                  }
                );
              } else {
              }

              // Check if last index of loop and re-write model-config.json
              if (next) {
                fs.readFile(modelConfigPath, 'utf8', function readFileCallback(
                  err,
                  data
                ) {
                  if (err) {
                    console.log(err);
                  } else {
                    var modelConfig = JSON.parse(data);
                    for (var prop in tablesObj) {
                      if (tablesObj.hasOwnProperty(prop)) {
                        modelConfig[prop] = tablesObj[prop];
                      }
                    }
                    var json = JSON.stringify(modelConfig);
                    fs.writeFile(modelConfigPath, json, 'utf8', function() {
                      console.log(
                        'File model-config.json successfully written'
                      );
                    });
                  }
                });

                fs.readFile(
                  absPath + 'server/auto-discover-config.json',
                  'utf8',
                  function readFileCallback(err, data) {
                    if (err) {
                      console.log(err);
                    } else {
                      var autoDiscoverConfig = JSON.parse(data);
                      autoDiscoverConfig.ready = true;
                      var json = JSON.stringify(autoDiscoverConfig);
                      fs.writeFile(
                        absPath + 'server/auto-discover-config.json',
                        json,
                        'utf8',
                        function() {
                          console.log(
                            'File auto-discover-config.json successfuly written'
                          );
                        }
                      );
                    }
                  }
                );
              }
            }
          );
    }

    connector.observe('before execute', function(ctx, next) {
      next();
    });

    connector.observe('after execute', function(ctx, next) {
      next();
    });

    if (autoDiscoverCfg.ready) {
      console.log('Already discovered. Now skipping...');
      // MySQL.discoverModelDefinitions({ schema: datasource.database }, utils.show);
    } else {
      // Discover model definitions from Database
      MySQL.discoverModelDefinitions({schema: datasource.database}, function(
        err,
        models
      ) {
        var count = models.length;

        // For each model, discover scheme and add files to common/models && edit model-config.json
        _.each(models, function(model) {
          MySQL.discoverSchema(
            model.name,
            {associations: true, relations: true},
            function(err, schema) {
              if (schema !== undefined) {
                // Check for relations
                if (_.isEmpty(schema.options.relations)) {
                  // console.log('Model: ', schema.name + ' has no relations defined')
                } else {
                  // console.log('Model: ' + schema.name +  ' has defined relation/s', schema);
                }

                // Check for ForeignKeys
                _.forOwn(schema.properties, function(value, key) {
                  if (key !== 'id' && _.includes(key, 'id')) {
                    // console.log('ForeignKey found: ', key, schema);
                  }
                });

                // Add each model as valid object
                tablesObj[schema.name] = modelDefinition;

                // Write .json valid file
                var outputName = outputPath + '/' + schema.name + '.json';
                fs.writeFile(
                  outputName,
                  JSON.stringify(schema, null, 2),
                  function(err) {
                    if (err) {
                      console.log(1, err);
                    } else {
                      console.log('JSON saved to ' + outputName);
                    }
                  }
                );

                // Write .js valid file
                fs.writeFile(
                  outputPath + '/' + schema.name + '.js',
                  utils.jsFileString(schema.name),
                  function(err) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log('Created ' + schema.name + '.json file');
                    }
                  }
                );
              } else {
                console.log('undefined', model, schema);
              }

              // Check if last index of loop and re-write model-config.json
              if (models.indexOf(model) + 1 == models.length) {
                fs.readFile(modelConfigPath, 'utf8', function readFileCallback(
                  err,
                  data
                ) {
                  if (err) {
                    console.log(err);
                  } else {
                    var modelConfig = JSON.parse(data);
                    for (var prop in tablesObj) {
                      if (tablesObj.hasOwnProperty(prop)) {
                        modelConfig[prop] = tablesObj[prop];
                      }
                    }
                    var json = JSON.stringify(modelConfig);
                    fs.writeFile(modelConfigPath, json, 'utf8', function() {
                      console.log(
                        'File model-config.json successfully written'
                      );
                    });
                  }
                });

                fs.readFile(
                  absPath + 'server/auto-discover-config.json',
                  'utf8',
                  function readFileCallback(err, data) {
                    if (err) {
                      console.log(err);
                    } else {
                      var autoDiscoverConfig = JSON.parse(data);
                      autoDiscoverConfig.ready = true;
                      var json = JSON.stringify(autoDiscoverConfig);
                      fs.writeFile(
                        absPath + 'server/auto-discover-config.json',
                        json,
                        'utf8',
                        function() {
                          console.log(
                            'File auto-discover-config.json successfuly written'
                          );
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        });
      });
    }
    // mySql.discoverAndBuildModels('tblauditoria', {visited: {}, associations: true, schema: 'mobile', relations: true},
    //     function (err, models) {
    //         models.Tblauditoria.find({
    //             limit: 10
    //         }, function (err, inv) {
    //             console.log('Running');
    //             if(err) {
    //             console.error(err);
    //             return;
    //             }
    //             console.log("\Model: ", inv);
    //             // Navigate to the product model
    //             // Assumes inventory table has a foreign key relationship to product table
    //         });
    // })

    // Only for raw SQL query
    MySQL.connector.execute("SELECT crm_contactos.codigo, crm_contactos.nombre, crm_agendadiaria.direccion, crm_agendadiaria.entrecalles, DATE_FORMAT(crm_agendadiaria.fecha_inicio, '%H:%i:%s') as horario  FROM crm_agendadiaria INNER JOIN crm_contactos ON crm_contactos.id = crm_agendadiaria.contactoid WHERE crm_agendadiaria.asesorid = '116' AND (crm_agendadiaria.fecha_inicio BETWEEN '2017-08-14 00:00:00' AND '2017-08-14 23:59:59')", function(err, result) {
      if (err) console.log(err);
      console.log('PIJAZOOOOOOOOOOOOOX', result);
    });
  });
};
