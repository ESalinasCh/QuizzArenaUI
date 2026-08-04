import { Pipe, PipeTransform } from '@angular/core';
import { QuizResponseAsExams } from '../api/teacher-exam.contract';
import { Match } from '../models/exam.model';

@Pipe({
  name: 'matchesForQuiz',
})
export class MatchesForQuizPipe implements PipeTransform {
  transform(quiz: QuizResponseAsExams, matches?: Match[]): Match[] {
    if (!matches || !quiz) {
      return [];
    }
    return matches.filter(match => match.quizId === quiz.id);
  }
}
