import { Component } from '@angular/core';

@Component({
  selector: 'qz-teacher-quiz-management-page',
  templateUrl: './quiz-management-page.html',
})
export class TeacherQuizManagementPage {
  questions: Question[] = [
    { id: '1', options: [], sourceId: '1', sourceName: '', text:'cscs64' },
  ];

  searchModel = signal({ name: '' });
  searchForm = form(this.searchModel);

  questionFilterModalIsOpen = signal(false);



  toogleQuestionFilterModal() {
    this.questionFilterModalIsOpen.update(value => !value);
  }

}
