/*global $, document, window, setTimeout */

function Jeopardy(options) {

    'use strict';

    //-----------------------------------------------------
    // Variables
    //-----------------------------------------------------
    var questions = [],
        categories = [],
        finalJeopardy = {},
        currency = '$',
        numberOfQuestions = 0,
        numberOfQuestionsViewed = 0,
        multiplier = 1,
        messages = {
            orientation: 'Please rotate your device or resize your screen so the browser window is in landscape orientation.',
            invalid_category_type: 'Invalid category found. All question objects must have a category with a String value. Please update and try again.',
            invalid_questions_type: 'Invalid questions found. All questions values must be an Object, with attributes and values for "value", "question", and "answer". Please update and try again.',
            no_questions: 'Invalid questions found for the game. Please ensure you provide an Array of questions and try again.',
            mismatched_question_values: 'There is a mismatch in the number of questions for each category. Please update and try again.',
            invalid_final_jeopardy: 'There is an issue with the Final Jeopardy settings. The finalJeopardy object must have attributes for "category", "question", and "answer", each with String values. Please update and try again.',
            welcome: 'Welcome to Jeopardy!',
            game_over: 'Thanks for playing!'
        },
        fontSizes = {
            'jeo-value-span': 0,
            'jeo-question-span': 0
        };

    //-----------------------------------------------------
    // Option setting
    //-----------------------------------------------------
    for (var attr in options) {
        switch (attr) {
            case 'currency':
                currency = options[attr];
                break;
            case 'messages':
                setMessages(options[attr]);
                break;
            case 'finalJeopardy':
                finalJeopardy = options[attr];
                break;
            default:
                break;
        }
    }
    function setMessages(values) {
        for (var attr in values) {
            if (messages.hasOwnProperty(attr)) {
                messages[attr] = values[attr];
            }
        }
    }

    //-----------------------------------------------------
    // Creation Functions
    //-----------------------------------------------------
    function createBoard() {
        var i,
            j,
            table = document.createElement('table'),
            tbody = document.createElement('tbody'),
            tr = document.createElement('tr'),
            td,
            span;
        table.setAttribute('class', 'jeo-board');
        for (i = 0; i < categories.length; i += 1) {
            td = document.createElement('td');
            td.setAttribute('class', 'jeo-category-name');
            td.setAttribute('data-category-number', i);
            td.appendChild(document.createTextNode(categories[i].category));
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
        for (i = 0; i < questions[0].length; i += 1) {
            tr = document.createElement('tr');
            for (j = 0; j < categories.length; j += 1) {
                td = document.createElement('td');
                span = document.createElement('span');
                span.setAttribute('class', 'jeo-currency');
                span.appendChild(document.createTextNode(currency));
                td.setAttribute('class', 'jeo-question');
                td.setAttribute('data-category-number', j);
                td.setAttribute('data-question-number', i);
                td.appendChild(span);
                td.appendChild(document.createTextNode(questions[j][i].value));
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        document.getElementById('id-jeo-wrapper').appendChild(table);
    }
    function createQuestionContainer() {
        var table = document.createElement('table'),
            tbody = document.createElement('tbody'),
            tr = document.createElement('tr'),
            td = document.createElement('td'),
            div = document.createElement('div'),
            close = document.createElement('div'),
            answer = document.createElement('div');
        table.setAttribute('id', 'id-jeo-question-container-table');
        table.setAttribute('class', 'jeo-question-container-table');
        td.setAttribute('class', 'jeo-question-container');
        div.setAttribute('class', 'jeo-value-span jeo-question-span');
        close.setAttribute('class', 'jeo-close-icon');
        close.setAttribute('aria-hidden', 'true');
        answer.setAttribute('class', 'jeo-answer-button');
        td.appendChild(div);
        td.appendChild(close);
        td.appendChild(answer);
        tr.appendChild(td);
        tbody.appendChild(tr);
        table.appendChild(tbody);
        document.getElementById('id-jeo-wrapper').appendChild(table);
        // Grab font sizes for value and question spans, then remove question span class
        fontSizes['jeo-value-span'] = parseInt($(div).css('font-size'), 10);
        fontSizes['jeo-question-span'] = parseInt($(div).css('font-size'), 10);
        $(div).removeClass('jeo-question-span');
    }
    function createWelcomeOverlay() {
        var fontSize = parseInt($($('.jeo-question')[0]).css('font-size'), 10);
        $('.jeo-question-container-table').css({
            height: '100%',
            width: '100%',
            cursor: 'pointer',
            bottom: 0,
            left: 0,
            right: 0,
            top: 0
        }).show();
        $('.jeo-value-span').html('').removeClass('jeo-value-span').addClass('jeo-question-span').html('<strong>' + messages.welcome + '</strong>').css({
            display: 'inline-block',
            fontSize: (fontSize * 1.5) + 'px',
            lineHeight: (fontSize * 1.75) + 'px'
        });
        $('.jeo-question-container-table').off('click').one('click', function() {
            $('.jeo-question-span').html('').removeClass('jeo-question-span').addClass('jeo-value-span').css({
                fontSize: fontSize + 'px',
                lineHeight: '',
                display: 'block'
            });
            $('.jeo-value-span > .jeo-currency').css({
                padding: '0 0.25rem'
            });
            $('#id-jeo-question-container-table').hide();
        });

    }
    function createWrappers() {
        var wrapper = document.createElement('div'),
            table = document.createElement('table'),
            tbody = document.createElement('tbody'),
            tr = document.createElement('tr'),
            td = document.createElement('td');
        wrapper.setAttribute('id', 'id-jeo-wrapper');
        table.setAttribute('id', 'id-jeo-message-overlay');
        table.setAttribute('class', 'jeo-message-overlay');
        td.setAttribute('id', 'id-jeo-message');
        td.appendChild(document.createTextNode(''));
        tr.appendChild(td);
        tbody.appendChild(tr);
        table.appendChild(tbody);
        document.body.appendChild(wrapper);
        wrapper.appendChild(table);
    }

    //-----------------------------------------------------
    // Event Listeners
    //-----------------------------------------------------
    function addResizeEventListeners() {
        var mql = window.matchMedia("(orientation: portrait)");
        showOverlayMessage(mql.matches, messages.orientation);
        mql.addListener(function(m) {
            showOverlayMessage(m.matches, messages.orientation);
        });
        $(window).on('resize', function() {
            showOverlayMessage(window.innerHeight > window.innerWidth, messages.overlay);
        });
        showOverlayMessage(window.innerHeight > window.innerWidth, messages.overlay);
    }
    function addEventListeners() {
        $('.jeo-question').each(function() {
            $(this).one('click', openQuestion);
        });
    }

    //-----------------------------------------------------
    // Event Handlers
    //-----------------------------------------------------
    function setOverlayMessage(message) {
        $('#id-jeo-message').html(message);
    }
    function openQuestion(event) {
        var width = $(event.currentTarget).outerWidth(),
            height = $(event.currentTarget).outerHeight(),
            x = $(event.currentTarget).offset().left,
            y = $(event.currentTarget).offset().top,
            fontSize = parseInt($(event.currentTarget).css('font-size'), 10),
            questionNumber = $(event.currentTarget).attr('data-question-number'),
            categoryNumber = $(event.currentTarget).attr('data-category-number'),
            question = questions[categoryNumber][questionNumber].question,
            questionValue = questions[categoryNumber][questionNumber].value;

        multiplier = Math.max((parseInt(window.innerWidth, 10) / width), (parseInt(window.innerHeight, 10) / height));
        questions[categoryNumber][questionNumber].viewed = true;
        categories[categoryNumber].questions_viewed += 1;
        numberOfQuestionsViewed += 1;

        $('.jeo-question-container').css({
            lineHeight: '',
        }).attr('data-question-number', questionNumber).attr('data-category-number', categoryNumber);
        $('.jeo-value-span').html('<span class="jeo-currency">' + currency + '</span><strong>' + questionValue + '</strong>');
        $('.jeo-value-span').animate({
            fontSize: (fontSize * multiplier) + 'px',
            lineHeight: (fontSize * 2.25) + 'px'
        }, 500);
        $('.jeo-question-container-table').css({'width': width + 'px', 'height': height + 'px', 'left': x + 'px', 'top': y + 'px', 'font-size': fontSize + 'px'}).show().animate({
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
            height: window.innerHeight + 'px',
            width: window.innerWidth + 'px'
        }, 500, function() {
            $('.jeo-question-container-table').css({
                height: '100%',
                width: '100%',
                cursor: 'pointer'
            });
            setTimeout(function() {
                if (categories[categoryNumber].questions_viewed === questions[categoryNumber].length) {
                    $('.jeo-category-name[data-category-number="' + categoryNumber + '"]').css({
                        color: 'rgba(255, 255, 255, 0.25)'
                    });
                }
                $('.jeo-value-span').html('').removeClass('jeo-value-span').addClass('jeo-question-span').html('<strong>' + question + '</strong>').css({
                    display: 'inline-block',
                    fontSize: (fontSize * 1.5) + 'px',
                    lineHeight: (fontSize * 1.75) + 'px'
                });
                $('.jeo-answer-button').show();
                $('.jeo-question-container-table').off('click').one('click', showAnswer);
            }, 500);
        });
        $(event.currentTarget).off('click').html('&nbsp;').css({
            cursor: 'default'
        });
    }
    function showAnswer(event) {
        var questionNumber = $(event.currentTarget).find('td[data-question-number]').attr('data-question-number'),
            categoryNumber = $(event.currentTarget).find('td[data-category-number]').attr('data-category-number'),
            answer = questions[categoryNumber][questionNumber].answer;

        $('.jeo-answer-button').hide();
        $('.jeo-close-icon').show();
        $('.jeo-question-span').html('<strong>' + answer + '</strong>');
        $('.jeo-question-container-table').off('click').one('click', closeQuestion);

    }
    function closeQuestion(event) {
        if (numberOfQuestionsViewed === numberOfQuestions) {
            // Show Final Jeopardy!
            $('.jeo-close-icon').hide();
            $('.jeo-answer-button').show();
            $('.jeo-question-span').html(finalJeopardy.category).removeClass('jeo-question-span').addClass('jeo-value-span').css({
                fontSize: (fontSizes['jeo-value-span'] * (multiplier / 2)) + 'px',
                lineHeight: (fontSizes['jeo-value-span'] * 3.25) + 'px',
                display: 'block'
            });
            $('#id-jeo-question-container-table').css({
                cursor: 'pointer'
            }).on('click', function() {
                $('.jeo-value-span').removeClass('jeo-value-span').addClass('jeo-question-span').html('<strong>' + finalJeopardy.question + '</strong>').css({
                    display: 'inline-block',
                    fontSize: fontSizes['jeo-question-span'] * 2 + 'px',
                    lineHeight: (fontSizes['jeo-question-span'] * 2.25) + 'px'
                });
                $(this).off('click').one('click', function() {
                    $('.jeo-question-span').html('<strong>' + finalJeopardy.answer + '</strong>').css({
                        cursor: 'default'
                    });
                    $(this).off('click').one('click', function() {
                        $('#id-jeo-question-container-table').css({
                            cursor: 'default'
                        });
                        $('.jeo-question-span').html('<strong>' + messages.game_over + '</strong>').css({
                            cursor: 'default'
                        });
                        $('.jeo-answer-button').hide();
                        $(this).off('click');
                    });
                });
            });
        } else {
            $('.jeo-close-icon').hide();
            $('.jeo-question-span').html('').removeClass('jeo-question-span').addClass('jeo-value-span').css({
                fontSize: fontSizes['jeo-value-span'] + 'px',
                lineHeight: '',
                display: 'block'
            });
            $('.jeo-value-span > .jeo-currency').css({
                padding: '0 0.25rem'
            });
            $('#id-jeo-question-container-table').hide();
        }
    }

    //-----------------------------------------------------
    // Visibility Functions
    //-----------------------------------------------------
    function showOverlayMessage(show, message) {
        if (message) {
            setOverlayMessage(message);
        }
        if (show) {
            $('#id-jeo-message-overlay').show();
        } else {
            $('#id-jeo-message-overlay').hide();
        }
    }

    //-----------------------------------------------------
    // Initialization
    //-----------------------------------------------------
    this.init = function() {

        // Redefine to avoid duplicating
        this.init = function() { return; };

        var i,
            j,
            attr,
            question,
            numQuestionsPerCategory;

        createWrappers();

        if (!options.questions || Object.prototype.toString.call(options.questions) !== '[object Array]' || options.questions.length === 0) {
            showOverlayMessage(true, messages.no_questions);
            return;
        }

        for (i = 0; i < options.questions.length; i += 1) {
            if (!options.questions[i].hasOwnProperty('category') || Object.prototype.toString.call(options.questions[i].category) !== '[object String]') {
                showOverlayMessage(true, messages.invalid_category_type);
                return;
            }
            categories[i] = {
                'category': options.questions[i].category,
                'questions_viewed': 0
            };
            if (i !== 0 && options.questions[i].questions.length !== numQuestionsPerCategory) {
                showOverlayMessage(true, messages.mismatched_question_values);
                return;
            }
            if (Object.prototype.toString.call(options.questions) !== '[object Array]') {
                showOverlayMessage(true, messages.invalid_questions_type);
                return;
            }
            if (Object.prototype.toString.call(options.questions[i]) !== '[object Object]' || !options.questions[i].hasOwnProperty('questions') || Object.prototype.toString.call(options.questions[i].questions) !== '[object Array]') {
                showOverlayMessage(true, messages.invalid_questions_type);
                return;
            }
            numQuestionsPerCategory = options.questions[i].questions.length;
            questions[i] = [];
            for (j = 0; j < numQuestionsPerCategory; j += 1) {
                question = options.questions[i];
                if (!question.questions[j].hasOwnProperty('value') || !question.questions[j].hasOwnProperty('question') || !question.questions[j].hasOwnProperty('answer') || Object.prototype.toString.call(question.questions[j].value) !== '[object String]' || Object.prototype.toString.call(question.questions[j].question) !== '[object String]' || Object.prototype.toString.call(question.questions[j].answer) !== '[object String]') {
                    showOverlayMessage(true, messages.invalid_questions_type);
                    return;
                }
                questions[i][j] = question.questions[j];
                numberOfQuestions += 1;
            }
        }

        // Final Jeopardy category and question check
        if (!finalJeopardy || !finalJeopardy.hasOwnProperty('category') || !finalJeopardy.hasOwnProperty('question') || !finalJeopardy.hasOwnProperty('answer') || Object.prototype.toString.call(finalJeopardy.category) !== '[object String]' || Object.prototype.toString.call(finalJeopardy.question) !== '[object String]' || Object.prototype.toString.call(finalJeopardy.answer) !== '[object String]') {
            showOverlayMessage(true, messages.invalid_final_jeopardy);
            return;
        }

        // Create all the things!
        createBoard();
        createQuestionContainer();
        createWelcomeOverlay();

        // Cut and append message overlay so it is layered on top.
        $('#id-jeo-wrapper').append($('#id-jeo-message-overlay'));

        // Add all the listeners!
        addEventListeners();
        addResizeEventListeners();
    };

    this.init();

}
