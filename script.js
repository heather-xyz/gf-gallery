const cloudName = 'dxbluyix5';
const uploadPreset = 'gf-gallery';
const galleryGrid = document.getElementById('galleryGrid');

// --------------------------
// Reveal on scroll
// --------------------------
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add('in');
  });
},{threshold:0.15});
revealEls.forEach(el=>io.observe(el));

// --------------------------
// Gallery functions
// --------------------------
function addPlate(src,title){
  const div = document.createElement('div');
  div.className = 'plate card';
  div.dataset.title = title || '';
  div.innerHTML = `<img src="${src}" alt="${title || 'Plate'}"><div class="meta">${title || ''}</div>`;
  div.addEventListener('click',()=>{openLightbox(src,title)});
  galleryGrid.appendChild(div);
}

function openLightbox(src,title){
  const lightbox = document.getElementById('lightbox');
  const lightImg = document.getElementById('lightImg');
  lightImg.src = src; lightImg.alt = title || '';
  lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false');
}

// Close lightbox
document.getElementById('closeLight').addEventListener('click',()=>{
  document.getElementById('lightbox').classList.remove('open');
  document.getElementById('lightbox').setAttribute('aria-hidden','true');
});
document.getElementById('lightbox').addEventListener('click', e=>{
  if(e.target===document.getElementById('lightbox')){
    document.getElementById('lightbox').classList.remove('open');
    document.getElementById('lightbox').setAttribute('aria-hidden','true');
  }
});

// --------------------------
// Fetch gallery JSON
// --------------------------
async function fetchGallery(){
  // Static cat images from assets folder
  const catImages = [
    { src: 'assets/cat1.jpg', title: 'Meh' },
    { src: 'assets/cat2.jpg', title: 'Bleeh' },
    { src: 'assets/cat3.jpg', title: 'Ehek' },
    { src: 'assets/cat4.jpg', title: 'Ergghh' },
    { src: 'assets/cat5.jpg', title: 'Ihhhhhh' }
  ];
  galleryGrid.innerHTML = '';
  catImages.forEach(img => {
    addPlate(img.src, img.title);
  });
}
fetchGallery();

// --------------------------
// Unsigned upload
// --------------------------
document.getElementById('uploadBtn').addEventListener('click', async () => {
  const file = document.getElementById('fileInput').files[0];
  const msg = document.getElementById('uploadMsg');
  if (!file) {
    msg.textContent = 'Select a file first';
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('tags', 'gf-gallery');

  try {
    msg.textContent = 'Uploading...';
    const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    msg.textContent = 'Upload successful!';
    addPlate(res.data.secure_url, res.data.original_filename);
  } catch (err) {
    console.error(err);
    msg.textContent = 'Upload failed. Check your preset name and unsigned status in Cloudinary.';
  }
});

// --------------------------
// Keyboard escape closes lightbox
// --------------------------
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    document.getElementById('lightbox').classList.remove('open');
    document.getElementById('lightbox').setAttribute('aria-hidden','true');
  }
});
