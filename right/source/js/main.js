/*
 *
 *   Right - Responsive Admin Template
 *   v 0.3.0
 *   http://adminbootstrap.com
 *
 */

$(document).ready(function() {
    $.fn.dataTable.ext.errMode = function ( settings, helpPage, message ) {
        console.log(message);
        $('#datatable-error').text(message);
    };

/*
    if($('#welcomeform').length > 0){
        loadProjectList();
    }
*/

  // Popovers
  $('[data-toggle="popover"]').popover({
    animation: true,
    trigger: 'hover',
    placement: 'left',
    container: 'body',
  });

  quickmenu($('.quickmenu__item.active'));

  $('body').on('click', '.quickmenu__item', function() {
    quickmenu($(this))
  });

  function quickmenu(item) {
    var menu = $('.sidebar__menu');
    menu.removeClass('active').eq(item.index()).addClass('active');
    $('.quickmenu__item').removeClass('active');
    item.addClass('active');
    menu.eq(0).css('margin-left', '-'+item.index()*200+'px');
  }

  $('.sidebar li').on('click', function(e) {
    e.stopPropagation();
    var second_nav = $(this).find('.collapse').first();
    if (second_nav.length) {
      second_nav.collapse('toggle');
      $(this).toggleClass('opened');
    }
  });

  $('body.main-scrollable .main__scroll').scrollbar();
  $('.scrollable').scrollbar({'disableBodyScroll' : true});
  $(window).on('resize', function() {
    $('body.main-scrollable .main__scroll').scrollbar();
    $('.scrollable').scrollbar({'disableBodyScroll' : true});
  });

  $('.selectize-dropdown-content').addClass('scrollable scrollbar-macosx').scrollbar({'disableBodyScroll' : true});
  $('.nav-pills, .nav-tabs').tabdrop();

  $('body').on('click', '.header-navbar-mobile__menu button', function() {
    $('.dashboard').toggleClass('dashboard_menu');
  });

  $('.sidestat__chart.sparkline.bar').each(function() {
    $(this).sparkline(
      'html',
      {
        type: 'bar',
        height: '30px',
        barSpacing: 2,
        barColor: '#1e59d9',
        negBarColor: '#ed4949'
      }
    );
  });

  $('.sidestat__chart.sparkline.area').each(function() {
    $(this).sparkline(
      'html',
      {
        width: '145px',
        height: '40px',
        type: 'line',
        lineColor: '#ed4949',
        lineWidth: 2,
        fillColor: 'rgba(237, 73, 73, 0.6)',
        spotColor: '#FF5722',
        minSpotColor: '#FF5722',
        maxSpotColor: '#FF5722',
        highlightSpotColor: '#FF5722',
        spotRadius: 2
      }
    );
  });

  $('.sidestat__chart.sparkline.bar_thin').each(function() {
    $(this).sparkline(
      'html',
      {
        type: 'bar',
        height: '30px',
        barSpacing: 1,
        barWidth: 2,
        barColor: '#FED42A',
        negBarColor: '#ed4949'
      }
    );
  });

  $('.sidestat__chart.sparkline.line').each(function() {
    $(this).sparkline(
      'html',
      {
        type: 'bar',
        height: '30px',
        barSpacing: 2,
        barWidth: 3,
        barColor: '#20c05c',
        negBarColor: '#ed4949'
      }
    );
  });

  $("input.bs-switch").bootstrapSwitch();

  $('.settings-slider').ionRangeSlider({
    decorate_both: false
  });

  if ($('input[type=number]').length) {
    $('input[type=number]').inputNumber({
      mobile: false
    });
  }

  // Add ID and DBID to the URLs
  $(".addids").each(function(index) {
    var id = $.url(window.location.href).param('id');
    var dbid = $.url(window.location.href).param('dbid');
    var option = $.url(window.location.href).param('option');

    var current = $(this).attr("href") + '';
    if ( (typeof id == 'undefined') || (id == 'undefined') || (id == '') )
      return;

    $(this).attr("href",
      current
      + (current.indexOf('?') > 1 ? '&' : '?')
      + 'id=' + id
      + '&dbid=' + dbid
      + '&option=' + option
    );
  });

  $('#welcomesubmit').click(function() {
    var form = $('#welcomeform');
    
    var out = {};
    form.serializeArray().forEach(function(row) {
      console.log(row);
      out[row.name] = row.value;
    });

    if (!out.name || !out.email || !out.organisation || !out.interest) {
        console.log("Out", out);
      
        var str = "You are missing the following required fields: ";
      
        var missingValues = [];
        
        if(!out.name) missingValues.push("Name");
        if(!out.email) missingValues.push("Email");
        if(!out.organisation) missingValues.push("Organisation");
        if(!out.interest) missingValues.push("Interest");
        
        for(var i=0; i<missingValues.length; i++){
            if(i!=0) str += ", ";
            str += missingValues[i];
        }
        
        alert(str);
        return null;
    }

    $.ajax({
      type: "POST",
      dataType: 'json',
      url: "/api/contact",
      data: out
    })
    .done(function( data ) {
      if (data && data.success) {
        // XXX Improved presentation
        alert("You have successfully requested an account on HITS. NSIP will provide you with account login information within two days. For problems or questions, contact NSIP on info@nsip.edu.au");

        // Clear form
        $('#welcomeform').find("input, textarea").val("").removeAttr('checked');

        // Specific refresh for the select
        // $('select.nsip_project_select').val("");
        // $('.nsip_project_select').selectpicker('refresh');
      }
      else {
        alert("Failed contact - " + data.message);
        console.log("Failed email contact error = " + data.error);
      }
    })
    .fail(function() {
      alert("Failed contact. Try reloading.");
    });

  });

    // Makes the log out button work
    $('a.logoutLink').click( function(e) {
        e.preventDefault();

        $.ajax({
            type: "GET",
            dataType: 'json',
            url: "/api/login/logout"
        })
        .done(function( data ) {
            if (data && data.success) {
                console.log(data);
                window.location = "index.html";
            }
            else {
                alert("Failed logout - " + data.error);
            }
        })
        .fail(function(err) {
            alert("Failed logout, please try again");
        });

        return false;
    });

});

function loadProjectList(){

    $.ajax({
        type: "GET",
        dataType: 'json',
        url: "/api/contact/projectlist"
    })
     .done(function( data ) {
        if (data && data.success) {

            var select = $('select.nsip_project_select');

            select.append($('<option>', {
                    value: '',
                    text: ' - - - Select - - - '
                }));

            for(var i=0; i<data.project_list.length; i++){
                select.append($('<option>', {
                    value: data.project_list[i],
                    text: data.project_list[i]
                }));
            }

            $('.nsip_project_select').selectpicker('refresh');

        }
        else {
            alert("Failed logout - " + data.error);
        }
     })
     .fail(function(err) {
         alert("Failed logout, please try again");
     });

}
