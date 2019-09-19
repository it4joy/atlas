'use strict';

$( document ).ready(function() {
    const errors = {
        emptyFields: 'Заполните, пожалуйста, поле.',
        invalidEmail: 'Email необходимо ввести в формате (пример): example@domain.com (без пробелов).',
        notANumber: 'Пожалуйста, введите числа.',
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

    const userInfoForm = $('#user-info-form');
    const btnSave = userInfoForm.find('.btn-save');
    const userFullName = userInfoForm.find('#fullname');
    const userEmail = userInfoForm.find('#email');
    const docType = userInfoForm.find('#doc-type');
    const docNumber = userInfoForm.find('#doc-number');

    let requiredFields = false;

    $('input').on('input', function() {
        btnSave.attr('disabled', false);
    });

    btnSave.on('click', function() {
        // ckecks required fields
        const userFullNameVal = userFullName.val();
        const userEmailVal = userEmail.val();
        const docNumberVal = docNumber.val();

        const formDataAsArray = userInfoForm.serializeArray();
        console.log(formDataAsArray); // test

        if (userFullNameVal.length === 0) {
            outputError(userInfoForm, userFullName, 'emptyFields');
        } else if (userEmailVal.length === 0) {
            outputError(userInfoForm, userEmail, 'emptyFields');
        } else if ( userEmailVal.search(regExps.emailRegExp) === -1 ) {
            outputError(userInfoForm, userEmail, 'invalidEmail');
        } else {
            requiredFields = true;
        }

        if (requiredFields === true) {
            // do request (user can send form with only required fields)
            alert('You filled required fields. That\'s OK.'); // test
            
            // gets values from additional fields if they have values
            let counter = 0;

            $.each(formDataAsArray, function(index, item) {                
                if (item.value !== '') {
                    ++counter;
                }
            });

            console.log(counter); // test

            if (counter > 3) {
                alert('The amount of items in array of form data is more than 3.'); // test

                if ( docNumberVal.match(regExps.numberRegExp) === null ) {
                    outputError(userInfoForm, docNumber, 'notANumber');
                }
            }
        }
    });
});
