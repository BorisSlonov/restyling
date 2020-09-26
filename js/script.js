$(document).ready(function () {

	/*
	 * Creates Cookie notice
	 */
	var status = localStorage.status;
	var notice = $('.cookie-notice');

	if (status != "agreed") {
		notice.slideDown(500);
	}

	$('.cookie-notice button').click(function () {
		notice.slideUp(500);
		localStorage.status = "agreed";
	});

	/*
	 * Альт и тайтл для изображений
	 */

	var i = 1;
	$('body img').each(function () {
		if ($(this).attr('alt')) {
			$(this).attr('title', $(this).attr('alt'));
		} else {
			$(this).attr('alt', 'Изображение - ' + i);
			$(this).attr('title', 'Изображение - ' + i);
			i++;
		}
	});




	$('.js-car').not(':first').hide();

	$('.js-wrap .item').hover(function () {
		$('.js-wrap .item').removeClass('active-w');
		$(this).addClass('active-w');
		$('.js-car').hide();
		$('.car-' + $(this).data('index')).show();
	});


	var mh = 0;
	$(".item").each(function () {
		var h_block = parseInt($(this).height());
		if (h_block > mh) {
			mh = h_block;
		};
	});
	$(".item").height(mh);


	// COMMON START
	$('a[href^="#"], a[href^="."]').click(function () {
		var scroll_el = $(this).attr('href');
		if ($(scroll_el).length != 0) {
			$('html, body').animate({ scrollTop: $(scroll_el).offset().top }, 500);
		}
		return false;
	});

	// phone mask, validate pasted value
	var tePhone = '+7 (999) 999-99-99';

	// format phone pasted from clipboard
	$("[name=phone]").each(function (i, obj) {
		let myElement = obj
		//console.log(myElement);
		myElement.onpaste = function (e) {
			let pastedText = undefined;
			if (window.clipboardData && window.clipboardData.getData) { // IE
				pastedText = window.clipboardData.getData('Text');
				//console.log(pastedText,1);
			} else if (e.clipboardData && e.clipboardData.getData) {
				pastedText = e.clipboardData.getData('text/plain');
				//console.log(pastedText,2);
			}
			let result;
			const RegEx = /\D/g;
			if (pastedText.length > 10) {
				result = pastedText;
				result = result.replace(RegEx, "");
				result = String(result.substr(-10));
				obj.value = (result);
				obj.focus();
			} else {
				//} else if (pastedText.length == 10) {
				result = pastedText;
				result = result.replace(RegEx, "");
				result = String(result);
				obj.value = result;
				obj.focus();
			}
			//alert(pastedText); // Process and handle text...
			return false; // Prevent the default handler from running.
		};
	})

	$(this).find("input[name=phone]").each(function () {
		$(this).mask(tePhone);
	});

	//$("[name=phone]").mask("+7 (999) 999-99-99");
	$("[name=phone]").attr('type', 'tel');


	// var max_chars = 10;

	// $('[name=phone]').keydown(function (e) {
	// 	if ($(this).val().length >= max_chars) {
	// 		$(this).val($(this).val().substr(0, max_chars));
	// 	}
	// });

	// $('[name=phone]').keyup(function (e) {
	// 	if ($(this).val().length >= max_chars) {
	// 		$(this).val($(this).val().substr(0, max_chars));
	// 	}
	// });


	$("[name=date]").datepicker({ minDate: 0 });

	(function () {
		var width = document.documentElement.clientWidth;
		if (width <= 800) {
			$("[data-popup-show=callback]").each(function () {
				$(this).removeAttr('data-popup-show');
				var regexp = /\d/g;
				var tel = $(this).html().match(regexp).join('');
				$(this).attr('href', 'tel:' + tel);
			})
		}
	})();
	// COMMON END

	// MAIN START
	$('.popup-youtube').magnificPopup({
		type: 'iframe',
		mainClass: 'mfp-fade',
		removalDelay: 160,
		preloader: false,

		fixedContentPos: false
	});
	// MAIN END

	// SERVICES START
	if ($(".services__slider").length > 0) {
		$('.services__slider').slick({
			arrows: false,
			dots: false,
			swipe: true,
			slidesToShow: 3,
			slidesToScroll: 3,
			responsive: [
				{
					breakpoint: 841,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2
					}
				},
				{
					breakpoint: 641,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}
			]
		});



		$(".services__slider-left").click(function () {
			$(this).parents(".services__bottom").find('.services__slider').slick('slickPrev');
		});
		$(".services__slider-right").click(function () {
			$(this).parents(".services__bottom").find('.services__slider').slick('slickNext');
		});

		$(".services__slider-2").slick({
			arrows: false,
			dots: false,
			swipe: false,
			slidesToShow: 1,
			slidesToScroll: 1
		});
		$(".services__slider-left").click(function () {
			$(this).parents(".services__bottom").find('.services__slider-2').slick('slickPrev');
		});
		$(".services__slider-right").click(function () {
			$(this).parents(".services__bottom").find('.services__slider-2').slick('slickNext');
		});

		$(".services__box-item").click(function () {
			if (!$(this).hasClass('current')) {
				$(".services__box-item.current").removeClass("current");
				$(this).addClass('current');
			}

			if ($(".services__box-item.current").length > 0) {
				$(".services__last .services__btn-290").removeClass('unactive');
			} else {
				$(".services__last .services__btn-290").addClass('unactive');
			}
		});




		$(".services__nav-item, .service-navigation__nav-item").click(function () {
			$(".services__nav-item.current").removeClass('current');
			$(".service-navigation__nav-item.current").removeClass('current');

			var this_tab = $(this).data("tab");

			$(".services__nav-item[data-tab=" + this_tab + "]").addClass('current');
			$(".service-navigation__nav-item[data-tab=" + this_tab + "]").addClass('current');


			$(".services__service").addClass('hide');
			$(".services__service[data-tab='" + $(this).data('tab') + "']").removeClass('hide');





			$('.services__slider').slick("unslick");
			$('.services__slider-2').slick("unslick");
			$('.services__slider').slick({
				arrows: false,
				dots: false,
				swipe: false,
				slidesToShow: 3,
				slidesToScroll: 3,
				responsive: [
					{
						breakpoint: 841,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2
						}
					},
					{
						breakpoint: 641,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1
						}
					}
				]
			});
			$('.services__slider-2').slick({
				arrows: false,
				dots: false,
				swipe: false,
				slidesToShow: 1,
				slidesToScroll: 1
			});

			$('.services__advantages .container')
				.html($(".services__nav-item[data-tab=" + this_tab + "]")
					.find('.services__nav-item-hide').html());
		});




		$(window).scroll(function () {
			var pos_start = $(".services__nav").offset().top + $(".services__nav").innerHeight() - 120,
				pos_end = $(".services").offset().top + $(".services").innerHeight();

			if ($(window).scrollTop() > pos_start && $(window).scrollTop() < pos_end) {
				$(".service-navigation").css("top", $("header").innerHeight() + "px");
			} else {
				$(".service-navigation").css("top", "0px");
			}
		});

	}




	$('.services__slider-new').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		fade: true,
		asNavFor: '.services__slider-new-nav'
	});
	$('.services__slider-new-nav').slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		asNavFor: '.services__slider-new',
		centerMode: true,
		arrows: false,
		focusOnSelect: true
	});


	//SLIDERS

	$(' .page-cases-slider').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		fade: true,
		asNavFor: '.page-cases-slider-nav'
	});
	$('.page-cases-slider-nav').slick({
		infinite: true,
		slidesToShow: 6,
		slidesToScroll: 1,
		asNavFor: '.page-cases-slider',
		arrows: false,
		centerMode: true,
		focusOnSelect: true,
		responsive: [
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 5,
				},
				breakpoint: 425,
				settings: {
					slidesToShow: 4,
				}
			}
		]
	});



	//4

	$('.page-cases-slider-4-item').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		infinite: true,
		fade: true,
		asNavFor: '.page-cases-slider-4-item-nav'
	});

	$('.page-cases-slider-4-item-nav').slick({
		infinite: true,
		slidesToShow: 4,
		slidesToScroll: 1,
		asNavFor: '.page-cases-slider-4-item',
		arrows: false,
		centerMode: true,
		focusOnSelect: true,
		responsive: [
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 5,
				},
				breakpoint: 425,
				settings: {
					slidesToShow: 4,
				}
			}
		]
	});



	//reviews 

	$('.reviews-slider').slick({
		dots: false,
		slidesToShow: 2,
		slidesToScroll: 2,
		adaptiveHeight: true,
		responsive: [
			{
				breakpoint: 641,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]

	});

	// cases

	$('.cases-slider').slick({
		dots: false,
		slidesToShow: 3,
		slidesToScroll: 3,
		adaptiveHeight: true,
		responsive: [
			{
				breakpoint: 641,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	});




	//SLIDERS




	// SERVICES END


	//TEAM START
	function pad(num, size) {
		var s = num + "";
		while (s.length < size) s = "0" + s;
		return s;
	}

	if ($(".footer-form__select")) {
		$(".footer-form__select").selectize({
			create: true
		});
	}

	if ($(".team__slider").length) {

		var slides_count = $('.team__slider .team__slider-item').length;
		$(".team__slide-num").html('01/' + pad(slides_count, 2));

		$('.team__slider').slick({
			arrows: false,
			dots: false,
			slidesToShow: 1,
			slidesToScroll: 1
		});

		$(".team__prev").click(function () {
			$('.team__slider').slick('slickPrev');
		});
		$(".team__next").click(function () {
			$('.team__slider').slick('slickNext');
		});

		$('.team__slider').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
			$(".team__slide-num").html(pad(nextSlide + 1, 2) + '/' + pad(slides_count, 2));
		});

	}
	//TEAM END

	//CLIENT START
	if ($(".clients__slider").length) {
		var slides_count1 = $('.clients__slider .clients__item').length;
		$(".clients__slide-num").html('01/' + pad(slides_count1, 2));

		$('.clients__slider').slick({
			arrows: false,
			dots: false,
			slidesToShow: 1,
			slidesToScroll: 1,
			responsive: [
				{
					breakpoint: 800,
					settings: {
						adaptiveHeight: true
					}
				}
			]
		});

		$(".clients__prev").click(function () {
			$('.clients__slider').slick('slickPrev');
		});
		$(".clients__next").click(function () {
			$('.clients__slider').slick('slickNext');
		});

		$('.clients__slider').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
			$(".clients__slide-num").html(pad(nextSlide + 1, 2) + '/' + pad(slides_count1, 2));
		});
	}

	if ($(".reviews__slider").length) {
		var slides_count2 = $('.reviews__slider .reviews__item').length;
		$(".reviews__slide-num").html('01/' + pad(slides_count2, 2));

		$('.reviews__slider').slick({
			arrows: false,
			dots: false,
			swipe: false,
			infinite: false,
			slidesToShow: 1,
			slidesToScroll: 1,
			asNavFor: '.reviews__nav'
		});
		$('.reviews__nav').slick({
			slidesToShow: 3,
			slidesToScroll: 1,
			infinite: false,
			asNavFor: '.reviews__slider',
			arrows: false,
			dots: false,
			swipe: false,
			centerMode: true,
			focusOnSelect: true
		});

		$(".reviews__prev").click(function () {
			$('.reviews__slider').slick('slickPrev');
		});
		$(".reviews__next").click(function () {
			$('.reviews__slider').slick('slickNext');
		});

		$('.reviews__slider').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
			$(".reviews__slide-num").html(pad(nextSlide + 1, 2) + '/' + pad(slides_count2, 2));
		});
	}
	//CLIENT END

	//WORKSHOP START
	if ($(".working").length) {
		$('.working__bottom-slider').slick({
			arrows: false,
			dots: false,
			swipe: false,
			slidesToShow: 3,
			slidesToScroll: 1,
			responsive: [
				{
					breakpoint: 501,
					settings: {
						swipe: true,
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}
			]
		});
		$(".working__arrow-left").click(function () {
			$('.working__bottom-slider').slick('slickPrev');
		});
		$(".working__arrow-right").click(function () {
			$('.working__bottom-slider').slick('slickNext');
		});

		$(".working__bottom-item").click(function () {
			$(".working__top-item").css('background-image', $(this).css('background-image'));
		});
	}
	//WORKSHOP END

	//MENU START
	$(".header__burger").click(function () {
		$(".header__menu").slideToggle();
		$(this).toggleClass('open');
	});
	$(".header_common__burger").click(function () {
		$(".header_common__menu").slideToggle();
		$(this).toggleClass('open');
	});

	$(".header__item a").click(function () {
		$(".header__burger").toggleClass('open');
		$(".header__menu").slideToggle();
	});
	$(".header_common__item a").click(function () {
		$(".header_common__burger").toggleClass('open');
		$(".header_common__menu").slideToggle();
	});
	//MENU END

	//QUIZ START
	$(".popup__quiz .popup__answer-1 .popup__select:not([name=marka])").selectize({
		create: true
	});
	$(".popup__quiz .popup__answer-1 .popup__select[name=marka]").selectize({
		create: true,
		onChange: function () {
			var current_car = $('.popup__quiz [name=marka] option:selected').val();
			$('.popup__quiz [data-select-model]').css('display', 'none');
			$('.popup__quiz [data-select-model="' + current_car + '"]').css('display', 'block');
		}
	});

	function quiz(next_quest) {
		if (next_quest < 5) {
			$(".popup__quiz .popup__answer").addClass("hide");
			$(".popup__quiz .popup__answer-" + next_quest).removeClass("hide");

			$(".popup__quiz .popup__left").data('stage', next_quest);

			$(".popup__quiz .popup__question").html($(".popup__quiz .popup__answer-" + next_quest).data('question'));
			$(".popup__quiz .popup__person-text").html($(".popup__quiz .popup__answer-" + next_quest).data('descr'));

			$(".popup__quiz .popup__progress").removeClass("popup__progress2 popup__progress3 popup__progress4");

			for (var i = 0; i < (next_quest - 1); i++) {
				$(".popup__quiz .popup__progress").addClass("popup__progress" + (next_quest - i));
			}
		} else {
			$(".popup__quiz .popup__top").addClass("hide");
			$(".popup__quiz .popup__end").removeClass("hide");

			$(".popup__quiz .popup__end-right-img").css("background-image", $(".popup__quiz .popup__radio input:checked ~ .popup__radio-img")
				.css("background-image"));
			$(".popup__quiz .popup__end-right-gift").html($(".popup__quiz .popup__radio input:checked ~ .popup__radio-text")
				.html());
		}
	}

	$(".popup__quiz .popup__next").click(function () {
		var next = $(".popup__quiz .popup__left").data("stage") + 1;
		if ((next == 3 && $(".popup__quiz .popup__answer-2 .popup__checkbox input:checked").length > 0) ||
			(next == 4 && $(".popup__quiz .popup__answer-3 .popup__checkbox input:checked").length > 0) ||
			(next == 5 && $(".popup__quiz .popup__answer-4 .popup__radio input:checked").length > 0) || next == 2) {
			quiz(next);
		};

	});
	$(".popup__quiz .popup__progress-btn ").click(function () {
		var next = $(this).data("stage");
		if ($(".popup__quiz .popup__progress").hasClass("popup__progress" + (next + 1))) {
			quiz(next);
		}
	});

	$(".popup__end-select").selectize({
		create: true
	});
	//QUIZ END



	if (window.location.hash == '#polirovka') {
		//удаляем все .current у ссылока на табы
		$(".service-navigation__nav-item.current").removeClass('current');
		$(".services__nav-item.current").removeClass('current');
		//прячем все остальные
		$('[class *= "-tabContent"]').addClass('hide')
		//открываем нужный таб
		$('.polirovka-tabContent').removeClass('hide')

		//добавляем .current нужной ссылке в навигации
		$('.polirovka-nav').addClass('current')
		$('.polirovka').addClass('current')
	};

	if (window.location.hash == '#plenka') {
		//удаляем все .current у ссылока на табы
		$(".service-navigation__nav-item.current").removeClass('current');
		$(".services__nav-item.current").removeClass('current');
		//прячем все остальные
		$('[class *= "-tabContent"]').addClass('hide')
		//открываем нужный таб
		$('.plenka-tabContent').removeClass('hide')



		//добавляем .current нужной ссылке в навигации
		$('.plenka-nav').addClass('current')
		$('.plenka').addClass('current')
	};

	if (window.location.hash == '#protect') {
		//удаляем все .current у ссылока на табы
		$(".service-navigation__nav-item.current").removeClass('current');
		$(".services__nav-item.current").removeClass('current');
		//прячем все остальные
		$('[class *= "-tabContent"]').addClass('hide')
		//открываем нужный таб
		$('.protect-tabContent').removeClass('hide')



		//добавляем .current нужной ссылке в навигации
		$('.protect-nav').addClass('current')
		$('.protect').addClass('current')
	};

	if (window.location.hash == '#chemical') {
		//удаляем все .current у ссылока на табы
		$(".service-navigation__nav-item.current").removeClass('current');
		$(".services__nav-item.current").removeClass('current');
		//прячем все остальные
		$('[class *= "-tabContent"]').addClass('hide')
		//открываем нужный таб
		$('.chemical-tabContent').removeClass('hide')



		//добавляем .current нужной ссылке в навигации
		$('.chemical-nav').addClass('current')
		$('.chemical').addClass('current')
	};

	if (window.location.hash == '#other') {
		//удаляем все .current у ссылока на табы
		$(".service-navigation__nav-item.current").removeClass('current');
		$(".services__nav-item.current").removeClass('current');
		//прячем все остальные
		$('[class *= "-tabContent"]').addClass('hide')
		//открываем нужный таб
		$('.other-tabContent').removeClass('hide')



		//добавляем .current нужной ссылке в навигации
		$('.other-nav').addClass('current')
		$('.other').addClass('current')
	};


	$('#open-plenka').click(function () {
		//удаляем все .current у ссылока на табы
		$(".service-navigation__nav-item.current").removeClass('current');
		$(".services__nav-item.current").removeClass('current');
		//прячем все остальные
		$('[class *= "-tabContent"]').addClass('hide')
		//открываем нужный таб
		$('.plenka-tabContent').removeClass('hide')



		//добавляем .current нужной ссылке в навигации
		$('.plenka-nav').addClass('current')
		$('.plenka').addClass('current')
	})

	$('#open-protect').click(function () {
		//удаляем все .current у ссылока на табы
		$(".service-navigation__nav-item.current").removeClass('current');
		$(".services__nav-item.current").removeClass('current');
		//прячем все остальные
		$('[class *= "-tabContent"]').addClass('hide')
		//открываем нужный таб
		$('.protect-tabContent').removeClass('hide')



		//добавляем .current нужной ссылке в навигации
		$('.protect-nav').addClass('current')
		$('.protect').addClass('current')
	})

	// MAP
	ymaps.ready(init);
	function init() {
		var myMap = new ymaps.Map("map__map", {
			center: [60.06617, 30.30133],
			zoom: 17
		});
		var myPlacemark = new ymaps.Placemark([60.06617, 30.30233], {}, {
			iconLayout: 'default#image',
			iconImageHref: 'img/map-logo.png',
			iconImageSize: [72, 102],
			iconImageOffset: [-36, -102]
		});

		myMap.geoObjects.add(myPlacemark);
	}









	//popup
	var top_wrap = 0;
	var popup = '';

	$("[data-popup-show]").click(function () {
		if (!$(this).hasClass("unactive")) {
			top_wrap = $(document).scrollTop();
			var popup_name = $(this).data('popup-show');
			popup = $(".popup[data-popup=" + popup_name + "]");

			open_popup(popup);
		}
	});
	$("[data-popup-change]").click(function () {
		close_popup();

		top_wrap = $(document).scrollTop();
		var popup_name = $(this).data('popup-show');
		popup = $(".popup[data-popup=" + popup_name + "]");

		open_popup(popup);
	});

	$(window).resize(function () {
		change_type_popup_for_height();
	});

	$(".popup, .popup .popup__close").click(function () {
		close_popup();
	})

	$(".popup .popup__wrapblock, .popup .popup__wrapblock *").click(function (event) {
		event.stopPropagation();
	})

	function open_popup(popup, popup_cont, popup_btn) {
		$(".wrap").addClass("open-popup");
		$(".wrap").css("top", "-" + top_wrap + "px");

		popup.css("display", "flex").hide().fadeIn();

		change_type_popup_for_height();
		$(window).scrollTop(0);
	}

	function change_popup(popup) {
		close_popup();
		setTimeout(function () {
			open_popup(popup);
		}, 500)
	}

	function close_popup() {
		popup.fadeOut();
		setTimeout(function () {
			$(".wrap").removeClass("open-popup");
			$(".wrap").removeClass("overflow-popup");
			$(".header_common").removeClass("overflow-popup");
			$(".wrap").css("top", 0);
			$(document).scrollTop(top_wrap);
			$(window).trigger('resize');
		}, 300)
	}

	function change_type_popup_for_height() {
		if ($(".wrap").hasClass("open-popup")) {
			if ($(window).height() < (popup.find(".popup__wrapblock").not(".hide").height() + 40)) {
				popup.addClass("big-popup");
			} else {
				popup.removeClass("big-popup");
			}
			check_overflow_for_popup();
		}
	}

	function check_overflow_for_popup() {
		$(".wrap").removeClass("overflow-popup");
		$(".header_common").removeClass("overflow-popup");
		if (!get_scroll('Height')) {
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
		return /CSS/.test(d.compatMode) ? (e[c] < e[a]) : (b[c] < b[a])
	};


	$('.send_form').submit(function (e) {
		e.preventDefault();

		var ltype = $(this).find("input[name=ltype]").val() ? $(this).find("input[name=ltype]").val() : '';
		var name = $(this).find("input[name=name]").val() ? $(this).find("input[name=name]").val() : '';
		var phone = $(this).find("input[name=phone]").val() ? $(this).find("input[name=phone]").val() : '';
		var date = $(this).find("input[name=date]").val() ? $(this).find("input[name=date]").val() : '';
		var time = $(this).find("input[name=time]").val() ? $(this).find("input[name=time]").val() : '';
		var topic = $(this).find("input[name=topic]").val() ? $(this).find("input[name=topic]").val() : '';
		var specialis = $(this).find("[name=specialis]").val() ? $(this).find("[name=specialis]").val() : '';
		var other = '';


		if ($(this).parents('.popup__quiz').length > 0) {
			var $popup__quiz = $(this).parents('.popup__quiz');
			other = '<br/>';
			other = 'Какой у вас автомобиль: ';
			other += ($popup__quiz.find('.popup__answer-1 .popup__quiz-input').val() || 'Не задано') + '<br/>';

			var other__2 = '';
			$popup__quiz.find('.popup__answer-2 .popup__checkbox [type="checkbox"]').each(function () {
				if ($(this).prop('checked')) {
					other__2 += $(this).nextAll('.popup__checkbox-text:eq(0)').html() + ', ';
				}
			})
			other += 'Какие элементы авто нуждаются в уходе: ';
			other += (other__2 ? other__2.slice(0, -2) : 'Ничего не выбрано') + '<br/>';


			var other__3 = '';
			$popup__quiz.find('.popup__answer-3 .popup__col').each(function () {
				var other__3_col = '';
				$(this).find('.popup__checkbox [type="checkbox"]').each(function () {
					if ($(this).prop('checked')) {
						other__3_col += $(this).nextAll('.popup__checkbox-text:eq(0)').html() + ', ';
					}
				})
				if (other__3_col) {
					other__3 = $(this).find('.popup__col-name').html() + ': ' + other__3_col.slice(0, -2) + '<br/>';
				}
			})
			other += 'Какие услуги по вашим ожиданиям вам потребуются: ';
			other += other__3 || 'Ничего не выбрано<br/>';

			var other__4 = '';
			$popup__quiz.find('.popup__answer-4 .popup__radio [type="radio"]').each(function () {
				if ($(this).prop('checked')) {
					other__4 += $(this).nextAll('.popup__radio-text:eq(0)').html();
				}
			})
			other += 'Выберите свой подарок: ';
			other += other__4 || 'Ничего не выбрано<br/>';
		}

		if ($(this).parents('.popup__complex').length > 0) {
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

		if (popup) {
			close_popup();
		}

		top_wrap = $(document).scrollTop();

		setTimeout(function () {

			var popup_name = 'thanks';
			popup = $(".popup[data-popup=" + popup_name + "]");

			open_popup(popup);

		}, 500)

	});

	// NEW POPUP RELATIONS

	$("[data-service-title]").click(function () {
		var title = $(this).data('service-title');
		var ltype = $(this).data('service-ltype');
		var desc = $(this).data('service-desc');

		if (ltype == 'services__box-item') {
			ltype = "Прочие услуги:" + $(this).parent().prev().find('.current').text();
		}

		$(".popup__services .popup__title").html(title);
		$(".popup__services [name='ltype']").val(ltype);
		$(".popup__services .popup__desc").html(desc);
	})

	$(".complex__btn").click(function () {
		var list = '';
		$(".popup__complex [type=checkbox]").remove();
		$(".complex__services [type=checkbox]").each(function () {
			if ($(this).prop('checked')) {
				list += '- ' + $(this).next().next().html() + '<br>';
				$(".popup__complex form").append($(this));
			}

		})
		$(".popup__complex .popup__desc").html(list);
	})

	$(".popup__bonus-img, .popup__bonus-title").click(function () {
		$(".popup__bonus-item").removeClass('current');
		$(this).parent().addClass('current');
	})




	$('.wash_table__col1').click(function () { 
		$('.wash_table__col1').addClass('w-active')
		$('.wash_table__col2').removeClass('w-active')
		$('.wash_table__col3').removeClass('w-active')
		$('.wash_table__col4').removeClass('w-active')
	 })

	 	$('.wash_table__col2').click(function () { 
		$('.wash_table__col2').addClass('w-active')
		$('.wash_table__col1').removeClass('w-active')
		$('.wash_table__col3').removeClass('w-active')
		$('.wash_table__col4').removeClass('w-active')
	 })

	 	$('.wash_table__col3').click(function () { 
		$('.wash_table__col3').addClass('w-active')
		$('.wash_table__col2').removeClass('w-active')
		$('.wash_table__col1').removeClass('w-active')
		$('.wash_table__col4').removeClass('w-active')
	 })

	 	$('.wash_table__col4').click(function () { 
		$('.wash_table__col4').addClass('w-active')
		$('.wash_table__col2').removeClass('w-active')
		$('.wash_table__col3').removeClass('w-active')
		$('.wash_table__col1').removeClass('w-active')
	 })

	 








});





window.onload = function () {
	//scrollUp
	const offset = 450
	const scrollUp = document.querySelector('.scroll-up')
	const scrollUpSvgPath = document.querySelector('.scroll-up__path')
	const pathLength = scrollUpSvgPath.getTotalLength();
	scrollUpSvgPath.style.strokeDasharray = `${pathLength} ${pathLength}`
	scrollUpSvgPath.style.transition = 'stroke-dashoffset 20ms'

	const getTop = () => window.pageYOffset || document.documentElement.scrollTop;

	//updateDashOffset

	const updateDashOffset = () => {
		const height = document.documentElement.scrollHeight - window.innerHeight
		const dashoffset = pathLength - (getTop() * pathLength / height)

		scrollUpSvgPath.style.strokeDashoffset = dashoffset;
	}


	//onScroll
	window.addEventListener('scroll', () => {
		updateDashOffset()
		if (getTop() > offset) {
			scrollUp.classList.add('scroll-up--active')
		} else {
			scrollUp.classList.remove('scroll-up--active')
		}
	})


	//click
	scrollUp.addEventListener('click', () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		})
	})

}


function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}