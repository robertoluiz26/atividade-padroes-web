// Constantes
const MIN_AGE = 18;
// Data mínima baseada na maior idade registrada nos últimos 10 anos (aproximadamente 120 anos)
// Considerando 2024 como referência, data mínima seria 1904, mas usaremos 1900 para ser conservador
const MIN_BIRTH_DATE = '1900-01-01';
const MAX_BIRTH_DATE = new Date();
MAX_BIRTH_DATE.setFullYear(MAX_BIRTH_DATE.getFullYear() - MIN_AGE);
const MAX_BIRTH_DATE_STR = MAX_BIRTH_DATE.toISOString().split('T')[0];

// Elementos do formulário
const form = document.getElementById('musicForm');
const errorSummary = document.getElementById('error-summary');
const errorSummaryList = document.getElementById('error-summary-list');
const confirmationSummary = document.getElementById('confirmation-summary');
const summaryContent = document.getElementById('summary-content');

// Campos do formulário
const fields = {
    nome: document.getElementById('nome'),
    email: document.getElementById('email'),
    telefone: document.getElementById('telefone'),
    nascimento: document.getElementById('nascimento'),
    foto: document.getElementById('foto'),
    estilos: document.querySelectorAll('input[name="estilos[]"]'),
    albuns: document.querySelectorAll('input[name="albuns[]"]'),
    artistas: document.getElementById('artistas'),
    melhor_cantor: document.getElementById('melhor_cantor')
};

// Erros de validação
const errors = {};

// Configurar data máxima de nascimento
fields.nascimento.setAttribute('max', MAX_BIRTH_DATE_STR);

// Função para limpar erros de um campo
function clearFieldError(fieldName) {
    const errorElement = document.getElementById(`error-${fieldName}`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('error');
    }
    
    const field = fields[fieldName] || document.getElementById(fieldName);
    if (field) {
        field.classList.remove('error');
        field.classList.add('valid');
    }
    
    delete errors[fieldName];
}

// Função para mostrar erro em um campo
function showFieldError(fieldName, message) {
    const errorElement = document.getElementById(`error-${fieldName}`);
    if (errorElement) {
        errorElement.textContent = message;
    }
    
    const field = fields[fieldName] || document.getElementById(fieldName);
    if (field) {
        field.classList.add('error');
        field.classList.remove('valid');
    }
    
    errors[fieldName] = message;
}

// Validação de nome
function validateNome() {
    const nome = fields.nome.value.trim();
    if (!nome) {
        showFieldError('nome', 'O nome é obrigatório.');
        return false;
    }
    if (nome.length < 2) {
        showFieldError('nome', 'O nome deve ter pelo menos 2 caracteres.');
        return false;
    }
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nome)) {
        showFieldError('nome', 'O nome deve conter apenas letras e espaços.');
        return false;
    }
    clearFieldError('nome');
    return true;
}

// Validação de email
function validateEmail() {
    const email = fields.email.value.trim();
    if (!email) {
        showFieldError('email', 'O e-mail é obrigatório.');
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError('email', 'Por favor, insira um e-mail válido.');
        return false;
    }
    clearFieldError('email');
    return true;
}

// Validação de telefone
function validateTelefone() {
    const telefone = fields.telefone.value.trim();
    if (!telefone) {
        showFieldError('telefone', 'O telefone é obrigatório.');
        return false;
    }
    // Formato: (xx) xxxxx-xxxx ou (xx) xxxx-xxxx
    const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!telefoneRegex.test(telefone)) {
        showFieldError('telefone', 'Por favor, insira um telefone no formato (xx) xxxxx-xxxx.');
        return false;
    }
    clearFieldError('telefone');
    return true;
}

// Validação de data de nascimento
function validateNascimento() {
    const nascimento = fields.nascimento.value;
    if (!nascimento) {
        showFieldError('nascimento', 'A data de nascimento é obrigatória.');
        return false;
    }
    
    const birthDate = new Date(nascimento);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    
    let actualAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        actualAge--;
    }
    
    if (actualAge < MIN_AGE) {
        showFieldError('nascimento', `Você deve ter pelo menos ${MIN_AGE} anos para enviar o formulário.`);
        return false;
    }
    
    if (nascimento < MIN_BIRTH_DATE) {
        showFieldError('nascimento', 'A data de nascimento informada é inválida.');
        return false;
    }
    
    if (nascimento > MAX_BIRTH_DATE_STR) {
        showFieldError('nascimento', `Você deve ter pelo menos ${MIN_AGE} anos para enviar o formulário.`);
        return false;
    }
    
    clearFieldError('nascimento');
    return true;
}

// Validação de foto
function validateFoto() {
    const foto = fields.foto.files[0];
    if (foto) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(foto.type)) {
            showFieldError('foto', 'Por favor, selecione uma imagem válida (JPEG, PNG, GIF ou WebP).');
            return false;
        }
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (foto.size > maxSize) {
            showFieldError('foto', 'A imagem deve ter no máximo 5MB.');
            return false;
        }
    }
    clearFieldError('foto');
    return true;
}

