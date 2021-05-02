import app from './app';
import * as http from 'http'; 
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

http.createServer(app).listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})
