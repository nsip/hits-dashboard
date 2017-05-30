// ----------------------------------------------------------------------
$(document).ready(function() {

  // XXX Reloading?

  // XXX Keep use case selected, flag (was it customised), the actual options.

  var usecases = [

      // Default - The starting position
      {
        id: 'custom',
        title: 'Custom (select)',
        schools: [1,1],
        students: [100,200],
        classrooms: [3,5],
        teachers: [5,10],
        options: {
          teachinggroups: true,
          timetable: true,
          grading: true,
          contacts: true,
          accounts: true,
          naplan: true,
        },
      },

      // The other entries
      {
        id: 'attendance',
        title: 'Attendance',
        schools: [1,1],
        students: [150,250],
        classrooms: [5,10], // XXX Fake
        teachers: [15,20], // XXX Fake
        // (optional) CalendarDate for each day of term in a year eg Feb-June, Aug-Nov, 5 days a week
        // 1 calendarsummary per year
        // Calendar Date is a check box (because it is an option)
        // (Classroom=0, Teachers=0) ie not required, maybe don't put up thiose slioders for this use case
        options: {
          teachinggroups: true,
          timetable: true,
          grading: false,
          contacts: true,
          accounts: false,
          naplan: true,
        },
      },

      {
        id: 'financial',
        title: 'Financial',
        schools: [2,2],
        students: [0,0],
        classrooms: [0,0],
        // 3 LocationInfos of which two point to schools, and the third is a central dept ed
        teachers: [15,20],
        parents: 20,
        vendors: 5,
        // (45 debtors=teachers+parents+vendors)
        // 12 financial accounts - 3 each of asset, liability, revenue, expense
        // (Also delete this from the use case text - Fincancial classifications)
        // No need to associate finacial accounts with parent financial accounts for this exercise
        // Sliders:
        // Locations (charge centres)
        // Teachers
        // Parents
        // Vendors
        // Financial accounts (less important)
        // No check boxes
        options: {},
      },

      {
        id: 'enrolment',
        title: 'Enrolment',
        schools: [1,1],
        options: {},
      },

      {
        id: 'gradebook',
        title: 'Gradebook',
        schools: [1,1],
        students: [175,225],
        classrooms: [0,0],
        teachers: [0,0],
        // teachinggroups: 10,
        // teachers: 10,
        // 200 students
        // 10 Teaching groups, even distro, 1 per student
        // 10 teachers (1 per techning group)
        // (optional) StudentEnrollment and StaffAssignment join records connecting them back to the school
        options: {},
      },

      {
        id: 'naplan_registration',
        title: 'NAPLAN registration',
        schools: [10,20],
        students: [0,0],
        classrooms: [0,0],
        teachers: [0,0],
        // 20 Schools (with ACARA IDs) - that's it.
        options: {},
      },

      {
        id: 'naplan_results',
        title: 'NAPLAN results',
        schools: [0,0],
        students: [0,0],
        classrooms: [0,0],
        teachers: [0,0],
        // TBD later - not ready for this yet as too early in NAPLAN cycle, not yet relevant for vendor. Covered by NIAS for TAAs. Revisit 2018
        options: {},
      },

      {
        id: 'timetabling',
        title: 'Timetabling',
        schools: [1,1],
        students: [200,350],
        classrooms: [30,40],
        teachers: [10,15],
        // 1 school
        // 200 students +
        // 20 teachers
        // 30 Rooms
        // 6 timetable subjects with these names: English, Maths, Science, PE, Geography, Home Economics
        // (optional) SchoolCourse Info - one per timetable subject (ie 6)
        // Sliders:
        // School
        // Students
        // Teachers
        // Room
        // Checkbox option: School Course Info
        options: {},
      },

      // Checkboxes
      // Don't need timetable example data
      //   XXX how do we create timetable then?
      // Grtading should be posted so don't need that
      //
      // Contact info & photos - don't need for any use case atm
      //  OK ? But we create these already in some use cases?
      // Accounts and invoices - redundant as you do the use case or you don't
      // NAPLAN sample - redundant
      //  Um... but we are creating the naplan IDs, should we rename this to "ACARA IDs"
      // Checkboxes we do need:
      // School Course Info
      // Create StudentEnrollment and StaffAssignment objects
      // Calendar date

  ];

  // Do them all ! These have to happen only once - make sure data already setup
  // $('.selectize').selectize();


  var createschools = $('#create-schools').ionRangeSlider({
    type: "single",
    min: 0,
    max: 5,
    from: 1,
    prefix: "Schools: ",
    decorate_both: false,
    onChange: function (data) {
      // tables.draw();
    }
  });


  var createstudents = $('#create-students').ionRangeSlider({
    type: "double",
    grid: true,
    min: 0,
    max: 500,  // TODO support 2000
    from: 100,
    to: 200,
    prefix: "Students: ",
    decorate_both: false,
    onChange: function (data) {
      // tables.draw();
    }
  });


  var createteachers = $('#create-teachers').ionRangeSlider({
    type: "double",
    grid: false,
    min: 0,
    max: 25,  // TODO support more?
    from: 5,
    to: 10,
    prefix: "Teachers: ",
    decorate_both: false,
    onChange: function (data) {
      // tables.draw();
    }
  });

  var createclassrooms = $('#create-classrooms').ionRangeSlider({
    type: "double",
    grid: false,
    min: 0,
    max: 20,  // Per teacher ?
    from: 3,
    to: 5,
    prefix: "Classrooms: ",
    decorate_both: false,
    onChange: function (data) {
      // tables.draw();
    }
  });

  // Add create-type code
  var createtype = $('#create-type');
  if (createtype.length) {
    createtype.empty();

    usecases.forEach(function(row) {
      createtype.append($('<option>', {value:row.id, text:row.title}));
    });

    var set = false;
    var uc = null;
    $('#set-values').click(function() {
      set = true;
      return;
    });
    $('#changeusecase').on('hidden.bs.modal', function (e) {
      if (set) {
        console.log("YES");
        if (uc.schools) {
          var slider = createschools.data("ionRangeSlider");
          slider.update({
            from: uc.schools[0],
            to: uc.schools[1],
          });
        }

        if (uc.students) {
          var slider = createstudents.data("ionRangeSlider");
          slider.update({
            from: uc.students[0],
            to: uc.students[1],
          });
        }

        if (uc.teachers) {
          var slider = createteachers.data("ionRangeSlider");
          slider.update({
            from: uc.teachers[0],
            to: uc.teachers[1],
          });
        }

        if (uc.classrooms) {
          var slider = createclassrooms.data("ionRangeSlider");
          slider.update({
            from: uc.classrooms[0],
            to: uc.classrooms[1],
          });
        }

        Object.keys(uc.options).forEach(function(key) {
          $('#create-' + key).prop('checked', uc.options[key]);
        });
      }
      else {
        console.log("NO");
      }
    });
    createtype.selectize({
      onChange: function(newval) {
        // XXX Confirm it is ok to change?
        set = false;

        usecases.forEach(function(row) {
          if (row.id == newval) {
            uc = row;
          }
        });
        if (!uc) {
          console.error("AHHH - Can't find use case");
          return;
        }

        $('#changeusecase').modal('show');

        // Update sliders !

        return;
      },
    });
  }

  // Get specific ID or 'default' (default is captured from last session)
  var id = $.url(window.location.href).param('id');

  // Get cookie version
  if (!id)
    id = $.cookie("hits2.id");

  // Nope - still no id
  if (!id) {
    alert("No ID provided. Find your original URL");
    window.location = "recover.html";
    return;
  }

  // OK - save this id for future
  $.cookie("hits2.id", id, {expires: 90});

  var table = undefined;
  var loadTable = function() {
    if (!table) {
      table = $('#account-databases').DataTable( {
        "ajax": {
          "url": "/api/account/" + id + "/counts",
          "dataSrc": "data"
        },
        "order": [[ 2, "desc" ]],
        pageLength: 10,
        "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
        "columns": [
          {
            "title": "ID",
            "width": "30%",
            "data": "id",
            "render": function (data, type, row, meta) {
              var option = "";
              if (row.opdata.hmac)
                option = "hmac";
              return '<a href="dashboard.html?id=' + id + '&dbid=' + data + '&option=' + option + '">' + data + '</a>';
            },
            "defaultContent": '',
          },
          { "title": "Name", "width": "20%", "data": "name", "defaultContent": '' },
          { "title": "When", "width": "20%", "data": "when" , "defaultContent": ''},
          { "title": "Schools", "width": "5%", "data": "schools" , "defaultContent": ''},
          { "title": "Students", "width": "5%", "data": "students" , "defaultContent": ''},
          { "title": "Teachers", "width": "5%", "data": "teachers" , "defaultContent": ''},
          { "title": "Status", "width": "10%", "data": "status" , "defaultContent": ''},
          { "title": "Options", "width": "10%", "data": "options" , "defaultContent": ''},
          // { "title": "Databases", "width": "10%", "data": "databases", defaultContent: "None" , "defaultContent": ''}
          // Adding buttons
        ]
      } );

      /*
      $('#filedata tbody').on('click', 'tr', function () {
        var data = table.row( this ).data();
        window.location = "/ui/processed.html?dir=" + data.id;
      });
      */
    }
    else {
      table.ajax.reload();
    }
  };

  // Load table
  loadTable();
  setInterval(loadTable, 60000);  // TODO Maybe push this to 30 seconds?

  // Create new entry
  $('#create-create').click(function() {
    var name = $('#create-name').val();
    var type = $('#create-type').val();

    // XXX Check values - must have valid entries here

    if (!name) {
      alert("Please enter a name and select options");
      // XXX Add as nice dismissable alert like Fran uses
      return;
    }

    $.ajax({
      type: "POST",
      dataType: 'json',
      contentType:"application/json; charset=utf-8",
      url: "/api/account/" + id + "/database",
      data: JSON.stringify({
        name: name,
        type: type,
        options: {
          schools: createschools.data("from"),
          students: [createstudents.data("from"), createstudents.data("to")],
          teachers: [createteachers.data("from"), createteachers.data("to")],
          classrooms: [createclassrooms.data("from"), createclassrooms.data("to")],
          teachinggroups: $('#create-teachinggroups').prop('checked'),
          timetable: $('#create-timetable').prop('checked'),
          grading: $('#create-grading').prop('checked'),
          contacts: $('#create-contacts').prop('checked'),
          accounts: $('#create-accounts').prop('checked'),
          naplan: $('#create-naplan').prop('checked'),
          hmac: $('#create-hmac').prop('checked'),
        },
      }),
    })
    .done(function( data ) {
      if (!data || !data.success) {
        alert("Failed create TODO");
        return;
      }

      $('#create-name').val("");
      $('#create-type').val("");
      loadTable();
      // XXX Add as nice dismissable success message like Fran uses
    })
    .fail(function() {
      // XXX Alert !
      alert("Failed create TODO");
      return;
    });

    return false;
  });

});
