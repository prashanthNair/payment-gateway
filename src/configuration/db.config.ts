import { createPool} from 'mysql2'

const connection= createPool({
    host: '',//Give IP or host name to connect the db
    user: '',// userName
    password: '',// password
    database: '', // name
    connectionLimit: 10, //optional
    multipleStatements: true
})
const db = connection.promise();
export { db }
 
