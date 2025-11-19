// Idade mínima permitida
const MIN_AGE = 18;
const MIN_BIRTH_DATE = '1903-01-02';

// Calcula a data máxima (hoje - 18 anos)
const hoje = new Date();
const anoMaximo = hoje.getFullYear() - MIN_AGE;
const mesMaximo = hoje.getMonth();
const diaMaximo = hoje.getDate();
const MAX_BIRTH_DATE_STR = anoMaximo + '-' + String(mesMaximo + 1).padStart(2, '0') + '-' + String(diaMaximo).padStart(2, '0');

// Elementos do formulário
const form = document.getElementById('musicForm');
const errorSummary = document.getElementById('error-summary');
const errorSummaryList = document.getElementById('error-summary-list');
const confirmationSummary = document.getElementById('confirmation-summary');
const summaryContent = document.getElementById('summary-content');
const buttonGroup = document.querySelector('.button-group');

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

const errors = {};

// Define data máxima no campo de nascimento
fields.nascimento.setAttribute('max', MAX_BIRTH_DATE_STR);

// Limpa o erro de um campo
function clearFieldError(fieldName) {
    const errorElement = document.getElementById('error-' + fieldName);
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    let field = fields[fieldName];
    if (!field) {
        field = document.getElementById(fieldName);
    }
    
    if (field) {
        if (field.length) {
            // É um array de checkboxes
            for (let i = 0; i < field.length; i++) {
                field[i].classList.remove('error');
                field[i].classList.add('valid');
            }
        } else {
            // É um campo único
            field.classList.remove('error');
            field.classList.add('valid');
        }
    }
    delete errors[fieldName];
}

// Mostra erro em um campo
function showFieldError(fieldName, message) {
    const errorElement = document.getElementById('error-' + fieldName);
    if (errorElement) {
        errorElement.textContent = message;
    }
    
    let field = fields[fieldName];
    if (!field) {
        field = document.getElementById(fieldName);
    }
    
    if (field) {
        if (field.length) {
            // É um array de checkboxes
            for (let i = 0; i < field.length; i++) {
                field[i].classList.add('error');
                field[i].classList.remove('valid');
            }
        } else {
            // É um campo único
            field.classList.add('error');
            field.classList.remove('valid');
        }
    }
    
    errors[fieldName] = message;
}

// Valida nome
function validateNome() {
    const nome = fields.nome.value.trim();
    
    if (nome === '') {
        showFieldError('nome', 'O nome é obrigatório.');
        return false;
    }
    
    if (nome.length < 2) {
        showFieldError('nome', 'O nome deve ter pelo menos 2 caracteres.');
        return false;
    }
    
    // Verifica se tem só letras
    let temSoLetras = true;
    for (let i = 0; i < nome.length; i++) {
        const char = nome[i];
        if (!((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === ' ' || char === 'À' || char === 'à')) {
            temSoLetras = false;
            break;
        }
    }
    
    if (!temSoLetras) {
        showFieldError('nome', 'O nome deve conter apenas letras e espaços.');
        return false;
    }
    
    clearFieldError('nome');
    return true;
}

// Valida email
function validateEmail() {
    const email = fields.email.value.trim();
    
    if (email === '') {
        showFieldError('email', 'O e-mail é obrigatório.');
        return false;
    }
    
    // Verifica se tem @ e ponto
    if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
        showFieldError('email', 'Por favor, insira um e-mail válido.');
        return false;
    }
    
    // Verifica se o @ vem antes do ponto
    if (email.indexOf('@') > email.lastIndexOf('.')) {
        showFieldError('email', 'Por favor, insira um e-mail válido.');
        return false;
    }
    
    clearFieldError('email');
    return true;
}

