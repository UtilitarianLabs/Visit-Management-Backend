module.exports = function (app, sfcon) {
    debugger;
    console.log('sfcon::'+sfcon);
    app.get('/',async(req,res,next)=>{
        res.status(200).json({'message':'Own by Yovo'})
    })
    app.get('/api/test', async function (req, res, next) {
        res.status(200).json({'message':'Bhaskar Jha'})
    })
    app.get('/api/account', async function (req, res, next) {
        console.log('Inside accountfetch')
        var records = [];
        await sfcon.query("SELECT Id, Name FROM visit__c", function(err, result) {
            if (err) {
                console.log('err::' + err);
                return console.error(err);
            }
            
        console.log("total : " + result.totalSize);
            console.log("fetched : ", result);
            res.status(200).json({'message':result})
        });

    })
    app.post('/api/authenticate_user', async function (req, res, next) {
        console.log('Inside accountfetch')
        var records = [];
        await sfcon.query("SELECT Id,Password__c,Username FROM user " +
            "WHERE Username = '" +
            req.body.username + "' AND Password__c = '" + req.body.password + "'"
            , function (err, result) {
            if (err) {
                console.log('err::' + err);
                return console.error(err);
            }
            
        console.log("total : " + result.totalSize);
                console.log("fetched : ", result);
                if (result.totalSize > 0) {
                    console.log('result::' + result.records[0].Id);
                    res.status(200).json({ 'message': result.records[0].Id,'Status':true })
                } else {
                    res.status(200).json({ 'message': 'No User Found.','Status':false })
                }
                
                
        });

    })

    app.post('/api/get_visit', async function (req, res, next) {
        console.log('Inside accountfetch')
        var records = [];
        await sfcon.query("SELECT Id,Check_In__c,Check_Out__c,User__c,User__r.name,Visit_Date_Time__c,Name,Is_Visited__c,Customer_Name__c FROM Visit__c WHERE User__c = '"
            + req.body.userid + "'"
            , function (err, result) {
            if (err) {
                console.log('err::' + err);
                return console.error(err);
            }
            
        console.log("total : " + result.totalSize);
                console.log("fetched : ", result);
                if (result.totalSize > 0) {
                    console.log('result::' + result.records[0].Id);
                    res.status(200).json({ 'message': result.records,'Status':'true' })
                } else {
                    res.status(200).json({ 'message': 'No visit available for user','Status':'false' })
                }
                
                
        });

    })

    app.post("/api/create_visit_record", async function (req, res, next) {
        try {
          console.log("err::" + JSON.stringify(req.body));
          await sfcon
            .sobject("visit__c")
            .create(req.body, function (err, response) {
              if (err) {
                console.log("err::" + err);
                return console.log(err);
              }
              console.log("response" + JSON.stringify(response));
              res.send(JSON.stringify(response));
            });
        } catch (err) {
          console.log(err);
          next(err);
        }
    });
    
    app.post("/api/attendance_check_in", async function (req, res, next) {
        try {
          console.log("err::" + JSON.stringify(req.body));
          await sfcon
            .sobject("Attendance__c")
            .create(req.body, function (err, response) {
              if (err) {
                console.log("err::" + err);
                return console.log(err);
              }
              console.log("response" + JSON.stringify(response));
              res.send(JSON.stringify(response));
            });
        } catch (err) {
          console.log(err);
          next(err);
        }
    });
    
    app.post("/api/attendance_check_out", async function (req, res, next) {
        try {
          console.log("err::" + JSON.stringify(req.body));
          await sfcon
            .sobject("Attendance__c")
            .update(req.body, function (err, response) {
              if (err) {
                console.log("err::" + err);
                return console.log(err);
              }
              console.log("response" + JSON.stringify(response));
              res.send(JSON.stringify(response));
            });
        } catch (err) {
          console.log(err);
          next(err);
        }
    });
    
    app.get('/api/get_locations', async function (req, res, next) {
        console.log('Inside accountfetch')
        var records = [];
        await sfcon.query("SELECT Id,Coordinates__Latitude__s,Coordinates__Longitude__s,Name FROM Location "
            , function (err, result) {
            if (err) {
                console.log('err::' + err);
                return console.error(err);
            }
            
        console.log("total : " + result.totalSize);
                console.log("fetched : ", result);
                if (result.totalSize > 0) {
                    console.log('result::' + result.records[0].Id);
                    res.status(200).json({ 'message': result.records,'Status':'true' })
                } else {
                    res.status(200).json({ 'message': 'No visit available for user','Status':'false' })
                }
                
                
        });

    })

    app.post("/api/update_profile", async function (req, res, next) {
        try {
          console.log("err::" + JSON.stringify(req.body));
          await sfcon
            .sobject("user")
            .update(req.body, function (err, response) {
              if (err) {
                console.log("err::" + err);
                return console.log(err);
              }
              console.log("response" + JSON.stringify(response));
              res.send(JSON.stringify(response));
            });
        } catch (err) {
          console.log(err);
          next(err);
        }
    });

    app.post('/api/get_profile', async function (req, res, next) {
        var records = [];
        await sfcon.query("SELECT Id,Lastname,Password__c,Email FROM user where id = '"
        + req.body.userid + "'"
            , function (err, result) {
            if (err) {
                console.log('err::' + err);
                return console.error(err);
            }
            
        console.log("total : " + result.totalSize);
                console.log("fetched : ", result);
                if (result.totalSize > 0) {
                    console.log('result::' + result.records[0].Id);
                    res.status(200).json({ 'message': result.records,'Status':'true' })
                } else {
                    res.status(200).json({ 'message': 'No visit available for user','Status':'false' })
                }
                
                
        });

    })

    app.post('/api/get_attendance', async function (req, res, next) {
        var records = [];
        await sfcon.query("SELECT Id,Check_In__Latitude__s,Check_In__Longitude__s,Check_Out__Latitude__s,Check_Out__Longitude__s,Check_In_DateTime__c,Check_Out_Datetime__c,Employee__c FROM Attendance__c where Employee__r.Employee__c = '"
        + req.body.userid + "'"
            , function (err, result) {
            if (err) {
                console.log('err::' + err);
                return console.error(err);
            }
            
        console.log("total : " + result.totalSize);
                console.log("fetched : ", result);
                if (result.totalSize > 0) {
                    console.log('result::' + result.records[0].Id);
                    res.status(200).json({ 'message': result.records,'Status':'true' })
                } else {
                    res.status(200).json({ 'message': 'No visit available for user','Status':'false' })
                }
                
                
        });

    })


}