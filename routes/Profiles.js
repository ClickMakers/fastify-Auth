const dotenv = require('dotenv');
const db = require('../config/db');

dotenv.config();



module.exports = function (fastify, opts, done) {

    fastify.get('/:load', { logLevel: 'warn' }, async (request, reply) => {

        try {
            const load = request.params.load;
          db.query("SELECT * FROM login LIMIT "+load, (err, result) => {
            if (err) {
              console.log(err);
            }
            reply.send(result);
          });
        } catch (error) {
            reply.status(500).send("Internal server error");
        }
 

      
       
      })


      

    done()
  }