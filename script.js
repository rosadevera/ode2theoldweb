$(document).ready(function() {

    $(".popup").draggable({
        start: function() {
            // When dragging starts, bring to front
            bringToFront($(this));
        }
    });
    
    // Function to bring popup to front
    let highestZIndex = 10;
    function bringToFront($popup) {
        highestZIndex += 1;
        $popup.css("z-index", highestZIndex);
    }

    // Click handler for popups
    $(".popup").on('click', function(e) {
        if (e.target === this) { // Only if clicking the popup itself (not children)
            bringToFront($(this));
        }
    });

    // Also bring to front when opening via icon
    function openPopup($popup) {
        $popup.removeClass('hidden');
        bringToFront($popup);
    }
    
    // clock!
    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0'); 
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
    }
    setInterval(updateTime, 1000);
    updateTime();

    // Map of popup IDs to their icon images
    const appIcons = {
        'about': './media/about.png',
        'tools': './media/tools.png',
        'preview': './media/imagefile.png'
    };

    // Function to update bottom apps
    function updateBottomApp(popupId, shouldShow) {
        const $openApps = $('#openapps');
        const $existingIcon = $openApps.find(`[data-popup="${popupId}"]`);
        
        if (shouldShow) {
            if ($existingIcon.length === 0) {
                $openApps.append(`
                    <div class="button" data-popup="${popupId}">
                        <img src="${appIcons[popupId]}" width="25px">
                    </div>
                `);
                
                // Make the new icon clickable to open the popup
                $(`[data-popup="${popupId}"]`).click(function() {
                    $(`#${popupId}`).removeClass('hidden');
                });
            }
        } else {
            $existingIcon.remove();
        }
    }

    // Handle desktop icon clicks
    $("#abouticon").click(function() {
        const $popup = $("#about");
        const isOpening = $popup.hasClass('hidden');
        $popup.toggleClass("hidden");
        updateBottomApp('about', isOpening);
    });

    $("#toolsicon").click(function() {
        const $popup = $("#tools");
        const isOpening = $popup.hasClass('hidden');
        $popup.toggleClass("hidden");
        updateBottomApp('tools', isOpening);
    });

    $("#previewicon").click(function() {
        const $popup = $("#preview");
        const isOpening = $popup.hasClass('hidden');
        $popup.toggleClass("hidden");
        updateBottomApp('preview', isOpening);
    });

    // Handle X button clicks
    $(".x-button").click(function(e) {
        e.stopPropagation();
        const $popup = $(this).closest(".popup");
        $popup.addClass("hidden");
        updateBottomApp($popup.attr('id'), false);
    });

    updateBottomApp('tools', true);
    updateBottomApp('preview', true);

    $("#about").click(function(e) {
        if (e.target === this) {
            // Reset all popups to z-index: 10 (or your default)
            $(".popup").css("z-index", "10");
            $(this).css("z-index", "999");
        }
    });
    
    $("#tools").click(function(e) {
        if (e.target === this) {
            // Reset all popups to z-index: 10 (or your default)
            $(".popup").css("z-index", "10");
            $(this).css("z-index", "999");
        }
    });

    $("#preview").click(function(e) {
        if (e.target === this) {
            // Reset all popups to z-index: 10 (or your default)
            $(".popup").css("z-index", "10");
            $(this).css("z-index", "999");
        }
    });


const $backgroundTab = $("#backgroundtab");
const $imageTab = $("#imagetab");
const $textTab = $("#texttab");
const $effectsTab = $("#effectstab");

const $backgroundSection = $(".background");
const $imageSection = $(".image");
const $textSection = $(".text");
const $effectsSection = $(".effects");

// Tab click handlers
$backgroundTab.click(function() {
    showSection($backgroundSection);
    setActiveTab($backgroundTab);
});

$imageTab.click(function() {
    showSection($imageSection);
    setActiveTab($imageTab);
});

$textTab.click(function() {
    showSection($textSection);
    setActiveTab($textTab);
});

$effectsTab.click(function() {
    showSection($effectsSection);
    setActiveTab($effectsTab);
});

// Helper functions
function showSection($section) {
    // Hide all sections
    $backgroundSection.addClass("hidden");
    $imageSection.addClass("hidden");
    $textSection.addClass("hidden");
    $effectsSection.addClass("hidden");
    
    // Show the selected section
    $section.removeClass("hidden");
}

function setActiveTab($tab) {
    // Remove active class from all tabs
    $backgroundTab.removeClass("active");
    $imageTab.removeClass("active");
    $textTab.removeClass("active");
    $effectsTab.removeClass("active");
    
    // Add active class to clicked tab
    $tab.addClass("active");
}

// Initialize - show background section by default
$(document).ready(function() {
    showSection($backgroundSection);
    setActiveTab($backgroundTab);
});
});