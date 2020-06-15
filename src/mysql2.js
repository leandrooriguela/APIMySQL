var mysql = require('mysql');
var config = require('../bin/config.json');

var connect = function (database)
{
	console.log(config.db);
	var con = mysql.createConnection({
  		host: config.db.server,
  		user: config.db.user,
  		password: config.db.password,
  		database: database
	});
	con.connect(function(err) {
  	if (err) throw err;
  		//console.log("Connected on "+config.db.host);
	});
	return con;
}

var query = function (query, database, callback)
{
	console.log("Query: "+query);
	var con = this.connect(database);
	con.query(query, function (err, result, fields) {
	    if (err){
	    	callback(err, result);
	    	return;
	    } 
	    // console.log(result);
	    callback(err, result);
  	});
}

function isPrimary(value) {
  return value.Key_name == 'PRIMARY';
}

var get_primarykey = function (database, table, callback)
{
	// console.log('get_primarykey');
	var con = this.connect(database);	
	con.query("show index from "+table, database, function(err, result, field){
		var primary = result.filter(isPrimary);
		callback(err, primary);
	})

}

var build_query = function (database, table, primary_values, callback) 
{
	var sql = "select * from "+table+" where ";
	this.get_primarykey(database, table, function(err, primary)
	{
		for(var i=0; i < primary.length; i++) {
			if(i > 0) sql += " and ";
			sql += primary[i].Column_name + "=" + primary_values[i];
		}
		callback(err, sql);
	});
}


var build_update = function (database, table, primary_values, update_fields, callback) 
{
	var sql = "update "+table+" set {campos} where ";

	this.get_primarykey(database, table, function(err, primary)
	{
		let condicao = "";
		for(var i=0; i < primary.length; i++) {
			if(i > 0) sql += " and ";
			condicao += primary[i].Column_name + "=" + primary_values[i];
		}
		sql += condicao;

		var campos = "";
		var keys = Object.keys(update_fields)
		for(i=0; i < keys.length; i++)
		{
			if(i > 0) campos += ", ";
			campos += keys[i]+"='"+update_fields[keys[i]]+"'";
		}
		sql = sql.replace('{campos}', campos);
		callback(err,sql);
	});
}

var table_exists = function (database, table, callback) 
{
	this.query("show tables like '"+table+"'", database, function (err, result) {
		if(result.length > 0) {
			callback(err, true);
			return;
		}
		callback(err, false);

	});
}

module.exports = {
  connect: connect,
  query: query,
  get_primarykey: get_primarykey,
  build_query: build_query,
  table_exists: table_exists,
  build_update: build_update
};