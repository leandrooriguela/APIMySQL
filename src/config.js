    var host  = process.env.HOST_MYSQL;
    var user   = process.env.USER_MYSQL;
    var password   = process.env.PASSWORD_MYSQL;

    if(!host) {
      host = 'localhost';
    }
    if(!user) {
      user = 'root';
    }
    if(!password) {
      password = '123456big';
    }
