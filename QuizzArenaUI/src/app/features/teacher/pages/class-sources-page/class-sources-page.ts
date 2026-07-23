import { Component, inject, signal, computed, debounced } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TextSpan } from '../../../../shared/atoms/text-span/text-span';
import { ClassSourcesService } from '../../services/class-sources.service';
import { TeacherClassSourceCard } from '../../components/class-source-card/class-source-card';
import { TextInput } from '../../../../shared/molecules/text-input/text-input';
import { Button } from '../../../../shared/atoms/button/button';

import { DEFAULT_PAGE_SIZE } from '../../../../core/models/pagination.model';

@Component({
  selector: 'qz-teacher-class-sources-page',
  templateUrl: './class-sources-page.html',
  imports: [TextSpan, TeacherClassSourceCard, TextInput, Button],
})
export class TeacherClassSourcesPage {
  readonly #classSourcesService = inject(ClassSourcesService);

  readonly searchQuery = signal('');
  readonly debouncedSearchQuery = debounced(this.searchQuery, 300);
  readonly limit = signal(DEFAULT_PAGE_SIZE);

  readonly classSourcesResource = rxResource({
    params: () => ({
      search: this.debouncedSearchQuery.value() ?? '',
      limit: this.limit()
    }),
    stream: ({ params }) => this.#classSourcesService.getClassSources({
      page: 1,
      pageSize: params.limit,
      search: params.search
    })
  });

  readonly classSources = computed(() => this.classSourcesResource.value() ?? []);
  readonly visibleClassSources = this.classSources;
  readonly isLoading = computed(() => this.classSourcesResource.isLoading());

  readonly hasMoreClassSources = computed(() => {
    return this.classSources().length >= this.limit();
  });

  loadMore(): void {
    this.limit.update(l => l + DEFAULT_PAGE_SIZE);
  }
}
