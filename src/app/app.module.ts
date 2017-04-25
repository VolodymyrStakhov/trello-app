import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router'

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BoardsComponent } from './boards/boards.component';
import { ColumnsComponent } from './columns/columns.component';

import { ServerService } from './services/server.service';
import { DragulaModule } from '../../node_modules/ng2-dragula/';

const appRoutes: Routes = [
  { path: 'boards', component: BoardsComponent },
  { path: 'columns/:name/:id', component: ColumnsComponent },
  { path: '', redirectTo: '/boards', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BoardsComponent,
    ColumnsComponent
  ],
  imports: [
    DragulaModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [ServerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
