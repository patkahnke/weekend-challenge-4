var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/tasks';

router.get('/', function (req, res) {
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    //Query the database to get all the tasks fields
    client.query('SELECT * FROM tasks ' +
                'ORDER BY complete, date_due ASC',
    function (err, result) {
      done();

      res.send(result.rows);
    });
  });
});

router.post('/', function (req, res) {
  var task = req.body;

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('INSERT INTO tasks (task, date_due) ' +
    'VALUES ($1, $2)', [task.task, task.date_due],
    function (err, result) {
      done();

      if (err) {
        res.sendStatus(500);
        return;
      }

      res.sendStatus(201);
    });
  });
});

router.put('/completed/:id', function (req, res) {
  var id = req.params.id;
  var today = new Date();
  console.log(req.params.id, today);

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('UPDATE tasks ' +
    'SET date_completed = $1, ' +
    'complete = $2' +
    'WHERE id = $3',
     [today, 'true', id],
   function (err, result) {
        done();

        if (err) {
          res.sendStatus(500);
          return;
        }

        res.sendStatus(200);
      });
  });
});

router.put('/procrastinate/:id', function (req, res) {
    var id = req.params.id;
    var newDate = req.body;
console.log(newDate, 'id:', id);
    pg.connect(connectionString, function (err, client, done) {
      if (err) {
        res.sendStatus(500);
      }

      client.query('UPDATE tasks ' +
      'SET date_due = $1' +
      'WHERE id = $2', [newDate, id],
      function (err, result) {
        done();

        if (err) {
          res.sendStatus(500);
          return;
        }

        res.sendStatus(200);
      });
    });
  });

router.delete('/:id', function (req, res) {
    var id = req.params.id;
    console.log(id);
    pg.connect(connectionString, function (err, client, done) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      }

      client.query('DELETE FROM tasks ' +
                    'WHERE id = $1',
                     [id],
                   function (err, result) {
                    done();

                    if (err) {
                      console.log(err);
                      res.sendStatus(500);
                      return;
                    }

                    res.sendStatus(200);
                  });
    });
  });

module.exports = router;
