import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TeacherContentService } from '../../services/teacher-content.service';
import { Button } from '../../../../shared/atoms/button/button';
import { Icon } from '../../../../shared/atoms/icon/icon';

const ACCEPTED_EXTENSIONS = ['.mp3', '.mp4'];
const DEFAULT_QUESTION_COUNT = 4;

@Component({
  selector: 'app-teacher-upload-content-page',
  imports: [FormsModule, Button, Icon],
  templateUrl: './upload-content-page.html',
})
export class TeacherUploadContentPage {
  readonly #router = inject(Router);
  readonly #contentService = inject(TeacherContentService);
  readonly #destroyRef = inject(DestroyRef);

  protected readonly uploadContentAriaLabel = $localize`:Upload content button aria label:Upload content`;

  protected readonly acceptedExtensions = ACCEPTED_EXTENSIONS.join(',');
  protected readonly acceptedExtensionsLabel = ACCEPTED_EXTENSIONS.join(' ');

  protected readonly subjects = toSignal(this.#contentService.getSubjects(), {
    initialValue: [],
  });

  protected readonly file = signal<File | null>(null);
  protected readonly className = signal('');
  protected readonly subjectId = signal('');
  protected readonly isDragging = signal(false);
  protected readonly reviewEnabled = signal(false);
  protected readonly questionCount = signal(DEFAULT_QUESTION_COUNT);
  protected readonly showCorrectAnswers = signal(true);
  protected readonly shuffleQuestions = signal(true);

  protected readonly canSubmit = computed(
    () => this.file() !== null && this.className().trim() !== '' && this.subjectId() !== '',
  );

  async goBack(): Promise<void> {
    await this.#router.navigate(['/teacher/dashboard']);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.setFile(input.files?.[0] ?? null);
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(): void {
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    this.setFile(event.dataTransfer?.files?.[0] ?? null);
  }

  removeFile(): void {
    this.file.set(null);
  }

  submit(): void {
    const file = this.file();
    if (!file || !this.canSubmit()) {
      return;
    }

    const review = this.reviewEnabled()
      ? {
          enabled: true as const,
          settings: {
            questionCount: this.questionCount(),
            showCorrectAnswers: this.showCorrectAnswers(),
            shuffleQuestions: this.shuffleQuestions(),
          },
        }
      : { enabled: false as const };

    this.#contentService
      .uploadContent({
        file,
        className: this.className().trim(),
        subjectId: this.subjectId(),
        review,
      })
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(async () => {
        await this.#router.navigate(['/teacher/dashboard']);
      });
  }

  private setFile(file: File | null): void {
    if (!file) {
      return;
    }

    const isAccepted = ACCEPTED_EXTENSIONS.some((extension) =>
      file.name.toLowerCase().endsWith(extension),
    );
    if (isAccepted) {
      this.file.set(file);
    }
  }
}
