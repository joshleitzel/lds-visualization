$(document).ready(function () {
  var form = $('form'),
      data = form.find('input[name=data]'),
      allLabel = $('#all'),
      allInput = allLabel.find('input'),
      randomLabel = $('#random'),
      randomInput = randomLabel.find('input');

  // data checkbox togglemania
  form.find('input[name=data]').click(function() {
    if (allInput.is(':checked')) {
      data.filter(':not([value=all],[value=random])').attr('checked', 'checked');
      randomLabel.addClass('disabled');
      randomInput.attr('disabled', 'disabled');
    } else if (randomInput.is(':checked')) {
      data.filter(':not([value=random])').attr('disabled', 'disabled').closest('label').addClass('disabled');
    } else {
      data.removeAttr('disabled').closest('label').removeClass('disabled');
    }
  });

  // pseudo form submission
  form.find('.submit a').click(function () {
    var dataSets = [];
    data.filter(':not([value=random],[value=all])').each(function () {
      if ($(this).is(':checked')) {
        dataSets.push($(this).val());
      }
    });
    console.log(dataSets);
  })
});