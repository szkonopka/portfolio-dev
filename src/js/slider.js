'use strict';

class Slider {
	constructor() {
		this.currentSlide = 1;
		this.slides = document.querySelectorAll('.slide');
		this.slidesAmount = this.slides.length;
		this.rightBtn = document.querySelectorAll('#right')[0];
		this.leftBtn = document.querySelectorAll('#left')[0];
		this.counter = document.querySelectorAll('#works__counter')[0];
		this.container = document.querySelectorAll('.slides')[0];
		this.init();
	}

	init() {

		for(let i = 0; i < this.slidesAmount; i++) {
			Object.assign(this.slides[i].style, {
				'position': 'absolute',
				'left': (i * 100) + '%',
				'width': '100%',
				'transition': 'left ' + 1 + 's',
				'overflow': 'hidden'
			});
		}
		this.resizeContainer();
		this.counter.innerHTML = '<h2><span class="order">'+ this.currentSlide +'</span> | '+ this.slidesAmount +'</h2>';
	}

	resizeContainer() {
		let maxHeight = 0;
		for(let i = 0; i < this.slidesAmount; i++) {
			if(this.slides[i].offsetHeight > maxHeight){
				maxHeight = this.slides[i].offsetHeight;
			}
		}
		Object.assign(this.container.style, {
			'position': 'relative',
			'overflow': 'hidden',
			'min-height': maxHeight + 'px'
		});
	}

	slideLeft() {
		if(this.currentSlide == 1) {
			for(let i = 0; i < this.slidesAmount; i++) {
				this.slides[i].style.left = ((i * 100) - ((this.slidesAmount - 1) * 100)) + '%';
			}
			this.currentSlide = this.slidesAmount;
		} else {
			for(let i = 0; i < this.slidesAmount; i++) {
				this.slides[i].style.left = ((i * 100) - ((this.currentSlide - 2) * 100)) + '%';
			}
			this.currentSlide--;
		}
		this.counter.innerHTML = '<h2><span class="order">'+ this.currentSlide +'</span> | '+ this.slidesAmount +'</h2>';
	}

	slideRight() {
		if(this.currentSlide == this.slidesAmount) {
			for(let i = 0; i < this.slidesAmount; i++) {
				this.slides[i].style.left = (i * 100) + '%';
			}
			this.currentSlide = 1;
		} else {
			for(let i = 0; i < this.slidesAmount; i++) {
				this.slides[i].style.left = ((i * 100) - (this.currentSlide * 100)) + '%';
			}
			this.currentSlide++;
		}
		this.counter.innerHTML = '<h2><span class="order">'+ this.currentSlide +'</span> | '+ this.slidesAmount +'</h2>';
	}

	autoSlide() {
		this.timer = setInterval(() => {
			this.slideRight();
		}, 5000);
	}
}

export default Slider
