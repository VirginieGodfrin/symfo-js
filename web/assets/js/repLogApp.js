(function (window, $) {
    'use strict';
    // obj RepLogApp
    // gestionnaire d'évènements
    window.RepLogApp = function($wrapper){
        this.$wrapper = $wrapper;
        this.helper = new Helper(this.$wrapper);
        this.$wrapper.find('.js-delete-rep-log').on( 'click', this.handleRepLogDelete.bind(this));
        this.$wrapper.find('tbody tr').on('click', this.handleRowClick.bind(this));
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