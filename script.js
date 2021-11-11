const form_input = {
    add_height: $('#add_height'),
    add_width: $('#add_width'),
    add_quantity: $('#add_quantity'),
    add_type: $('#add_type'),
    add_color: $('#add_color'),
    add_floor: $('#add_floor'),
    add_location: $('#add_location'),
    add_laminated: $('#add_laminated'),

    edit_height: $('#edit_height'),
    edit_width: $('#edit_width'),
    edit_quantity: $('#edit_quantity'),
    edit_type: $('#edit_type'),
    edit_color: $('#edit_color'),
    edit_floor: $('#edit_floor'),
    edit_laminated: $('#edit_laminated'),
    edit_location: $('#edit_location'),
    edit_key: $('#edit_key'),
};

const script = {
    init: function () {
        script.loadData();
        script.loadSettings();
        script.modalSettings();

        $(document).on('click', '.btn-edit', function () {
            const val = $(this).data('value');
            const key = $(this).data('key');
            const formatted = JSON.parse(decodeURIComponent(val));
            windows.edit(formatted, key);
        });
    },

    clearField: function () {
        form_input.add_height.val("");
        form_input.add_width.val("");
        form_input.add_quantity.val("");
        form_input.add_type.val("swing");
    },

    saveSettings: function () {
        if ($("#price_sqft").val() == '') {
            swal("Invalid", "Please input SQFT", "error");
            return false;
        }
    
        const data = {
            price_sqft: $("#price_sqft").val()
        }
    
        window.localStorage.setItem('price_sqft', data.price_sqft);
    
        const newData = JSON.stringify(data);
        jQuery.post('file.php', {
            newData: newData,
            method: 'saveSettings'
        }, function (response) {
            $("#modalSettings").modal('hide')
            swal("Saved!", "Successfully Saved", "success");
        })
    },

    loadData: function () {
        $('#tbody_list').html('')
    
        $.ajax({
            url: 'data/data.json',
            dataType: 'json',
            success: function (data) {
                let list = '';
                let btn = '';
                let total = [];

                $.each(data, function (key, val) {
                    btn = `<div class="d-flex align-items-center mt-3 justify-content-end">
                                <button class="btn btn-sm btn-outline-danger mr-2 d-print-none" onclick="windows.delete(` + key + `)"><i class="fas fa-trash-alt"></i> <span class="ml-1">Delete</span></button>
                                <button type="button" class="btn btn-sm btn-outline-success d-print-none btn-edit" data-value="`  + encodeURIComponent(JSON.stringify(val)) + `" data-key="` + key + `"><i class="fas fa-pencil-alt"></i> <span class="ml-1">Edit</span></button>
                            </div>`;
    
                    list += `<tr>
                                <td rowspan="2" style="border-bottom: 2px solid gray;">` + val.quantity + `</td>
                                <td>` + windows.getImage(val.type) + `</td>
                                <td class="align-middle">` + val.height + `</td>
                                <td class="align-middle">` + val.width + `</td>
                                <td style="border-bottom: 2px solid gray;" rowspan="2" class="text-right align-middle">Php. ` + (val.amount).toFixed(2) + '' + btn + `</td>
                            </tr>
                            <tr>
                                <td style="border-bottom: 2px solid gray;">
                                    <small>Type: ` + val.type + `</small><br/>
                                    <small>Color: ` + val.color + `</small>
                                </td>
                                <td style="border-bottom: 2px solid gray;" colspan="2">
                                    <small>Location: ` + val.location + ` </small><br/>
                                    <small>Floor: ` + val.floor + ` </small><br/>
                                    <small>Laminated: ` + val.laminated + `</small>
                                </td>
                            </tr>`;
    
                    total.push(val.amount);
                });
    
                list += `<tr>
                            <td colspan="4" class="border-right-0 border-left-0"></td>
                            <td colspan="2">
                                <table class="table table-borderless mb-0">
                                    <tr>
                                        <td class="font-weight-bold">Price:</td>
                                        <td>Php. ` + (total.reduce((a, b) => a + b, 0)).toFixed(2) + `</td>
                                    </tr>
                                    <tr>
                                        <td class="font-weight-bold">Discount:</td>
                                        <td>Php. 0.00</td>
                                    </tr>
                                    <tr>
                                        <td class="font-weight-bold">Total Amount:</td>
                                        <td>Php. ` + (total.reduce((a, b) => a + b, 0)).toFixed(2) + `</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>`;
    
                list += `
                    <tr class="d-none d-print-table-row">
                        <td style="border-left:0px;" rowspan="2" colspan="4">
                            <small>
                                <i>
                                    Note: Above information and Prices are base on the computed formula ( H x W / 90,000 ) x price of sqft.<br/>
                                    and other accessories that has been added.
                                </i>
                            </small>
                        </td>
                        <td style="border-bottom: 1px solid black;" class="text-center pt-5">
                            <img class="img-fluid" style="width: 150px;" src="images/danilo_signature.png" alt="signature">
                        </td>
                    </tr>
                    <tr class="d-none d-print-table-row">
                        <td class="text-center">
                            (Owner) Danilo Alvarez
                        </td>
                    </tr>`;
    
                if (data.length === 0) {
                    list = '<tr><td class="text-center" colspan="5">No Record</td></tr>'
                }
    
                $('#tbody_list').append(list);
    
            },
            statusCode: {
                404: function () {
                    alert('There was a problem with the server.  Try again soon!');
                }
            }
        });
    },
    
    loadSettings: function () {
        $.ajax({
            url: 'data/settings.json',
            dataType: 'json',
            success: function (data) {
                window.localStorage.setItem('price_sqft', data.price_sqft);
            },
            statusCode: {
                404: function () {
                    alert('There was a problem with the server.  Try again soon!');
                }
            }
        });
    },

    modalSettings: function () {
        $("#modalSettings").on('shown.bs.modal', function () {
            $('#price_sqft').val(window.localStorage.getItem('price_sqft'));
        });
    }
};

