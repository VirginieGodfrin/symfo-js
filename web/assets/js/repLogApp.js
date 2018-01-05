var RepLogApp = {
	// 1° clé initialisation
	initalize: function($wrapper){
    this.$wrapper = $wrapper;
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
        var totalWeight = 0;
        this.$wrapper.find('tbody tr').each(function() { // each(function (){}) : ittération (jquery) 
            totalWeight += $(this).data('weight'); // this "correspond" à tr
        });
        this.$wrapper.find('.js-total-weight').html(totalWeight);
    },

};