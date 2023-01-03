function filtersHandler() {
    const periodContainer = $(".periodContainer");
    const filtersElement = $("#filters");
    const togglerElement = $(".toggler");

    periodContainer.hide();
    filtersElement.hide();

    let now = new Date();
    let dateFrom = now.toLocaleDateString("pt-br");
    let dateTo = dayjs(now).add(7, 'day').format("DD/MM/YYYY");

    togglerElement.click(function () {
        filtersElement.toggle("slow");
    });

    $(".filterInput").change(function () {
        periodContainer.hide();
        if ($(this).attr("id") === "periodBtn") {
            periodContainer.show();
        }
    });

    $("#filterForm").submit(function (e) {
        e.preventDefault();

        const filterFormData = $(this).serializeArray();
        const { value } = filterFormData[0];
        console.log(e);

        switch (value) {
            case "week":
                dateTo = dayjs(now).add(7, 'day').format("DD/MM/YYYY");
                break;
            case "day":
                dateTo = dateFrom;
                break;
            case "month":
                dateTo = dayjs(now).add(30, 'day').format("DD/MM/YYYY");
                break;
            case "period":
                dateFrom = dayjs(filterFormData[1].value).format("DD/MM/YYYY");
                dateTo = dayjs(filterFormData[2].value).format("DD/MM/YYYY");
                break;
        }
    });
}

$(document).ready(async function () {
    filtersHandler();
});