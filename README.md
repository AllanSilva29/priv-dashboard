# Página Interativa com Fundo Dinâmico

Este projeto é uma página interativa que permite personalizar o fundo da tela, ajustar efeitos visuais e organizar componentes arrastáveis. Ele foi desenvolvido usando React, Zustand para gerenciamento de estado e `@dnd-kit` para funcionalidades de arrastar e soltar.

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para rodar o projeto localmente:

### Pré-requisitos

- **Node.js**: Certifique-se de ter o Node.js instalado. Você pode baixá-lo [aqui](https://nodejs.org/).
- **Git**: Para clonar o repositório. Instale o Git [aqui](https://git-scm.com/).

### Passos

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Acesse o projeto**:
   Abra o navegador e acesse:
   ```
   http://localhost:5173
   ```

---

## 🖥️ Como Usar a Interface

O projeto é composto por um página principal com um fundo dinâmico e componentes personalizáveis. Abaixo estão as funcionalidades principais:

### 1. **Fundo Dinâmico**
   - O fundo da tela é carregado aleatoriamente a partir de uma lista de imagens.
   - Você pode ajustar o **zoom** (escala) do fundo usando o slider no canto superior direito.
   - O fundo pode ser **rotacionado** em 0°, 90°, 180° ou 270°.
   - O **tamanho do fundo** pode ser ajustado para opções como `Cover`, `Contain`, `Stretch to Fit`, entre outras.
   - O **repetição do fundo** pode ser configurada para `No-Repeat` ou `Repeat`.
   - A rotação automática também pode ser pausada ou retomada a qualquer momento.

### 2. **Efeitos Visuais**
   - **Desfoque (Blur)**: Ajuste o desfoque do fundo para criar um efeito visual suave.
   - **Rotação Automática**: O fundo e a frase exibida podem ser alterados automaticamente em intervalos de tempo configuráveis.

### 3. **Componentes Arrastáveis**
   - A página inclui componentes como:
     - **Relógio**: Exibe a hora atual.
     - **Frase Motivacional**: Exibe uma frase aleatória com o autor.
   - Você pode **arrastar e soltar** os componentes para reorganizá-los na tela.

### 4. **Configurações**
   - Clique no ícone de **engrenagem** no canto superior direito para abrir o painel de configurações.
   - No painel, você pode:
     - Alterar a **cor do texto** do relógio e da frase.
     - Adicionar ou remover **frases** e **imagens de fundo**.
     - Configurar o **intervalo de rotação** automática.

---

## 🛠️ Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção da interface.
- **Zustand**: Gerenciamento de estado global.
- **@dnd-kit**: Biblioteca para funcionalidades de arrastar e soltar.
- **Lucide React**: Ícones modernos e elegantes.
- **Vite**: Ferramenta de build rápida para desenvolvimento.

---

## 🙌 Contribuição

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`).
4. Faça push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

---

## 📧 Contato

Se você tiver alguma dúvida ou sugestão, entre em contato:

- **E-mail**: allanjulio61@gmail.com
- **GitHub**: [AllanSilva29](https://github.com/AllanSilva29)

---

Sinta-se a vontade para brincar com este projeto! 🚀
