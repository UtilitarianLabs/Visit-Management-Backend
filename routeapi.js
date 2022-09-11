module.exports = function (app, sfcon) {
    app.post('/api/signin', async function (req, res, next) {
        await sfcon.query("SELECT Id,Name,Outlet__c,Phone__c,Outlet__r.BillingLatitude,Outlet__r.BillingLongitude,Password__c,Username__c FROM Employee__c " +
            "WHERE Username__c = '" +
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
                        let response = result.records[0];

                        response.BillingLatitude = response.Outlet__r.BillingLatitude;
                        response.BillingLongitude = response.Outlet__r.BillingLongitude;

                        delete response.attributes;
                        delete response.Outlet__r;
                        res.status(200).json({ 'message': response,'Status':true })
                    } else {
                        res.status(200).json({ 'message': 'No User Found.','Status':false })
                    }
        });
    })

    app.post('/api/todayVisited', async function (req, res, next) {
        await sfcon.query("SELECT Id,Name,Is_visited__c FROM Visit__c " +
            "WHERE Visit_Date__c = " +
            req.body.todayDate+" AND Employee__c = '"+req.body.emp_code+"'"
            , function (err, result) {
                    if (err) {
                        console.log('err::' + err);
                        return console.error(err);
                    }
            
                    console.log("total : " + result.totalSize);
                    console.log("fetched : ", result);
                    if (result.totalSize > 0) {
                        console.log('result::' + result.records[0].Id);
                        let response = result.records[0];

                        delete response.attributes;
                        res.status(200).json({ 'message': response,'Status':true })
                    } else {
                        res.status(200).json({ 'message': 'No record found.','Status':false })
                    }
        });
    })

    

    app.post("/api/checkin", async function (req, res, next) {
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

    app.post("/api/checkout", async function (req, res, next) {
        try {
          await sfcon
            .sobject("Visit__c")
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

    app.post("/api/updateprofile", async function (req, res, next) {
        try {
          await sfcon
            .sobject("Employee__c")
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

    app.post('/api/dashboard', async function (req, res, next) {
        let {startDate,endDate} = req.body;

        console.log(startDate,endDate);

        await sfcon.query("SELECT Id,Name,Visit_Date__c,Is_Visited__c,Visit_Time__c FROM Visit__c " +
            "WHERE Visit_Date__c>" +
            req.body.startDate + " AND Visit_Date__c < " + req.body.endDate+" AND Employee__c = '"+req.body.emp_code+"'"
            ,function (err, result) {
                    if (err) {
                        console.log('err::' + err);
                        return console.error(err);
                    }
        
                    if (result.totalSize > 0) {
                        let response = [];

                        result.records.forEach(visit => {
                            delete visit.attributes;
                            response.push(visit);
                        });
                       
                        res.status(200).json({ 'message': response,'Status':true })
                    } else {
                        res.status(200).json({ 'message': 'No User Found.','Status':false })
                    }
                }
            );
    })

}