// js/changeSpeed.js
document.addEventListener('DOMContentLoaded', function() {
    const currentSpeedNameElement = document.getElementById('currentSpeedName');
    const newSpeedSelectionElement = document.getElementById('newSpeedSelection');
    const confirmButton = document.getElementById('confirmSpeedChange');

    let currentUsername = '';
    let currentSpeedValue = '';
    let plans = []; // To store plans from plans.json

    // Function to parse URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\[').replace(/[\]]/, '\]');
        const regex = new RegExp('[\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Function to fetch plans
    async function fetchPlans() {
        try {
            const response = await fetch('plans.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            plans = await response.json();
            return plans;
        } catch (error) {
            console.error('Error fetching plans.json:', error);
            newSpeedSelectionElement.innerHTML = '<p>خطأ في تحميل الباقات المتاحة.</p>';
            if(confirmButton) confirmButton.disabled = true;
            return [];
        }
    }

    // Function to display current package and populate new speed options
    async function initializePage() {
        currentUsername = getUrlParameter('username');
        currentSpeedValue = getUrlParameter('speed_value');

        await fetchPlans(); // Load plans

        let currentPlanName = 'غير محدد';
        const currentPlan = plans.find(plan => plan.speed_value === currentSpeedValue);
        if (currentPlan) {
            currentPlanName = currentPlan.name;
        } else if (currentSpeedValue) {
            currentPlanName = `سرعة (${currentSpeedValue.substring(0,8)}...)`;
        }

        if (currentSpeedNameElement) {
            currentSpeedNameElement.textContent = currentPlanName;
        }

        if (newSpeedSelectionElement && plans.length > 0) {
             // Keep existing error message if fetchPlans failed
            if (!newSpeedSelectionElement.innerHTML.includes('خطأ')) {
                newSpeedSelectionElement.innerHTML = ''; // Clear previous content

                const descriptiveParagraph = document.createElement('p');
                descriptiveParagraph.textContent = 'اختر السرعة الجديدة من القائمة:'; // More descriptive
                newSpeedSelectionElement.appendChild(descriptiveParagraph);

                const selectLabel = document.createElement('label');
                selectLabel.htmlFor = 'newSpeedSelect';
                selectLabel.className = 'form-label'; // Use the new class
                selectLabel.textContent = 'الباقات المتاحة:';

                const select = document.createElement('select');
                select.id = 'newSpeedSelect';
                select.name = 'newSpeed';
                select.className = 'login-input'; // Apply standard input styling class

                plans.forEach(plan => {
                    if (plan.speed_value !== currentSpeedValue) {
                        const option = document.createElement('option');
                        option.value = plan.speed_value;
                        option.textContent = `${plan.name} (${plan.price}, ${plan.duration})`;
                        select.appendChild(option);
                    }
                });

                if (select.options.length === 0) {
                     newSpeedSelectionElement.innerHTML = '<p>لا توجد باقات أخرى متاحة حاليًا لتغيير السرعة إليها.</p>'; // More specific message
                     if(confirmButton) confirmButton.disabled = true;
                } else {
                    newSpeedSelectionElement.appendChild(selectLabel); // Add label
                    newSpeedSelectionElement.appendChild(select);    // Add select
                }
            }
        } else if (plans.length === 0 && newSpeedSelectionElement && !newSpeedSelectionElement.innerHTML.includes('خطأ')) {
             newSpeedSelectionElement.innerHTML = '<p>لا توجد باقات متاحة حاليًا لتغيير السرعة إليها.</p>';
             if(confirmButton) confirmButton.disabled = true;
        }
    }

    if (confirmButton) {
        confirmButton.addEventListener('click', function() {
            const newSpeedSelect = document.getElementById('newSpeedSelect');
            if (!newSpeedSelect || !newSpeedSelect.value) {
                alert('يرجى اختيار باقة جديدة.');
                return;
            }
            const newSpeedValue = newSpeedSelect.value;

            if (currentUsername && newSpeedValue) {
                try {
                    localStorage.setItem('pendingSpeedChange', JSON.stringify({
                        username: currentUsername,
                        newSpeed: newSpeedValue,
                        timestamp: new Date().getTime()
                    }));

                    const logoutUrlParam = getUrlParameter('logout_url');
                    let logoutRedirect = logoutUrlParam ? logoutUrlParam : 'logout.html'; // Use passed URL or fallback

                    console.log(`Preparing to change speed for ${currentUsername} to ${newSpeedValue}. Logging out via ${logoutRedirect}`);
                    window.location.href = logoutRedirect;

                } catch (e) {
                    console.error('Failed to save pending speed change to localStorage:', e);
                    alert('حدث خطأ أثناء محاولة تغيير السرعة. الرجاء المحاولة مرة أخرى.');
                }
            } else {
                alert('بيانات المستخدم أو السرعة الجديدة غير متوفرة.');
            }
        });
    }

    initializePage();
});
