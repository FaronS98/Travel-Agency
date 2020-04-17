$(document).ready(function() {
	loadInitFunction();
});

function loadInitFunction() {
	submitContactForm();
	loadOffersData();
	updateModalData();
}

function submitContactForm() {
	$('#submit-contact-form-button').on('click', function(event) {
		event.preventDefault();
		
		const $button = $('#submit-contact-form-button');
		const $wrapper = $button.closest('#question-form-wrapper');
		const $alert = $wrapper.find('#submit-message');

		$button.hide();
		$alert.show();

		$('#question-form-wrapper input').each(function() {
			this.value = '';
		})
	});
}

function loadOffersData() {
	$.getJSON( "../data/offers.json", function(response) {
		const offers = response;
		let html = '';

		offers.forEach(offer => {
			html += `
				<div class="offer" data-toggle="modal" data-target="#mymodal" offer-id="${offer.id}">
					<img src=${offer.imageUrl}>
					<h2>${offer.country}</h2>
					<p column row--horizontal-center>${offer.description}</p>
					<h4>${offer.price}zł/doba</h3>
				</div>
			`
		});

		$('#offers-container').append(html);
	});
}

function updateModalData() {
	$(document).on('click', '.offer', function(){
		const offer = this;
		const id = parseInt(offer.getAttribute('offer-id'));		

		$.getJSON( "../data/offers.json", function(response) {
			const offers = response;

			
		
			offers.filter(offer => {
			var adults=[]
			var childs=[]
			var days=[]
			for(var i= offer.adultsNumberMin; i<=offer.adultsNumberMax; i++)
			{
					adults.push(i)
			}
			for(var i= offer.childsNumberMin; i<=offer.childsNumberMax; i++)
			{
					childs.push(i)
			}

			for(var i= offer.daysMin; i<=offer.daysMax; i++)
			{
					days.push(i)
			}
				if (offer.id === id) {
					$(`#modal-name`).text(offer.name);
					$('#modal-description').text(offer.description);
					$('#modal-country').text(`Kraj: ${offer.country}`);
					$('#modal-city').text(`Miasto: ${offer.city}`);
					$('#modal-months').text(`Terminy dostępne w miesiącach: ${offer.months}`);
					$('#modal-adultsNumber').text(`Liczba dorosłych: ${offer.adultsNumberMin} do ${offer.adultsNumberMax} to jest ${adults}`);
					$('#modal-childNumber').text(`Liczba dzieci:${offer.childsNumberMin} do ${offer.childsNumberMax} to jest ${childs}`);
					$('#modal-days').text(`Liczba dni pobytu: ${offer.daysMin} do ${offer.daysMax} to jest ${days}`)
				}
			});

		});
	})
}