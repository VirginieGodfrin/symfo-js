// Avant, quand nous n'étions pas à l'intérieur de toute fonction, 
// nos deux variables devenaient effectivement globales: nous pouvions y accéder de n'importe où. 
// Mais maintenant que nous sommes à l'intérieur d'une fonction, 
// les variables RepLogApp et Helper ne sont accessibles qu'à partir de l'intérieur 
// de cette fonction auto-exécutable.

(function (window, $) {
    'use strict';
    // window. est une variable de fenêtre globale, window contient toutes les variables globales, 
    // window.RepLogApp est une variable globalle
    window.RepLogApp = {
    	// 1° clé initialisation
    	initalize: function($wrapper){
        this.$wrapper = $wrapper;
        // Helper.initialize(this.$wrapper);
        this.helper = new Helper(this.$wrapper);
        var helper2 = new Helper($('footer'));
        this.$wrapper.find('.js-delete-rep-log').on( 'click', this.handleRepLogDelete.bind(this) );
        this.$wrapper.find('tbody tr').on('click', this.handleRowClick.bind(this));
        // La méthode Object.keys est un moyen facile d'imprimer les propriétés et les méthodes à l'intérieur d'un objet.
        // console.log(this.helper, Object.keys(this.helper));
        // console.log(Helper, Object.keys(Helper));
        console.log("helper : " + this.helper.calculateTotalWeight() );
        console.log("helper : " + helper2.calculateTotalWeight() );
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
    // Lorsque l'on crée des objets qui doivent être instanciés, 
    // on doit ajouter ses propriétés et méthodes en utilisant prototype
    // ainsi elles font partie intégrante de l'objet
    Helper.prototype.calculateTotalWeight = function() {
        var totalWeight = 0;
        this.$wrapper.find('tbody tr').each(function() {
            totalWeight += $(this).data('weight');
        });
        return totalWeight;
    };

// __proto__ : Chaque objet a une propriété magique appelée __proto__.  
// Chaque __proto__ agit comme une classe que nous étendons. 
// Et ce dernier __proto__ est comme une classe de base que tout étend.
// Chaque fois que vous utilisez le nouveau mot-clé, 
// tout ce qui figure sur la clé prototype de cet objet devient le __proto__ de l'objet nouvellement instancié.
// __proto__
        var playObject = { 
             lift: 'stuff'
        };
        playObject.__proto__.cat = 'meow'; 
        console.log(playObject.lift, playObject.cat);
        console.log( 'foo'.__proto__);
        console.log([].__proto__);
        console.log((new Date()).__proto__);
})(window, jQuery);