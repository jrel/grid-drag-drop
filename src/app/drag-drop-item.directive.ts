import { coerceElement } from '@angular/cdk/coercion';
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';
import { DragDropContainerDirective } from './drag-drop-container.directive';
@Directive({
  selector: '[appDragDropItem]',
  host: {
    draggable: 'true',
  },
})
export class DragDropItemDirective<T> {
  @Input('appDragDropItem') data!: T;
  private listener?: () => void;

  constructor(
    private readonly element: ElementRef<HTMLElement>,
    private readonly container: DragDropContainerDirective<T>,
    private readonly render: Renderer2
  ) {}

  ngOnInit() {
    this.container.register(this);
  }

  @HostListener('dragstart')
  onDragStart() {
    const section = coerceElement(this.element);
    this.container.start(this);

    const listener = this.render.listen(
      section,
      'dragend',
      (event: DragEvent) => {
        event.preventDefault();
        this.container.terminate();
        listener();
      }
    );
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  start(notify: () => void) {
    this.listener = this.render.listen(
      coerceElement(this.element),
      'dragenter',
      (e: DragEvent) => {
        e.preventDefault();
        notify();
      }
    );
  }

  terminate() {
    this.listener?.();
  }
}
