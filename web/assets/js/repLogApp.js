// arguments
(function (window, $, Routing, swal) {
    'use strict';
    // obj RepLogApp
    // gestionnaire d'évènements
    window.RepLogApp = function($wrapper){
        this.$wrapper = $wrapper;
        this.helper = new Helper(this.$wrapper);
        this.loadRepLogs();
        // .on('event', 'selector', methode)
        this.$wrapper.on('click', '.js-delete-rep-log', this.handleRepLogDelete.bind(this));
        this.$wrapper.on('click','tbody tr', this.handleRowClick.bind(this));
        this.$wrapper.on('submit', this._selectors.newRepForm, this.handleNewFormSubmit.bind(this));
    };
    // méthodes
    // jQuery.extend(): Fusionner le contenu de deux ou plusieurs objets ensemble dans le premier objet.
    $.extend(window.RepLogApp.prototype,{
        // nouvelle propriété(attribut) _selector => clé: newRepForm , valeur :'.js-new-rep-log-form' (obj)
        _selectors: {
            newRepForm: '.js-new-rep-log-form' 
        },
        loadRepLogs: function() {
            var self = this;
            $.ajax({
                url: Routing.generate('rep_log_list'),
            }).then(function(data){ // promise
                console.log("loadRepLogs: "+data);
                $.each(data.items, function(key, repLog) {
                    self._addRow(repLog);
                });
            });
        },
        handleRepLogDelete: function(e) {
            e.preventDefault();
            var $link = $(e.currentTarget);
            var self = this;
            swal({
                title: 'Are you sure to delete this log?',
                text: "You won't be able to revert this!",
                showCancelButton: true,
                showLoaderOnConfirm: true,
                preConfirm: function() {
                    return self._deleteRepLog($link);
                }
            }).then(function(arg){ // catch don't work
                console.log('canceled', arg);
                 swal(
                      'Cancelled',
                      'Your imaginary file is safe :)',
                      'error'
                )
            });
        },
        _deleteRepLog: function($link){
            $link.addClass('text-danger');
            $link.find('.fa')
                .removeClass('fa-trash') 
                .addClass('fa-spinner') 
                .addClass('fa-spin');
            var deleteUrl = $link.data('url');
            var $row = $link.closest('tr');

            var self = this;
            $.ajax({
                url: deleteUrl, 
                method: 'DELETE'
            }).then(function(){ //promise
                console.log("handleRepLogDelete");
                $row.fadeOut('normal', function(){
                    this.remove();
                });
                self.updateTotalWeightLifted();

            });
        },
        updateTotalWeightLifted: function() {
            this.$wrapper.find('.js-total-weight').html(this.helper.calculateTotalWeight());
        },
        handleRowClick: function() {
            console.log('tbody tr on click ok!');
        },

        handleNewFormSubmit: function(e) { 
            e.preventDefault(); 
            console.log('submitting!');
            var $form = $(e.currentTarget);// recup du form
            var formData = {};
            $.each($form.serializeArray(), function(key, fieldData) {
                formData[fieldData.name] = fieldData.value
            });
            var $tbody = this.$wrapper.find('tbody');
            var self = this;
            this._saveRepLog(formData)
                .then(function(data) { 
                    // promise (success)
                    console.log('ok');
                    self._clearForm(); 
                    self._addRow(data); // déclenche une exception 
                }).catch(function(jqXHR){
                    // var errorData = JSON.parse(jqXHR.responseText);
                    self._mapErrorsToForm(errorData.errors);
                });
            // catch: capture la promesse échouée et renvoie une nouvelle promesse qui se résout avec succès. 
            // Il sert à gérer les erreurs
        },
        _mapErrorsToForm: function(errorData) { 
            this._removeFormErrors();
            var $form = this.$wrapper.find(this._selectors.newRepForm);
            $form.find(':input').each(function() {
                var fieldName = $(this).attr('name');
                var $wrapper = $(this).closest('.form-group');
                if (!errorData[fieldName]) {
                    // no error!
                    return; 
                }
                var $error = $('<span class="js-field-error help-block"></span>');
                $error.html(errorData[fieldName]);
                $wrapper.append($error);
                $wrapper.addClass('has-error');
            });
        },
        _removeFormErrors: function() {
            var $form = this.$wrapper.find(this._selectors.newRepForm);
            $form.find('.js-field-error').remove(); 
            $form.find('.form-group').removeClass('has-error');
        },
        _clearForm: function(){
            this._removeFormErrors();
            var $form = this.$wrapper.find(this._selectors.newRepForm);
            $form[0].reset();
        },
        _addRow: function(repLog) { 
            var tplText = $('#js-rep-log-row-template').html();
            var tpl = _.template(tplText);
            var html = tpl(repLog);
            this.$wrapper.find('tbody').append($.parseHTML(html));
            this.updateTotalWeightLifted();
        },
        _saveRepLog: function(data) { // return a promise
            return new Promise(function(resolve, reject) { // new promise obj
                $.ajax({
                    url: Routing.generate('rep_log_new'), 
                    method: 'POST',
                    data: JSON.stringify(data)
                }).then(function(data, textStatus, jqXHR) {
                    console.log(jqXHR.getResponseHeader('Location')); // recupération de response->header in newRepLogAction()
                    $.ajax({
                        url: jqXHR.getResponseHeader('Location')
                    }).then(function(data){
                        console.log('now we are REALLY done');
                        console.log(data);
                        resolve(data);
                    }).catch(function(jqXHR) { // pas nécessaire
                        var errorData = JSON.parse(jqXHR.responseText);
                        reject(jqXHR);
                    });
                });
            });
        }

    });
    // obj Helper
    // constructor
    var Helper = function ($wrapper) {
        this.$wrapper = $wrapper; 
    };
    //methodes
    $.extend(Helper.prototype, {
        calculateTotalWeight : function() {
            var totalWeight = 0;
            this.$wrapper.find('tbody tr').each(function() {
                totalWeight += $(this).data('weight');
            });
            return totalWeight;
        }
    });

})(window, jQuery, Routing, swal); 
