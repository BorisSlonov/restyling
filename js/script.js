"use stict"




	// lazyYT

	; (function ($) {
		'use strict';

		function setUp($el, settings) {
			var width = $el.data('width'),
				height = $el.data('height'),
				ratio = ($el.data('ratio')) ? $el.data('ratio') : settings.default_ratio,
				id = $el.data('youtube-id'),
				padding_bottom,
				innerHtml = [],
				$thumb,
				thumb_img,
				loading_text = $el.text() ? $el.text() : settings.loading_text,
				youtube_parameters = $el.data('parameters') || '';

			ratio = ratio.split(":");

			// width and height might override default_ratio value
			if (typeof width === 'number' && typeof height === 'number') {
				$el.width(width);
				padding_bottom = height + 'px';
			} else if (typeof width === 'number') {
				$el.width(width);
				padding_bottom = (width * ratio[1] / ratio[0]) + 'px';
			} else {
				width = $el.width();

				// no width means that container is fluid and will be the size of its parent
				if (width == 0) {
					width = $el.parent().width();
				}

				padding_bottom = (ratio[1] / ratio[0] * 100) + '%';
			}

			//
			// This HTML will be placed inside 'lazyYT' container

			innerHtml.push('<div class="ytp-thumbnail">');

			// Play button from YouTube (exactly as it is in YouTube)
			innerHtml.push('<div class="ytp-large-play-button"');
			if (width <= 640) innerHtml.push(' style="transform: scale(0.563888888888889);"');
			innerHtml.push('>');
			innerHtml.push('<svg>');
			innerHtml.push('<path fill-rule="evenodd" clip-rule="evenodd" fill="#1F1F1F" class="ytp-large-play-button-svg" d="M84.15,26.4v6.35c0,2.833-0.15,5.967-0.45,9.4c-0.133,1.7-0.267,3.117-0.4,4.25l-0.15,0.95c-0.167,0.767-0.367,1.517-0.6,2.25c-0.667,2.367-1.533,4.083-2.6,5.15c-1.367,1.4-2.967,2.383-4.8,2.95c-0.633,0.2-1.316,0.333-2.05,0.4c-0.767,0.1-1.3,0.167-1.6,0.2c-4.9,0.367-11.283,0.617-19.15,0.75c-2.434,0.034-4.883,0.067-7.35,0.1h-2.95C38.417,59.117,34.5,59.067,30.3,59c-8.433-0.167-14.05-0.383-16.85-0.65c-0.067-0.033-0.667-0.117-1.8-0.25c-0.9-0.133-1.683-0.283-2.35-0.45c-2.066-0.533-3.783-1.5-5.15-2.9c-1.033-1.067-1.9-2.783-2.6-5.15C1.317,48.867,1.133,48.117,1,47.35L0.8,46.4c-0.133-1.133-0.267-2.55-0.4-4.25C0.133,38.717,0,35.583,0,32.75V26.4c0-2.833,0.133-5.95,0.4-9.35l0.4-4.25c0.167-0.966,0.417-2.05,0.75-3.25c0.7-2.333,1.567-4.033,2.6-5.1c1.367-1.434,2.967-2.434,4.8-3c0.633-0.167,1.333-0.3,2.1-0.4c0.4-0.066,0.917-0.133,1.55-0.2c4.9-0.333,11.283-0.567,19.15-0.7C35.65,0.05,39.083,0,42.05,0L45,0.05c2.467,0,4.933,0.034,7.4,0.1c7.833,0.133,14.2,0.367,19.1,0.7c0.3,0.033,0.833,0.1,1.6,0.2c0.733,0.1,1.417,0.233,2.05,0.4c1.833,0.566,3.434,1.566,4.8,3c1.066,1.066,1.933,2.767,2.6,5.1c0.367,1.2,0.617,2.284,0.75,3.25l0.4,4.25C84,20.45,84.15,23.567,84.15,26.4z M33.3,41.4L56,29.6L33.3,17.75V41.4z"></path>');
			innerHtml.push('<polygon fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" points="33.3,41.4 33.3,17.75 56,29.6"></polygon>');
			innerHtml.push('</svg>');
			innerHtml.push('</div>'); // end of .ytp-large-play-button

			innerHtml.push('</div>'); // end of .ytp-thumbnail

			// Video title (info bar)
			innerHtml.push('<div class="html5-info-bar">');
			innerHtml.push('<div class="html5-title">');
			innerHtml.push('<div class="html5-title-text-wrapper">');
			innerHtml.push('<a id="lazyYT-title-', id, '" class="html5-title-text" target="_blank" tabindex="3100" href="//www.youtube.com/watch?v=', id, '">');
			innerHtml.push(loading_text);
			innerHtml.push('</a>');
			innerHtml.push('</div>'); // .html5-title
			innerHtml.push('</div>'); // .html5-title-text-wrapper
			innerHtml.push('</div>'); // end of Video title .html5-info-bar

			$el.css({
				'padding-bottom': padding_bottom
			})
				.html(innerHtml.join(''));

			if (width > 640) {
				thumb_img = 'maxresdefault.jpg';
			} else if (width > 480) {
				thumb_img = 'sddefault.jpg';
			} else if (width > 320) {
				thumb_img = 'hqdefault.jpg';
			} else if (width > 120) {
				thumb_img = 'mqdefault.jpg';
			} else if (width == 0) { // sometimes it fails on fluid layout
				thumb_img = 'hqdefault.jpg';
			} else {
				thumb_img = 'default.jpg';
			}

			$thumb = $el.find('.ytp-thumbnail').css({
				'background-image': ['url(//img.youtube.com/vi/', id, '/', thumb_img, ')'].join('')
			})
				.addClass('lazyYT-image-loaded')
				.on('click', function (e) {
					e.preventDefault();
					if (!$el.hasClass('lazyYT-video-loaded') && $thumb.hasClass('lazyYT-image-loaded')) {
						$el.html('<iframe src="//www.youtube.com/embed/' + id + '?autoplay=1&' + youtube_parameters + '" frameborder="0" allowfullscreen></iframe>')
							.addClass('lazyYT-video-loaded');
					}
				});

			$.getJSON('//gdata.youtube.com/feeds/api/videos/' + id + '?v=2&alt=json', function (data) {
				$el.find('#lazyYT-title-' + id).text(data.entry.title.$t);
			});

		}

		$.fn.lazyYT = function (newSettings) {
			var defaultSettings = {
				loading_text: 'Loading...',
				default_ratio: '16:9',
				callback: null, // ToDO execute callback if given
				container_class: 'lazyYT-container'
			};
			var settings = $.extend(defaultSettings, newSettings);

			return this.each(function () {
				var $el = $(this).addClass(settings.container_class);
				setUp($el, settings);
			});
		};

	}(jQuery));


