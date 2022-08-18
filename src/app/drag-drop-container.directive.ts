import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DragDropItemDirective } from './drag-drop-item.directive';
@Directive({
  selector: '[appDragDropContainer]',
  exportAs: 'dragDropContainer',
})
export class DragDropContainerDirective<T> {
  private readonly draggableItems: DragDropItemDirective<T>[] = [];

  private readonly renderItems$ = new BehaviorSubject<T[]>([]);
  private readonly items$ = new EventEmitter<T[]>();

  private lastOverItem: DragDropItemDirective<T> | undefined;
  private active: DragDropItemDirective<T> | undefined;

  @Input() set items(items: T[]) {
    this.renderItems$.next(items.slice());
  }

  @Output() readonly itemsChange = this.items$.asObservable();
  @Output() readonly renderItems = this.renderItems$.asObservable();

  register(item: DragDropItemDirective<T>) {
    this.draggableItems.push(item);
  }

  start(active: DragDropItemDirective<T>) {
    this.active = active;
    this.draggableItems.forEach((item) => {
      if (active === item) return;
      item.start(() => {
        this.lastOverItem = item;
        this.updateRenderItems();
      });
    });
  }

  terminate() {
    const renderItems = this.renderItems$.value;
    this.items$.emit(renderItems);
    this.draggableItems.forEach((item) => {
      if (this.lastOverItem === item) return;
      item.terminate();
    });
  }

  private updateRenderItems() {
    const { active, lastOverItem } = this;

    if (!active || !lastOverItem) return this.renderItems$.value;

    const renderItems = this.renderItems$.value.slice();
    const previousIndex = renderItems.indexOf(active.data);
    const nextIndex = renderItems.indexOf(lastOverItem.data);
    moveItemInArray(renderItems, previousIndex, nextIndex);
    this.renderItems$.next(renderItems);
    return renderItems;
  }
}
