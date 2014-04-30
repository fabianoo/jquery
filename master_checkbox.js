// - Master Checkbox - Luan Nico
// - github.com/luanpotter/jquery
// - Version: 0.1

(function( $ ) {

  $.fn.setMasterCheckbox = function(clazz) {
    var checkbox = $(this);
    $(':checkbox.' + clazz).on('change', function (e) {
      var all = true;
      $(':checkbox.' + clazz).each(function (index) {
        if (!$(this).is(':checked')) {
          checkbox.prop('checked', false);
          all = false;
          return false; //break
        }
      });

      if (all) {
        checkbox.prop('checked', true);
      }
    });

    checkbox.click(function (e) {
      var checked = $(this).is(':checked');
      $(':checkbox.' + clazz).each(function(index) {
        $(this).prop('checked', checked);
      });
    });
    return this;
  };

}( jQuery ));
