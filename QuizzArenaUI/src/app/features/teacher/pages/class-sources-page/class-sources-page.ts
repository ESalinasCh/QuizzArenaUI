import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { TextSpan } from '../../../../shared/atoms/text-span/text-span';
import { ClassSourcesService } from '../../services/class-sources.service';
import { TeacherClassSourceCard } from '../../components/class-source-card/class-source-card';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TeacherClassSource } from '../../models/class-source.model';

@Component({
  selector: 'qz-teacher-class-sources-page',
  templateUrl: './class-sources-page.html',

  imports: [TextSpan, TeacherClassSourceCard],
})
export class TeacherClassSourcesPage implements OnInit {
  readonly #classSourcesService = inject(ClassSourcesService);
  readonly #destroyRef = inject(DestroyRef);

  readonly classSources = signal<TeacherClassSource[]>([]);
  readonly isLoading = signal(false);

  ngOnInit(): void {
    this.loadClassSources();
  }

  loadClassSources(): void {
    this.isLoading.set(true);
    this.#classSourcesService.getClassSources().pipe(
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe({
      next: (sources) => {
        this.classSources.set(sources);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading class sources', err);
        this.isLoading.set(false);
      }
    });
  }
}