// Validação de estilos musicais
function validateEstilos() {
    const selectedEstilos = Array.from(fields.estilos).filter(cb => cb.checked);
    if (selectedEstilos.length === 0) {
        showFieldError('estilos', 'Selecione pelo menos um estilo musical.');
        return false;
    }
    clearFieldError('estilos');
    return true;
}

// Validação de álbuns (exatamente 3)
function validateAlbuns() {
    const selectedAlbuns = Array.from(fields.albuns).filter(cb => cb.checked);
    if (selectedAlbuns.length === 0) {
        showFieldError('albuns', 'Selecione exatamente 3 álbuns preferidos.');
        return false;
    }
    if (selectedAlbuns.length < 3) {
        showFieldError('albuns', `Você selecionou ${selectedAlbuns.length} álbum(ns). Selecione exatamente 3.`);
        return false;
    }
    if (selectedAlbuns.length > 3) {
        showFieldError('albuns', `Você selecionou ${selectedAlbuns.length} álbuns. Selecione exatamente 3.`);
        return false;
    }
    clearFieldError('albuns');
    return true;
}

// Validação de artistas
function validateArtistas() {
    const artistas = fields.artistas.value.trim();
    const selectedEstilos = Array.from(fields.estilos).filter(cb => cb.checked);
    
    if (selectedEstilos.length > 0 && !artistas) {
        showFieldError('artistas', 'Por favor, liste os artistas dos estilos escolhidos.');
        return false;
    }
    
    if (artistas && artistas.length < 3) {
        showFieldError('artistas', 'A lista de artistas deve ter pelo menos 3 caracteres.');
        return false;
    }
    
    clearFieldError('artistas');
    return true;
}

// Validação de melhor cantor
function validateMelhorCantor() {
    const melhorCantor = fields.melhor_cantor.value;
    if (!melhorCantor) {
        showFieldError('melhor_cantor', 'Selecione o melhor cantor(a) da história.');
        return false;
    }
    clearFieldError('melhor_cantor');
    return true;
}

// Validação completa do formulário
function validateForm() {
    // Limpar erros anteriores
    Object.keys(errors).forEach(key => clearFieldError(key));
    errorSummary.hidden = true;
    errorSummaryList.innerHTML = '';
    confirmationSummary.hidden = true;
    
    // Validar todos os campos
    const validations = [
        { name: 'nome', fn: validateNome },
        { name: 'email', fn: validateEmail },
        { name: 'telefone', fn: validateTelefone },
        { name: 'nascimento', fn: validateNascimento },
        { name: 'foto', fn: validateFoto },
        { name: 'estilos', fn: validateEstilos },
        { name: 'albuns', fn: validateAlbuns },
        { name: 'artistas', fn: validateArtistas },
        { name: 'melhor_cantor', fn: validateMelhorCantor }
    ];
    
    let isValid = true;
    validations.forEach(({ name, fn }) => {
        if (!fn()) {
            isValid = false;
        }
    });
    
    // Se houver erros, mostrar resumo
    if (!isValid) {
        showErrorSummary();
        return false;
    }
    
    // Se não houver erros, mostrar resumo de confirmação
    showConfirmationSummary();
    return false; // Retornar false para prevenir submit real
}

// Mostrar resumo de erros
function showErrorSummary() {
    if (Object.keys(errors).length === 0) {
        errorSummary.hidden = true;
        return;
    }
    
    errorSummary.hidden = false;
    errorSummaryList.innerHTML = '';
    
    const fieldLabels = {
        'nome': 'Nome',
        'email': 'E-mail',
        'telefone': 'Telefone',
        'nascimento': 'Data de Nascimento',
        'foto': 'Foto de Perfil',
        'estilos': 'Estilos Musicais',
        'albuns': 'Álbuns Preferidos',
        'artistas': 'Artistas',
        'melhor_cantor': 'Melhor Cantor(a)'
    };
    
    Object.keys(errors).forEach(fieldName => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = `${fieldLabels[fieldName] || fieldName}: ${errors[fieldName]}`;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            focusField(fieldName);
        });
        li.appendChild(a);
        errorSummaryList.appendChild(li);
    });
    
    // Scroll para o resumo de erros
    errorSummary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Focar em um campo específico
function focusField(fieldName) {
    let field = fields[fieldName];
    
    if (!field) {
        // Para checkboxes, focar no primeiro
        if (fieldName === 'estilos') {
            field = fields.estilos[0];
        } else if (fieldName === 'albuns') {
            field = fields.albuns[0];
        } else {
            field = document.getElementById(fieldName);
        }
    }
    
    if (field) {
        field.focus();
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Se for checkbox, destacar visualmente
        if (field.type === 'checkbox') {
            field.parentElement.style.backgroundColor = '#fff3cd';
            setTimeout(() => {
                field.parentElement.style.backgroundColor = '';
            }, 2000);
        }
    }
}

