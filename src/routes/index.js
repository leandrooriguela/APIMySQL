const express = require('express');
const router = express.Router();
const mysql = require('../mysql2');
const bodyParser = require('body-parser');

var jsonParser = bodyParser.json()

router.get('/', function (req, res, next) {
	res.status(200).send({
        title: "Mysql to Api",
        autor: "Cleiton Waldemar Ribeiro <cleiton@varejointeligente.tech>",
        version: "0.0.1"
    });
});

router.get('^/:database', function (req, res, next) {
	mysql.query('show tables', req.params.database, function (result) {
		res.status(200).send({
        	result: result,
    	});
	});
});

router.get('^/:database/:table', function (req, res, next) {
	mysql.table_exists(req.params.database, req.params.table, function (err, bool) {
		if(!bool) {
			res.status(401).send({
				       	msg: "Table '"+req.params.database+"."+req.params.table+"' doesn't exist"
			});
			return;
		}
		else {
			mysql.query('select * from '+req.params.table, req.params.database, function (error, result) {

				if(error){
					res.status(401).send({
				       	msg: error.sqlMessage
				    });
				    return;
				}
				res.status(200).send({
			       	result: result
			    });

			});
		}
	});

});

router.post('^/:database/query', jsonParser ,function (req, res, next) {
	req.body.sql
	mysql.query(req.body.sql, req.params.database, function (error, result) {
		if(error){
			res.status(401).send({
				msg: error.sqlMessage
			});
			return;
		}
		 console.log(result);
		res.status(200).send({
			results: result
		});
	});
}); 

router.get('^/:database/:table/*', function (req, res, next) {
	var arr = req.params[0].split("/");
	// console.log("rotina table");
	mysql.table_exists(req.params.database, req.params.table, function (err, bool) {
		if(!bool) {
			res.status(401).send({
				       	msg: "Table '"+req.params.database+"."+req.params.table+"' doesn't exist"
			});
			return;
		}
		else {
				mysql.get_primarykey(req.params.database, req.params.table, function(err, primary) {
				if(err) {
					console.log(err);
					return;
				}
				if(arr.length != primary.length) {
					res.status(400).send({
				       	msg: "A chave primaria enviada e diferete da tabela: "+req.params.table+". Utilize /datatabase/table/chave1/chave2/chave4",
				       	primary: primary
				    });
				    return;
				}
				mysql.build_query(req.params.database, req.params.table, arr, function (err, sql) {
					mysql.query(sql, req.params.database, function (error, result) {

						if(error){
							res.status(401).send({
						       	msg: error.sqlMessage
						    });
						    return;
						}
						res.status(200).send({
					       	results: result
					    });

					});

				});

			});
		}

	});

});

router.put('^/:database/:table/*', jsonParser,function (req, res) {
	var arr = req.params[0].split("/");
	mysql.table_exists(req.params.database, req.params.table, function (err, bool) {
		if(!bool) {
			res.status(401).send({
				       	msg: "Table '"+req.params.database+"."+req.params.table+"' doesn't exist"
			});
			return;
		}
		else {
				mysql.get_primarykey(req.params.database, req.params.table, function(err, primary) {
				if(err) {
					console.log(err);
					return;
				}
				if(arr.length != primary.length) {
					res.status(400).send({
				       	msg: "A chave primaria enviada e diferete da tabela: "+req.params.table+". Utilize /datatabase/table/chave1/chave2/chave4",
				       	primary: primary
				    });
				    return;
				}
				mysql.build_update(req.params.database, req.params.table, arr, req.body ,function (err, sql) {
					console.log(sql);
					mysql.query(sql, req.params.database, function (error, result) {

						if(error){
							res.status(401).send({
						       	msg: error.sqlMessage
						    });
						    return;
						}
						res.status(200).send({
					       	msg: 'Updated'
					    });

					});

				});

			});		
		}
	});
});


module.exports = router;