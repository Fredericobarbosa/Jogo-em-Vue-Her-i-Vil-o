const ComponenteLogin ={
    template: `
        <div class="container">
            <div class="componente1">
                <h1>LOGIN</h1>
                <label>Email</label>
                <input v-model="email" placeholder="Email" type="email"></input><br><br>
                <label>Senha</label>
                <input v-model="senha" placeholder="Senha" type="password"></input><br><br>
                <button @click="entrar(email, senha)" class="botaoLogin">Entrar</button><br><br>
                <button @click="$emit('cadastro')">Cadastre-se</button>                
            </div>
        </div>
    `,
    data() {
        return {
            email: '',
            senha: ''
        }
    },
    methods: {
        entrar(email, senha) {
            this.email = email;
            this.senha = senha;
            this.validarUsuario(this.email, this.senha)
        },
        async validarUsuario(email, senha) {
            try {
                const response = await fetch(`${API_URL}validar_usuario`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, senha })
                });
                if (!response.ok) {
                    throw new Error('Email ou senha incorretos.');
                }else{
                    alert('Login realizado com Sucesso!')
                    window.location.href='jogo/'
                }
            } catch (error) {
                console.error('Erro ao validar o usuário no banco de dados:', error);
            }
        }
    }
}

const ComponenteCadastro = {
    template: `
        <div class="componente2">
            <h1>Cadastre-se</h1>
            <label>Nome*</label>
            <input v-model="nome" placeholder="Nome" type="text"></input><br><br>
            <label>Email*</label>
            <input v-model="email" placeholder="Email" type="email"></input><br><br>
            <label>Senha*</label>
            <input v-model="senha" placeholder="Senha" type="password"></input><br><br>
            <button @click="cadastrar(nome, email, senha)" class="botaoCadastro">Cadastrar</button>
        </div>
    `,
    data() {
        return {
            nome: '',
            email: '',
            senha: ''
        };
    },
    methods: {
        async cadastrar(nome, email, senha) {
            this.nome = nome.trim()
            this.email = email.trim()
            this.senha = senha.trim()
            try {
                const response = await fetch(`${API_URL}cadastrar_usuario`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nome: this.nome, email: this.email, senha: this.senha })
                });
                if (!response.ok) {
                    throw new Error('Erro ao cadastrar usuário.');
                } else {
                    alert('Cadastro realizado com sucesso!');
                    this.$emit('cadastro');
                }
            } catch (error) {
                console.error('Erro ao cadastrar o usuário no banco de dados:', error);
                alert('Erro ao cadastrar o usuário no banco de dados.');
            }
        }
    }
};

const { createApp } = Vue
const API_URL = 'https://jogo-em-vue-her-i-vil-o.onrender.com/'; //'http://localhost:3000';

createApp({
    data() {
        return {
            componenteAtual: "ComponenteLogin",
        }
    },
    methods: {
        alterarComponentes() {
            this.componenteAtual = (this.componenteAtual === "ComponenteLogin") ? "ComponenteCadastro" : "ComponenteLogin"
        },
    },

     components: {
        ComponenteLogin,
        ComponenteCadastro
    }    
}).mount("#app");