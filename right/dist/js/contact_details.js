// ----------------------------------------------------------------------
var contact_id;
var account_id;
var email;
var name;
$(document).ready(function() {

    contact_id = $.url(window.location.href).param('contact_id');
    
    $.ajax({
        type: "GET",
        dataType: 'json',
        url: "/api/admin/contact/" + contact_id
    })
    .done(function( data ) {
        if (!data || !data.success) {
            alert("Failed load TODO");
        } else {
            
            var values = data.contact;
            var raw = JSON.parse(values.data);

            email = raw.email;
            name = raw.name;
            
            var developerArchitect = "Neither";
            if(raw.checkbox_developer && raw.checkbox_developer == 'on'
                && raw.checkbox_developer && raw.checkbox_developer == 'on'){
                developerArchitect = "Developer and Architect";
            } else if(raw.checkbox_developer && raw.checkbox_developer == 'on'){
                developerArchitect = "Developer";
            } else if(raw.checkbox_architect && raw.checkbox_architect == 'on'){
                developerArchitect = "Architect";
            }

            var representation = "Neither";
            if(raw.checkbox_school_authority && raw.checkbox_school_authority == 'on'
                && raw.checkbox_vendor && raw.checkbox_vendor == 'on'){
                representation = "Vendor and School Authority";
            } else if(raw.checkbox_vendor && raw.checkbox_vendor == 'on'){
                representation = "Vendor";
            } else if(raw.checkbox_school_authority && raw.checkbox_school_authority == 'on'){
                representation = "School Authority";
            }

            var familiarSif = "No";
            if(raw.checkbox_sif && raw.checkbox_sif == 'on'){
                familiarSif = "Yes";
            }

            var nsipProject = "None";
            if(raw.nsip_project && raw.nsip_project.trim() != ''){
                nsipProject = raw.nsip_project;
            }
            
            var status = values.status;
            if(data.account){
                status = "Existing"
            }

            var jurisdiction = '';
            switch(raw.jurisdiction) {
                case "actgov":
                    jurisdiction = "ACT Government";
                    break;
                case "nswgov":
                    jurisdiction = "NSW Government";
                    break;
                case "ntgov":
                    jurisdiction = "NT Government";
                    break;
                case "qldgov":
                    jurisdiction = "QLD Government";
                    break;
                case "tasgov":
                    jurisdiction = "TAS Government";
                    break;
                case "vicgov":
                    jurisdiction = "VIC Government";
                    break;
                case "wagov":
                    jurisdiction = "WA Government";
                    break;
                case "actcath":
                    jurisdiction = "ACT Catholic";
                    break;
                case "nswcath":
                    jurisdiction = "NSW Catholic";
                    break;
                case "ntcath":
                    jurisdiction = "NT Catholic";
                    break;
                case "qldcath":
                    jurisdiction = "QLD Catholic";
                    break;   
                case "tascath":
                    jurisdiction = "TAS Catholic";
                    break;   
                case "viccath":
                    jurisdiction = "VIC Catholic";
                    break;   
                case "wacath":
                    jurisdiction = "WA Catholic";
                    break;   
                case "actind":
                    jurisdiction = "ACT Independent";
                    break;   
                case "nswind":
                    jurisdiction = "NSW Independent";
                    break;   
                case "ntind":
                    jurisdiction = "NT Independent";
                    break;   
                case "qldind":
                    jurisdiction = "QLD Independent";
                    break;
                case "tasind":
                    jurisdiction = "TAS Independent";
                    break;
                case "vicind":
                    jurisdiction = "VIC Independent";
                    break;
                case "waind":
                    jurisdiction = "WA Independent";
                    break;
                default:
                    jurisdiction = raw.jurisdiction;
            }
            
            $('.contactName').text(raw.name);
            $('.contactEmail').text(raw.email);
            $('.contactOrg').text(raw.organisation);
            $('.contactJurisdiction').text(jurisdiction);
            $('.contactInterest').text(raw.interest);
            $('.contactDevArchitect').text(developerArchitect);
            $('.contactVendorSchool').text(representation);
            $('.contactSif').text(familiarSif);
            $('.contactProject').text(nsipProject);
            $('.contactStatus').text(status);
            $('.contactDate').text(moment(values.created_at).format("DD/MM/YYYY HH:mm:ss"));
            
            if(data.account){
                account_id = data.account.id;
            
                $('.createAccountButton').hide();
                $('.ignoreContactButton').hide();
                
                $('.accountInformation').show();
                $('.accountName').text(data.account.name);
                $('.accountEmail').text(data.account.email);
            } else {
                $('.createAccountButton').show();
                $('.ignoreContactButton').show();
            }

        }
    })
    .fail(function() {
        alert("Failed load TODO");
    });

    $('.createAccountButton').click(function() {

        var choice = confirm('Are you sure you want create an account for ' + name + ' ' + email + '?');

        if(choice){

            $.ajax({
                type: "POST",
                dataType: 'json',
                url: "/api/admin/",
                data: {
                    name: name,
                    email: email
                }
            })
            .done(function( data ) {
                if (!data || !data.success) {
                    alert("Failed create TODO");
                } else {
                    
                    account_id = data.id;
                    
                    $('.accountCreatedSuccess').show();

                    $('.createAccountButton').hide();
                    $('.ignoreContactButton').hide();

                    $('.accountInformation').show();
                    $('.accountName').text(name);
                    $('.accountEmail').text(email);
                    $('.contactStatus').text("Existing");                   
                }

            })
            .fail(function() {
                alert("Failed create TODO");
            });
        }

        return false;
    });

    $('.ignoreContactButton').click(function() {

        var choice = confirm('Are you sure you ignore contact ' + name + ' ' + email + '?\n This will remove them from the list of Contacts.');

        if(choice){

            $.ajax({
                type: "POST",
                dataType: 'json',
                url: "/api/admin/contact/" + contact_id,
                data: {
                    status: 'ignore'
                }
            })
            .done(function( data ) {
                if (!data || !data.success) {
                    alert("Failed create TODO");
                } else {
                    window.location.href = 'contacts.html';
                }
            })
            .fail(function() {
                alert("Failed create TODO");
            });
        }

        return false;
    });
    
    $('.goToAccountButton').click(function(){
        window.location.href = 'account_details.html?account_id=' + account_id;
    });
});
