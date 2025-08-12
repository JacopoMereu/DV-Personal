window.onload = main;

function main() {
    toogle_captions();
    make_accordions();
    make_selected_text_yellow();
}

function toogle_captions() {
// Get all images with captions
    const imagesWithCaptions = document.querySelectorAll('img[title]');

    imagesWithCaptions.forEach(image => {
        const caption = image.getAttribute('title');
        const captionElement = document.createElement('span');
        captionElement.innerText = caption;
        captionElement.classList.add('caption');
        image.parentNode.insertBefore(captionElement, image.nextSibling);

        // Hide caption by default
        captionElement.style.display = 'none';

        // Toggle caption visibility on image click
        image.addEventListener('click', () => {
            captionElement.style.display = captionElement.style.display === 'none' ? 'block' : 'none';
        });
    });
}

function make_accordions() {
    const className = 'out';

    // Get all section headers
    const sectionHeaders = document.querySelectorAll('main section h2');
    sectionHeaders.forEach(header => {
        const section = header.parentElement;

        if (section.classList.contains(className)) {
            section.classList.toggle(className);
        }
        header.addEventListener('click', () => {
            section.classList.toggle(className);
        });
    });
}


function make_selected_text_yellow() {
    function highlightSelectedText() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const selectedText = range.toString();
            if (selectedText.length > 0) {
                const span = document.createElement('span');
                span.style.backgroundColor = 'yellow';
                span.classList.add('highlighted-text');
                range.surroundContents(span);
            }
        }
    }

    document.addEventListener('mouseup', highlightSelectedText);

}
