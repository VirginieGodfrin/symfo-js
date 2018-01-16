(function (window, $) {
    'use strict';
    // obj RepLogApp
    // gestionnaire d'évènements
    window.RepLogApp = function($wrapper){
        this.$wrapper = $wrapper;
        this.helper = new Helper(this.$wrapper);
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
        handleRepLogDelete: function(e) {
            e.preventDefault();

            var $link = $(e.currentTarget);
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
                method: 'DELETE', 
                success: function() {
                    $row.fadeOut('normal', function(){
                        this.remove();
                    });
                    self.updateTotalWeightLifted();
                }
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
            $.ajax({
                url: $form.data('url'), 
                method: 'POST',
                data: JSON.stringify(formData),
                success: function(data) { // callback
                    self._clearForm();
                    self._addRow(data);
                },
                error: function(jqXHR) {
                    var errorData = JSON.parse(jqXHR.responseText);
                    self._mapErrorsToForm(errorData.errors);
                } 
            });
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
            console.log(repLog);
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

})(window, jQuery);