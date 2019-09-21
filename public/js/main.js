'use strict';

$(document).ready(function() {
    const errors = {
        emptyFields: 'Заполните, пожалуйста, поле.',
        invalidEmail: 'Email необходимо ввести в формате (пример): example@domain.com (без пробелов).',
        notANumber: 'Пожалуйста, введите числа.',
        nothingFound: 'Ничего не найдено',
    };

    const errorBlock = '<div class="error-block"><p class="p"></p></div>';

    const outputError = (form, field, errorType) => {
        field.addClass('form-field-error');
        console.log(field);

        form.append(errorBlock);

        $('.error-block p').text(errors[`${errorType}`]);

        setTimeout(function() {
            field.removeClass('form-field-error');
            $('.error-block').remove();
        }, 3000);
    };

    const regExps = {
        numberRegExp: /^\d\d+\d$/g,
        emailRegExp: /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/i,
    };

    // gets records for page 'records.html'
    const getRecords = () => {
        $.ajax({
            method: 'POST',
            url: 'php/app.php',
            data: {
                action: 'get_records'
            },
            success: function(data) {
                const content = $.parseJSON(data);

                $.each(content, function(i, record) {
                    $('.ajax-content').append(`
                        <div class='card'>
                            <div class='row'>
                                <div class='col-6'>
                                    <p class='p'><strong>ФИО:</strong> ${record.Full_Name}</p>
                                    <p class='p'><strong>Дата рождения:</strong> ${record.Birthday}</p>
                                    <p class='p'><strong>Тип документа:</strong> ${record.Doc_Type}</p>
                                    <p class='p'><strong>Права на доступ:</strong> ${record.Rights}</p>
                                    <p class='p'><strong>Броузер (User-Agent):</strong> ${record.Browser}</p>
                                </div>
                                <div class='col-6'>
                                    <p class='p'><strong>Email:</strong> ${record.Email}</p>
                                    <p class='p'><strong>Пол:</strong> ${record.Gender}</p>
                                    <p class='p'><strong>Номер документа:</strong> ${record.Doc_Number}</p>
                                    <p class='p'><strong>IP-адрес:</strong> ${record.User_IP}</p>
                                </div>
                            </div>
                            <div class='row'>
                                <div class='col-6'>
                                    <p class='p text-muted'><strong>Время добавления записи:</strong> ${record.Time_Stamp}</p>
                                </div>
                                <div class='col-6'>
                                    <p class='p text-muted'><strong>ID пользователя:</strong> ${record.User_ID}</p>
                                </div>
                            </div>
                        </div>
                    `);
                });
            },
            error: function(jqxhr, status, errMsg) {
                console.log(`Статус: ${status}. Ошибка: ${errMsg}`);
                alert(errMsg); // test
            }
        });
    };

    getRecords();

    // gets the name of browser
    const browser = navigator.userAgent;

    // user info form
    const userInfoForm = $('#user-info-form');
    const btnSave = userInfoForm.find('.btn-save');
    const userFullName = userInfoForm.find('#fullname');
    const userEmail = userInfoForm.find('#email');
    const userBirthday = userInfoForm.find('#birthday');
    const docType = userInfoForm.find('#doc-type');
    const docNumber = userInfoForm.find('#doc-number');
    
    // searching form
    const searchingForm = $('#searching-form');
    const btnSearch = $('.btn-search');
    const searchResult = false; // ?..

    btnSearch.on('click', function() {
        // removes class '.searching-result' from the card marked in the past
        $('.card').removeClass('searching-result');

        searchingForm.find('input').each(function(i, el) {
            if ( $(el).val() !== '' ) {
                $(el).addClass('searching-input');
            }
        });

        const searchInput = $('.searching-input');
        const searchRequest = $(searchInput).val();

        // N: check is '.card' exists
        $('.card').each(function(i, el) {
            const children = $(this).children();

            children.each(function(i, el) {
                if ( $(el).text().search(searchRequest) !== -1 ) {
                    $(el).parents('.card').addClass('searching-result');
                    $('.card').hide();
                    $('.searching-result').show();
                }
            });
        });

        if ( $('.searching-result').length === 0 ) {
            outputError(searchingForm, searchInput, 'nothingFound');
            setTimeout(function() {
                $(searchInput).val('');
                $('.card').show();
                btnSearch.attr('disabled', true);
            }, 2000);
        }
    });

    // shows all of cards if user is typing again
    searchingForm.find('input').on('input', function() {
        $('.card').show();
    });


    let requiredFields = false;

    $('input').on('input', function() {
        btnSave.attr('disabled', false);
        btnSearch.attr('disabled', false);
    });

    btnSave.on('click', function() {
        // ckecks required fields
        const userFullNameVal = userFullName.val();
        const userEmailVal = userEmail.val();
        const userBirthdayVal = userBirthday.val();
        const docNumberVal = docNumber.val();

        const formDataAsArray = userInfoForm.serializeArray();
        //console.log(formDataAsArray); // test
        //console.log(userBirthdayVal); // test

        if (userFullNameVal.length === 0) {
            outputError(userInfoForm, userFullName, 'emptyFields');
        } else if (userEmailVal.length === 0) {
            outputError(userInfoForm, userEmail, 'emptyFields');
        } else if ( userEmailVal.search(regExps.emailRegExp) === -1 ) {
            outputError(userInfoForm, userEmail, 'invalidEmail');
        } else if (userBirthdayVal.length === 0) {
            outputError(userInfoForm, userBirthday, 'emptyFields');
        } else {
            requiredFields = true;
        }

        if (requiredFields === true) {
            //alert('You filled required fields. That\'s OK.'); // test
            
            // ckecks additional fields if they have values
            let counter = 0;

            $.each(formDataAsArray, function(index, item) {                
                if (item.value !== '') {
                    ++counter;
                }
            });

            console.log(counter); // test

            if (counter > 4) {
                //alert('The amount of items in array of form data is more than 4.'); // test
                if (docNumberVal.length === 0) {
                    outputError(userInfoForm, docNumber, 'emptyFields');
                    return false;
                } else if ( docNumberVal.match(regExps.numberRegExp) === null ) {
                    outputError(userInfoForm, docNumber, 'notANumber');
                    return false;
                }
            }

            // makes a request in any case
            const postData = userInfoForm.serialize() + `&action=add_record&browser=${browser}`;

            $.ajax({
                method: 'POST',
                url: 'php/app.php',
                data: postData,
                success: function(data) {
                    const response = $.parseJSON(data);
                    alert(response);
                },
                error: function(jqxhr, status, errMsg) {
                    console.log(`Статус: ${status}. Ошибка: ${errMsg}`);
                    alert(errMsg); // test
                }
            });

            userInfoForm.trigger('reset');
        }
    });
});
