$(document).ready(function() {


	//Создаем скрытые поля в форме
		$("form").append("<input type='hidden' name='utm_source' class='utm_source' value='none' />");
		$("form").append("<input type='hidden' name='utm_campaign' class='utm_campaign' value='none' />");
		$("form").append("<input type='hidden' name='utm_content' class='utm_content' value='none' />");
		$("form").append("<input type='hidden' name='utm_term' class='utm_term' value='none' />");
		$("form").append("<input type='hidden' name='cid' class='cid' value='cid' />");
		$("form").append("<input type='hidden' name='page' class='page' value=' "+document.location.pathname+" ' />");

	setTimeout(setCID,10000);
	setTimeout(utm_form,10000); // это в начало дока под document.ready

	$("form").submit(function() {


	    var form = $(this).closest("form");
	    var phone = $(form).find("[name=phone]").val();
	    if (phone.indexOf("_") != -1 || phone == "" || phone == undefined) {return false;} 
	    data = $(form).serialize();

	    if($(this).parents('popup__quiz')){
				var $popup__quiz = $(this).parents('.popup__quiz');
				other = 'Какой у вас автомобиль: ';
				other += ($popup__quiz.find('.popup__answer-1 .popup__quiz-input').val() || 'Не задано') + "\n";

				var other__2 = '';
				$popup__quiz.find('.popup__answer-2 .popup__checkbox [type="checkbox"]').each(function(){
					if($(this).prop('checked')){
						other__2 += $(this).nextAll('.popup__checkbox-text:eq(0)').html() + ', ';
					}
				})
				other += 'Какие элементы авто нуждаются в уходе: ';
				other += (other__2 ? other__2.slice(0, -2) : 'Ничего не выбрано') + "\n";


				var other__3 = '';
				$popup__quiz.find('.popup__answer-3 .popup__col').each(function(){
					var other__3_col = '';
					$(this).find('.popup__checkbox [type="checkbox"]').each(function(){
						if($(this).prop('checked')){
							other__3_col += $(this).nextAll('.popup__checkbox-text:eq(0)').html() + ', ';
						}
					})
					if(other__3_col){
						other__3 = $(this).find('.popup__col-name').html() + ': ' + other__3_col.slice(0, -2) + "\n";
					}
				})
				other += 'Какие услуги по вашим ожиданиям вам потребуются: ';
				other += other__3 || 'Ничего не выбрано';

				var other__4 = '';
				$popup__quiz.find('.popup__answer-4 .popup__radio [type="radio"]').each(function(){
					if($(this).prop('checked')){
						other__4 += $(this).nextAll('.popup__radio-text:eq(0)').html();
					}
				})
				other += 'Выберите свой подарок: ';
				other += other__4 || 'Ничего не выбрано';

				data += '&other=' + other;
			}

	    
	    dataLayer.push({'event': 'formSubmit'});
	    console.log(data);
	    leadCollect(data);

	});


	function setCID() {
	        if(ga!=undefined){
	        var tracker = ga.getAll()[0];
	        var cid = tracker.get('clientId');
	        $('.cid').each(function(index, el) {
	                $(el).val(cid);
	        });
	        }
	}

	function leadCollect(data) {
	        //var data = $(form).serialize();
	        $.ajax({
	                type: "post",
	                url: "/php/lead-collect.php",
	                data: data,
	                success: function() {
	                	console.log('lead-collect-ok')
	                }
	        });
	        return false;
	}


	function utm_form(){
		var utm_source = getUrlVars()["utm_source"];
		var utm_campaign = getUrlVars()["utm_campaign"];
		var utm_content = window.decodeURIComponent(getUrlVars()["utm_content"]);
		var utm_term = window.decodeURIComponent(getUrlVars()["utm_term"]);

		$('.utm_source').val(utm_source);
		$('.utm_campaign').val(utm_campaign);
		$('.utm_content').val(utm_content);
		$('.utm_term').val(utm_term);
	}

	function getUrlVars() {
	        var vars = [], hash;
	        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	                for(var i = 0; i < hashes.length; i++)
	                {
	                        hash = hashes[i].split('=');
	                        vars.push(hash[0]);
	                        vars[hash[0]] = hash[1];
	                }
	        return vars;
	}

});