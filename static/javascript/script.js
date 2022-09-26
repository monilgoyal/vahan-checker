function alertfun(type, focus, string) {
    return '<div class="alert alert-' + type + ' alert-dismissible fade show  " role="alert"><strong>' + focus + '!!</strong>' + '&nbsp;' + string + '  <button type="button" style="font-size:medium" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
}
$(document).on('click', '.close', function(e) {
    $(this).parent().alert('close')
})
$(document).on("change", "#inp", function(event) {
    var rdata = null
    var file = $('#inp').prop('files')[0]
    console.log(file)
    $.ajax({
        url: "https://4g2tobnadewfnymuxetlv5btpi0kbyhf.lambda-url.ap-south-1.on.aws/",
        type: "PUT",
        data: file,
        cache: false,
        processData: false,
        contentType: file.type,
        error: function(data) {
            console.log("upload error", data);
            console.log(data.getAllResponseHeaders());
        },
        beforeSend: function() {
            $("#Output").attr("src", URL.createObjectURL(event.target.files[0]))
            $("#upload_button").prop('disabled', true);
            $("#inp").prop('disabled', true);
            $("#upload_button div span").addClass("d-none")
            $("#upload_button div div").removeClass("d-none")
            $("#alertbox").html('')
            $('#result').addClass('d-none')


        },
        success: function(data) {
            rdata = data
        }
    }).done(function() {
        setTimeout(function() {
            console.log(rdata)
            $("#upload_button div span").removeClass("d-none")
            $("#upload_button div div").addClass("d-none")
            if (rdata.status != 0) {
                $("#result").addClass("d-none")
                $("#alertbox").html(alertfun(rdata.rtodata["type"], rdata.rtodata["focus"], rdata.rtodata["string"]))
                $("#upload_button").prop('disabled', false);
                $("#inp").prop('disabled', false);
                return false
            }
            $("#car_number").html(rdata.carNumber)
                // RJ20CG8343
            data = rdata.rtodata
            $("table tbody tr").remove();
            for (var i in data) {
                if (i === "ImageUrl") {
                    continue
                }
                var newRow = $("<tr>");
                var cols = '';
                cols += '<td scope="col" class="col-6 px-1">' + i + '</td>';
                if (typeof data[i] === 'object') {
                    if (data[i]["CurrentTextValue"] === "") {
                        data[i]["CurrentTextValue"] = "-"
                    }
                    cols += '<td scope="col" class="col-6 px-1">' + data[i]["CurrentTextValue"] + '</td>';
                } else {
                    if (data[i] === "") {
                        data[i] = "-"
                    }
                    cols += '<td scope="col" class="col-6 px-1">' + data[i] + '</td>';
                }
                newRow.append(cols);
                $("table tbody").append(newRow);
            }
            $('#result').removeClass('d-none')
            $("#upload_button").prop('disabled', false);
            $("#inp").prop('disabled', false);
        });
    });
})