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

function handleNavbar() {
    $("#navbarNavAltMarkup .nav-link").click(function () {
        const idtoShow = $(this).data("target");

        if (idtoShow == "#novaAtividade") {
            $("#home_button").removeClass("active");
            $("#home").attr('style', 'display:none !important');
        } else if (idtoShow == "#home") {
            $("#novaAtividade_button").removeClass("active");
            $("#novaAtividade").attr('style', 'display:none !important');
        }

        $(this).addClass("active");
        $(idtoShow).show("slow");
    });
}

function handleAddAtividadeSubmit() {
    $("#addForm").submit(function (e) {
        e.preventDefault();

        const formData = $(this).serializeArray();

        let data = {};
        formData.forEach(field => {
            data[field.name] = field.value;
        });

        $.ajax({
            url: "http://localhost:8080/api/activities",
            type: "post",
            data: data,
            beforeSend: function () {
                $("button[type=submit]")
                    .attr("disabled", "true")
                    .html("Cadastrando")
                    .append(`<span class="ms-2 spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
            }
        })
        .done(function (data) {
            console.log(data);
            alert("Sucesso!");
        })
        .fail(function () {
            alert("Algo deu errado!");
        })
        .always(function() {
            $("button[type=submit]")
            .removeAttr("disabled")
            .html("Cadastrar")
            .remove(".spinner-border");
        });
    });
}

$(document).ready(async function () {
    $("#date").mask("00/00/0000");

    filtersHandler();
    handleNavbar();

    handleAddAtividadeSubmit();
});