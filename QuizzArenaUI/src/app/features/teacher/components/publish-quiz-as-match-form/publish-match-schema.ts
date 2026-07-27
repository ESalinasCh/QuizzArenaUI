import { required, schema, validate } from "@angular/forms/signals";
import { PublishMatchForm } from "../../models/publish-match-form.model";

export const publishMatchSchema = schema<PublishMatchForm>(path => {
    required(path.courseId, { message: 'A course must be selected' });
    required(path.durationMinutes, { message: 'Duration is required' });
    required(path.questionsAmount, { message: 'Number of questions is required' });
    required(path.maxRetries, { message: 'Max retries is required' });
    required(path.enabledFrom, { message: 'Start date is required' });
    required(path.enabledUntil, { message: 'End date is required' });

    validate(path.durationMinutes, ctx => {
        const val = Number(ctx.value());
        if (!isNaN(val) && val < 1) {
            return { kind: 'min_duration', message: 'Duration must be at least 1 minute' };
        }
        return undefined;
    });

    validate(path.questionsAmount, ctx => {
        const val = Number(ctx.value());
        if (!isNaN(val) && val < 1) {
            return { kind: 'min_questions', message: 'Questions amount must be at least 1' };
        }
        return undefined;
    });

    validate(path.maxRetries, ctx => {
        const val = Number(ctx.value());
        if (!isNaN(val) && val <= 0) {
            return { kind: 'min_retries', message: 'Max retries is required' };
        }
        return undefined;
    });

    validate(path, ctx => {
        const from = ctx.value().enabledFrom;
        const until = ctx.value().enabledUntil;
        if (from && until && new Date(until) <= new Date(from)) {
            return { kind: 'date_range', message: 'End date must be after start date' };
        }
        return undefined;
    });
});