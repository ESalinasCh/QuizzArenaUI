import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TextInput } from "../../../../shared/molecules/text-input/text-input";
import { AdminQuestionCard } from "../../../../shared/organisms/admin-question-card/admin-question-card";
import { Icon } from "../../../../shared/atoms/icon/icon";
import { Button } from "../../../../shared/atoms/button/button";
import { Question } from '../../models/exam.model';
import { form, FormField } from '@angular/forms/signals';
import { QuestionFilterModal } from "../../components/question-filter-modal/question-filter-modal";

@Component({
  selector: 'qz-teacher-quiz-management-page',
  templateUrl: './quiz-management-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextInput, AdminQuestionCard, Icon, Button, FormField, QuestionFilterModal],
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
