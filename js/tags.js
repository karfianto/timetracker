

(function() {

    $( function() {

        $(document).ready(function() {
            $("#dialog-confirm").dialog({
              autoOpen: false,
              modal: true
            });
        });

        $("#new-tag-submit").click(function () {
            if ($("#new-tag-input").val().trim() == '')
                return false;
            var baseUrl = OC.generateUrl('/apps/timetracker/ajax/add-tag/'+$("#new-tag-input").val());
            var jqxhr = $.post( baseUrl, function() {
                getTags();
                $(dialogTagEditForm).dialog("close");
            }).done(function(data, status, jqXHR) {
                var response = data;
                if ('Error' in response){
                    alert(response.Error);
                }
            }).fail(function() {
                alert( "error" );
            })
            return false;
        });

        dialogTagEditForm = $( "#dialog-tag-edit-form" ).dialog({
            autoOpen: false,
            height: 400,
            width: 350,
            modal: true,
            buttons: {
                "Edit tag": {
                    click: function(){
                        editTag(dialogTagEditForm);
                        return false;
                    },
                    text: 'Edit tag',
                    class:'primary'
                },
                Cancel: function() {
                    dialogTagEditForm.dialog( "close" );
                }
            },
            close: function() {
                form[ 0 ].reset();
            }
       });

       form = dialogTagEditForm.find( "form" ).on( "submit", function( event ) {
            event.preventDefault();
            editTag(dialogTagEditForm);
       });

       getTags();
       function editTag(dialogTagEditForm){
            target = dialogTagEditForm.target;
            form =  dialogTagEditForm.find( "form" );
            var baseUrl = OC.generateUrl('/apps/timetracker/ajax/edit-tag/'+target);
            var jqxhr = $.post( baseUrl, {name:form.find("#name").val()},function() {
                getTags();
                $(dialogTagEditForm).dialog("close");
              })
                .done(function(data, status, jqXHR) {
                  var response = data;
                  if ('Error' in response){
                    alert(response.Error);
                  }
                })
                .fail(function() {
                  alert( "error" );
                })

        }

        function getTags(){
            var baseUrl = OC.generateUrl('/apps/timetracker/ajax/tags');

            var editIcon = function(cell, formatterParams){ //plain text value
                return "<i class='fa fa-edit'></i>";
            };

            $.get(baseUrl, function(data){
                $('#tags').html('');
                var contentList = $('<div/>').addClass('app-content-list');
                for (tag of data.Tags) {
                    console.log(tag);
                    var listItem = $('<a/>', {href:'#'}).addClass('app-content-list-item');
                    listItem.append($('<div/>').addClass('app-content-list-item-icon')
                                               .addClass('icon-tag-white')
                                               .css('background-color', 'rgb(100,100,100)'));
                    listItem.append($('<div/>').addClass('app-content-list-item-line-one').text(tag.name));
                    listItem.append($('<div/>').addClass('icon-delete').click(function(event){
                       event.stopPropagation();
                       $("#dialog-confirm").dialog({
                           buttons : {
                              "Confirm" : {click: function() {
                              var baseUrl = OC.generateUrl('/apps/timetracker/ajax/delete-tag/'+tag.id);
                                  var jqxhr = $.post( baseUrl, function() {
                                      getTags();
                                      $("#dialog-confirm").dialog("close");
                                  })
                                      .done(function(data, status, jqXHR) {
                                        var response = data;
                                        if ('Error' in response){
                                          alert(response.Error);
                                        }
                                      })
                                      .fail(function() {
                                      alert( "error" );
                                      })
                                      return false;
                              },
                              text: 'Confirm',
                              class:'primary'
                             },
                           "Cancel" : function() {
                               $(this).dialog("close");
                           }
                          }
                       });
                       $("#dialog-confirm").dialog('open');
                    }));
                    listItem.click(function(){
                        dialogTagEditForm.target = tag.id;

                        form = dialogTagEditForm.find( "form" )
                        form.find("#name").val(tag.name);
                        dialogTagEditForm.dialog("open");
                    });
                    contentList.append(listItem);
                }
                $('#tags').append(contentList);
            });
        }
   });
}());
