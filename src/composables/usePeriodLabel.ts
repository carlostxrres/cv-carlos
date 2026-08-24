import { computed } from "vue";
import { labels, locale } from "@/i18n";
import type { TimelineItem } from "@/types/cv";

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
};

export function usePeriodLabel(
    periodStart: TimelineItem["periodStart"],
    periodEnd: TimelineItem["periodEnd"],
) {
    const dateFormatter = computed(
        () => new Intl.DateTimeFormat(locale.value, DATE_FORMAT_OPTIONS),
    );

    const isValidDate = (date: Date) => {
        return !Number.isNaN(date.getTime());
    };

    return computed(() => {
        const parts: string[] = [];

        const addDate = (dateString: string) => {
            const date = new Date(dateString);

            if (isValidDate(date)) {
                parts.push(dateFormatter.value.format(date));
            }
        };

        if (typeof periodStart === "string") {
            addDate(periodStart);
        }

        if (periodStart === periodEnd) {
            // If the end equals the start, do not add it
        } else if (periodEnd === null) {
            // If the end is null, it means the period is ongoing
            parts.push(labels.value.now);
        } else if (typeof periodEnd === "string") {
            addDate(periodEnd);
        }

        return parts.join(" - ");
    });
}