'use strict';

module.exports = function(Proxy) {
  Proxy.get_contacts = function(args, cb) {
    var MySQL = Proxy.app.dataSources.MySQL;
    var query = "SELECT crm_contactos.codigo, crm_contactos.nombre FROM crm_agendadiaria INNER JOIN crm_contactos ON crm_contactos.id = crm_agendadiaria.contactoid WHERE crm_agendadiaria.asesorid = '34';";

    MySQL.connector.execute(query, function(err, result) {
      console.log('Executing raw SQL Query', query);
      if (err) cb(err);
      console.log('MERCA', result);
              // cb(null, result);
      cb(null, result);
    });
  };

  Proxy.login = function(credentials, cb) {

  };

  Proxy.get_today_events = function(args, cb) {
    var MySQL = Proxy.app.dataSources.MySQL;
    var queryString;

    var response = [
      {
        today: [],
        tomorrow: [],
        list: [],
      },
    ];

    console.log('ARGS', args);

    var today = "SELECT count(id) as cantidadagendas FROM crm_agendadiaria WHERE asesorid = '34' AND (fecha_inicio BETWEEN '2017-08-14 00:00:00' AND '2017-08-14 23:59:59')";

    MySQL.connector.execute(today, function(err, result) {
      console.log('Executing raw SQL Query', queryString);
      if (err) cb(err);
      // console.log(result);

      response[0].today = result;

      var tomorrow = "SELECT count(id) as cantidadagendas FROM crm_agendadiaria WHERE asesorid = '34' AND (fecha_inicio BETWEEN '2017-08-15 00:00:00' AND '2017-08-15 23:59:59')";
      MySQL.connector.execute(tomorrow, function(err, result) {
        console.log('Executing raw SQL Query', queryString);
        if (err) cb(err);
        // console.log(result);

        response[0].tomorrow = result;

        var list = "SELECT crm_contactos.codigo, crm_contactos.nombre FROM crm_agendadiaria INNER JOIN crm_contactos ON crm_contactos.id = crm_agendadiaria.contactoid WHERE crm_agendadiaria.asesorid = '34' AND (crm_agendadiaria.fecha_inicio BETWEEN '2017-08-14 00:00:00' AND '2017-08-14 23:59:59')";

        MySQL.connector.execute(list, function(err, result) {
          console.log('Executing raw SQL Query', queryString);
          if (err) cb(err);
          console.log('MERCA', result);
                  // cb(null, result);

          response[0].list = result;
          cb(null, response);
        });
          // cb(null, result);
      });

        // cb(null, result);
    });

      // var tomorrow = "SELECT count(id) as cantidadagendas FROM crm_agendadiaria WHERE asesorid = '34' AND (fecha_inicio BETWEEN '2017-08-15 00:00:00' AND '2017-08-15 23:59:59')";
      // MySQL.connector.execute(tomorrow, function(err, result) {
      //   console.log('Executing raw SQL Query', queryString);
      //   if (err) cb(err);
      //   console.log(result);
      //   // cb(null, result);
      // });

      // var list = "SELECT crm_contactos.codigo, crm_contactos.nombre, crm_agendadiaria.direccion, crm_agendadiaria.entrecalles, DATE_FORMAT(crm_agendadiaria.fecha_inicio, '%H:%i:%s') as horario  FROM crm_agendadiaria INNER JOIN crm_contactos ON crm_contactos.id = crm_agendadiaria.contactoid WHERE crm_agendadiaria.asesorid = '34'";

      // MySQL.connector.execute(list, function(err, result) {
      //   console.log('Executing raw SQL Query', queryString);
      //   if (err) cb(err);
      //   console.log(result);
      //   // cb(null, result);
      // });
  };

    // if (args.login) {
    //   var User = Proxy.app.models.SalesforceUsuarios;
    //   var AsesorTecnico = Proxy.app.models.CrmAsesorTecnico;

    //   User.find({
    //     where: {
    //       dispositivo: args.uuid,
    //     },
    //   }, function(err, users) {
    //     if (err) cb(err);

    //     var user = users[0];

    //     AsesorTecnico.find({
    //       where: {
    //         id: user.asesorTecnicoId,
    //       },
    //     }, function(err, asesor) {
    //       if (err) {
    //         cb(err);
    //       } else {
    //         user.asesor = asesor[0];
    //         cb(null, [
    //           user,
    //         ]);
    //       }
    //     });
    //   });
    // }

  Proxy.remoteMethod('get_today_events', {
    accepts: {arg: 'args', type: 'object'},
    returns: {arg: 'response', type: 'array'},
    http: {verb: 'post'},
  });

  Proxy.remoteMethod('get_contacts', {
    accepts: {arg: 'args', type: 'object'},
    returns: {arg: 'response', type: 'array'},
    http: {verb: 'post'},
  });
};

