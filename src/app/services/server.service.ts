import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ServerService {

  constructor(private http: Http) { }

// CRUD FOR BOARDS
  getBoards() {
    return this.http.get('/api/boards/');
  };

  setNewBoard(newBoard) {
    const headers = new Headers({'Content-type': 'application/json'});
    return this.http.post('/api/boards/', newBoard, {headers: headers});
  };

  deleteBoard(id) {
    let boardId = parseInt(id, 10);
    return this.http.delete('/api/boards/' + boardId);
  };

  updateBoardName(idAndNewName) {
    const headers = new Headers({'Content-type': 'application/json'});
    let boardId = idAndNewName['id'];
    return this.http.put('/api/boards/' + boardId, idAndNewName, {headers: headers})
  };


  //CRUD FOR LISTS
  setNewList(newList) {
    const headers = new Headers({'Content-type': 'application/json'});
    return this.http.post('/api/boards/lists', newList, {headers: headers});
  };

  updateListName(newListNameObj) {
    const headers = new Headers({'Content-type': 'application/json'});
    let boardId = newListNameObj['id'];
    return this.http.put('/api/boards/lists/' + boardId, newListNameObj, {headers: headers})
  };

  deleteList(deletedListObj) {
    let boardId = deletedListObj['boardId'];
    let currentList = deletedListObj['listName'];
    return this.http.delete('/api/boards/lists/' + boardId + '/' + currentList);
  };


  //CRUD for CARDS
  setNewCard(newCardObj) {
    const headers = new Headers({'Content-type': 'application/json'});
    return this.http.post('/api/boards/lists/cards', newCardObj, {headers: headers});
  };

  deleteCard(deletedCardObj) {
    let boardId = deletedCardObj['boardId'];
    let listName = deletedCardObj['listName'];
    let cardName = deletedCardObj['cardName'];
    return this.http.delete('/api/boards/lists/cards/' + boardId + '/' + listName + '/' + cardName);
  };

  updateCardName(newCardNameObj) {
    const headers = new Headers({'Content-type': 'application/json'});
    let boardId = newCardNameObj['boardId'];
    return this.http.put('/api/boards/lists/cards/' + boardId, newCardNameObj, {headers: headers})
  };

  updateCardInfo(cardInfoObj) {
    const headers = new Headers({'Content-type': 'application/json'});
    return this.http.post('/api/boards/lists/cardInfo', cardInfoObj, {headers: headers});
  }
}
