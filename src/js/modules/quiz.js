import axios from 'axios';
import { quizSlider } from './sliders';

export default () => {
	const nextBtn = document.querySelector('.quiz__btn');
	const modalBtn = document.querySelector('.modal__btn');
	const quizTitle = document.querySelector('.quiz__title');
	const quizAnswers = document.querySelectorAll('.quiz__answer');
	const quizBox = document.querySelector('.quiz__box');
	const quizSuccess = document.querySelector('.quiz__success');
	const quizColumn = document.querySelector('.quiz__column');
	const inputSizeTrack = document.querySelector('.quiz__input-size input');
	const modalName = document.querySelector('.modal__input-name');
	const modalPhone = document.querySelector('.modal__input-phone');
	const modalChoose = document.querySelector('.modal__choose');
	const choosedAnswers = { name: null, phone: null, answers: [] };

	const closest = (el, sel) => {
		if (el != null) return el.matches(sel) ? el : el.querySelector(sel) || closest(el.parentNode, sel);
	};

	for (const answer of quizAnswers) {
		answer.addEventListener('click', (e) => {
			const slideId = quizSlider.realIndex;
			const slideParent = quizSlider.slides[quizSlider.realIndex];
			const slideParentStage = slideParent.classList[1];
			if (quizSlider.realIndex + 1 !== 7) {
				const quizQuestion = closest(e.target, '.quiz__question').getAttribute('data-real-question');
				const quizRawQuestion = closest(e.target, '.quiz__question').textContent;
				const quizTitle = closest(e.target, '.quiz__answer-title');
				const quizValue = quizTitle.textContent.replace(/\n\t/gm, '');
				nextBtn.disabled = false;
				nextBtn.classList.add('_active');
				const activeQuizTitle = document.querySelector(`.${slideParentStage} .quiz__answer-title._active`);
				if (activeQuizTitle) {
					activeQuizTitle.classList.remove('_active');
				}
				quizTitle.classList.add('_active');

				choosedAnswers.answers.push({ question: quizQuestion, answer: quizValue, rawQuestion: quizRawQuestion });
			}
			// quizSlider.slideNext();
		});
	}
	quizSlider.on('slideChange', () => {
		nextBtn.disabled = true;
		if (quizSlider.realIndex + 1 === 3) {
			// nextBtn.addEventListener('click', (e) => {
			// 	const quizQuestion = closest(document.querySelector('.quiz__stage_size'), '.quiz__question').getAttribute('data-real-question');
			// 	const quizRawQuestion = closest(e.target, '.quiz__question').textContent;
			// 	const quizValue = parseInt(inputSizeTrack.value);
			// 	// choosedAnswers.push({ question: quizQuestion, answer: quizValue });
			// 	choosedAnswers.answers.push({ question: quizQuestion, answer: quizValue, rawQuestion: quizRawQuestion });
			// });
			inputSize();
		} else if (quizSlider.realIndex + 1 === 7) {
			quizColumn.style.maxWidth = '100%';
			for (const present of modalChoose.children) {
				console.log(present);
				present.addEventListener('click', (e) => {
					const activePresent = document.querySelector('.modal__choose-item > h4._active');
					console.log(activePresent);
					if (activePresent) {
						activePresent.classList.remove('_active');
					}
					e.target.children[1].classList.add('_active');
				});
			}
			modalBtn.addEventListener('click', (e) => {
				const present = document.querySelector('.modal__choose-item > h4._active').textContent;
				// choosedAnswers.push({ question: 'Вы выбрали подарок:', answer: present });
				choosedAnswers.answers.push({ question: 'Вы выбрали подарок:', answer: present });

				// choosedAnswers.unshift({ name: modalName.value, phone: modalPhone.value });
				choosedAnswers.name = modalName.value;
				choosedAnswers.phone = modalPhone.value;
				const postData = JSON.stringify(choosedAnswers);
				console.log('Вы выбрали эти ответы во время опроса:', postData);
				// generateMessage(choosedAnswers);

				// 	fetch('./server/mail.php', {
				// 		headers: {
				// 			'Content-Type': 'application/json',
				// 		},
				// 		method: 'POST',
				// 		body: JSON.stringify(choosedAnswers),
				// 	})
				// 		.then((response) => response.json())
				// 		.then((json) => console.log(json))
				// 		.catch((err) => console.error(err));
				axios
					.post('./server/mail.php', {
						postData,
					})
					.then((response) => {
						console.log(response);
						alert('Ваша заявки принята. Ожидайте звонка');
					})
					.catch((error) => alert('Ошибка отправки запроса. Попробуйте позднее'));
			});

			quizBox.classList.add('_modal');
			quizSuccess.classList.add('_active');
			nextBtn.style.opacity = '0';
			quizTitle.style.opacity = '0';
			// console.log('Вы выбрали эти ответы во время опроса:', choosedAnswers);
		}
	});
};

