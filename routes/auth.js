const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../config/db');

dotenv.config();

const JWT_SECRET = process.env.JWT_TOKEN_KEY 

module.exports = function (fastify, opts, done) {

    fastify.post('/login', { logLevel: 'warn' }, async (request, reply) => {

 
        try {
            let {username,password} = request.body;

           let Verified;
           let success = false;
           
            db.query('SELECT * FROM login WHERE username = ?', [username], async function(error, results, fields)  {
              

                if (results.length > 0) {
                    
                    passcheck = results[0].password;
                    Verified = results;
                  const  passwordcompare = await bcrypt.compare(password, passcheck);
        
                    if(!passwordcompare){ 
                        success = false;
                        return reply.status(404).send({ success, errors: "Please try to login with correct credentials." });
                    }else{
                    const data = username;
        
                    const authtoken = jwt.sign(data, JWT_SECRET);
                    
                        // res.json(user)
                        success = true;
                        reply.send({success,Verified,authtoken})
                    }
                } else {
                    return reply.status(404).send({success,errors: "Please try to login with correct credentials." });
                }			
               
            });
          
        } catch (error) {
            return reply.status(500).send({success:false,errors: error });
        }

       
      })


      fastify.post('/signup', { logLevel: 'warn' }, async (request, reply) => {

 
        try {
            let {username,password,email} = request.body;

           let success = false;
           
            db.query('SELECT * FROM login WHERE username = ?', [username], async function(error, results, fields)  {
              
                if (results.length <= 0) {
                    
                    const salt = await bcrypt.genSalt(10);
                    let secPass = await bcrypt.hash(password, salt);
                    const userstatus = 'active';
              
                    db.query("INSERT INTO login (email,username,password ,status) VALUES (?,?,?,?)",[email,username, secPass,userstatus], async (err,result)=>{
                        if(err) {
                            console.log(err)
                             reply.status(400).send({success,error: err});
                        } 
                              const data = username;
                              const authtoken = jwt.sign(data, JWT_SECRET);
                              success = true;
                              reply.send({success,authtoken,id:result.insertId})           
                            }
                            );
        
                   
                } else {
                     reply.status(404).send({success,errors: "Please try to login with correct credentials.",data:results });
                }			
               
            });
          
        } catch (error) {
            return reply.status(500).send({success:false,errors: error });
        }

       
      })


    done()
  }