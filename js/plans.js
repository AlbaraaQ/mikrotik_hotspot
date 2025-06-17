// js/plans.js
document.addEventListener('DOMContentLoaded', function() {
    const plansContainer = document.getElementById('plansContainer');

    if (!plansContainer) {
        console.error('Plans container element (plansContainer) not found.');
        return;
    }

    async function fetchAndDisplayPlans() {
        try {
            const response = await fetch('plans.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const plans = await response.json();

            if (plans && plans.length > 0) {
                plansContainer.innerHTML = '';
                plans.forEach(plan => {
                    const card = document.createElement('div');
                    // Use the generic 'card' class for styling, can add 'plan-card-item' for specific overrides
                    card.className = 'card plan-card-item'; // Ensuring it gets .card styles, plus a specific class

                    const nameElement = document.createElement('h3'); // h3 for card titles
                    nameElement.textContent = plan.name;
                    card.appendChild(nameElement);

                    const speedElement = document.createElement('p');
                    speedElement.textContent = `السرعة: ${plan.name}`;
                    card.appendChild(speedElement);

                    const priceElement = document.createElement('p');
                    priceElement.textContent = `السعر: ${plan.price}`;
                    card.appendChild(priceElement);

                    const durationElement = document.createElement('p');
                    durationElement.textContent = `المدة: ${plan.duration}`;
                    card.appendChild(durationElement);

                    const chooseButton = document.createElement('button');
                    chooseButton.textContent = 'اختر هذه الباقة';
                    // Apply primary button styling
                    chooseButton.className = 'button button-primary';
                    chooseButton.style.width = '100%'; // Make button full width within card
                    chooseButton.style.marginTop = '15px'; // Add some space above button

                    chooseButton.addEventListener('click', function() {
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
