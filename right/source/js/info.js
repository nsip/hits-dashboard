// ----------------------------------------------------------------------
$(document).ready(function() {
  var id = $.url(window.location.href).param('id');
  if (!id)
    id = $.cookie("hits2.id");

  // Get some data?
  if (id) {
    $.ajax({
      type: "GET",
      dataType: 'json',
      url: "/api/account/" + id,
    })
    .done(function( data ) {
      if (!data || !data.success) {
        alert("Failed get misc data for id=" + id);
        return;
      }
    
      $('.hitsinfo-id').html(data.data.id);
      $('.hitsinfo-email').html(data.data.email);
      $('.hitsinfo-name').html(data.data.name);
    })
    .fail(function() {
      alert("Failed create TODO");
    });

    return false;
  }
});
