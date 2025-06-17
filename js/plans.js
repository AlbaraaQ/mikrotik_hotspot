// js/plans.js
document.addEventListener('DOMContentLoaded', function() {
    const plansContainer = document.getElementById('plansContainer');

    if (!plansContainer) {
        console.error('Plans container element (plansContainer) not found.');
        return;
    }

    async function fetchAndDisplayPlans() {
        try {
            const response = await fetch('plans.json'); // Assuming plans.json is in the root
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const plans = await response.json();

            if (plans && plans.length > 0) {
                plansContainer.innerHTML = ''; // Clear any loading message
                plans.forEach(plan => {
                    const card = document.createElement('div');
                    card.className = 'plan-card'; // Use class from custom.css

                    const nameElement = document.createElement('h3');
                    nameElement.textContent = plan.name;
                    card.appendChild(nameElement);

                    const speedElement = document.createElement('p');
                    // The actual speed value (like '55987b0d-...') is not usually human-readable.
                    // The plan 'name' should ideally represent the speed tier.
                    speedElement.textContent = `السرعة: ${plan.name}`; // Or some other field like plan.speed_description
                    card.appendChild(speedElement);

                    const priceElement = document.createElement('p');
                    priceElement.textContent = `السعر: ${plan.price}`;
                    card.appendChild(priceElement);

                    const durationElement = document.createElement('p');
                    durationElement.textContent = `المدة: ${plan.duration}`;
                    card.appendChild(durationElement);

                    const chooseButton = document.createElement('button');
                    chooseButton.textContent = 'اختر هذه الباقة';
                    chooseButton.className = 'button'; // Assuming a general button style exists
                    chooseButton.addEventListener('click', function() {
                        // Redirect to index.html (login page) with the speed_value as a parameter
                        window.location.href = `index.html?speed_value=${encodeURIComponent(plan.speed_value)}`;
                    });
                    card.appendChild(chooseButton);

                    plansContainer.appendChild(card);
                });
            } else {
                plansContainer.innerHTML = '<p>لا توجد باقات متاحة حاليًا.</p>';
            }
        } catch (error) {
            console.error('Error fetching or displaying plans:', error);
            plansContainer.innerHTML = '<p>خطأ في تحميل الباقات. الرجاء المحاولة مرة أخرى لاحقًا.</p>';
        }
    }

    fetchAndDisplayPlans();
});
