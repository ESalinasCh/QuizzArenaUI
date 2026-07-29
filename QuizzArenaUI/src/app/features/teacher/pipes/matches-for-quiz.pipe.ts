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
    return matches.filter(match => {
      if (match.quizId && match.quizId === quiz.id) return true;
      if (match.title && quiz.title && match.title.toLowerCase().startsWith(quiz.title.toLowerCase())) return true;
      return false;
    });
  }
}
