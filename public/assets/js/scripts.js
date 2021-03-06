jQuery(document).ready(function() {
  //PAGE LOAD
  $(".registration-form").ready(function() {
    $("#ifPassword").hide();
  });
  $('.registration-form fieldset:first-child').fadeIn('slow');

  $('.registration-form input[type="text"], input[type="number"].mobile1, input[type="email"]').on('focus', function() {
    $(this).removeClass('input-error');
  });

  // next step
  $('.registration-form .btn-next').on('click', function() {
    console.log("NEXT");
    window.samir = true;
    let parent_fieldset = $(this).parents('fieldset');
    let next_step = true;
    let password, confirmPassword;
    parent_fieldset.find('input[type="text"], input[type="number"], input[type="email"], input[type="password"],select').each(function() {
      if ($(this).attr('id') == "landline" || $(this).attr('id') == "mobile2" || $(this).attr('id') == "password" || $(this).attr('id') == "confirmPassword") {
        $(this).removeClass('input-error');
        if ($(this).attr('id') == "mobile2") {
          if ($(this)[0].value.length > 0 && $(this)[0].value.length != 10 || isNaN($(this).val())) {
            $(this).addClass('input-error');
            next_step = false;
          } else {
            $(this).removeClass('input-error');
          }
        }
      } else if ($(this).val() == "") {
        $(this).addClass('input-error');
        next_step = false;
      } else {
        $(this).removeClass('input-error');
      }
      if ($(this).attr('id') == "state") {
        if ($(this)[0].selectedIndex === 0) {
          next_step = false;
          $(this).addClass('input-error');
        }
      }
      if ($(this).attr('id') == "mobile1") {
        if ($(this).val().length != 10 || isNaN($(this).val())) {
          next_step = false;
          $(this).addClass('input-error');
        }
      }
      if ($(this).attr('id') == "pincode") {
        if ($(this).val().length != 6 || isNaN($(this).val())) {
          next_step = false;
          $(this).addClass('input-error');
        }
      }
      if ($(this).attr('id') == "panNo") {
        if ($(this).val().length != 10) {
          next_step = false;
          $(this).addClass('input-error');
        }
      }
      if ($(this).attr('id') == "GSTNo") {
        let conflict = $(this).attr("data-isGstConflict");
        console.log(conflict);
        if ($(this).val().length != 15 || conflict === "true") {
          next_step = false;
          $(this).addClass('input-error');
        }
      }
      if ($(this).attr('id') == "password") {
        password = $(this).val();
      }
      if ($(this).attr('id') == "confirmPassword") {
        confirmPassword = $(this).val();
        if (password || confirmPassword) {
          if (password != confirmPassword) {
            $(this).addClass('input-error');
            next_step = false;
          }
        }
      }
    });
    if (next_step) {
      parent_fieldset.fadeOut(400, function() {
        $(this).next().fadeIn();
      });
    }
  });

  //Show Hide Password
  $('.registration-form .togglePassword').on('click', function() {
    if ($(this).attr('id') == "togglePassword") {
      $("#ifPassword").toggle(500);
    }
  });

  // previous step
  $('.registration-form .btn-previous').on('click', function() {
    $(this).parents('fieldset').fadeOut(100, function() {
      $(this).prev().fadeIn();
    });
  });

  // submit
  $('.registration-form').on('submit', function(e) {
    $(this).find('input[type="text"], input[type="email"], textarea').each(function() {
      if ($(this).val() == "") {
        e.preventDefault();
        $(this).addClass('input-error');
      } else {
        $(this).removeClass('input-error');
      }
    });
  });
});