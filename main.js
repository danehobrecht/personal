// Flyer navigation
$(window).on('load', function() {
	const bars = $('.bars a');
	const resumeContainer = $('#resume');
	history.scrollRestoration = "manual";
	let moduleWidth = calculateModuleWidth();

	resumeContainer.scrollLeft(0);

	function calculateModuleWidth() {
		const width = $('.module').eq(0).width();
		return width;
	}

	function updateActiveDot(activeIndex) {
		bars.removeAttr('id');
		bars.eq(activeIndex).attr('id', 'active');
	}

	// Mouse/Touch controls
	bars.on('click', function(e) {
		bars.removeAttr('id');
		$(this).attr('id', 'active');
	});

	resumeContainer.on('click', function() {
		resumeContainer.focus();
		resumeContainer.attr('tabindex', 0);
	});

	let isDragging = false;
	let startX, scrollLeft, animationFrame;

	resumeContainer.on('mousedown', function(e) {
		isDragging = true;
		startX = e.clientX - resumeContainer.offset().left;
		scrollLeft = resumeContainer.scrollLeft();
	});

	$(document).on('mousemove', function(e) {
		if (!isDragging) { return; }
		e.preventDefault();
		const x = e.clientX - resumeContainer.offset().left;
		const walk = (x - startX) * 8;
		// Slow animation to refresh rate
		cancelAnimationFrame(animationFrame);
		animationFrame = requestAnimationFrame(function() {
			resumeContainer.scrollLeft(scrollLeft - walk);
		});
	});

	$(document).on('mouseup', function() {
		isDragging = false;
	}).on('mouseleave', function() {
		isDragging = false;
	});

	resumeContainer.on('scroll touchmove', function() {
		const scrollPosition = resumeContainer.scrollLeft();
		const containerWidth = resumeContainer.innerWidth();
		const snappedModuleIndex = Math.floor(scrollPosition / moduleWidth);
		const middleModuleIndex = Math.floor(snappedModuleIndex + containerWidth / (2 * moduleWidth));
		updateActiveDot(middleModuleIndex);
	});

	// Keyboard controls
	let arrowKeyPressed = false;
	let spacebarPressed = false;

	resumeContainer.on('keydown', function(e) {
		const currentScrollLeft = resumeContainer.scrollLeft();
		const containerWidth = resumeContainer.innerWidth();
		const moduleCount = Math.floor(containerWidth / moduleWidth);
		const scrollDistance = moduleWidth * moduleCount * 0.32;

		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			arrowKeyPressed = true;
			resumeContainer.scrollLeft(currentScrollLeft - scrollDistance);
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			arrowKeyPressed = true;
			resumeContainer.scrollLeft(currentScrollLeft + scrollDistance);
		}

		if ((e.key === ' ' || e.key === 'Spacebar') && !spacebarPressed) {
			e.preventDefault();
			if (!isDragging && !arrowKeyPressed) {
				const checkboxes = $('input[type="checkbox"]');
				const containerWidth = resumeContainer.innerWidth();
				const snappedModuleIndex = Math.floor(resumeContainer.scrollLeft() / moduleWidth);
				const middleModuleIndex = Math.floor(snappedModuleIndex + containerWidth / (2 * moduleWidth));
				const checkboxToToggle = checkboxes.eq(middleModuleIndex);
				if (checkboxToToggle.length > 0) {
					checkboxToToggle.prop('checked', !checkboxToToggle.prop('checked'));
				}
			}
			arrowKeyPressed = false;
			spacebarPressed = true;
		}
	});

	resumeContainer.on('keyup', function(e) {
		if (e.key === ' ' || e.key === 'Spacebar') { spacebarPressed = false; }
	});
});