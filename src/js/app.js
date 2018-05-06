import { Scene, PerspectiveCamera, WebGLRenderer, Mesh, CircleGeometry, SphereGeometry, MeshBasicMaterial } from 'three';

window.onload = function() {
	/*
		GLOBAL SCRIPTS
	*/

	// init canvas environment
	const scene = new Scene();
	const camera = new PerspectiveCamera(100, window.innerWidth / (window.innerHeight * 2), 0.1, 1000);
	const canvas = document.getElementById('backgroundcanvas');
	const renderer = new WebGLRenderer({canvas: canvas, antialis: true, alpha: true});
	camera.position.z = 5;
	renderer.setSize(window.innerWidth, window.innerHeight * 2);
	renderer.setClearColor(0xffffff, 0);

	// init needed variables
	let circles = new Array();
	let lines = new Array();
	let lastXPosition, lastYPosition;
	let directionsX, directionsY;
	let bump = true;
	let x, y, t = 0;
	initCircles();
	animate();

	// resizing canvas with resising window
	window.addEventListener('resize', onWindowResize, false);

	function onWindowResize() {
	  camera.aspect = window.innerWidth / (window.innerHeight * 2);
	  camera.updateProjectionMatrix();
	  renderer.setSize(window.innerWidth, window.innerHeight * 2);
	}

	// move scene with mouse move
	window.addEventListener('mousemove', moveCamera);

	function moveCamera(event) {
		x = event.clientX;

		if(lastXPosition < x) {
			camera.position.x += 0.005
		} else {
			camera.position.x -= 0.005
		}

		lastXPosition = x;
	}

	function update() {
		t++;
		circles.forEach(moveScene);
	}

	function animate() {
	  requestAnimationFrame(animate);
		update();
	  render();
	}

	function render() {
		renderer.render(scene, camera);
	}

	function moveScene(circle, index) {
		camera.position.x = (Math.sin( t/100000) * 0.05);
		camera.position.y = (Math.random() * 0.00005) - 0.00001;
		camera.position.z = (Math.cos( t/10000) * 0.000005) + 2;
		t++;
		bump = !bump;

		if(bump === true) {
			circle.position.z -= 0.001;
		} else {
			circle.position.z += 0.0000001;
		}

	  circle.position.z -= 0.0001;
		circle.position.x += directionsX[index] * 0.0005;
		circle.position.y += directionsY[index] * 0.0005;

	  if(circle.position.z > 0) {
			randDirections(index);
	    circle.position.z = -10;
	  } else if(circle.position.z < -10) {
			randDirections(index);
	    circle.position.z = (Math.random() * 5) - 5	;
	  } else if(circle.position.x > 12 || circle.position.x < -12) {
			directionsX[index] = (-1) * directionsX[index];
		} else if(circle.position.y > 6|| circle.position.y < -6) {
			directionsY[index] = (-1) * directionsY[index];
		}
	}

	function randDirections(index, size) {
		let directionY, directionX;
		directionY = Math.random();
		if(directionY < 0.5) {
			directionY = -1;
		} else {
			directionY = 1;
		}

		directionX = Math.random();
		if(directionX < 0.5) {
			directionX = -1;
		} else {
			directionX = 1;
		}

		if(directionsX.length < size || directionsY.length < size) {
			directionsY.push(directionY);
			directionsX.push(directionX);
		} else {
			directionsX[index] = directionX;
			directionsY[index] = directionY;
		}
	}

	function initCircles() {
	  const MAX_CIRCLES = 200;
		directionsX = new Array();
		directionsY = new Array();

	  for(let i = 0; i < MAX_CIRCLES; i++) {
			randDirections(0, MAX_CIRCLES);

	    let material, geometry;
	    material = new MeshBasicMaterial();
	    let dimension = (Math.random() * 0.03) + 0.001;
	    geometry = new CircleGeometry(dimension, 32);
	    let circle = new Mesh(geometry, material);

	    circle.position.x = (Math.random() * 24) - 12;
	    circle.position.y = (Math.random() * 12) - 6;
	    circle.position.z = ((Math.random() * 5) - 5);
			//circle.material.color.setHex(0xe22e38);
			circle.material.color.setRGB(Math.random() * 0.4 + 0.6, Math.random() * 0.2 + 0.1, Math.random() * 0.5 + 0.1);
	    circles.push(circle);
	    scene.add(circle);
	  }
	}

	/*
		MAIN PAGE SCRIPTS
	*/

	// click on project list animation, get to the new url
	const projectList = document.querySelectorAll('.projects .row');
	const globalContainer = document.querySelectorAll('.wrapper')[0];

	if(projectList !== null)
		window.addEventListener('click', checkClick);

	// change footer header contect after resized to mobile screen
	let currentWidth;
	const footerHeader = document.querySelectorAll('#footer .page__content h1')[0];


	window.addEventListener('resize', changeFooterHeader);

	function checkClick(event) {
		const target = event.target;
		let destination = target.getAttribute('href');
		const projectListArr = Array.from(projectList);
		let now;
		const period = 300;
		const step = period / 100;
		let currentStep = 0;
		let interval;
		let currentOpacity = 1;

		projectListArr.forEach((element) => {
			if(target == element) {
				let now = new Date().getTime();
				interval = setInterval(() => {
					currentOpacity = (1 - ((new Date().getTime() - now) / period));

					if(currentOpacity < 0.05)
						currentOpacity = 0;

					Object.assign(globalContainer.style, {
						'opacity': currentOpacity
					});
					Object.assign(target.style, {
						'pointer-events': 'none'
					})
				}, 1);

				setTimeout(() => {
					clearInterval(interval);
					Object.assign(target.style, {
						'pointer-events': 'auto'
					})
					window.location.href = destination;
				}, period);
			}
		});
	}

	function changeFooterHeader(event) {
		if(footerHeader !== null && footerHeader !== undefined) {
			currentWidth = window.innerWidth;
			if(currentWidth < 768) {
				footerHeader.innerHTML = "My <strong>tech stack.</strong>";
			} else {
				footerHeader.innerHTML = "I run, drink coffee and still chasing for new opportunites to learn new things. <strong>Currently on my stack.</strong>";
			}
		}
	}

	/*
		PROJECTS PAGE SCRIPTS
	*/

	// swapping between projects animation
	const leftBtn = document.getElementById('prev');
	const rightBtn = document.getElementById('next');
	const projectContainer = document.querySelectorAll('.wrapper')[0];

	if(leftBtn !== null && rightBtn !== null) {
		leftBtn.addEventListener('click', swapPrev, false);
		rightBtn.addEventListener('click', swapNext, false);
	}

	function swapPrev(event) {
		let destination = document.getElementById('prev__anchor').getAttribute("href");
		let swapper = document.createElement('div');
		let cover = document.createElement('div');
		cover.className = 'cover';

		swapper.className = 'swapper swapper_left';
		projectContainer.appendChild(swapper);
		projectContainer.appendChild(cover);
		setTimeout(() => {
			projectContainer.removeChild(cover);
			projectContainer.removeChild(swapper);
			window.location.href = destination;
		}, 1000);
	}

	function swapNext(event) {
		let destination = document.getElementById('next__anchor').getAttribute("href");
		let swapper = document.createElement('div');
		let cover = document.createElement('div');
		cover.className = 'cover';

		swapper.className = 'swapper swapper_right';
		projectContainer.appendChild(swapper);
		projectContainer.appendChild(cover);
		setTimeout(() => {
			projectContainer.removeChild(cover);
			projectContainer.removeChild(swapper);
			window.location.href = destination;
		}, 1000);
	}

	const workBtn = document.getElementById('work-link');
	if(workBtn !== null && workBtn !== null)
		workBtn.addEventListener('click', goToWorks);

	function goToWorks(event) {
		let destination = document.querySelectorAll('#work-link a')[0].getAttribute("href");
		let swapper = document.createElement('div');
		let cover = document.createElement('div');
		cover.className = 'cover';

		swapper.className = 'swapper swapper_left';
		projectContainer.appendChild(swapper);
		projectContainer.appendChild(cover);
		setTimeout(() => {
			projectContainer.removeChild(cover);
			projectContainer.removeChild(swapper);
			window.location.href = destination;
		}, 1000);
	}
}
