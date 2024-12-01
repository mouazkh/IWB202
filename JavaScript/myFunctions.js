const books = [{
        title: "ألف ليلة وليلة",
        author: "دار المعارف",
        category: "قصص شعبية",
        price: "25000",
        image: "../images/Seven Travels.jpg"
    },
    {
        title: "موسم الهجرة الى الشمال",
        author: "دار العودة",
        category: "رواية أدبية",
        price: "12000",
        image: "../images/Travel To North.jpg"
    },
    {
        title: "علاء الدين والمصباح السحري",
        author: "دار المعارف",
        category: "قصص سحرية",
        price: "25000",
        image: "../images/alaa Alden And The LightMAgic.jpg"
    },
    {
        title: "الخبز الحافي",
        author: "دار الساقي",
        category: "سيرة ذاتية",
        price: "10000",
        image: "../images/Bread.jpg"
    },
    {
        title: "في ديسمبر تنتهي الاحلام",
        author: "دار المعارف",
        category: "رواية أدبية",
        price: "40000",
        image: "../images/Dreams End In December.jpg"
    },
    {
        title: "أرض زيكولا",
        author: "دار المعارف",
        category: "رواية أدبية",
        price: "35000",
        image: "../images/Zekola Land.jpg"
    },
    {
        title: "اماريتا",
        author: "دار المعارف",
        category: "رواية أدبية",
        price: "39000",
        image: "../images/Amareta.jpg"
    },
    {
        title: "نظرية الفستق",
        author: "دار المعارف",
        category: "رواية أدبية",
        price: "25000",
        image: "../images/Nut Theory.jpg"
    }
];

$(function() {
    // Handle Sign-in and Login button clicks
    $('.signin-btn, .login-btn').click(function() {
        showNotification('خدمة تسجيل الدخول/الحساب غير متوفرة حالياً');
    });

    // Toggle book details when a checkbox is clicked
    $('input[type="checkbox"]').change(function() {
        const $detailsRow = $(this).closest('tr').next('.details-row');
        const bookID = $(this).attr('name').replace('CO', 'book');
        const $bookDetail = $(`#${bookID}`);

        $detailsRow.toggle(this.checked);
        $bookDetail.toggle(this.checked);
    });

    // Order form handling
    const $popup = $('#orderForm');
    const $form = $('#bookOrderForm');

    $('.action-button').click(() => $popup.show());
    $('.close-btn, window').click(function(e) {
        if ($(e.target).is($popup) || $(this).hasClass('close-btn')) $popup.hide();
    });

    // Handle national ID input navigation
    $('.national-digit').on('input keydown', function(e) {
        const $this = $(this);
        if (e.type === 'input' && this.value.length === this.maxLength) {
            $this.next('.national-digit').focus();
        } else if (e.key === 'Backspace' && !this.value) {
            $this.prev('.national-digit').focus();
        }
    });

    // Submit the order form
    $form.submit(function(e) {
        e.preventDefault();
        if (validateForm()) {
            const selectedBook = getSelectedBook();
            if (selectedBook) {
                showNotification('تم تأكيد الطلب بنجاح');
                showBookConfirmation(selectedBook);
                this.reset();
                $popup.hide();
            } else {
                alert('الرجاء اختيار كتاب قبل إرسال الطلب');
            }
        }
    });

    // Search functionality
    $('#searchInput').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        const $resultsPopup = $('#searchResultsPopup');

        if (searchTerm) {
            const filteredBooks = books.filter(book => [book.title, book.author, book.category]
                .some(field => field.toLowerCase().includes(searchTerm))
            );
            displaySearchResults(filteredBooks);
            $resultsPopup.show();
        } else {
            $resultsPopup.hide();
        }
    });

    // Close search results when clicking outside
    $(window).click(function(e) {
        if ($(e.target).is('#searchResultsPopup')) $('#searchResultsPopup').hide();
    });

    // Parallax effect and fade-in animations
    $(window).scroll(function() {
        const scroll = $(this).scrollTop();

        // Parallax effect for header image
        $('.about-image img').css('transform', `translateY(${scroll * 0.3}px)`);

        // Fade-in effect
        $('.mission-card, .about-description p').each(function() {
            if (scroll > $(this).offset().top - $(window).height() + 100) {
                $(this).addClass('fade-in');
            }
        });
    });

    // Hover effect for mission cards
    $('.mission-card').hover(
        function() { $(this).find('i').addClass('fa-bounce'); },
        function() { $(this).find('i').removeClass('fa-bounce'); }
    );
});

// Helper Functions
function validateForm() {
    const fullName = $('#fullName').val();
    const phone = $('#phone').val();
    const email = $('#email').val();
    const dob = $('#dob').val();
    const nationalNumber = $('#nationalNumber').val();

    if (!/[\u0600-\u06FF\s]+/.test(fullName)) {
        alert('الرجاء إدخال الاسم باللغة العربية');
        return false;
    }
    if (!/^09\d{8}$/.test(phone)) {
        alert('رقم الهاتف يجب أن يبدأ ب 09 ويتكون من 10 أرقام');
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('الرجاء إدخال بريد إلكتروني صحيح');
        return false;
    }
    if (!dob) {
        alert('الرجاء اختيار تاريخ الميلاد');
        return false;
    }
    if (!/^\d{11}$/.test(nationalNumber)) {
        alert('الرجاء إدخال الرقم الوطني كاملاً (11 رقمًا)');
        return false;
    }
    return true;
}

function getSelectedBook() {
    const $selected = $('input[name="choos book"]:checked');
    if (!$selected.length) return null;

    const $row = $selected.closest('tr');
    return {
        title: $row.find('td:nth-child(4)').text().trim(),
        price: $row.find('td:nth-child(3)').text().trim(),
        code: $row.find('td:nth-child(5)').text().trim()
    };
}

function showBookConfirmation(book) {
    const confirmationWindow = window.open('', 'BookConfirmation', 'width=400,height=300');
    confirmationWindow.document.write(`
        <html dir="rtl">
        <head><title>تأكيد الطلب</title></head>
        <body style="font-family: Arial; background: #f5f5f5; padding: 20px;">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2>تأكيد الطلب</h2>
                <p><strong>عنوان الكتاب:</strong> ${book.title}</p>
                <p><strong>السعر:</strong> ${book.price}</p>
                <p><strong>رمز الكتاب:</strong> ${book.code}</p>
                <p style="color: #28a745; font-weight: bold;">تم تأكيد طلبك بنجاح!</p>
            </div>
        </body>
        </html>
    `);
}

function displaySearchResults(results) {
    const $grid = $('#searchResultsGrid');
    if (!results.length) {
        $grid.html('<div class="no-results">لا توجد نتائج</div>');
        return;
    }

    $grid.html(results.map(book => `
        <div class="search-book-card">
            <img src="${book.image}" alt="${book.title}">
            <div>
                <h3>${book.title}</h3>
                <p class="author">${book.author}</p>
                <p class="category">${book.category}</p>
                <p class="price">${book.price} ل.س</p>
                <button onclick="showNotification('خدمة الطلب غير متوفرة حالياً')" class="submit-btn">اطلب الآن</button>
            </div>
        </div>
    `).join(''));
}

function showNotification(message) {
    const $notification = $('#notification');
    if ($notification.length) {
        $notification.html(`<p>${message}</p>`)
            .css('background', 'linear-gradient(45deg, #ff0000, #ff6b6b)')
            .fadeIn().delay(3000).fadeOut();
    }
}