export const inputSize = () => {
	const inputSizeContainer = document.querySelector('.quiz__input-size');
	const inputSizeLine = document.querySelector('.quiz__input-size-line');
	const inputSizeTrack = document.querySelector('.quiz__input-size input');
	const inputSizeDesc = document.querySelector('.quiz__answer-desc');
	const numberSize = document.querySelector('.quiz__answer-number span');
	const incrementSize = document.querySelector('.quiz__answer-increment');
	const decrementSize = document.querySelector('.quiz__answer-decrement');
	console.log(inputSizeTrack.offsetWidth);
	const maxWidth = inputSizeTrack.offsetWidth;
	const maxValue = 500;

	const isMobile = maxWidth <= 200;
	console.log('mobile', isMobile);

	const sizeFill = setInterval(() => {
		if (inputSizeTrack.value >= 50) {
			clearInterval(sizeFill);
			inputSizeDesc.classList.add('_active');
			return false;
		}
		inputSizeTrack.value++;
		numberSize.innerHTML = inputSizeTrack.value;
		inputSizeLine.style.width = `${(inputSizeTrack.value * maxWidth) / maxValue}px`;
	}, 30);

	const inputSizeHandler = (e) => {
		const track = inputSizeTrack;
		// track.classList.add('_active');
		if (track.value >= 250) {
			track.style.marginLeft = '45px';
		} else if (e.target.value < 250) {
			track.style.marginLeft = '43px';
		}
		if (track.value >= 400) {
			track.style.marginLeft = '48px';
		} else if (e.target.value < 400) {
			track.style.marginLeft = '43px';
		}
		if (track.value >= 470) {
			console.log('>470');
			track.style.marginLeft = '50px';
		} else if (track.value < 470) {
			track.style.marginLeft = '43px';
		}

		numberSize.innerHTML = inputSizeTrack.value;
		inputSizeLine.style.width = `${(inputSizeTrack.value * maxWidth) / maxValue}px`;
	};

	inputSizeTrack.addEventListener('change', inputSizeHandler);

	inputSizeTrack.addEventListener('input', inputSizeHandler);

	incrementSize.addEventListener('click', (e) => {
		inputSizeTrack.value++;
		inputSizeHandler(e);
	});
	decrementSize.addEventListener('click', (e) => {
		inputSizeTrack.value--;
		inputSizeHandler(e);
	});
};

// export const generateMessage = (choosedAnswers) => {
// 	const [user, present, ...answers] = choosedAnswers;

// 	let message = `
// 					<h1>Заявка на обратный звонок от elbrus-dom.ru</h1>
// 					<hr>
// 					<p>
// 						<b>Имя:</b>
// 						<span>${user.name}</span>
// 					</p>
// 					<p>
// 						<b>Номер телефона:</b>
// 						<span>${user.phone}</span>
// 					</p>

// 				`;

// 	for (const answer of answers) {
// 		message += `
// 						<p>
// 							<b>${answer.question}</b>
// 							<span>${answer.answer}</span>
// 						</p>

// 					`;
// 	}
// 	message += `
// 						<p>
// 							<b>Вы выбрали подарок:</b>
// 							<span>${present.present}</span>
// 						</p>
// 				`;
// 	console.log(message);
// };