const windows = {
    add: function () {
        const height = parseFloat(form_input.add_height.val());
        const width = parseFloat(form_input.add_width.val());
        const qty = parseFloat(form_input.add_quantity.val());
        const sqft = parseInt(window.localStorage.getItem('price_sqft'))
        const date = new Date();
        const stamp_time = date.getTime();
        const stamp_milli = date.getMilliseconds();
    
        if (
            form_input.add_height.val() == '' ||
            form_input.add_width.val() == '' ||
            form_input.add_quantity.val() == '' ||
            form_input.add_width.val() <= 0 ||
            form_input.add_height.val() <= 0 || 
            form_input.add_quantity.val() <= 0
        ) {
            return false;
        }
    
        const data = {
            id: stamp_time + stamp_milli,
            color: form_input.add_color.val(),
            location: form_input.add_location.val(),
            laminated: form_input.add_laminated.is(':checked') ? true:false,
            floor: form_input.add_floor.val(),
            height: height,
            width: width,
            type: form_input.add_type.val(),
            quantity: qty,
            amount: (((height * width) / 90000) * sqft) * qty
        };
    
        const newData = JSON.stringify(data);
        jQuery.post('file.php', {
            newData: newData,
            method: 'addWindow'
        }, function (response) {
            script.clearField();
            script.loadData();
        });
    },

    delete: function (key) {
        const data = {
            id: key
        };
    
        const newData = JSON.stringify(data);
        jQuery.post('file.php', {
            newData: newData,
            method: 'deleteWindow'
        }, function (response) {
            console.log(response);
            script.loadData();
        })
    },
    
    edit: function (data, key) {
        form_input.edit_height.val(data.height);
        form_input.edit_width.val(data.width);
        form_input.edit_quantity.val(data.quantity);
        form_input.edit_floor.val(data.floor);
        form_input.edit_location.val(data.location);
        form_input.edit_laminated.prop('checked', data.laminated);
        form_input.edit_color.val(data.color);
        form_input.edit_type.val(data.type);
        form_input.edit_key.val(data.id);

        // console.log(data.type);
    
        $('#modalEdit').modal('show');
    },
    
    update: function () {
        const height = parseFloat(form_input.edit_height.val());
        const width = parseFloat(form_input.edit_width.val());
        const qty = parseFloat(form_input.edit_quantity.val());
        const sqft = parseInt(window.localStorage.getItem('price_sqft'))

        const data = {
            id: form_input.edit_key.val(),
            color: form_input.edit_color.val(),
            location: form_input.edit_location.val(),
            laminated: form_input.edit_laminated.is(':checked') ? true:false,
            floor: form_input.edit_floor.val(),
            height: height,
            width: width,
            type: form_input.edit_type.val(),
            quantity: qty,
            amount: (((height * width) / 90000) * sqft) * qty
        };
    
        const newData = JSON.stringify(data);
        jQuery.post('file.php', {
            newData: newData,
            method: 'updateWindow'
        }, function (response) {
            console.log(response);
            $('#modalEdit').modal('hide');
            script.loadData();
        })
    },

    print: function () {
        window.print()
    },

    getImage: function (type) {
        switch (type) {
            case "swing":
                return '<img class="img-fluid img-size" src="images/swing.png" alt="swing">';
                break;
            case "sliding":
                return '<img class="img-fluid img-size" src="images/sliding.png" alt="sliding">';
                break;
            case "casement":
                return '<img class="img-fluid img-size" src="images/casement.png" alt="casement">';
                break;
            case "hopper":
                return '<img class="img-fluid img-size" src="images/hopper.png" alt="hopper">';
                break;
            case "fixed":
                return '<img class="img-fluid img-size" src="images/fixed.png" alt="fixed">';
                break;
            case "awning":
                return '<img class="img-fluid img-size" src="images/awning.png" alt="awning">';
                break;
            case "double_hung":
                return '<img class="img-fluid img-size" src="images/double_hung.png" alt="double_hung">';
                break;
            default:
                return '<img class="img-fluid img-size" src="images/swing.png" alt="swing">';
        }
    },
}

$(function () {
    script.init();
});