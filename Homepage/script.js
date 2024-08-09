let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('nav div div ul li a');

window.onscroll = ()=>{
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 100;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

       

        if(top >= offset && top< offset + height){
            navLinks.forEach(links =>{
                links.classList.remove('active');
                document.querySelector('nav div div ul li a[href*=' + id + ']').classList.add('active');
            })
        }
    })
}

const toggleButton = document.getElementById('nav-toggle');
const navlinks = document.getElementById('nav-links');

toggleButton.addEventListener('click', ()=>{
    navlinks.classList.toggle('active');
})


// Toggle mobile menu
document.getElementById('nav-toggle').addEventListener('click', function () {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('show');
});

