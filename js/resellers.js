// js/resellers.js
document.addEventListener('DOMContentLoaded', function() {
    const resellersListElement = document.getElementById('resellersList');

    if (!resellersListElement) {
        console.error('Resellers list element (resellersList) not found.');
        return;
    }

    async function fetchAndDisplayResellers() {
        try {
            const response = await fetch('resellers.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const resellers = await response.json();

            if (resellers && resellers.length > 0) {
                resellersListElement.innerHTML = '';

                const ul = document.createElement('ul');
                ul.className = 'reseller-list-ul';


                resellers.forEach(reseller => {
                    const li = document.createElement('li');
                    // Use the generic 'card' class for styling, plus a specific class
                    li.className = 'card reseller-list-item';

                    const nameElement = document.createElement('h4');
                    nameElement.textContent = reseller.name;
                    li.appendChild(nameElement);

                    const locationElement = document.createElement('p');
                    locationElement.innerHTML = `<i class="icon-location"></i> ${reseller.location}`; // Removed "الموقع:" for cleaner look, icon implies it
                    li.appendChild(locationElement);

                    const contactElement = document.createElement('p');
                    contactElement.innerHTML = `<i class="icon-phone"></i> <a href="tel:${reseller.contact}">${reseller.contact}</a>`; // Removed "للتواصل:"
                    li.appendChild(contactElement);

                    ul.appendChild(li);
                });
                resellersListElement.appendChild(ul);
            } else {
                resellersListElement.innerHTML = '<p>لا توجد نقاط بيع متاحة حاليًا.</p>';
            }
        } catch (error) {
            console.error('Error fetching or displaying resellers:', error);
            resellersListElement.innerHTML = '<p>خطأ في تحميل قائمة نقاط البيع. الرجاء المحاولة مرة أخرى لاحقًا.</p>';
        }
    }

    fetchAndDisplayResellers();
});
