// Professional JavaScript with modern syntax
document.addEventListener('DOMContentLoaded', function() {
    const moveBtn = document.getElementById('moveBtn');
    const innerDiv = document.getElementById('innerDiv');

    moveBtn.addEventListener('click', function() {
        innerDiv.classList.toggle('moved');
    });
});