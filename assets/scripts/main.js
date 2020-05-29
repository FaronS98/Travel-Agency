$(document).ready(() => {
	loadInitFunction();
});

function loadInitFunction() {
	submitContactForm();
	loadOffersData();
	loadVisitedOffersData();
	loadCartOffersData();
	updateModalData();
	filterOffers();
	setOfferVisited();
	setOfferInCart();
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

function loadVisitedOffersData() {
	$.getJSON( "../data/offers.json", (response) => {
		const offers = response;
		let html = '';
		const values = JSON.parse(sessionStorage.getItem("offers"));

		offers.forEach((offer) => {
			return values.includes(offer.id) ? html += getOfferHtml(offer) : '';
		});

		$('#visited-container').append(html);
	});
}

function loadCartOffersData() {
	$.getJSON( "../data/offers.json", (response) => {
		const offers = response;
		let html = '';
		const values = JSON.parse(sessionStorage.getItem("cart"));

		offers.forEach((offer) => {
			return values.includes(offer.id) ? html += getOfferHtml(offer) : '';
		});

		$('#cart-offers-container').append(html);
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
					$('div#mymodal').attr('data-modal-id', offer.id);
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

function setOfferVisited(){
	$(document).on('click', '.offer', function() {
		const offer = this;
		const id = parseInt(offer.getAttribute('offer-id'));		
		const currentValues = JSON.parse(sessionStorage.getItem("offers"));
		const array = [id];

		if (currentValues === null) {
			sessionStorage.setItem('offers', JSON.stringify(array));
		} else {
			const values = JSON.parse(sessionStorage.getItem("offers"));
			
			values.map(item => {
				array.push(item);
			})
			const uniq =  [...new Set(array)];
			sessionStorage.setItem('offers', JSON.stringify(uniq));
		}
	})
}

function setOfferInCart() {
	$('.button-pay').on('click', function() {
		const id = parseInt($('div#mymodal').attr('data-modal-id'));		
		const currentValues = JSON.parse(sessionStorage.getItem("cart"));
		const array = [id];

		if (currentValues === null) {
			sessionStorage.setItem('cart', JSON.stringify(array));
		} else {
			const values = JSON.parse(sessionStorage.getItem("cart"));
			
			values.map(item => {
				array.push(item);
			})
			const uniq =  [...new Set(array)];
			sessionStorage.setItem('cart', JSON.stringify(uniq));
		}
	})
}