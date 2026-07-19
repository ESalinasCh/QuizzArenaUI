import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Icon } from '../../../../shared/atoms/icon/icon';
import { Button } from '../../../../shared/atoms/button/button';
import { TextSpan } from '../../../../shared/atoms/text-span/text-span';
import { TeacherClassSource } from '../../models/class-source.model';

@Component({
  selector: 'qz-class-source-card',
  templateUrl: './class-source-card.html',

  imports: [Icon, Button, TextSpan, RouterLink, DatePipe],
})
export class TeacherClassSourceCard {
  readonly source = input.required<TeacherClassSource>();
}
