$(document).ready(function() {

    $('iframe').load(function(e){

        var frame = e.target;
        frame.style.height = frame.contentWindow.document.body.scrollHeight + 'px';
        
        $('body.main-scrollable .main__scroll').scrollTop(0);

	// $('#link_other a').attr('target', '_blank');
    }); 
});
