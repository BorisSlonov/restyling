$(document).ready(function(){

	var top_wrap = 0;
	var popup = '';

	$("[data-popup-show]").click(function(){
		if(!$(this).hasClass("unactive")){
			top_wrap = $(document).scrollTop();
			var popup_name = $(this).data('popup-show');
			popup = $(".popup[data-popup="+popup_name+"]");

			open_popup(popup);
		}
	});
	$("[data-popup-change]").click(function(){
        close_popup();

		top_wrap = $(document).scrollTop();
		var popup_name = $(this).data('popup-show');
		popup = $(".popup[data-popup="+popup_name+"]");

		open_popup(popup);
	});

	$(window).resize(function(){
		change_type_popup_for_height();
	});

	$(".popup, .popup .popup__close").click(function(){
		close_popup();
	})

	$(".popup .popup__wrapblock, .popup .popup__wrapblock *").click(function(event){
		event.stopPropagation();
	})

	function open_popup(popup, popup_cont, popup_btn){
		$(".wrap").addClass("open-popup");
		$(".wrap").css("top","-" + top_wrap + "px");

		popup.css("display","flex").hide().fadeIn();

		change_type_popup_for_height();
		$(window).scrollTop(0);
	}

	function change_popup(popup){
        close_popup();
        setTimeout(function(){
        	open_popup(popup);
		},500)
	}

	function close_popup(){
		popup.fadeOut();
		setTimeout(function(){
			$(".wrap").removeClass("open-popup");
			$(".wrap").removeClass("overflow-popup");
			$(".header_common").removeClass("overflow-popup");
			$(".wrap").css("top",0);
			$(document).scrollTop(top_wrap);
			$(window).trigger('resize');
		},300)
	}

	function change_type_popup_for_height(){
		if($(".wrap").hasClass("open-popup")){
			if($(window).height() < (popup.find(".popup__wrapblock").not(".hide").height()+40)){
				popup.addClass("big-popup");
			}else{
				popup.removeClass("big-popup");
			}
			check_overflow_for_popup();
		}
	}

	function check_overflow_for_popup(){
		$(".wrap").removeClass("overflow-popup");
		$(".header_common").removeClass("overflow-popup");
		if(!get_scroll('Height')){
			$(".wrap").addClass("overflow-popup");
			$(".header_common").addClass("overflow-popup");
		}
	}

	function get_scroll(a) {
	    var d = document,
	        b = d.body,
	        e = d.documentElement,
	        c = "client" + a;
	        a = "scroll" + a;
	    return /CSS/.test(d.compatMode)? (e[c]< e[a]) : (b[c]< b[a])
	};


  $('.send_form').submit(function(e){
	    e.preventDefault();

	    var ltype = $(this).find("input[name=ltype]").val() ? $(this).find("input[name=ltype]").val() : '';
	    var name = $(this).find("input[name=name]").val() ? $(this).find("input[name=name]").val() : '';
	    var phone = $(this).find("input[name=phone]").val() ? $(this).find("input[name=phone]").val() : '';
	    var date = $(this).find("input[name=date]").val() ? $(this).find("input[name=date]").val() : '';
	    var time = $(this).find("input[name=time]").val() ? $(this).find("input[name=time]").val() : '';
	    var topic = $(this).find("input[name=topic]").val() ? $(this).find("input[name=topic]").val() : '';
	    var specialis = $(this).find("[name=specialis]").val() ? $(this).find("[name=specialis]").val() : '';
			var other = '';


			if($(this).parents('.popup__quiz').length>0){
				var $popup__quiz = $(this).parents('.popup__quiz');
				other = '<br/>';
				other = 'Какой у вас автомобиль: ';
				other += ($popup__quiz.find('.popup__answer-1 .popup__quiz-input').val() || 'Не задано') + '<br/>';

				var other__2 = '';
				$popup__quiz.find('.popup__answer-2 .popup__checkbox [type="checkbox"]').each(function(){
					if($(this).prop('checked')){
						other__2 += $(this).nextAll('.popup__checkbox-text:eq(0)').html() + ', ';
					}
				})
				other += 'Какие элементы авто нуждаются в уходе: ';
				other += (other__2 ? other__2.slice(0, -2) : 'Ничего не выбрано') + '<br/>';


				var other__3 = '';
				$popup__quiz.find('.popup__answer-3 .popup__col').each(function(){
					var other__3_col = '';
					$(this).find('.popup__checkbox [type="checkbox"]').each(function(){
						if($(this).prop('checked')){
							other__3_col += $(this).nextAll('.popup__checkbox-text:eq(0)').html() + ', ';
						}
					})
					if(other__3_col){
						other__3 = $(this).find('.popup__col-name').html() + ': ' + other__3_col.slice(0, -2) + '<br/>';
					}
				})
				other += 'Какие услуги по вашим ожиданиям вам потребуются: ';
				other += other__3 || 'Ничего не выбрано<br/>';

				var other__4 = '';
				$popup__quiz.find('.popup__answer-4 .popup__radio [type="radio"]').each(function(){
					if($(this).prop('checked')){
						other__4 += $(this).nextAll('.popup__radio-text:eq(0)').html();
					}
				})
				other += 'Выберите свой подарок: ';
				other += other__4 || 'Ничего не выбрано<br/>';
			}

			if($(this).parents('.popup__complex').length>0){
				other = 'Услуги: ';
				other += $(".popup__complex .popup__desc").html();

				var other__4 = $('.popup__complex .popup__bonus-item.current .popup__bonus-title').text();
				
				other += 'Выберите свой подарок: ';
				other += other__4 || 'Ничего не выбрано<br/>';
			}

      $.ajax({
          type: "POST",
          url: "php/send.php",
          contentType: "application/json",
          data: JSON.stringify({
          	'ltype': ltype, 
          	'name': name, 
          	"phone": phone, 
          	'time': time, 
          	'date': date, 
          	'other': other, 
          	'topic': topic, 
          	'specialis': specialis
          })
      })

      if(popup){
    		close_popup();
      }

			top_wrap = $(document).scrollTop();

		  setTimeout(function(){

				var popup_name = 'thanks';
				popup = $(".popup[data-popup="+popup_name+"]");

				open_popup(popup);

			},500)

  });

	// NEW POPUP RELATIONS

	$("[data-service-title]").click(function(){
		var title = $(this).data('service-title');
		var ltype = $(this).data('service-ltype');
		var desc = $(this).data('service-desc');

		if(ltype == 'services__box-item') {
			ltype = "Прочие услуги:" + $(this).parent().prev().find('.current').text();
		}

		$(".popup__services .popup__title").html(title);
		$(".popup__services [name='ltype']").val(ltype);
		$(".popup__services .popup__desc").html(desc);
	})

	$(".complex__btn").click(function() {
		var list = '';
		$(".popup__complex [type=checkbox]").remove();
		$(".complex__services [type=checkbox]").each(function(){
			if($(this).prop('checked')){
				list += '- ' + $(this).next().next().html() + '<br>';
				$(".popup__complex form").append($(this));
			}

		})
		$(".popup__complex .popup__desc").html(list);
	})

	$(".popup__bonus-img, .popup__bonus-title").click(function(){
		$(".popup__bonus-item").removeClass('current');
	  $(this).parent().addClass('current');
	})





});