// Valida telefone
function validateTelefone() {
    const telefone = fields.telefone.value.trim();
    
    if (telefone === '') {
        showFieldError('telefone', 'O telefone é obrigatório.');
        return false;
    }
    
    // Verifica formato básico: (xx) xxxxx-xxxx
    if (telefone.length < 14 || telefone[0] !== '(' || telefone[3] !== ')' || telefone[4] !== ' ' || telefone.indexOf('-') === -1) {
        showFieldError('telefone', 'Por favor, insira um telefone no formato (xx) xxxxx-xxxx.');
        return false;
    }
    
    clearFieldError('telefone');
    return true;
}

// Valida data de nascimento
function validateNascimento() {
    const nascimento = fields.nascimento.value;
    
    if (nascimento === '') {
        showFieldError('nascimento', 'A data de nascimento é obrigatória.');
        return false;
    }
    
    // Calcula idade
    const dataNasc = new Date(nascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    
    // Ajusta se ainda não fez aniversário
    if (hoje.getMonth() < dataNasc.getMonth() || (hoje.getMonth() === dataNasc.getMonth() && hoje.getDate() < dataNasc.getDate())) {
        idade--;
    }
    
    if (idade < MIN_AGE) {
        showFieldError('nascimento', 'Você deve ter pelo menos 18 anos para enviar o formulário.');
        return false;
    }
    
    if (nascimento < MIN_BIRTH_DATE) {
        showFieldError('nascimento', 'A data de nascimento informada é inválida.');
        return false;
    }
    
    if (nascimento > MAX_BIRTH_DATE_STR) {
        showFieldError('nascimento', 'Você deve ter pelo menos 18 anos para enviar o formulário.');
        return false;
    }
    
    clearFieldError('nascimento');
    return true;
}

// Valida foto
function validateFoto() {
    const foto = fields.foto.files[0];
    if (foto) {
        // Verifica tipo
        const tipo = foto.type;
        if (tipo !== 'image/jpeg' && tipo !== 'image/jpg' && tipo !== 'image/png' && tipo !== 'image/gif' && tipo !== 'image/webp') {
            showFieldError('foto', 'Por favor, selecione uma imagem válida (JPEG, PNG, GIF ou WebP).');
            return false;
        }
        // Verifica tamanho (5MB)
        if (foto.size > 5 * 1024 * 1024) {
            showFieldError('foto', 'A imagem deve ter no máximo 5MB.');
            return false;
        }
    }
    clearFieldError('foto');
    return true;
}

// Valida estilos
function validateEstilos() {
    let contador = 0;
    for (let i = 0; i < fields.estilos.length; i++) {
        if (fields.estilos[i].checked) {
            contador++;
        }
    }
    
    if (contador === 0) {
        showFieldError('estilos', 'Selecione pelo menos um estilo musical.');
        return false;
    }
    
    clearFieldError('estilos');
    return true;
}

// Valida álbuns (tem que ser exatamente 3)
function validateAlbuns() {
    let contador = 0;
    for (let i = 0; i < fields.albuns.length; i++) {
        if (fields.albuns[i].checked) {
            contador++;
        }
    }
    
    if (contador === 0) {
        showFieldError('albuns', 'Selecione exatamente 3 álbuns preferidos.');
        return false;
    }
    
    if (contador < 3) {
        showFieldError('albuns', 'Você selecionou ' + contador + ' álbum(ns). Selecione exatamente 3.');
        return false;
    }
    
    if (contador > 3) {
        showFieldError('albuns', 'Você selecionou ' + contador + ' álbuns. Selecione exatamente 3.');
        return false;
    }
    
    clearFieldError('albuns');
    return true;
}

// Valida artistas
function validateArtistas() {
    const artistas = fields.artistas.value.trim();
    
    // Verifica se escolheu estilos
    let temEstilos = false;
    for (let i = 0; i < fields.estilos.length; i++) {
        if (fields.estilos[i].checked) {
            temEstilos = true;
            break;
        }
    }
    
    if (temEstilos && artistas === '') {
        showFieldError('artistas', 'Por favor, liste os artistas dos estilos escolhidos.');
        return false;
    }
    
    if (artistas !== '' && artistas.length < 3) {
        showFieldError('artistas', 'A lista de artistas deve ter pelo menos 3 caracteres.');
        return false;
    }
    
    clearFieldError('artistas');
    return true;
}

// Valida melhor cantor
function validateMelhorCantor() {
    if (fields.melhor_cantor.value === '') {
        showFieldError('melhor_cantor', 'Selecione o melhor cantor(a) da história.');
        return false;
    }
    clearFieldError('melhor_cantor');
    return true;
}

// Valida todo o formulário
function validateForm() {
    // Limpa erros anteriores
    for (let key in errors) {
        clearFieldError(key);
    }
    errorSummary.hidden = true;
    errorSummaryList.innerHTML = '';
    confirmationSummary.hidden = true;
    
    if (buttonGroup) {
        buttonGroup.style.display = 'flex';
    }
    
    // Valida cada campo
    let tudoOk = true;
    
    if (!validateNome()) tudoOk = false;
    if (!validateEmail()) tudoOk = false;
    if (!validateTelefone()) tudoOk = false;
    if (!validateNascimento()) tudoOk = false;
    if (!validateFoto()) tudoOk = false;
    if (!validateEstilos()) tudoOk = false;
    if (!validateAlbuns()) tudoOk = false;
    if (!validateArtistas()) tudoOk = false;
    if (!validateMelhorCantor()) tudoOk = false;
    
    if (!tudoOk) {
        showErrorSummary();
        setTimeout(function() {
            errorSummary.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        return false;
    }
    
    showConfirmationSummary();
    return false;
}

// Mostra resumo de erros
function showErrorSummary() {
    if (Object.keys(errors).length === 0) {
        errorSummary.hidden = true;
        return;
    }
    
    errorSummary.hidden = false;
    
    if (buttonGroup) {
        buttonGroup.style.display = 'flex';
    }
    
    errorSummaryList.innerHTML = '';
    
    const nomes = {
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
    
    for (let campo in errors) {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = nomes[campo] + ': ' + errors[campo];
        link.onclick = function(e) {
            e.preventDefault();
            focusField(campo);
        };
        li.appendChild(link);
        errorSummaryList.appendChild(li);
    }
    
    setTimeout(function() {
        errorSummary.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Foca no campo com erro
function focusField(campo) {
    const element = fields[campo];

    if (!element) return;

    if (element instanceof NodeList) {
        if (element.length > 0) {
            element[0].focus();
        }
    } else {
        element.focus();
    }
}

// Mostra resumo de confirmação
function showConfirmationSummary() {
    confirmationSummary.hidden = false;
    summaryContent.innerHTML = '';
    
    if (buttonGroup) {
        buttonGroup.style.display = 'none';
    }
    
    // Pega os dados
    const nome = fields.nome.value.trim();
    const email = fields.email.value.trim();
    const telefone = fields.telefone.value.trim();
    const nascimento = formatDate(fields.nascimento.value);
    const foto = fields.foto.files[0] ? fields.foto.files[0].name : 'Nenhuma foto selecionada';
    
    // Pega estilos selecionados
    const estilos = [];
    for (let i = 0; i < fields.estilos.length; i++) {
        if (fields.estilos[i].checked) {
            const label = document.querySelector('label[for="' + fields.estilos[i].id + '"]');
            estilos.push(label ? label.textContent : fields.estilos[i].value);
        }
    }
    
    // Pega álbuns selecionados
    const albuns = [];
    for (let i = 0; i < fields.albuns.length; i++) {
        if (fields.albuns[i].checked) {
            const label = document.querySelector('label[for="' + fields.albuns[i].id + '"]');
            albuns.push(label ? label.textContent : fields.albuns[i].value);
        }
    }
    
    const artistas = fields.artistas.value.trim() || 'Nenhum artista listado';
    const melhorCantor = fields.melhor_cantor.options[fields.melhor_cantor.selectedIndex].text;
    
    // Monta o HTML do resumo
    let html = '<p><strong>Nome:</strong> ' + escapeHtml(nome) + '</p>';
    html += '<p><strong>E-mail:</strong> ' + escapeHtml(email) + '</p>';
    html += '<p><strong>Telefone:</strong> ' + escapeHtml(telefone) + '</p>';
    html += '<p><strong>Data de Nascimento:</strong> ' + escapeHtml(nascimento) + '</p>';
    html += '<p><strong>Foto de Perfil:</strong> ' + escapeHtml(foto) + '</p>';
    html += '<p><strong>Estilos Musicais:</strong> ';
    for (let i = 0; i < estilos.length; i++) {
        html += escapeHtml(estilos[i]);
        if (i < estilos.length - 1) html += ', ';
    }
    html += '</p>';
    html += '<p><strong>Álbuns Preferidos:</strong> ';
    for (let i = 0; i < albuns.length; i++) {
        html += escapeHtml(albuns[i]);
        if (i < albuns.length - 1) html += ', ';
    }
    html += '</p>';
    html += '<p><strong>Artistas:</strong> ' + escapeHtml(artistas) + '</p>';
    html += '<p><strong>Melhor Cantor(a):</strong> ' + escapeHtml(melhorCantor) + '</p>';
    
    summaryContent.innerHTML = html;
    
    confirmationSummary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Formata data para exibição
function formatDate(dateStr) {
    if (!dateStr) return '';
    const partes = dateStr.split('-');
    return partes[2] + '/' + partes[1] + '/' + partes[0];
}

// Escapa HTML para segurança
function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Validação em tempo real
fields.nome.addEventListener('blur', validateNome);
fields.nome.addEventListener('input', function() {
    if (fields.nome.classList.contains('error')) {
        validateNome();
    }
});

fields.email.addEventListener('blur', validateEmail);
fields.email.addEventListener('input', function() {
    if (fields.email.classList.contains('error')) {
        validateEmail();
    }
});

fields.telefone.addEventListener('blur', validateTelefone);
fields.telefone.addEventListener('input', function() {
    if (fields.telefone.classList.contains('error')) {
        validateTelefone();
    }
});

fields.nascimento.addEventListener('blur', validateNascimento);
fields.nascimento.addEventListener('change', function() {
    if (fields.nascimento.classList.contains('error')) {
        validateNascimento();
    }
});

fields.foto.addEventListener('change', validateFoto);

for (let i = 0; i < fields.estilos.length; i++) {
    fields.estilos[i].addEventListener('change', function() {
        if (document.getElementById('error-estilos').textContent) {
            validateEstilos();
        }
    });
}

// Limita seleção de álbuns a 3
for (let i = 0; i < fields.albuns.length; i++) {
    fields.albuns[i].addEventListener('change', function() {
        let contador = 0;
        for (let j = 0; j < fields.albuns.length; j++) {
            if (fields.albuns[j].checked) {
                contador++;
            }
        }
        
        // Se tentou marcar e já tem 3 ou mais, desmarca e mostra erro
        if (this.checked && contador > 3) {
            this.checked = false;
            showFieldError('albuns', 'Você pode selecionar no máximo 3 álbuns.');
            // Recalcula contador após desmarcar
            contador = 0;
            for (let j = 0; j < fields.albuns.length; j++) {
                if (fields.albuns[j].checked) {
                    contador++;
                }
            }
        }
        
        // Valida normalmente se não excedeu o limite
        if (contador <= 3) {
            validateAlbuns();
        }
    });
}

fields.artistas.addEventListener('blur', validateArtistas);
fields.artistas.addEventListener('input', function() {
    if (fields.artistas.classList.contains('error')) {
        validateArtistas();
    }
});

fields.melhor_cantor.addEventListener('change', function() {
    if (fields.melhor_cantor.classList.contains('error')) {
        validateMelhorCantor();
    }
});

// Formata telefone enquanto digita
fields.telefone.addEventListener('input', function(e) {
    let valor = e.target.value;
    // Remove tudo que não é número
    let numeros = '';
    for (let i = 0; i < valor.length; i++) {
        if (valor[i] >= '0' && valor[i] <= '9') {
            numeros += valor[i];
        }
    }
    
    // Formata conforme vai digitando
    let formatado = '';
    if (numeros.length <= 2) {
        formatado = numeros.length > 0 ? '(' + numeros : '';
    } else if (numeros.length <= 7) {
        formatado = '(' + numeros.substring(0, 2) + ') ' + numeros.substring(2);
    } else if (numeros.length <= 10) {
        formatado = '(' + numeros.substring(0, 2) + ') ' + numeros.substring(2, 6) + '-' + numeros.substring(6);
    } else {
        formatado = '(' + numeros.substring(0, 2) + ') ' + numeros.substring(2, 7) + '-' + numeros.substring(7, 11);
    }
    
    e.target.value = formatado;
});

// Submit do formulário
form.addEventListener('submit', function(e) {
    e.preventDefault();
    validateForm();
});

// Listener no botão de submit
const submitBtn = document.getElementById('submit-btn');
if (submitBtn) {
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        validateForm();
    });
}

// Prepara dados para envio
function prepareFormData() {
    const estilos = [];
    for (let i = 0; i < fields.estilos.length; i++) {
        if (fields.estilos[i].checked) {
            estilos.push(fields.estilos[i].value);
        }
    }
    
    const albuns = [];
    for (let i = 0; i < fields.albuns.length; i++) {
        if (fields.albuns[i].checked) {
            albuns.push(fields.albuns[i].value);
        }
    }
    
    return {
        nome: fields.nome.value.trim(),
        email: fields.email.value.trim(),
        telefone: fields.telefone.value.trim(),
        nascimento: fields.nascimento.value,
        foto: fields.foto.files[0] ? fields.foto.files[0].name : 'Nenhuma foto selecionada',
        estilos: estilos,
        albuns: albuns,
        artistas: fields.artistas.value.trim() || 'Nenhum artista listado',
        melhor_cantor: fields.melhor_cantor.value
    };
}

// Finaliza envio
function finalizeSubmission(data) {
    alert('Formulário enviado com sucesso!\n\nOs dados foram processados e enviados.');
    
    form.reset();
    confirmationSummary.hidden = true;
    
    // Limpa classes de validação
    for (let key in fields) {
        const field = fields[key];
        if (field) {
            if (field.length) {
                for (let i = 0; i < field.length; i++) {
                    field[i].classList.remove('error', 'valid');
                }
            } else {
                field.classList.remove('error', 'valid');
            }
        }
    }
    
    // Limpa erros
    for (let key in errors) {
        clearFieldError(key);
    }
    errorSummary.hidden = true;
    errorSummaryList.innerHTML = '';
    
    if (buttonGroup) {
        buttonGroup.style.display = 'flex';
    }
    
    fields.nome.focus();
}

// Envia os dados
function submitFormData() {
    const confirmBtn = document.getElementById('confirm-submit');
    const textoOriginal = confirmBtn.textContent;
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Enviando...';
    
    const dados = prepareFormData();
    
    setTimeout(function() {
        finalizeSubmission(dados);
    }, 500);
}


// Botão de confirmação
document.getElementById('confirm-submit').addEventListener('click', function() {
    submitFormData();
});

// Botão de cancelar
document.getElementById('cancel-submit').addEventListener('click', function() {
    confirmationSummary.hidden = true;
    if (buttonGroup) {
        buttonGroup.style.display = 'flex';
    }
});

// Reset do formulário
form.addEventListener('reset', function() {
    // Limpa erros
    for (let key in errors) {
        clearFieldError(key);
    }
    errorSummary.hidden = true;
    errorSummaryList.innerHTML = '';
    confirmationSummary.hidden = true;
    
    // Remove classes de validação
    for (let key in fields) {
        const field = fields[key];
        if (field) {
            if (field.length) {
                for (let i = 0; i < field.length; i++) {
                    field[i].classList.remove('error', 'valid');
                }
            } else if (field.classList) {
                field.classList.remove('error', 'valid');
            }
        }
    }
    
    setTimeout(function() {
        fields.nome.focus();
    }, 100);
});

