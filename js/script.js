// Shared JavaScript for the movie website.
// This file contains the movie list, recommendations and form checks.

var movies = [
    {
        id: "inception",
        title: "Inception",
        genre: "Science Fiction",
        year: 2010,
        rating: "M",
        duration: 148,
        price: 22,
        image: "images/inception.jpg",
        description: "A skilled thief enters people's dreams to steal information and is offered a difficult final job.",
        moods: ["curious", "thoughtful", "excited"]
    },
    {
        id: "dark-knight",
        title: "The Dark Knight",
        genre: "Action",
        year: 2008,
        rating: "M",
        duration: 152,
        price: 22,
        image: "images/dark-knight.jpg",
        description: "Batman faces the Joker, a criminal who creates chaos across Gotham City.",
        moods: ["excited", "thoughtful"]
    },
    {
        id: "inside-out-2",
        title: "Inside Out 2",
        genre: "Animation",
        year: 2024,
        rating: "PG",
        duration: 96,
        price: 18,
        image: "images/inside-out-2.jpg",
        description: "Riley starts her teenage years as new emotions arrive at headquarters.",
        moods: ["happy", "thoughtful"]
    },
    {
        id: "interstellar",
        title: "Interstellar",
        genre: "Science Fiction",
        year: 2014,
        rating: "M",
        duration: 169,
        price: 22,
        image: "images/interstellar.jpg",
        description: "A group of explorers travels through space to search for a future home for humanity.",
        moods: ["curious", "thoughtful", "excited"]
    },
    {
        id: "spider-verse",
        title: "Spider-Man: Across the Spider-Verse",
        genre: "Animation",
        year: 2023,
        rating: "PG",
        duration: 140,
        price: 18,
        image: "images/spider-verse.jpg",
        description: "Miles Morales meets other Spider-People while travelling across different universes.",
        moods: ["excited", "happy", "curious"]
    },
    {
        id: "super-mario",
        title: "The Super Mario Bros. Movie",
        genre: "Adventure",
        year: 2023,
        rating: "PG",
        duration: 92,
        price: 18,
        image: "images/super-mario.jpg",
        description: "Mario and Luigi are taken to a strange world where they must help stop Bowser.",
        moods: ["happy", "excited"]
    },
    {
        id: "jurassic-park",
        title: "Jurassic Park",
        genre: "Adventure",
        year: 1993,
        rating: "M",
        duration: 127,
        price: 22,
        image: "images/jurassic-park.jpg",
        description: "Visitors to a dinosaur theme park discover that the attraction is not under control.",
        moods: ["excited", "curious"]
    },
    {
        id: "the-avengers",
        title: "The Avengers",
        genre: "Action",
        year: 2012,
        rating: "M",
        duration: 143,
        price: 22,
        image: "images/avengers.jpg",
        description: "A team of superheroes joins forces to protect Earth from an alien threat.",
        moods: ["excited", "happy"]
    }
];

var ticketPrices = {
    adult: 22,
    student: 18,
    child: 14,
    senior: 16
};

function money(amount) {
    return new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD"
    }).format(amount);
}

function getMovie(id) {
    return movies.find(function(movie) {
        return movie.id === id;
    });
}

function getSaved() {
    try {
        return JSON.parse(localStorage.getItem("movie-watchlist") || "[]");
    } catch (error) {
        return [];
    }
}

function saveSaved(ids) {
    localStorage.setItem("movie-watchlist", JSON.stringify(ids));
}

