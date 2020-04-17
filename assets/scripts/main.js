$(document).ready(() => {
	loadInitFunction();
});

function loadInitFunction() {
	submitContactForm();
	loadOffersData();
	updateModalData();
	filterOffers();
}

function submitContactForm() {
	$('#submit-contact-form-button').on('click', (event) => {
		event.preventDefault();
		
		const $button = $('#submit-contact-form-button');
		const $wrapper = $button.closest('#question-form-wrapper');
		const $alert = $wrapper.find('#submit-message');

		$button.hide();
		$alert.show();

		$('#question-form-wrapper input').each(() => {
			this.value = '';
		})
	});
}

function loadOffersData() {
	$.getJSON( "../data/offers.json", (response) => {
		const offers = response;
		let html = '';

		offers.forEach((offer) => {
			html += getOfferHtml(offer);
		});

		$('#offers-container').append(html);
	});
}

function updateModalData() {
	$(document).on('click', '.offer', function() {
		const offer = this;
		const id = parseInt(offer.getAttribute('offer-id'));

		$.getJSON( "../data/offers.json", (response) => {
			const offers = response;

			offers.filter((offer) => {
				if (offer.id === id) {
					$(`#modal-name`).text(offer.name);
					$('#modal-description').text(offer.description);
					$('#modal-country').text(`Kraj: ${offer.country}`);
					$('#modal-city').text(`Miasto: ${offer.city}`);
					$('#modal-months').text(`Terminy dostępne w miesiącach: ${offer.months}`);
					$('#modal-adultsNumber').text(`Liczba dorosłych: ${offer.adultsNumberMin} do ${offer.adultsNumberMax}`);
					$('#modal-childNumber').text(`Liczba dzieci:${offer.childsNumberMin} do ${offer.childsNumberMax}`);
					$('#modal-days').text(`Liczba dni pobytu: ${offer.daysMin} do ${offer.daysMax}`);
					$('#modal-image').attr('src', offer.imageUrl);
				}
			});
		});
	})
}

function getOfferHtml(offer) {
	return `
		<div class="offer" data-toggle="modal" data-target="#mymodal" offer-id="${offer.id}">
			<img src=${offer.imageUrl}>
			<h2>${offer.country}</h2>
			<p column row--horizontal-center>${offer.description}</p>
			<h4>${offer.price}zł/doba</h3>
		</div>`;
}

function checkOfferCondition(offer) {
	const $form = $('#filter-form');
	const type = $form.find('select#type').val();
	const direction = $form.find('select#direction').val();
	const price = $form.find('input[name="price"]').val() === '' ? 200 : parseInt($form.find('input[name="price"]').val());
	const mature = $form.find('input[name="mature"]').val() === '' ? 1 : parseInt($form.find('input[name="mature"]').val());
	const kids = $form.find('input[name="kids"]').val() === '' ? 1 : parseInt($form.find('input[name="kids"]').val());
	const time = $form.find('input[name="time"]').val() === '' ? 1 : parseInt($form.find('input[name="time"]').val());

	return type === offer.type.toLowerCase().replace('ó', 'o') &&
		direction === offer.country.toLowerCase().replace('ł', 'l') && 
		price <= parseInt(offer.price) &&
		mature >= parseInt(offer.adultsNumberMin) &&
		mature <= parseInt(offer.adultsNumberMax) &&
		kids >= parseInt(offer.childsNumberMin) &&
		kids <= parseInt(offer.childsNumberMax) && 
		time >= parseInt(offer.daysMin) &&
		time <= parseInt(offer.daysMax);
}

function filterOffers() {
	$('#filter-search-button').on('click', (event) => {
		event.preventDefault();		
		$('#offers-container').empty();

		$.getJSON( "../data/offers.json", (response) => {
			const offers = response;			
			let html = '';
	
			offers.filter((offer) => {
				const displayOffer = checkOfferCondition(offer);

				if (displayOffer === true) {
					html += getOfferHtml(offer)
				}
			});
	
			$('#offers-container').append(html);
		});
	});
}
