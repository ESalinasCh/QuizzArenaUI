import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { TeacherContentService } from '../../services/teacher-content.service';
import { Button } from '../../../../shared/atoms/button/button';
import { Icon } from '../../../../shared/atoms/icon/icon';

const ACCEPTED_EXTENSIONS = ['.mp3', '.mp4', '.wav', '.txt'];
const DEFAULT_QUESTION_COUNT = 4;
const MAX_FILE_SIZE_BYTES = 500_000_000;

const INVALID_FORMAT_ERROR = $localize`:Invalid file format error:Invalid file format. Accepted formats: ${ACCEPTED_EXTENSIONS.join(', ')}:extensions:.`;
const FILE_TOO_LARGE_ERROR = $localize`:File too large error:File is too large. Maximum size is 500MB.`;

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

  protected readonly subjects = toSignal(this.#contentService.getCourses(), {
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
  protected readonly isUploading = signal(false);
  protected readonly uploadError = signal(false);
  protected readonly fileError = signal<string | null>(null);

  protected readonly canSubmit = computed(
    () =>
      this.file() !== null &&
      this.className().trim() !== '' &&
      this.subjectId() !== '' &&
      !this.isUploading(),
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
    this.fileError.set(null);
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

    this.isUploading.set(true);
    this.uploadError.set(false);

    this.#contentService
      .uploadContent({
        file,
        className: this.className().trim(),
        subjectId: this.subjectId(),
        review,
      })
      .pipe(
        finalize(() => this.isUploading.set(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        next: async () => {
          await this.#router.navigate(['/teacher/dashboard']);
        },
        error: () => {
          this.uploadError.set(true);
        },
      });
  }

  private setFile(file: File | null): void {
    if (!file) {
      return;
    }

    const isAccepted = ACCEPTED_EXTENSIONS.some((extension) =>
      file.name.toLowerCase().endsWith(extension),
    );
    if (!isAccepted) {
      this.fileError.set(INVALID_FORMAT_ERROR);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      this.fileError.set(FILE_TOO_LARGE_ERROR);
      return;
    }

    this.fileError.set(null);
    this.file.set(file);
  }
}
