import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { ServerService } from '../services/server.service';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css'],
})
export class BoardsComponent implements OnInit {
  boards = [];
  boardToUpdate = {};
  showPopUp: boolean = false;
  offsetTop: string;
  offsetLeft: string;
  errorMsgEmpty: boolean = false;
  errorMsgExist: boolean = false;
  showDeleteBoardBtn: boolean = false;
  boardName: string = '';

  constructor(private serverService: ServerService, private router: Router) { }

  ngOnInit() {
    this.serverService.getBoards()
    .subscribe(data => this.boards = data.json())
  }

  showPopUpWindow(e) {
    this.offsetTop = e.target.offsetTop + 'px';
    this.offsetLeft = (e.target.offsetLeft - 50) + 'px';
    this.showPopUp = true;
  };

  createBoardNameByEnter() {
    this.errorMsgEmpty = false;
    this.boardName.length < 1 ? this.errorMsgEmpty = true : this.createNewBoard();
  }

  createNewBoard() {
    this.errorMsgEmpty = false;
    this.errorMsgExist = false;

    if (this.boardName.length < 1) {
      this.errorMsgEmpty = true;
    } else {
      this.serverService.setNewBoard({id: Date.now(), name: this.boardName})
      .subscribe(data => {
        let boards = data.json();
        this.boards = boards.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      });
      this.showPopUp = false;
      this.boardName = '';
    }
  }

  itemTodelete(e) {
    e.stopPropagation();
    let deleteItem = e.target.nextElementSibling.value.trim()
    let array = [];
    this.boards.forEach(item => {
      if (item.name == deleteItem) {
        this.deleteCurrentBoard(item.id)
      }
    });
  }

  deleteCurrentBoard(id) {
    let boardId = id;
    this.serverService.deleteBoard(boardId)
    .subscribe(data => {
      this.boards = data.json();
    });
  }

focusIn(e) {
  e.stopPropagation();
  let current = e.target.value;
  console.log(current)
  current.trim();
  this.boards.forEach(item => {
    if(item.name == current) {
      this.boardToUpdate = item;
    }
  });
}

focusOut(e) {
  e.stopPropagation();
  let current = e.target.value.trim();
  this.boardToUpdate['name'] = current;
  this.updateBoard(this.boardToUpdate);
}

updateBoard(newBoardName) {
  this.serverService.updateBoardName(newBoardName)
  .subscribe(data => {
    let boards = data.json();
    this.boards = boards.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
  });
}

  goToLists(e) {
    e.stopPropagation();
    let currentBoard = e.target.children[1].value;
    currentBoard.trim();

    let board = this.boards.find(item => item.name == currentBoard);
    this.router.navigate(['columns', board['name'], board['id']]);
  }

}
