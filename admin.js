class AdminPanel {
  constructor() {
    this.currentEditItem = null;
    this.currentEditIndex = null;
    this.currentEditSection = null;
    this.init();
  }

  init() {
    this.loadAllContent();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Navigation tabs
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchSection(e.target.dataset.section));
    });

    // Add buttons
    document.getElementById('addVideoBtn')?.addEventListener('click', () => this.editVideo());
    document.getElementById('addClipBtn')?.addEventListener('click', () => this.editClip());
    document.getElementById('addScheduleBtn')?.addEventListener('click', () => this.editSchedule());
    document.getElementById('addNewsBtn')?.addEventListener('click', () => this.editNews());
    document.getElementById('addSocialBtn')?.addEventListener('click', () => this.editSocial());
    document.getElementById('saveAboutBtn')?.addEventListener('click', () => this.saveAbout());

    // Modal close
    document.querySelector('.modal-close')?.addEventListener('click', () => this.closeModal());
    document.getElementById('editModal')?.addEventListener('click', (e) => {
      if (e.target.id === 'editModal') this.closeModal();
    });

    // Export/Import
    document.getElementById('downloadBtn')?.addEventListener('click', () => this.exportData());
    document.getElementById('uploadBtn')?.addEventListener('click', () => document.getElementById('importFile').click());
    document.getElementById('importFile')?.addEventListener('change', (e) => this.importData(e));
  }

  loadAllContent() {
    this.renderVideos();
    this.renderClips();
    this.renderSchedule();
    this.renderNews();
    this.renderAbout();
    this.renderSocial();
  }

  switchSection(section) {
    document.querySelectorAll('.section-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(section)?.classList.add('active');
    event.target.classList.add('active');
  }

  // VIDEOS
  renderVideos() {
    const list = document.getElementById('videosList');
    list.innerHTML = '';

    siteContent.videos.forEach((video, index) => {
      const div = document.createElement('div');
      div.className = 'item-card';
      div.innerHTML = `
        <div class="item-info">
          <h4>${video.title_no}</h4>
          <p>YouTube ID: ${video.videoId}</p>
          <p class="item-desc">${video.description_no.substring(0, 60)}...</p>
        </div>
        <div class="item-actions">
          <button class="btn-edit" onclick="admin.editVideo(${index})">Rediger</button>
          <button class="btn-delete" onclick="admin.deleteVideo(${index})">Slett</button>
        </div>
      `;
      list.appendChild(div);
    });
  }

  editVideo(index) {
    const video = index !== undefined ? siteContent.videos[index] : { title_no: '', title_en: '', videoId: '', description_no: '', description_en: '' };
    this.currentEditIndex = index;
    this.currentEditSection = 'videos';

    const form = document.getElementById('modalForm');
    form.innerHTML = `
      <h3>${index !== undefined ? 'Rediger video' : 'Legg til video'}</h3>
      <div class="form-group">
        <label>Tittel (Norsk):</label>
        <input type="text" id="title_no" value="${video.title_no}" placeholder="F.eks. Gaming tutorial del 1">
      </div>
      <div class="form-group">
        <label>Title (English):</label>
        <input type="text" id="title_en" value="${video.title_en}" placeholder="E.g. Gaming tutorial part 1">
      </div>
      <div class="form-group">
        <label>YouTube Video ID:</label>
        <input type="text" id="videoId" value="${video.videoId}" placeholder="F.eks. dQw4w9WgXcQ">
        <p style="font-size:0.85rem;color:#7f8c8d;margin-top:5px">Fra YouTube URL: youtube.com/watch?v=<strong>DETTE_ER_ID_EN</strong></p>
      </div>
      <div class="form-group">
        <label>Beskrivelse (Norsk):</label>
        <textarea id="description_no" placeholder="Kort beskrivelse av videoen...">${video.description_no}</textarea>
      </div>
      <div class="form-group">
        <label>Description (English):</label>
        <textarea id="description_en" placeholder="Short description of the video...">${video.description_en}</textarea>
      </div>
      <button class="btn-save" onclick="admin.saveVideo()">Lagre video</button>
    `;
    document.getElementById('editModal').classList.add('active');
  }

  saveVideo() {
    const video = {
      title_no: document.getElementById('title_no').value,
      title_en: document.getElementById('title_en').value,
      videoId: document.getElementById('videoId').value,
      description_no: document.getElementById('description_no').value,
      description_en: document.getElementById('description_en').value
    };

    if (this.currentEditIndex !== undefined) {
      siteContent.videos[this.currentEditIndex] = video;
    } else {
      siteContent.videos.push(video);
    }

    this.renderVideos();
    this.closeModal();
    this.showMessage('Video lagret!');
  }

  deleteVideo(index) {
    if (confirm('Er du sikker?')) {
      siteContent.videos.splice(index, 1);
      this.renderVideos();
      this.showMessage('Video slettet!');
    }
  }

  // CLIPS
  renderClips() {
    const list = document.getElementById('clipsList');
    list.innerHTML = '';

    siteContent.clips.forEach((clip, index) => {
      const div = document.createElement('div');
      div.className = 'item-card';
      div.innerHTML = `
        <div class="item-info">
          <h4>${clip.title_no}</h4>
          <p>URL: ${clip.url.substring(0, 50)}...</p>
        </div>
        <div class="item-actions">
          <button class="btn-edit" onclick="admin.editClip(${index})">Rediger</button>
          <button class="btn-delete" onclick="admin.deleteClip(${index})">Slett</button>
        </div>
      `;
      list.appendChild(div);
    });
  }

  editClip(index) {
    const clip = index !== undefined ? siteContent.clips[index] : { title_no: '', title_en: '', url: '', thumbnail: '' };
    this.currentEditIndex = index;
    this.currentEditSection = 'clips';

    const form = document.getElementById('modalForm');
    form.innerHTML = `
      <h3>${index !== undefined ? 'Rediger klipp' : 'Legg til klipp'}</h3>
      <div class="form-group">
        <label>Tittel (Norsk):</label>
        <input type="text" id="title_no" value="${clip.title_no}" placeholder="F.eks. Kampens høydepunkt">
      </div>
      <div class="form-group">
        <label>Title (English):</label>
        <input type="text" id="title_en" value="${clip.title_en}" placeholder="E.g. Match highlight">
      </div>
      <div class="form-group">
        <label>Clip URL:</label>
        <input type="url" id="url" value="${clip.url}" placeholder="https://www.twitch.tv/geggi1984/clip/...">
      </div>
      <div class="form-group">
        <label>Thumbnail URL:</label>
        <input type="url" id="thumbnail" value="${clip.thumbnail}" placeholder="https://...">
      </div>
      <button class="btn-save" onclick="admin.saveClip()">Lagre klipp</button>
    `;
    document.getElementById('editModal').classList.add('active');
  }

  saveClip() {
    const clip = {
      title_no: document.getElementById('title_no').value,
      title_en: document.getElementById('title_en').value,
      url: document.getElementById('url').value,
      thumbnail: document.getElementById('thumbnail').value
    };

    if (this.currentEditIndex !== undefined) {
      siteContent.clips[this.currentEditIndex] = clip;
    } else {
      siteContent.clips.push(clip);
    }

    this.renderClips();
    this.closeModal();
    this.showMessage('Klipp lagret!');
  }

  deleteClip(index) {
    if (confirm('Er du sikker?')) {
      siteContent.clips.splice(index, 1);
      this.renderClips();
      this.showMessage('Klipp slettet!');
    }
  }

  // SCHEDULE
  renderSchedule() {
    const list = document.getElementById('scheduleList');
    list.innerHTML = '';

    const days_no = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];

    siteContent.schedule.forEach((slot, index) => {
      const div = document.createElement('div');
      div.className = 'item-card';
      div.innerHTML = `
        <div class="item-info">
          <h4>${slot.day_no} - ${slot.time}</h4>
          <p>${slot.game_no} | Status: ${slot.status_no}</p>
        </div>
        <div class="item-actions">
          <button class="btn-edit" onclick="admin.editSchedule(${index})">Rediger</button>
          <button class="btn-delete" onclick="admin.deleteSchedule(${index})">Slett</button>
        </div>
      `;
      list.appendChild(div);
    });
  }

  editSchedule(index) {
    const slot = index !== undefined ? siteContent.schedule[index] : { day_no: 'Mandag', day_en: 'Monday', time: '19:00', game_no: '', game_en: '', status_no: 'Planlagt', status_en: 'Scheduled' };
    this.currentEditIndex = index;

    const form = document.getElementById('modalForm');
    form.innerHTML = `
      <h3>${index !== undefined ? 'Rediger streamtid' : 'Legg til streamtid'}</h3>
      <div class="form-group">
        <label>Dag:</label>
        <select id="day_no" style="width:100%;padding:12px;border:1px solid #bdc3c7;border-radius:6px;">
          <option value="Mandag" ${slot.day_no === 'Mandag' ? 'selected' : ''}>Mandag</option>
          <option value="Tirsdag" ${slot.day_no === 'Tirsdag' ? 'selected' : ''}>Tirsdag</option>
          <option value="Onsdag" ${slot.day_no === 'Onsdag' ? 'selected' : ''}>Onsdag</option>
          <option value="Torsdag" ${slot.day_no === 'Torsdag' ? 'selected' : ''}>Torsdag</option>
          <option value="Fredag" ${slot.day_no === 'Fredag' ? 'selected' : ''}>Fredag</option>
          <option value="Lørdag" ${slot.day_no === 'Lørdag' ? 'selected' : ''}>Lørdag</option>
          <option value="Søndag" ${slot.day_no === 'Søndag' ? 'selected' : ''}>Søndag</option>
        </select>
      </div>
      <div class="form-group">
        <label>Tid (HH:MM):</label>
        <input type="time" id="time" value="${slot.time}">
      </div>
      <div class="form-group">
        <label>Spill (Norsk):</label>
        <input type="text" id="game_no" value="${slot.game_no}" placeholder="F.eks. Counter-Strike 2">
      </div>
      <div class="form-group">
        <label>Game (English):</label>
        <input type="text" id="game_en" value="${slot.game_en}" placeholder="E.g. Counter-Strike 2">
      </div>
      <div class="form-group">
        <label>Status (Norsk):</label>
        <select id="status_no" style="width:100%;padding:12px;border:1px solid #bdc3c7;border-radius:6px;">
          <option value="Planlagt" ${slot.status_no === 'Planlagt' ? 'selected' : ''}>Planlagt</option>
          <option value="Live" ${slot.status_no === 'Live' ? 'selected' : ''}>Live</option>
        </select>
      </div>
      <button class="btn-save" onclick="admin.saveSchedule()">Lagre streamtid</button>
    `;
    document.getElementById('editModal').classList.add('active');
  }

  saveSchedule() {
    const dayMap = {
      'Mandag': 'Monday',
      'Tirsdag': 'Tuesday',
      'Onsdag': 'Wednesday',
      'Torsdag': 'Thursday',
      'Fredag': 'Friday',
      'Lørdag': 'Saturday',
      'Søndag': 'Sunday'
    };
    const statusMap = {
      'Planlagt': 'Scheduled',
      'Live': 'Live'
    };

    const day_no = document.getElementById('day_no').value;
    const slot = {
      day_no: day_no,
      day_en: dayMap[day_no],
      time: document.getElementById('time').value,
      game_no: document.getElementById('game_no').value,
      game_en: document.getElementById('game_en').value,
      status_no: document.getElementById('status_no').value,
      status_en: statusMap[document.getElementById('status_no').value]
    };

    if (this.currentEditIndex !== undefined) {
      siteContent.schedule[this.currentEditIndex] = slot;
    } else {
      siteContent.schedule.push(slot);
    }

    this.renderSchedule();
    this.closeModal();
    this.showMessage('Streamtid lagret!');
  }

  deleteSchedule(index) {
    if (confirm('Er du sikker?')) {
      siteContent.schedule.splice(index, 1);
      this.renderSchedule();
      this.showMessage('Streamtid slettet!');
    }
  }

  // NEWS
  renderNews() {
    const list = document.getElementById('newsList');
    list.innerHTML = '';

    siteContent.news.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'item-card';
      div.innerHTML = `
        <div class="item-info">
          <h4>${item.title_no}</h4>
          <p>Dato: ${item.date}</p>
          <p class="item-desc">${item.excerpt_no.substring(0, 60)}...</p>
        </div>
        <div class="item-actions">
          <button class="btn-edit" onclick="admin.editNews(${index})">Rediger</button>
          <button class="btn-delete" onclick="admin.deleteNews(${index})">Slett</button>
        </div>
      `;
      list.appendChild(div);
    });
  }

  editNews(index) {
    const today = new Date().toISOString().split('T')[0];
    const news = index !== undefined ? siteContent.news[index] : { date: today, title_no: '', title_en: '', excerpt_no: '', excerpt_en: '' };
    this.currentEditIndex = index;

    const form = document.getElementById('modalForm');
    form.innerHTML = `
      <h3>${index !== undefined ? 'Rediger nyhet' : 'Legg til nyhet'}</h3>
      <div class="form-group">
        <label>Dato:</label>
        <input type="date" id="date" value="${news.date}">
      </div>
      <div class="form-group">
        <label>Tittel (Norsk):</label>
        <input type="text" id="title_no" value="${news.title_no}" placeholder="Nyhetstitel">
      </div>
      <div class="form-group">
        <label>Title (English):</label>
        <input type="text" id="title_en" value="${news.title_en}" placeholder="News title">
      </div>
      <div class="form-group">
        <label>Sammendrag (Norsk):</label>
        <textarea id="excerpt_no" placeholder="Kort beskrivelse av nyheten...">${news.excerpt_no}</textarea>
      </div>
      <div class="form-group">
        <label>Summary (English):</label>
        <textarea id="excerpt_en" placeholder="Short news summary...">${news.excerpt_en}</textarea>
      </div>
      <button class="btn-save" onclick="admin.saveNews()">Lagre nyhet</button>
    `;
    document.getElementById('editModal').classList.add('active');
  }

  saveNews() {
    const news = {
      date: document.getElementById('date').value,
      title_no: document.getElementById('title_no').value,
      title_en: document.getElementById('title_en').value,
      excerpt_no: document.getElementById('excerpt_no').value,
      excerpt_en: document.getElementById('excerpt_en').value
    };

    if (this.currentEditIndex !== undefined) {
      siteContent.news[this.currentEditIndex] = news;
    } else {
      siteContent.news.push(news);
    }

    this.renderNews();
    this.closeModal();
    this.showMessage('Nyhet lagret!');
  }

  deleteNews(index) {
    if (confirm('Er du sikker?')) {
      siteContent.news.splice(index, 1);
      this.renderNews();
      this.showMessage('Nyhet slettet!');
    }
  }

  // ABOUT
  renderAbout() {
    document.getElementById('aboutNo').value = siteContent.about.text_no;
    document.getElementById('aboutEn').value = siteContent.about.text_en;
  }

  saveAbout() {
    siteContent.about.text_no = document.getElementById('aboutNo').value;
    siteContent.about.text_en = document.getElementById('aboutEn').value;
    this.showMessage('Om meg-tekst lagret!');
  }

  // SOCIAL LINKS
  renderSocial() {
    const list = document.getElementById('socialList');
    list.innerHTML = '';

    siteContent.socialLinks.forEach((link, index) => {
      const div = document.createElement('div');
      div.className = 'item-card';
      div.innerHTML = `
        <div class="item-info">
          <h4>${link.icon} ${link.name}</h4>
          <p>${link.url}</p>
        </div>
        <div class="item-actions">
          <button class="btn-edit" onclick="admin.editSocial(${index})">Rediger</button>
          <button class="btn-delete" onclick="admin.deleteSocial(${index})">Slett</button>
        </div>
      `;
      list.appendChild(div);
    });
  }

  editSocial(index) {
    const link = index !== undefined ? siteContent.socialLinks[index] : { name: '', icon: '', url: '' };
    this.currentEditIndex = index;

    const form = document.getElementById('modalForm');
    form.innerHTML = `
      <h3>${index !== undefined ? 'Rediger sosial lenke' : 'Legg til sosial lenke'}</h3>
      <div class="form-group">
        <label>Navn:</label>
        <input type="text" id="name" value="${link.name}" placeholder="F.eks. Twitch">
      </div>
      <div class="form-group">
        <label>Emoji/Ikon:</label>
        <input type="text" id="icon" value="${link.icon}" placeholder="F.eks. 📺" maxlength="3">
      </div>
      <div class="form-group">
        <label>URL:</label>
        <input type="url" id="url" value="${link.url}" placeholder="https://">
      </div>
      <button class="btn-save" onclick="admin.saveSocial()">Lagre lenke</button>
    `;
    document.getElementById('editModal').classList.add('active');
  }

  saveSocial() {
    const link = {
      name: document.getElementById('name').value,
      icon: document.getElementById('icon').value,
      url: document.getElementById('url').value
    };

    if (this.currentEditIndex !== undefined) {
      siteContent.socialLinks[this.currentEditIndex] = link;
    } else {
      siteContent.socialLinks.push(link);
    }

    this.renderSocial();
    this.closeModal();
    this.showMessage('Sosial lenke lagret!');
  }

  deleteSocial(index) {
    if (confirm('Er du sikker?')) {
      siteContent.socialLinks.splice(index, 1);
      this.renderSocial();
      this.showMessage('Sosial lenke slettet!');
    }
  }

  closeModal() {
    document.getElementById('editModal').classList.remove('active');
  }

  showMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'message success';
    msg.textContent = text;
    document.querySelector('.admin-content').insertBefore(msg, document.querySelector('.admin-content').firstChild);
    setTimeout(() => msg.remove(), 3000);
  }

  exportData() {
    const dataStr = JSON.stringify(siteContent, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `geggi1984-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        Object.assign(siteContent, imported);
        this.loadAllContent();
        this.showMessage('Data importert!');
      } catch (err) {
        alert('Feil ved import: ' + err.message);
      }
    };
    reader.readAsText(file);
  }
}

const admin = new AdminPanel();
