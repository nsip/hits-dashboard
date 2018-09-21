$(document).ready(function() {

    $('iframe').load(function(e){

        var frame = e.target;
        frame.style.height = frame.contentWindow.document.body.scrollHeight + 'px';

        $('body.main-scrollable .main__scroll').scrollTop(0);
   
        // This intercepts iframe clicks and makes usecase links open in the iframe, mailto links
        // open as a new href location, anything on this domain opens in the parent window and
        // not on this domain, opens in a new tab/window
        var iframeContent = $('iframe').contents();
        iframeContent.find('a').click(function(event){
            event.preventDefault();

            var currentLocation = window.location;
            var targetLocation = event.target;

            if(currentLocation && targetLocation) {

                var isUsecase = targetLocation.pathname.startsWith("/usecases/");
                var isMailTo = targetLocation.pathname.startsWith('mailto');

                var sameDomain = targetLocation.hostname == currentLocation.hostname &&
                targetLocation.port == currentLocation.port &&
                targetLocation.protocol == currentLocation.protocol;

                if(isMailTo){
                    location.href = targetLocation;
                } else if(isUsecase) {
                    $('iframe').attr('src', targetLocation)
                } else if(sameDomain) {
                    window.open(targetLocation, '_top');
                } else {
                    window.open(targetLocation, '_blank');
                }
            }
        });    
    });
});