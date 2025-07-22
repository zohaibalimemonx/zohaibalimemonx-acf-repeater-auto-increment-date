/**
 * ACF Date Field - Return Format vs Display Format:
 *
 * 1. **Display Format: 22.07.2025**
 * 2. **Return Format: 20250722**
 * Example:
 * - Display Format: `d.m.Y` (visible in admin)
 * - Return Format: `Ymd` (stored and retrieved for use in code, queries, etc.)
 */

(function ($) {
    if (typeof acf === 'undefined') return;

    acf.addAction('append', function ($el) {
        const $repeater = $el.closest('.acf-field-repeater');
        if (!$repeater.length) return;

        setTimeout(function () {
            const $allRows = $repeater.find('.acf-row:not(.acf-clone)');
            if ($allRows.length < 2) return;

            const $newRow = $el.closest('.acf-row');
            const $newDateInput = $newRow.find('input.hasDatepicker');
            if (!$newDateInput.length) return;

            let parsedDate = null;

            for (let i = $allRows.length - 2; i >= 0; i--) {
                const $prevRow = $allRows.eq(i);
                const $prevDateInput = $prevRow.find('input.hasDatepicker');
                if (!$prevDateInput.length) continue;

                const prevDateValue = $prevDateInput.val();
                if (!prevDateValue) continue;

                const dateParts = prevDateValue.split(/[.\-/]/);
                if (dateParts.length === 3) {
                    let day, month, year;

                    if (dateParts[2].length === 4) {
                        day = parseInt(dateParts[0], 10);
                        month = parseInt(dateParts[1], 10) - 1;
                        year = parseInt(dateParts[2], 10);
                    } else {
                        year = parseInt(dateParts[0], 10);
                        month = parseInt(dateParts[1], 10) - 1;
                        day = parseInt(dateParts[2], 10);
                    }

                    const tempDate = new Date(year, month, day);
                    if (!isNaN(tempDate.getTime())) {
                        parsedDate = tempDate;
                        parsedDate.setDate(parsedDate.getDate() + 1);
                        break;
                    }
                }
            }

            if (!parsedDate) return;

            const formattedDate = ("0" + parsedDate.getDate()).slice(-2) + "." +
                                  ("0" + (parsedDate.getMonth() + 1)).slice(-2) + "." +
                                  parsedDate.getFullYear();

            $newDateInput.val(formattedDate).trigger('change');

            const fieldInstance = acf.getField($newDateInput.closest('.acf-field'));
            if (fieldInstance) {
                fieldInstance.val(formattedDate);
            }

        }, 100);
    });
})(jQuery);
