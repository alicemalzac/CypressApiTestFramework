# Projeto de Teste de uma API Restful

Este projeto buscou atender a todos os requisitos do teste prático, demonstrando a capacidade de criar testes de API robustos e bem documentados utilizando Cypress, além de configurar um ambiente Docker para execução.

## Tecnologias Utilizadas

-   **Cypress:** Framework de testes end-to-end e de API.
-   **Node.js:** Ambiente de execução JavaScript server-side.
-   **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
-   **Docker:** Plataforma para desenvolvimento, deployment e execução de aplicações em containers.

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em seu ambiente:

-   Node.js (versão 18.x ou superior recomendada)
-   npm (geralmente vem com o Node.js)
-   Docker (para execução em container)

## Estrutura do Projeto

O projeto segue uma estrutura padrão para aplicações Node.js com Cypress:

```
cial_test_project/
├── cypress/
│   ├── fixtures/       # Dados de mock para os testes
│   ├── integration/    # Arquivos de teste (specs)
│   │   └── api_celulares_spec.cy.js
│   ├── plugins/        # Arquivos de plugin do Cypress
│   └── support/        # Comandos customizados e configurações globais
├── Dockerfile          # Define a imagem Docker para o projeto
├── package.json        # Metadados do projeto e dependências
├── package-lock.json   # Lockfile das dependências
├── tsconfig.json       # Configurações do TypeScript
└── README.md           # Este arquivo
```

## Configuração do Ambiente Local

1.  **Clone o repositório (ou copie os arquivos para um diretório local):**

    ```bash
    # Se fosse um repositório git
    # git clone <url_do_repositorio>
    # cd cial_test_project
    ```

2.  **Instale as dependências do projeto:**

    Navegue até o diretório raiz do projeto (`cial_test_project`) e execute:

    ```bash
    npm install
    ```

## Executando os Testes com Cypress

Existem duas formas principais de executar os testes Cypress:

1.  **Modo Interativo (Test Runner):**

    Este modo abre a interface gráfica do Cypress, permitindo que você veja os testes rodando em tempo real e depure-os facilmente.

    ```bash
    npx cypress open
    ```

    Na interface do Cypress, selecione o arquivo `api_celulares_spec.cy.js` para executar os testes de API.

2.  **Modo Headless (terminal):**

    Este modo executa os testes sem abrir a interface gráfica, ideal para integração contínua ou execução em scripts.

    ```bash
    npx cypress run
    ```

    Por padrão, os testes serão executados no Electron browser. Você pode especificar um browser diferente se necessário:

    ```bash
    npx cypress run --browser chrome
    ```

### Detalhamento dos Testes com `cy.log()`

Conforme solicitado nas regras do teste, `cy.log()` foi utilizado para detalhar os passos executados em cada cenário de teste, facilitando o acompanhamento e a depuração. Exemplos:

```javascript
cy.log('Acessando a API para listar todos os celulares');
// ... requisição e asserções ...
cy.log('Teste de listar todos os celulares concluído com sucesso');
```

## Executando o Projeto com Docker

O projeto inclui um `Dockerfile` para facilitar a execução dos testes em um ambiente containerizado, garantindo consistência entre diferentes máquinas.

1.  **Construa a imagem Docker:**

    Navegue até o diretório raiz do projeto (`cial_test_project`) onde o `Dockerfile` está localizado e execute:

    ```bash
    docker build -t cial-test-cypress .
    ```

2.  **Execute os testes Cypress dentro do container Docker:**

    Após a construção da imagem, você pode executar os testes com o seguinte comando:

    ```bash
    docker run cial-test-cypress
    ```

    Este comando irá iniciar o container, instalar as dependências (se ainda não estiverem na imagem) e executar `npx cypress run`.

## Endpoints da API Testados

Os seguintes endpoints da API `https://api.restful-api.dev/objects` foram cobertos pelos testes automatizados:

-   `GET /objects`: Listar todos os celulares.
-   `GET /objects?id=3&id=5&id=10`: Listar um range específico de celulares.
-   `GET /objects/{id}`: Listar celular pelo Id.
-   `POST /objects`: Cadastrar um celular.
-   `PUT /objects/{id}`: Atualizar todos os dados de um celular.
-   `PATCH /objects/{id}`: Atualizar um campo específico de um celular.
-   `DELETE /objects/{id}`: Deletar um celular (incluindo um cenário de cadastrar e depois excluir).

## URLs Completas Testadas

A `baseUrl` configurada para os testes é: `https://api.restful-api.dev`.

As seguintes URLs completas (ou padrões de URL) foram efetivamente testadas, utilizando a `baseUrl` em conjunto com os caminhos relativos:

-   **Listar todos os celulares:** `GET https://api.restful-api.dev/objects`
-   **Listar um range específico de celulares:** `GET https://api.restful-api.dev/objects?id={id1}&id={id2}&id={id3}`
-   **Listar celular pelo Id:** `GET https://api.restful-api.dev/objects/{id}` 
-   **Cadastrar um celular:** `POST https://api.restful-api.dev/objects`
-   **Atualizar um campo específico de um celular:** `PATCH https://api.restful-api.dev/objects/{id}` (utilizando IDs de objetos recém-criados)
-   **Atualizar todos os dados de um celular:** `PUT https://api.restful-api.dev/objects/{id}` (utilizando IDs de objetos recém-criados)
-   **Deletar um celular:** `DELETE https://api.restful-api.dev/objects/{id}` (utilizando IDs de objetos recém-criados)

Nota: Para operações de `PUT`, `PATCH`, e `DELETE` que requerem um ID específico e para evitar conflitos com IDs reservados, os testes foram desenhados para primeiro criar um novo objeto (via `POST /objects`), obter seu ID, e então utilizar esse ID dinâmico na URL da operação subsequente (ex: `https://api.restful-api.dev/objects/aGeneratedId`).


