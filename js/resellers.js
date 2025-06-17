// js/resellers.js
document.addEventListener('DOMContentLoaded', function() {
    const resellersListElement = document.getElementById('resellersList');

    if (!resellersListElement) {
        console.error('Resellers list element (resellersList) not found.');
        return;
    }

    async function fetchAndDisplayResellers() {
        try {
            const response = await fetch('resellers.json'); // Assuming resellers.json is in the root
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const resellers = await response.json();

            if (resellers && resellers.length > 0) {
                resellersListElement.innerHTML = ''; // Clear any loading message

                const ul = document.createElement('ul');
                ul.className = 'reseller-list-ul'; // Add a class for styling if needed

                resellers.forEach(reseller => {
                    const li = document.createElement('li');
                    li.className = 'reseller-item'; // Use class from custom.css

                    const nameElement = document.createElement('h4'); // Changed to h4 for better semantics than h3 if multiple items
                    nameElement.textContent = reseller.name;
                    li.appendChild(nameElement);

                    const locationElement = document.createElement('p');
                    locationElement.innerHTML = `<i class="icon-location"></i> الموقع: ${reseller.location}`; // Assuming icon-location exists in Fontello
                    li.appendChild(locationElement);

                    const contactElement = document.createElement('p');
                    // Make phone numbers clickable with tel: link
                    contactElement.innerHTML = `<i class="icon-phone"></i> للتواصل: <a href="tel:${reseller.contact}">${reseller.contact}</a>`; // Assuming icon-phone exists
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