function safeText(value) {
    return String(value).replace(/[&<>"']/g, function(char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}

function movieCard(movie) {
    var saved = getSaved().includes(movie.id);

    return '<article class="movie-card">' +
        '<div class="movie-art"><img src="' + movie.image + '" alt="Movie poster for ' + safeText(movie.title) + '"></div>' +
        '<div class="movie-info">' +
        '<div class="movie-meta"><span>' + movie.year + ' · ' + movie.duration + ' min</span><span class="genre-pill">' + movie.genre + '</span></div>' +
        '<h3>' + safeText(movie.title) + '</h3>' +
        '<p>' + safeText(movie.description) + '</p>' +
        '<div class="movie-meta"><span>Rated ' + movie.rating + ' · from ' + money(movie.price) + '</span></div>' +
        '<div class="card-actions">' +
        '<a class="button button-primary" href="booking.html?movie=' + encodeURIComponent(movie.id) + '">Book tickets</a>' +
        '<button class="icon-button watchlist-toggle" type="button" data-movie="' + movie.id + '" aria-label="' + (saved ? 'Remove' : 'Add') + ' ' + safeText(movie.title) + ' ' + (saved ? 'from' : 'to') + ' watchlist" aria-pressed="' + saved + '">' + (saved ? 'Remove from watchlist' : 'Add to watchlist') + '</button>' +
        '</div></div></article>';
}

function setupNavigation() {
    var currentFile = location.pathname.split("/").pop() || "index.html";
    var links = document.querySelectorAll(".primary-nav a");
    var i;

    for (i = 0; i < links.length; i++) {
        if (links[i].getAttribute("href") === currentFile) {
            links[i].setAttribute("aria-current", "page");
        }
    }

    var toggle = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".primary-nav");

    if (toggle && nav) {
        toggle.addEventListener("click", function() {
            var open = toggle.getAttribute("aria-expanded") !== "true";
            toggle.setAttribute("aria-expanded", String(open));
            nav.classList.toggle("open", open);
        });
    }
}

function setupWatchlist() {
    document.addEventListener("click", function(event) {
        var button = event.target.closest(".watchlist-toggle");
        var id;
        var saved;
        var next;
        var isSaved;
        var movie;

        if (!button) {
            return;
        }

        id = button.dataset.movie;
        saved = getSaved();
        next = saved.includes(id) ? saved.filter(function(item) {
            return item !== id;
        }) : saved.concat(id);
        saveSaved(next);
        isSaved = next.includes(id);
        movie = getMovie(id);
        button.setAttribute("aria-pressed", String(isSaved));
        button.textContent = isSaved ? "Remove from watchlist" : "Add to watchlist";
        button.setAttribute("aria-label", (isSaved ? "Remove " : "Add ") + (movie ? movie.title : "movie") + (isSaved ? " from" : " to") + " watchlist");
    });
}

function setupHome() {
    var container = document.getElementById("featured-movies");

    if (container) {
        container.innerHTML = movies.slice(0, 3).map(movieCard).join("");
    }
}

function setupCatalog() {
    var container = document.getElementById("all-movies");

    if (!container) {
        return;
    }

    var search = document.getElementById("movie-search");
    var genre = document.getElementById("genre-filter");
    var count = document.getElementById("movie-count");
    var empty = document.getElementById("no-movies");

    function render() {
        var query = search.value.trim().toLowerCase();
        var selectedGenre = genre.value;
        var results = movies.filter(function(movie) {
            var matchesGenre = selectedGenre === "all" || movie.genre === selectedGenre;
            var matchesSearch = movie.title.toLowerCase().includes(query) ||
                movie.genre.toLowerCase().includes(query) ||
                movie.description.toLowerCase().includes(query);
            return matchesGenre && matchesSearch;
        });

        container.innerHTML = results.map(movieCard).join("");
        count.textContent = results.length + (results.length === 1 ? " movie found" : " movies found");
        empty.hidden = results.length !== 0;
    }

    search.addEventListener("input", render);
    genre.addEventListener("change", render);
    render();
}

function setupBooking() {
    var form = document.getElementById("booking-form");

    if (!form) {
        return;
    }

    var movieSelect = document.getElementById("booking-movie");
    var typeSelect = document.getElementById("ticket-type");
    var quantitySelect = document.getElementById("ticket-quantity");
    var snack = document.getElementById("snack-combo");
    var premium = document.getElementById("premium-screen");
    var date = document.getElementById("show-date");
    var time = document.getElementById("show-time");
    var name = document.getElementById("booking-name");
    var email = document.getElementById("booking-email");
    var message = document.getElementById("booking-message");
    var paymentOptions = document.querySelectorAll('input[name="payment"]');
    var cardDetails = document.getElementById("card-details");
    var cardNumber = document.getElementById("card-number");

    movieSelect.innerHTML = '<option value="">Select a movie</option>';
    movies.forEach(function(movie) {
        movieSelect.innerHTML += '<option value="' + movie.id + '">' + safeText(movie.title) + ' — ' + movie.genre + '</option>';
    });

    var requestedMovie = new URLSearchParams(location.search).get("movie");
    if (getMovie(requestedMovie)) {
        movieSelect.value = requestedMovie;
    }

    date.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

    function updatePaymentFields() {
        var selectedPayment = document.querySelector('input[name="payment"]:checked');
        var useCard = selectedPayment && selectedPayment.value === "card";
        cardDetails.hidden = !useCard;
        cardNumber.required = Boolean(useCard);
    }

    function updateSummary() {
        var movie = getMovie(movieSelect.value);
        var quantity = Number(quantitySelect.value);
        var basePrice = ticketPrices[typeSelect.value] || ticketPrices.adult;
        var extrasPerTicket = (snack.checked ? 9.5 : 0) + (premium.checked ? 5 : 0);
        var total = (basePrice + extrasPerTicket) * quantity;
        var art = document.getElementById("summary-art");

        document.getElementById("summary-title").textContent = movie ? movie.title : "Choose a movie";
        document.getElementById("summary-genre").textContent = movie ? movie.genre + " · " + movie.duration + " min · " + movie.rating : "Select a movie to see its details.";
        document.getElementById("summary-price").textContent = money(basePrice);
        document.getElementById("summary-quantity").textContent = quantity;
        document.getElementById("summary-extras").textContent = money(extrasPerTicket * quantity);
        document.getElementById("summary-total").textContent = money(total);

        if (movie) {
            art.innerHTML = '<img src="' + movie.image + '" alt="Movie poster for ' + safeText(movie.title) + '">';
        } else {
            art.innerHTML = "";
        }
    }

    [movieSelect, typeSelect, quantitySelect, snack, premium].forEach(function(element) {
        element.addEventListener("change", updateSummary);
    });

    paymentOptions.forEach(function(option) {
        option.addEventListener("change", updatePaymentFields);
    });

    updateSummary();
    updatePaymentFields();

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        document.querySelectorAll("#booking-form .field-error").forEach(function(element) {
            element.textContent = "";
        });
        message.textContent = "";
        message.className = "form-message";

        var valid = true;
        var selectedPayment = document.querySelector('input[name="payment"]:checked');
        var errors = [
            ["movie-error", !movieSelect.value, "Please choose a movie."],
            ["date-error", !date.value || date.value < date.min, "Choose today or a future date."],
            ["time-error", !time.value, "Please choose a session."],
            ["name-error", name.value.trim().length < 2, "Enter your name (at least 2 characters)."],
            ["email-error", !email.validity.valid || !email.value.trim(), "Enter a valid email address."]
        ];

        errors.forEach(function(error) {
            if (error[1]) {
                document.getElementById(error[0]).textContent = error[2];
                valid = false;
            }
        });

        if (selectedPayment && selectedPayment.value === "card" && cardNumber.value.trim().length < 12) {
            document.getElementById("card-number-error").textContent = "Enter a demo card number with at least 12 digits.";
            valid = false;
        }

        if (!valid) {
            message.textContent = "Please check the fields above and try again.";
            message.classList.add("error");
            return;
        }

        var movie = getMovie(movieSelect.value);
        var quantity = Number(quantitySelect.value);
        var total = (ticketPrices[typeSelect.value] + (snack.checked ? 9.5 : 0) + (premium.checked ? 5 : 0)) * quantity;
        var paymentText = selectedPayment ? selectedPayment.value : "not selected";
        message.textContent = "Demo booking ready for " + movie.title + ": " + quantity + " ticket(s), " + date.value + " at " + time.value + ". Estimated total: " + money(total) + ". Payment method: " + paymentText + ". No payment has been processed.";
        message.classList.add("success");
    });
}

