import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DragDropContainerDirective } from './drag-drop-container.directive';
import { DragDropItemDirective } from './drag-drop-item.directive';

@NgModule({
  declarations: [
    AppComponent,
    DragDropContainerDirective,
    DragDropItemDirective,
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
