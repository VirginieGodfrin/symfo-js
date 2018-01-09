// Avant, quand nous n'étions pas à l'intérieur de toute fonction, 
// nos deux variables devenaient effectivement globales: nous pouvions y accéder de n'importe où. 
// Mais maintenant que nous sommes à l'intérieur d'une fonction, 
// les variables RepLogApp et Helper ne sont accessibles qu'à partir de l'intérieur 
// de cette fonction auto-exécutable.

(function (window, $) {
    'use strict';
    // window. est une variable de fenêtre globale, window conient toutes les variable globales, 
    // window.RepLogApp est une variable globalle
    window.RepLogApp = {
    	// 1° clé initialisation
    	initalize: function($wrapper){
        this.$wrapper = $wrapper;
        // Helper.initialize(this.$wrapper);
        this.helper = new Helper(this.$wrapper);
        this.$wrapper.find('.js-delete-rep-log').on( 'click', this.handleRepLogDelete.bind(this) );
        this.$wrapper.find('tbody tr').on('click', this.handleRowClick.bind(this));
    	},
        // 2° clé 
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
        // 3° clé
        handleRowClick: function() {
            console.log('tbody tr on click ok!');
        },
        // 4° clé
        updateTotalWeightLifted: function() {
            // this.$wrapper.find('.js-total-weight').html(this._calculateTotalWeight);
            this.$wrapper.find('.js-total-weight').html(this.helper.calculateTotalWeight());
        },
        // Creating a Faux-Private Method
        // _calculateTotalWeight: function(){
        //     var totalWeight = 0;
        //     this.$wrapper.find('tbody tr').each(function() {
        //         totalWeight += $(this).data('weight');
        //     });
        //     return totalWeight;
        // },
    };

    /*
     * Private object
     */
   
    // var Helper = {};
    // var Helper devient un constructor
    var Helper = function ($wrapper) {
        this.$wrapper = $wrapper; 
    };
    Helper.calculateTotalWeight = function() {
        var totalWeight = 0;
        this.$wrapper.find('tbody tr').each(function() {
            totalWeight += $(this).data('weight');
        });
        return totalWeight;
    };
})(window, jQuery);