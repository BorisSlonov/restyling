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
		if(h_block > mh) {
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
	var tePhone = '+7 (999) 999-99-99?9';

	// format phone pasted from clipboard
	$("[name=phone]").each(function (i, obj) {
		let myElement = obj;
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





	// $('#services__slider-3-new').slick({
	// 	arrows: true,
	// 	dots: false,
	// 	slidesToShow: 1,
	// 	slidesToScroll: 1,
	// 	responsive: [
	// 		{
	// 			breakpoint: 841,
	// 			settings: {
	// 				slidesToShow: 2,
	// 				slidesToScroll: 2
	// 			}
	// 		},
	// 		{
	// 			breakpoint: 641,
	// 			settings: {
	// 				slidesToShow: 1,
	// 				slidesToScroll: 1
	// 			}
	// 		}
	// 	]
	// });



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

	$('.services__slider-new').slick('setPosition');

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







});