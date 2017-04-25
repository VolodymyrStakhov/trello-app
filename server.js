var express = require('express');
var bodyParser = require('body-parser');
var boards = require('./db/boards')

var port = 5000;
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// REST for BOARDS
app.get('/api/boards', function(req, res) {
  res.send(boards)
});

app.post('/api/boards', function(req, res) {
  boards.push(req.body)
  res.send(boards)
});

app.delete('/api/boards/:id', function(req, res) {
  var elementIndex = 0;
  boards.forEach(function(item, i) {
    if (item.id == req.params.id) {
      elementIndex = i;
    }
  });
  boards.splice(elementIndex, 1)
  res.send(boards)
});

app.put('/api/boards/:id', function(req, res) {
  var updatedObj = req.body;
  boards.forEach(function(item) {
    if (item.id == updatedObj['id']) {
      item.name = updatedObj['name'];
    }
  });
  res.send(boards)
});

// REST for LISTS
app.post('/api/boards/lists', function(req, res) {
  boards.forEach(function(item) {
    if (item.id == req.body['id']) {
      item.lists = item.lists || [];
      item.lists.push({name: req.body.name});
    }
  });
  res.send(boards)
});

app.put('/api/boards/lists/:id', function(req, res) {
  var newListNameObject = req.body;
  boards.forEach(function(item) {
    if (item.id == newListNameObject.boardId) {
      item.lists.forEach(function(list) {
        if (list.name == newListNameObject['listName']) {
          list.name = newListNameObject['newListName'];
        }
      });
    }
  });
  res.send(boards)
});

app.delete('/api/boards/lists/:id/:name', function(req, res) {
  var elementIndex = 0;
  boards.forEach(function(item) {
    if (item.id == req.params.id) {
      item.lists.forEach(function(list, i) {
        if (list.name == req.params.name) {
          elementIndex = i;
        }
      });
      item.lists.splice(elementIndex, 1);
    }
  })
  res.send(boards)
});


// REST for CARDS
app.post('/api/boards/lists/cards', function(req, res) {
  boards.forEach(function(item) {
    if (item.id == req.body['boardId']) {
      item.lists.forEach(function(list) {
        if (list.name == req.body['listName']) {
          list.cards = list.cards || [];
          list.cards.push({name: req.body['newCardName']});
        }
      });
    }
  });
  res.send(boards)
});


app.delete('/api/boards/lists/cards/:boardId/:listName/:cardName', function(req, res) {
  boards.forEach(function(item) {
    if (item.id == req.params.boardId) {
      item.lists.forEach(function(list) {
        if (list.name == req.params.listName) {
          var listIndex = 1;
          list.cards.forEach(function(card, index, arr) {
            if (card.name == req.params.cardName) {
              arr.splice(index, 1)
            }
          });
        }
      });
    }
  });
  res.send(boards)
});

app.put('/api/boards/lists/cards/:boardId', function(req, res) {
  boards.forEach(function(item) {
    if (item.id == req.body.boardId) {
      item.lists.forEach(function(list) {
        if (list.name == req.body.listName) {
          list.cards.forEach(function(card) {
            if (card.name == req.body.cardName) {
              card.name = req.body.newCardName;
            }
          });
        }
      });
    }
  });
  res.send(boards)
});

app.post('/api/boards/lists/cardInfo', function(req, res) {
  boards.forEach(function(item) {
    if (item.id == req.body['boardId']) {
      item.lists.forEach(function(list) {
        if(list.name == req.body.listName) {
          list.cards.forEach(function(card) {
            if (card.name == req.body.name) {
              Object.assign(card, req.body)
            }
          })
        }
      });
    }
  });
  res.send(boards)
});

app.listen(port, function(){
    console.log('Server started on port ', port);
});
