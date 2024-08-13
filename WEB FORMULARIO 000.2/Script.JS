document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const confirmationMessage = document.getElementById('confirmation-message');
    const showEncryptedMessagesButton = document.getElementById('show-encrypted-messages');
    const passwordContainer = document.getElementById('password-container');
    const passwordInput = document.getElementById('password');
    const decryptMessagesButton = document.getElementById('decrypt-messages');
    const messagesList = document.getElementById('messages-list');
    const messagesUl = document.getElementById('messages');

    // Array para armazenar mensagens localmente
    let messages = [];

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const mensagem = document.getElementById('mensagem').value;

        // Chave de segurança para criptografia
        const chave = 'PROTECTION_KEY';

        // Criptografando os dados
        const nomeCriptografado = CryptoJS.AES.encrypt(nome, chave).toString();
        const emailCriptografado = CryptoJS.AES.encrypt(email, chave).toString();
        const mensagemCriptografada = CryptoJS.AES.encrypt(mensagem, chave).toString();

        // Armazenando os dados criptografados
        messages.push({ nome: nomeCriptografado, email: emailCriptografado, mensagem: mensagemCriptografada });

        // Exibe a mensagem de confirmação
        confirmationMessage.classList.remove('hidden');
        form.reset();

        setTimeout(() => {
            confirmationMessage.classList.add('hidden');
        }, 3000);
    });

    function displayMessages(crypt) {
        // Limpa a lista de mensagens
        messagesUl.innerHTML = '';

        messages.forEach(({ nome, email, mensagem }) => {
            const li = document.createElement('li');
            if (crypt) {
                // Exibe mensagens criptografadas
                li.textContent = `Email criptografado: ${email}`;
                li.addEventListener('click', () => {
                    alert(`Nome criptografado: ${nome}\nMensagem criptografada: ${mensagem}`);
                });
            } else {
                // Descriptografa e exibe mensagens
                const chave = 'PROTECTION_KEY'; // A mesma chave usada para criptografar
                const nomeDescriptografado = CryptoJS.AES.decrypt(nome, chave).toString(CryptoJS.enc.Utf8);
                const emailDescriptografado = CryptoJS.AES.decrypt(email, chave).toString(CryptoJS.enc.Utf8);
                const mensagemDescriptografada = CryptoJS.AES.decrypt(mensagem, chave).toString(CryptoJS.enc.Utf8);

                li.textContent = `Email: ${emailDescriptografado}`;
                li.addEventListener('click', () => {
                    alert(`Nome: ${nomeDescriptografado}\nMensagem: ${mensagemDescriptografada}`);
                });
            }
            messagesUl.appendChild(li);
        });

        messagesList.classList.remove('hidden');
    }

    showEncryptedMessagesButton.addEventListener('click', () => {
        displayMessages(true);
        passwordContainer.classList.remove('hidden');
    });

    decryptMessagesButton.addEventListener('click', () => {
        const password = passwordInput.value;
        const correta = '123987456'; // Senha para descriptografar

        if (password === correta) {
            displayMessages(false);
            passwordContainer.classList.add('hidden');
        } else {
            alert('Senha incorreta!');
        }
    });
});
