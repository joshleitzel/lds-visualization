$(document).ready(function () {
  var main = $('#main'),
      allLabel = $('#all'),
      allInput = allLabel.find('input'),
      randomLabel = $('#random'),
      randomInput = randomLabel.find('input'),
      ads = $('#add-data-set-area'),
      adsmain = ads.find('main'),
      adsInput = adsmain.find('input[type=file]'),
      loadingData = $('#loading-data'),
      dataSets = $('#data-sets')
      submit = main.find('.submit'),
      submitP = submit.find('p');
      submitButton = submit.find('a'),
      dataReady = false,
      processReady = false,
      submitReady = false,
      graph = $('#graph .inner');

  // Graph event handler
  $('#graph-list label').click(function () {
    var graphType = $(this).find('input').val();
    $('#options .graph-option').hide();
    $('#options #graph-details-' + graphType).show();
    if ($('#options').css('display') == 'none') {
      $('#options').slideDown();
    }
    toggleSubmit();
  });

  $('input[name=random5]').click(function () {
    // pick 5 random clusters
    randomClusters = [];
    for (i = 0; i < 5; i++) {
      randomClusters.push(Math.floor(Math.random() * (173 - 1 + 1) + 1));
    }
    // usability win: actually select them in the `select` menu
    $('select[name=clusters] option').removeAttr('selected');
    randomClusters.forEach(function (clusterNum) {
      console.log(clusterNum);
      $('select[name=clusters] option[value=cluster' + clusterNum + ']').attr('selected', 'selected');
    });
    $('input[name=randomClusterNum]').val(randomClusters.join(','));
    toggleSubmit();
  });

  $('select[name=clusters]').click(function () {
    $('input[name=random5]').removeAttr('checked');
    toggleSubmit();
  });

  $('div.color').each(function () {
    var $this = $(this);
    var defaultRGB = $this.find('input').val();
    var defaultRGBSplit = defaultRGB.split(',');
    $this.find('.colorsub').css('backgroundColor', 'rgb(' + defaultRGB + ')');
    $this.ColorPicker({
     color: '#' + rgbToHex(defaultRGBSplit[0], defaultRGBSplit[1], defaultRGBSplit[2]),
     onShow: function (colpkr) {
       $(colpkr).fadeIn(500);
       return false;
     },
     onHide: function (colpkr) {
       $(colpkr).fadeOut(500);
       return false;
     },
     onChange: function (hsb, hex, rgb) {
       $this.find('.colorsub').css('backgroundColor', '#' + hex);
       $this.find('input').val(rgb.r + ',' + rgb.g + ',' + rgb.b);
     }
    });
  });

  // pseudo main submission
  $('#form-submit').click(function () {
    event.preventDefault();

    $('#graph-will-load-here').hide();
    $('#graph img').hide();
    $('#graph-loading').show();

    var processData = {},
        clusters = [],
        i;

    processData.graph = $('#graph-list input:checked').val();

    processData.visual = [];
    $('#graph-details-' + processData.graph + ' input[data-visual=true]').each(function () {
      processData.visual.push($(this).attr('name') + '=' + $(this).val());
    });

    $('select[name=clusters] option:selected').each(function () {
      clusters.push($(this).val().split('cluster')[1]);
    });
    processData.clusters = clusters.join(',');

    processData.process = 'cluster';

    console.log('The following data is /process\'d');
    console.log(processData);

    // send to server for R crunch magic
    $.post('/process', processData, function (data, textStatus, jqXHR) {
      // `data` should be the path to the graph, relative to the graphs/ directory
      // put the graph into place
      var url = data.split('GRAPH_PRE')[1].split('GRAPH_POST')[0];
      $('#graph-loading').hide();
      $('#graph .inner').append('<img src="graphs/' + url + '" />');
    });
  });

  // credit: http://www.javascripter.net/faq/rgbtohex.htm
  function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}
  function toHex(n) {
   n = parseInt(n,10);
   if (isNaN(n)) return "00";
   n = Math.max(0,Math.min(n,255));
   return "0123456789ABCDEF".charAt((n-n%16)/16)
        + "0123456789ABCDEF".charAt(n%16);
  }

  // submit button togglemania
  function toggleSubmit() {
    var graphChecked = $('#graph-list input:checked');
    var graphVal = graphChecked.val();
    var clustersSelected = $('select[name=clusters] option:selected');
    var formReady = 
      (graphVal === 'bivariate' && clustersSelected.length > 0)
      || (graphVal === 'silhouette');
    if (formReady) {
      submitP.slideUp();
      submitButton.removeClass('disabled');
      submitButton.removeAttr('disabled');
    } else {
      submitButton.addClass('disabled');
      submitP.slideDown();
      submitButton.attr('disabled', 'disabled');
    }
  }
  toggleSubmit();
  $('[name=process]').click(function () {
    toggleSubmit();
  });
});