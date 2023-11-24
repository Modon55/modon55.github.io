var unsereSchuleLink = document.getElementById('about');
var dropdownContent = document.querySelector('.dropdown-content');
var arrowIcon = document.getElementById('arrowIcon');
var isOpen = false;
var isAnimating = false;

    unsereSchuleLink.addEventListener('click', function (event) {
        event.preventDefault();

        if (isAnimating) {
            return;
        }

        isAnimating = true;

        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    });

    document.addEventListener('click', function (event) {
        if (!dropdownContent.contains(event.target) && event.target !== unsereSchuleLink && isOpen) {
            closeDropdown();
        }
    });

    dropdownContent.addEventListener('click', function (event) {
        event.stopPropagation();
    });

    function openDropdown() {
        dropdownContent.style.display = 'block';
        dropdownContent.style.animation = 'slideIn 0.2s ease';

        setTimeout(function () {
            isAnimating = false;
            isOpen = true;
        }, 100);
    }

    function closeDropdown() {
        dropdownContent.style.animation = 'slideOut 0.2s ease';

        setTimeout(function () {
            dropdownContent.style.display = 'none';
            dropdownContent.style.animation = '';
            isOpen = false;
            isAnimating = false;
        }, 100);
    }

    document.getElementById('about').addEventListener('click', function() {
        dropdownContent.classList.toggle('show');
        
        arrowIcon.style.transition = 'transform 0.4s ease';
        arrowIcon.style.transform = dropdownContent.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)';
    });
    
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.about-dropdown')) {
            dropdownContent.classList.remove('show');
            arrowIcon.style.transition = 'transform 0.4s ease';
            arrowIcon.style.transform = 'rotate(0deg)';
        }
    });

const navLinkEls = document.querySelectorAll('.nav_link');
const windowPathname = window.location.pathname;

navLinkEls.forEach(navLinkEls => {
    const navLinkPathname = new URL(navLinkEls.href).pathname;

    if ((windowPathname === navLinkPathname) || (windowPathname === '/index.html' && navLinkPathname === '/')) {
        navLinkEls.classList.add('active');
    }
})