function setupRecommendations() {
    var form = document.getElementById("recommendation-form");

    if (!form) {
        return;
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        var mood = form.querySelector('input[name="mood"]:checked');
        var genre = document.getElementById("preferred-genre").value;
        var error = document.getElementById("recommendation-error");
        var result = document.getElementById("recommendation-result");
        var matches;
        var choice;
        var reasons = {
            excited: "You picked an energetic mood, so this film has action or adventure.",
            thoughtful: "You picked a thoughtful mood, so this film has a story to think about.",
            happy: "You picked a happy mood, so this film should suit a fun movie night.",
            curious: "You picked a curious mood, so this film offers mystery or discovery."
        };

        error.textContent = "";
        if (!mood) {
            error.textContent = "Please select a mood first.";
            return;
        }

        matches = movies.filter(function(movie) {
            return (genre === "any" || movie.genre === genre) && movie.moods.includes(mood.value);
        });

        if (matches.length === 0) {
            matches = movies.filter(function(movie) {
                return genre === "any" || movie.genre === genre;
            });
        }

        if (matches.length === 0) {
            matches = movies.filter(function(movie) {
                return movie.moods.includes(mood.value);
            });
        }

        choice = matches[0];
        result.innerHTML = '<h2>Recommended movie</h2>' + movieCard(choice) + '<p class="small-copy">' + reasons[mood.value] + '</p>';
    });
}

