$(document).ready(function () {
  var form = $('#main'),
      data = form.find('input[name=data]'),
      allLabel = $('#all'),
      allInput = allLabel.find('input'),
      randomLabel = $('#random'),
      randomInput = randomLabel.find('input'),
      ads = $('#add-data-set-area'),
      adsForm = ads.find('form'),
      adsInput = adsForm.find('input[type=file]'),
      loadingData = $('#loading-data'),
      dataSets = $('#data-sets');

  // load data
  $.get('/data', function (data, textStatus, jqXHR) {
    var data = data.split(',');
    data.forEach(function (dataSet) {
      dataSets.append('<label><input type="checkbox" name="data" value="' + dataSet + '">' + dataSet + '</label>');
    });
    dataSets.show();
    loadingData.hide();
  });

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

  // add data set
  form.find('#add-data-set a').click(function () {
    ads.toggle();
    $(this).toggle();
  });
  adsInput.change(function () {
    adsForm.submit();
  });

  // pseudo form submission
  form.find('.submit a').click(function () {
    var processData = {},
        dataSets = [];

    data.filter(':not([value=random],[value=all])').each(function () {
      if ($(this).is(':checked')) {
        dataSets.push($(this).val());
      }
    });

    processData.dataSets = dataSets;
    processData.process = form.find('input[name=process]').val();

    console.log('The following data is /process\'d');
    console.log(processData);

    // send to server for R crunch magic
    $.post('/process', processData, function (data, textStatus, jqXHR) {
      console.log(data);
    })
  })
});