//masked-input

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var ua = navigator.userAgent,
		iPhone = /iphone/i.test(ua),
		chrome = /chrome/i.test(ua),
		android = /android/i.test(ua),
		caretTimeoutId;

	$.mask = {
		//Predefined character definitions
		definitions: {
			'9': "[0-9]",
			'a': "[A-Za-z]",
			'*': "[A-Za-z0-9]"
		},
		autoclear: true,
		dataName: "rawMaskFn",
		placeholder: '_'
	};

	$.fn.extend({
		//Helper Function for Caret positioning
		caret: function (begin, end) {
			var range;

			if (this.length === 0 || this.is(":hidden")) {
				return;
			}

			if (typeof begin == 'number') {
				end = (typeof end === 'number') ? end : begin;
				return this.each(function () {
					if (this.setSelectionRange) {
						this.setSelectionRange(begin, end);
					} else if (this.createTextRange) {
						range = this.createTextRange();
						range.collapse(true);
						range.moveEnd('character', end);
						range.moveStart('character', begin);
						range.select();
					}
				});
			} else {
				if (this[0].setSelectionRange) {
					begin = this[0].selectionStart;
					end = this[0].selectionEnd;
				} else if (document.selection && document.selection.createRange) {
					range = document.selection.createRange();
					begin = 0 - range.duplicate().moveStart('character', -100000);
					end = begin + range.text.length;
				}
				return { begin: begin, end: end };
			}
		},
		unmask: function () {
			return this.trigger("unmask");
		},
		mask: function (mask, settings) {
			var input,
				defs,
				tests,
				partialPosition,
				firstNonMaskPos,
				lastRequiredNonMaskPos,
				len,
				oldVal;

			if (!mask && this.length > 0) {
				input = $(this[0]);
				var fn = input.data($.mask.dataName)
				return fn ? fn() : undefined;
			}

			settings = $.extend({
				autoclear: $.mask.autoclear,
				placeholder: $.mask.placeholder, // Load default placeholder
				completed: null
			}, settings);


			defs = $.mask.definitions;
			tests = [];
			partialPosition = len = mask.length;
			firstNonMaskPos = null;

			$.each(mask.split(""), function (i, c) {
				if (c == '?') {
					len--;
					partialPosition = i;
				} else if (defs[c]) {
					tests.push(new RegExp(defs[c]));
					if (firstNonMaskPos === null) {
						firstNonMaskPos = tests.length - 1;
					}
					if (i < partialPosition) {
						lastRequiredNonMaskPos = tests.length - 1;
					}
				} else {
					tests.push(null);
				}
			});

			return this.trigger("unmask").each(function () {
				var input = $(this),
					buffer = $.map(
						mask.split(""),
						function (c, i) {
							if (c != '?') {
								return defs[c] ? getPlaceholder(i) : c;
							}
						}),
					defaultBuffer = buffer.join(''),
					focusText = input.val();

				function tryFireCompleted() {
					if (!settings.completed) {
						return;
					}

					for (var i = firstNonMaskPos; i <= lastRequiredNonMaskPos; i++) {
						if (tests[i] && buffer[i] === getPlaceholder(i)) {
							return;
						}
					}
					settings.completed.call(input);
				}

				function getPlaceholder(i) {
					if (i < settings.placeholder.length)
						return settings.placeholder.charAt(i);
					return settings.placeholder.charAt(0);
				}

				function seekNext(pos) {
					while (++pos < len && !tests[pos]);
					return pos;
				}

				function seekPrev(pos) {
					while (--pos >= 0 && !tests[pos]);
					return pos;
				}

				function shiftL(begin, end) {
					var i,
						j;

					if (begin < 0) {
						return;
					}

					for (i = begin, j = seekNext(end); i < len; i++) {
						if (tests[i]) {
							if (j < len && tests[i].test(buffer[j])) {
								buffer[i] = buffer[j];
								buffer[j] = getPlaceholder(j);
							} else {
								break;
							}

							j = seekNext(j);
						}
					}
					writeBuffer();
					input.caret(Math.max(firstNonMaskPos, begin));
				}

				function shiftR(pos) {
					var i,
						c,
						j,
						t;

					for (i = pos, c = getPlaceholder(pos); i < len; i++) {
						if (tests[i]) {
							j = seekNext(i);
							t = buffer[i];
							buffer[i] = c;
							if (j < len && tests[j].test(t)) {
								c = t;
							} else {
								break;
							}
						}
					}
				}

				function androidInputEvent(e) {
					var curVal = input.val();
					var pos = input.caret();
					if (oldVal && oldVal.length && oldVal.length > curVal.length) {
						// a deletion or backspace happened
						checkVal(true);
						while (pos.begin > 0 && !tests[pos.begin - 1])
							pos.begin--;
						if (pos.begin === 0) {
							while (pos.begin < firstNonMaskPos && !tests[pos.begin])
								pos.begin++;
						}
						input.caret(pos.begin, pos.begin);
					} else {
						var pos2 = checkVal(true);
						while (pos.begin < len && !tests[pos.begin])
							pos.begin++;

						input.caret(pos.begin, pos.begin);
					}

					tryFireCompleted();
				}

				function blurEvent(e) {
					checkVal();

					if (input.val() != focusText)
						input.change();
				}

				function keydownEvent(e) {
					if (input.prop("readonly")) {
						return;
					}

					var k = e.which || e.keyCode,
						pos,
						begin,
						end;
					oldVal = input.val();
					//backspace, delete, and escape get special treatment
					if (k === 8 || k === 46 || (iPhone && k === 127)) {
						pos = input.caret();
						begin = pos.begin;
						end = pos.end;

						if (end - begin === 0) {
							begin = k !== 46 ? seekPrev(begin) : (end = seekNext(begin - 1));
							end = k === 46 ? seekNext(end) : end;
						}
						clearBuffer(begin, end);
						shiftL(begin, end - 1);

						e.preventDefault();
					} else if (k === 13) { // enter
						blurEvent.call(this, e);
					} else if (k === 27) { // escape
						input.val(focusText);
						input.caret(0, checkVal());
						e.preventDefault();
					}
				}

				function keypressEvent(e) {
					if (input.prop("readonly")) {
						return;
					}

					var k = e.which || e.keyCode,
						pos = input.caret(),
						p,
						c,
						next;

					if (e.ctrlKey || e.altKey || e.metaKey || k < 32) {//Ignore
						return;
					} else if (k && k !== 13) {
						if (pos.end - pos.begin !== 0) {
							clearBuffer(pos.begin, pos.end);
							shiftL(pos.begin, pos.end - 1);
						}

						p = seekNext(pos.begin - 1);
						if (p < len) {
							c = String.fromCharCode(k);
							if (tests[p].test(c)) {
								shiftR(p);

								buffer[p] = c;
								writeBuffer();
								next = seekNext(p);

								if (android) {
									//Path for CSP Violation on FireFox OS 1.1
									var proxy = function () {
										$.proxy($.fn.caret, input, next)();
									};

									setTimeout(proxy, 0);
								} else {
									input.caret(next);
								}
								if (pos.begin <= lastRequiredNonMaskPos) {
									tryFireCompleted();
								}
							}
						}
						e.preventDefault();
					}
				}

				function clearBuffer(start, end) {
					var i;
					for (i = start; i < end && i < len; i++) {
						if (tests[i]) {
							buffer[i] = getPlaceholder(i);
						}
					}
				}

				function writeBuffer() { input.val(buffer.join('')); }

				function checkVal(allow) {
					//try to place characters where they belong
					var test = input.val(),
						lastMatch = -1,
						i,
						c,
						pos;

					for (i = 0, pos = 0; i < len; i++) {
						if (tests[i]) {
							buffer[i] = getPlaceholder(i);
							while (pos++ < test.length) {
								c = test.charAt(pos - 1);
								if (tests[i].test(c)) {
									buffer[i] = c;
									lastMatch = i;
									break;
								}
							}
							if (pos > test.length) {
								clearBuffer(i + 1, len);
								break;
							}
						} else {
							if (buffer[i] === test.charAt(pos)) {
								pos++;
							}
							if (i < partialPosition) {
								lastMatch = i;
							}
						}
					}
					if (allow) {
						writeBuffer();
					} else if (lastMatch + 1 < partialPosition) {
						if (settings.autoclear || buffer.join('') === defaultBuffer) {
							// Invalid value. Remove it and replace it with the
							// mask, which is the default behavior.
							if (input.val()) input.val("");
							clearBuffer(0, len);
						} else {
							// Invalid value, but we opt to show the value to the
							// user and allow them to correct their mistake.
							writeBuffer();
						}
					} else {
						writeBuffer();
						input.val(input.val().substring(0, lastMatch + 1));
					}
					return (partialPosition ? i : firstNonMaskPos);
				}

				input.data($.mask.dataName, function () {
					return $.map(buffer, function (c, i) {
						return tests[i] && c != getPlaceholder(i) ? c : null;
					}).join('');
				});


				input
					.one("unmask", function () {
						input
							.off(".mask")
							.removeData($.mask.dataName);
					})
					.on("focus.mask", function () {
						if (input.prop("readonly")) {
							return;
						}

						clearTimeout(caretTimeoutId);
						var pos;

						focusText = input.val();

						pos = checkVal();

						caretTimeoutId = setTimeout(function () {
							if (input.get(0) !== document.activeElement) {
								return;
							}
							writeBuffer();
							if (pos == mask.replace("?", "").length) {
								input.caret(0, pos);
							} else {
								input.caret(pos);
							}
						}, 10);
					})
					.on("blur.mask", blurEvent)
					.on("keydown.mask", keydownEvent)
					.on("keypress.mask", keypressEvent)
					.on("input.mask paste.mask", function () {
						if (input.prop("readonly")) {
							return;
						}

						setTimeout(function () {
							var pos = checkVal(true);
							input.caret(pos);
							tryFireCompleted();
						}, 0);
					});
				if (chrome && android) {
					input
						.off('input.mask')
						.on('input.mask', androidInputEvent);
				}
				checkVal(); //Perform initial check for existing values
			});
		}
	});
}));







