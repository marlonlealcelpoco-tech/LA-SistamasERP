const token = sessionStorage.getItem('la_token');
const session = JSON.parse(sessionStorage.getItem('la_session') || 'null');

if (!token) {
  window.location.href = './login.html';
  throw new Error('Sessão não autenticada.');
}

const items = [...document.querySelectorAll('.menu-item')];
const title = document.getElementById('pageTitle');

async function bootstrapSession() {
  try {
    const result = await getCurrentUser();
    const user = result.user;
    sessionStorage.setItem('la_session', JSON.stringify(user));

    document.getElementById('userName').textContent = user.name || 'Usuário';
    document.getElementById('userRole').textContent = Array.isArray(user.roles) && user.roles.length
      ? user.roles.join(' • ')
      : 'Sem perfil informado';
    document.getElementById('avatar').textContent = (user.name || 'US')
      .split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  } catch (error) {
    if (error.status === 401) {
      sessionStorage.removeItem('la_token');
      sessionStorage.removeItem('la_session');
      window.location.href = './login.html';
      return;
    }

    // Mantém a sessão já confirmada pelo login caso a API esteja temporariamente indisponível.
    if (session) {
      document.getElementById('userName').textContent = session.name || 'Usuário';
      document.getElementById('userRole').textContent = Array.isArray(session.roles) && session.roles.length
        ? session.roles.join(' • ')
        : 'Sessão';
    }
  }
}

items.forEach(item => item.addEventListener('click', event => {
  event.preventDefault();
  items.forEach(element => element.classList.remove('active'));
  item.classList.add('active');
  title.textContent = item.querySelector('span:last-child').textContent;
  history.replaceState(null, '', `#${item.dataset.module.toLowerCase()}`);
  document.querySelector('.sidebar').classList.remove('hidden');
}));

document.getElementById('logout').onclick = () => {
  sessionStorage.removeItem('la_token');
  sessionStorage.removeItem('la_session');
  window.location.href = './login.html';
};

document.getElementById('mobileMenu').onclick = () => document.querySelector('.sidebar').classList.toggle('hidden');
document.getElementById('currentDate').textContent = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date());

bootstrapSession();
