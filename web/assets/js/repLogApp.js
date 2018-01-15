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
        this.$wrapper.on('submit','.js-new-rep-log-form', this.handleNewFormSubmit.bind(this));
    };
    // méthodes
    // jQuery.extend(): Fusionner le contenu de deux ou plusieurs objets ensemble dans le premier objet.
    $.extend(window.RepLogApp.prototype,{
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
                // url: $form.attr('action'),
                url: $form.data('url'), 
                method: 'POST',
                // data: $form.serialize(), //!!! serialise()
                data: JSON.stringify(formData),
                success: function(data) { // callback
                    // $form.closest('.js-new-rep-log-form-wrapper').html(data);
                    // $tbody.append(data);
                    // self.updateTotalWeightLifted();
                    console.log('success');
                },
                error: function(jqXHR) {
                    // $form.closest('.js-new-rep-log-form-wrapper').html(jqXHR.responseText);
                    console.log('error:(');
                } 
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

})(window, jQuery);