function setupRegistration() {
    var form = document.getElementById("registration-form");

    if (!form) {
        return;
    }

    var fields = [
        {id: "reg-name", error: "reg-name-error", check: function(element) { return element.value.trim().length >= 2; }, message: "Enter your name (at least 2 characters)."},
        {id: "reg-email", error: "reg-email-error", check: function(element) { return element.validity.valid && element.value.trim() !== ""; }, message: "Enter a valid email address."},
        {id: "reg-username", error: "reg-username-error", check: function(element) { return /^[A-Za-z0-9_]{4,16}$/.test(element.value); }, message: "Use 4–16 letters, numbers or underscores."},
        {id: "reg-password", error: "reg-password-error", check: function(element) { return element.value.length >= 8 && /[A-Za-z]/.test(element.value) && /[0-9]/.test(element.value); }, message: "Use at least 8 characters, including a letter and a number."},
        {id: "reg-confirm", error: "reg-confirm-error", check: function(element) { return element.value !== "" && element.value === document.getElementById("reg-password").value; }, message: "Passwords must match."},
        {id: "reg-birthdate", error: "reg-birthdate-error", check: function(element) { return !element.value || element.value <= new Date().toISOString().slice(0, 10); }, message: "Birth date cannot be in the future."},
        {id: "reg-consent", error: "reg-consent-error", check: function(element) { return element.checked; }, message: "Please agree to continue."}
    ];

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        var valid = true;
        var i;

        for (i = 0; i < fields.length; i++) {
            var field = fields[i];
            var element = document.getElementById(field.id);
            var okay = field.check(element);
            document.getElementById(field.error).textContent = okay ? "" : field.message;

            if (!okay) {
                valid = false;
            }
        }

        var message = document.getElementById("registration-message");
        message.className = "form-message";

        if (!valid) {
            message.textContent = "Please correct the fields above.";
            message.classList.add("error");
            return;
        }

        message.textContent = "Thanks, " + document.getElementById("reg-name").value.trim() + ". The demo form passed validation, but no real account was created.";
        message.classList.add("success");
        form.reset();
    });
}

document.addEventListener("DOMContentLoaded", function() {
    setupNavigation();
    setupWatchlist();
    setupHome();
    setupCatalog();
    setupBooking();
    setupRecommendations();
    setupRegistration();
});