$(document).ready(function () {

	$('.js-lazyYT').lazyYT();



	setTimeout(function () {

		$('.services__nav-item').click(function () {

			$('.services__slider-new').slick('reinit');
			$('.services__slider-new-nav').slick('reinit');
		})

	}, 1000);


	$('.detail-phone-name').click(function () {

		$('.wash-phone-name').removeClass('phone-name-active')
		$('.wash-phone').removeClass('h-phone-active')

		$(this).toggleClass('phone-name-active')
		$('.detail-phone').toggleClass('h-phone-active')




	});

	$('.wash-phone-name').click(function () {

		$('.detail-phone-name').removeClass('phone-name-active')
		$('.detail-phone').removeClass('h-phone-active')


		$(this).toggleClass('phone-name-active')
		$('.wash-phone').toggleClass('h-phone-active')





	});






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
			lazyLoad: 'progressive',
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
			lazyLoad: 'progressive',
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
				lazyLoad: 'progressive',
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
				lazyLoad: 'progressive',
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
		lazyLoad: 'progressive',
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		fade: true,
		asNavFor: '.services__slider-new-nav'
	});
	$('.services__slider-new-nav').slick({
		lazyLoad: 'progressive',
		slidesToShow: 3,
		slidesToScroll: 1,
		asNavFor: '.services__slider-new',
		centerMode: true,
		arrows: false,
		focusOnSelect: true
	});


	//SLIDERS

	$(' .page-cases-slider').slick({
		lazyLoad: 'progressive',
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		fade: true,
		asNavFor: '.page-cases-slider-nav'
	});
	$('.page-cases-slider-nav').slick({
		lazyLoad: 'progressive',
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
		lazyLoad: 'progressive',
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		infinite: true,
		fade: true,
		asNavFor: '.page-cases-slider-4-item-nav'
	});

	$('.page-cases-slider-4-item-nav').slick({
		lazyLoad: 'progressive',
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
		lazyLoad: 'progressive',
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
		lazyLoad: 'progressive',
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
			lazyLoad: 'progressive',
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
			lazyLoad: 'progressive',
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
			lazyLoad: 'progressive',
			arrows: false,
			dots: false,
			swipe: false,
			infinite: false,
			slidesToShow: 1,
			slidesToScroll: 1,
			asNavFor: '.reviews__nav'
		});
		$('.reviews__nav').slick({
			lazyLoad: 'progressive',
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
			lazyLoad: 'progressive',
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





function lazyMap() {
	let flag = 0;

	window.addEventListener('scroll', function () {
		let scrollY = window.scrollY
		let mapOffset = document.getElementById('map__map').offsetTop
		if ((scrollY >= mapOffset - 500) && (flag = 0)) {


			// MAP
			ymaps.ready(init);
			function init() {
				var myMap = new ymaps.Map("map__map", {
					center: [59.998528, 30.268370],
					zoom: 17
				});
				var myPlacemark = new ymaps.Placemark([59.998528, 30.268370], {}, {
					iconLayout: 'default#image',
					iconImageHref: 'img/map-logo.png',
					iconImageSize: [72, 102],
					iconImageOffset: [-36, -102]
				});
				myMap.geoObjects.add(myPlacemark);
			}
		}
		flag = 1;

	});
}
lazyMap()