// Mostrar resumo de confirmação
function showConfirmationSummary() {
    confirmationSummary.hidden = false;
    summaryContent.innerHTML = '';
    
    // Coletar dados do formulário
    const data = {
        nome: fields.nome.value.trim(),
        email: fields.email.value.trim(),
        telefone: fields.telefone.value.trim(),
        nascimento: formatDate(fields.nascimento.value),
        foto: fields.foto.files[0] ? fields.foto.files[0].name : 'Nenhuma foto selecionada',
        estilos: Array.from(fields.estilos)
            .filter(cb => cb.checked)
            .map(cb => {
                const label = document.querySelector(`label[for="${cb.id}"]`);
                return label ? label.textContent : cb.value;
            }),
        albuns: Array.from(fields.albuns)
            .filter(cb => cb.checked)
            .map(cb => {
                const label = document.querySelector(`label[for="${cb.id}"]`);
                return label ? label.textContent : cb.value;
            }),
        artistas: fields.artistas.value.trim() || 'Nenhum artista listado',
        melhor_cantor: fields.melhor_cantor.options[fields.melhor_cantor.selectedIndex].text
    };
    
    // Criar resumo HTML
    const summaryHTML = `
        <p><strong>Nome:</strong> ${escapeHtml(data.nome)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Telefone:</strong> ${escapeHtml(data.telefone)}</p>
        <p><strong>Data de Nascimento:</strong> ${escapeHtml(data.nascimento)}</p>
        <p><strong>Foto de Perfil:</strong> ${escapeHtml(data.foto)}</p>
        <p><strong>Estilos Musicais:</strong> ${data.estilos.map(e => escapeHtml(e)).join(', ')}</p>
        <p><strong>Álbuns Preferidos:</strong> ${data.albuns.map(a => escapeHtml(a)).join(', ')}</p>
        <p><strong>Artistas:</strong> ${escapeHtml(data.artistas)}</p>
        <p><strong>Melhor Cantor(a):</strong> ${escapeHtml(data.melhor_cantor)}</p>
    `;
    
    summaryContent.innerHTML = summaryHTML;
    
    // Scroll para o resumo
    confirmationSummary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Formatar data
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}

// Escapar HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event listeners para validação em tempo real
fields.nome.addEventListener('blur', validateNome);
fields.nome.addEventListener('input', () => {
    if (fields.nome.classList.contains('error')) {
        validateNome();
    }
});

fields.email.addEventListener('blur', validateEmail);
fields.email.addEventListener('input', () => {
    if (fields.email.classList.contains('error')) {
        validateEmail();
    }
});

fields.telefone.addEventListener('blur', validateTelefone);
fields.telefone.addEventListener('input', () => {
    if (fields.telefone.classList.contains('error')) {
        validateTelefone();
    }
});

fields.nascimento.addEventListener('blur', validateNascimento);
fields.nascimento.addEventListener('change', () => {
    if (fields.nascimento.classList.contains('error')) {
        validateNascimento();
    }
});

fields.foto.addEventListener('change', validateFoto);

fields.estilos.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        if (document.getElementById('error-estilos').textContent) {
            validateEstilos();
        }
    });
});

fields.albuns.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        if (document.getElementById('error-albuns').textContent) {
            validateAlbuns();
        }
    });
});

fields.artistas.addEventListener('blur', validateArtistas);
fields.artistas.addEventListener('input', () => {
    if (fields.artistas.classList.contains('error')) {
        validateArtistas();
    }
});

fields.melhor_cantor.addEventListener('change', () => {
    if (fields.melhor_cantor.classList.contains('error')) {
        validateMelhorCantor();
    }
});

// Formatar telefone automaticamente
fields.telefone.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        if (value.length <= 2) {
            value = value ? `(${value}` : value;
        } else if (value.length <= 7) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else if (value.length <= 10) {
            value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
        } else {
            value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
        }
        e.target.value = value;
    }
});

// Submit do formulário
form.addEventListener('submit', (e) => {
    e.preventDefault();
    validateForm();
});

// Botão de confirmação
document.getElementById('confirm-submit').addEventListener('click', () => {
    alert('Formulário enviado com sucesso!');
    form.reset();
    confirmationSummary.hidden = true;
    Object.keys(fields).forEach(key => {
        if (fields[key] && fields[key].classList) {
            fields[key].classList.remove('error', 'valid');
        }
    });
    fields.nome.focus();
});

// Botão de cancelar confirmação
document.getElementById('cancel-submit').addEventListener('click', () => {
    confirmationSummary.hidden = true;
});

// Reset do formulário
form.addEventListener('reset', () => {
    // Limpar todos os erros
    Object.keys(errors).forEach(key => clearFieldError(key));
    errorSummary.hidden = true;
    errorSummaryList.innerHTML = '';
    confirmationSummary.hidden = true;
    
    // Remover classes de validação
    Object.keys(fields).forEach(key => {
        if (fields[key] && fields[key].classList) {
            fields[key].classList.remove('error', 'valid');
        }
    });
    
    // Focar no primeiro campo após reset
    setTimeout(() => {
        fields.nome.focus();
    }, 100);
});

