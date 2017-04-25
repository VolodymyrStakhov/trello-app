import { Component, OnInit, DoCheck } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

import { ServerService } from '../services/server.service';

@Component({
  selector: 'app-columns',
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.css']
})

export class ColumnsComponent implements OnInit {
  boards: any = [];
  header: string;
  boardName: string;
  boardId: string;
  showDelListBtn: boolean = true;
  showAddCardInput: boolean = false;
  showCardPopUp: boolean = false;
  showDescriptionField: boolean = false;
  lists: any = [];
  listToUpdate = {};
  listToDelete = {};
  cardInfo = {};
  progressCounter:number = 0;
  tasks: any = [];
  widthPx: number = 0;
  totalChecked: number = 0;
  pieces: number = 0;

  constructor(private route: ActivatedRoute, private serverService: ServerService ) {  }

  ngOnInit() {
    this.boardName = this.route.snapshot.params['name']
    this.boardId = this.route.snapshot.params['id'];
    this.serverService.getBoards()
    .subscribe(data => {
      this.boards = data.json();
      let temp = this.boards.find(item => item.id == this.boardId) || [];
      this.lists = temp.lists || [];
    });
  }

  addList(e) {
    let newList = e.target.previousElementSibling.value;
    newList.trim();
    if (newList.length < 1) return;
    this.serverService.setNewList({name: newList, id: this.boardId})
    .subscribe(data => {
      this.boards = data.json();
      this.lists = this.boards.find(item => item.id == this.boardId).lists;
      // this.lists.forEach(item => item.cards = ['kyiv','lviv','kharkiv'])
      e.target.previousElementSibling.value = '';
    });
  }

  focusIn(e) {
    e.stopPropagation();
    let current = e.target.value;
    current.trim();
    this.boards.forEach(item => {
      if(item.id == this.boardId) {
        item.lists.forEach(list => {
          if (list.name == current) {
            this.listToUpdate = {boardId: this.boardId, listName: list.name};
          }
        });
      }
    });
  }

  focusOut(e) {
    e.stopPropagation();
    let current = e.target.value.trim();
    this.listToUpdate['newListName'] = current;
    this.updateList(this.listToUpdate);
  }

  updateList(newListName) {
    this.serverService.updateListName(newListName)
    .subscribe(data => {
      let boards = data.json();
    });
  }

  deleteList(e) {
    e.stopPropagation();
    let deleteItem = e.target.nextElementSibling.value;
    deleteItem.trim();
    let currentList = {boardId: this.boardId, listName: deleteItem};
    // console.log(currentList);
    this.deleteCurrentList(currentList)
  }

  deleteCurrentList(currentList){
    this.serverService.deleteList(currentList)
    .subscribe(data => {
      this.boards = data.json();
    });
    this.ngOnInit()
  }

  addCard(e) {
    let currentListName = e.target.parentElement.childNodes[1].children[1].value;
    let newCard = e.target.previousElementSibling.value;
    newCard.trim();
    if (newCard.length < 1) return;
    this.serverService.setNewCard({boardId: this.boardId, listName: currentListName, newCardName: newCard})
    .subscribe(data => {
      this.boards = data.json();
      this.lists = this.boards.find(item => item.id == this.boardId).lists;
    });
  }

  deleteCard(e) {
    e.stopPropagation();
    let cardName = e.target.parentElement.children[1].innerText.trim();
    let listName = e.target.parentElement.parentElement.children[0].children[1].value;
    listName.trim();
    this.serverService.deleteCard({boardId: this.boardId, listName: listName, cardName: cardName})
    .subscribe(data => {
      this.boards = data.json();
      this.lists = this.boards.find(item => item.id == this.boardId).lists;
    });
  }

  showPopUp(e) {
    // e.stopPropagation();
    console.log(e)
    let cardName = e.target.childNodes[2].data.trim();
      let listName = e.target.parentElement.children[0].children[1].value;
      // let listName = e.target.parentElement.parentElement.children[0].children[1].value;
    let card = this.lists.find(list => list.name == listName)
    .cards.find(card => {
      if(card.name == cardName) return card;
    });
    this.cardInfo = card;
    this.cardInfo['listName'] = this.cardInfo['listName'] || listName;
    this.showCardPopUp = true;
  }

  closePopUp() {
    this.showCardPopUp = false;
  }

  renameCard(e) {
    let newCardName = e.target.value;
    newCardName.trim();
    this.serverService.updateCardName(
      { boardId: this.boardId,
        listName: this.cardInfo['listName'],
        cardName: this.cardInfo['name'],
        newCardName: newCardName
      }).subscribe(data => {
        this.boards = data.json();
        this.lists = this.boards.find(item => item.id == this.boardId).lists;
      });
  }

  addDescription(e) {
    let description = e.target.previousElementSibling.previousElementSibling.value;
    description.trim();
    this.cardInfo['description'] = description;
    this.cardInfo['boardId'] = this.boardId;
    this.serverService.updateCardInfo(this.cardInfo)
    .subscribe(data => {
      this.boards = data.json();
      this.lists = this.boards.find(item => item.id == this.boardId).lists;
    });
    this.showDescriptionField = !this.showDescriptionField;
  }

  addCheckbox(e) {
    let newCheckbox = e.target.previousElementSibling.value;
    if (newCheckbox.length < 1) return;
    newCheckbox.trim();
    this.tasks.push(newCheckbox);
    this.pieces = 500 / this.tasks.length;
    this.progressCounter = Math.round(((this.pieces * 100)/500) * this.totalChecked);
    this.widthPx -= this.pieces;
    e.target.previousElementSibling.value = '';
  }

  isChacked(e) {
    this.pieces = 500 / this.tasks.length;
    if(e.target.checked) {
      this.totalChecked++
      this.widthPx = this.pieces * this.totalChecked;
      this.progressCounter = Math.round(((this.pieces * 100)/500) * this.totalChecked);
    } else if(!e.target.checked) {
        this.totalChecked--
        this.progressCounter = Math.round(((this.pieces * 100)/500) * this.totalChecked);
        this.widthPx -= this.pieces;
    }
  }

}
