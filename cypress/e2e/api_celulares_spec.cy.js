describe("Testes de API para Celulares", () => {
  let apiData;

  beforeEach(() => {
    cy.fixture("api_data.json").then((data) => {
      apiData = data;
    });
  });

  it("Deve listar todos os celulares", () => {
    cy.log("Acessando a API para listar todos os celulares");
    cy.request({
      method: "GET",
      url: "/objects",
    }).then((response) => {
      cy.log("Validação do status da resposta");
      expect(response.status).to.eq(200);
      cy.log("Validação do corpo da resposta");
      expect(response.body).to.not.be.empty;
      expect(response.body).to.be.an("array");
      if (response.body.length > 0) {
        cy.log("Verificando a estrutura do primeiro objeto da lista");
        expect(response.body[0]).to.have.property("id");
        expect(response.body[0]).to.have.property("name");
      }
      cy.log("Teste de listar todos os celulares concluído com sucesso");
    });
  });

  it("Deve listar um range específico de celulares", () => {
    cy.log(`Acessando a API para listar um range específico de celulares (IDs: ${apiData.listarRangeIds.join(", ")})`);
    cy.request({
      method: "GET",
      url: `/objects?id=${apiData.listarRangeIds.join("&id=")}`,
    }).then((response) => {
      cy.log("Validação do status da resposta");
      expect(response.status).to.eq(200);
      cy.log("Validação do corpo da resposta");
      expect(response.body).to.not.be.empty;
      expect(response.body).to.be.an("array");
      const ids = response.body.map(item => item.id);
      expect(ids).to.include.members(apiData.listarRangeIds);
      cy.log("Teste de listar um range específico de celulares concluído com sucesso");
    });
  });

  it("Deve listar um celular pelo Id (ID reservado)", () => {
    cy.log(`Acessando a API para listar o celular com ID reservado: ${apiData.celularId}`);
    cy.request({
      method: "GET",
      url: `/objects/${apiData.celularId}`,
    }).then((response) => {
      cy.log("Validação do status da resposta");
      expect(response.status).to.eq(200);
      cy.log("Validação do corpo da resposta");
      expect(response.body).to.not.be.empty;
      expect(response.body).to.be.an("object");
      cy.log(`Verificando se o ID do celular retornado é ${apiData.celularId}`);
      expect(response.body.id).to.eq(apiData.celularId);
      expect(response.body).to.have.property("name");
      cy.log("Teste de listar celular pelo Id (ID reservado) concluído com sucesso");
    });
  });

  it("Deve atualizar um campo específico de um celular recém-criado", () => {
    let novoCelularId;
    cy.log("Criando um novo celular para o teste de PATCH");
    cy.request({
      method: "POST",
      url: "/objects",
      body: apiData.postPayload, // Usando um payload genérico para criação
    }).then((postResponse) => {
      expect(postResponse.status).to.eq(200);
      novoCelularId = postResponse.body.id;
      cy.log(`Novo celular criado com ID: ${novoCelularId} para o teste de PATCH`);

      cy.log(`Acessando a API para atualizar o nome do celular com ID: ${novoCelularId}`);
      return cy.request({
        method: "PATCH",
        url: `/objects/${novoCelularId}`,
        body: apiData.patchPayload,
      });
    }).then((patchResponse) => {
      cy.log("Validação do status da resposta do PATCH");
      expect(patchResponse.status).to.eq(200);
      cy.log("Validação do corpo da resposta do PATCH");
      expect(patchResponse.body).to.not.be.empty;
      expect(patchResponse.body).to.be.an("object");
      cy.log(`Verificando se o nome do celular foi atualizado para: ${apiData.patchPayload.name}`);
      expect(patchResponse.body.name).to.eq(apiData.patchPayload.name);
      expect(patchResponse.body.id).to.eq(novoCelularId);
      cy.log("Teste de atualizar um campo específico do celular concluído com sucesso");
      
      // Limpeza: Deletar o celular criado
      cy.log(`Deletando o celular de teste com ID: ${novoCelularId}`);
      return cy.request({
        method: "DELETE",
        url: `/objects/${novoCelularId}`,
      });
    }).then((deleteResponse) => {
      expect(deleteResponse.status).to.eq(200);
      cy.log(`Celular de teste com ID: ${novoCelularId} deletado com sucesso.`);
    });
  });

  it("Deve cadastrar um novo celular", () => {
    cy.log("Acessando a API para cadastrar um novo celular");
    cy.request({
      method: "POST",
      url: "/objects",
      body: apiData.postPayload,
    }).then((response) => {
      cy.log("Validação do status da resposta");
      expect(response.status).to.eq(200);
      cy.log("Validação do corpo da resposta");
      expect(response.body).to.not.be.empty;
      expect(response.body).to.be.an("object");
      cy.log("Verificando se o celular cadastrado possui um ID");
      expect(response.body).to.have.property("id");
      cy.log("Verificando os dados do celular cadastrado");
      expect(response.body.name).to.eq(apiData.postPayload.name);
      expect(response.body.data.year).to.eq(apiData.postPayload.data.year);
      expect(response.body.data.price).to.eq(apiData.postPayload.data.price);
      expect(response.body.data["CPU model"]).to.eq(apiData.postPayload.data["CPU model"]);
      expect(response.body.data["Hard disk size"]).to.eq(apiData.postPayload.data["Hard disk size"]);
      cy.log("Teste de cadastrar um novo celular concluído com sucesso");
      // Opcional: deletar o celular criado se não for usado em outros testes encadeados
      const createdId = response.body.id;
      cy.log(`Deletando o celular de teste (cadastro) com ID: ${createdId}`);
      return cy.request({method: "DELETE",url: `/objects/${createdId}`});
    }).then((deleteResponse) => {
      expect(deleteResponse.status).to.eq(200);
      cy.log(`Celular de teste (cadastro) com ID deletado com sucesso.`);
    });
  });

  it("Deve atualizar todos os dados de um celular recém-criado", () => {
    let novoCelularId;
    cy.log("Criando um novo celular para o teste de PUT");
    cy.request({
      method: "POST",
      url: "/objects",
      body: apiData.postPayload, // Usando um payload genérico para criação
    }).then((postResponse) => {
      expect(postResponse.status).to.eq(200);
      novoCelularId = postResponse.body.id;
      cy.log(`Novo celular criado com ID: ${novoCelularId} para o teste de PUT`);

      cy.log(`Acessando a API para atualizar todos os dados do celular com ID: ${novoCelularId}`);
      return cy.request({
        method: "PUT",
        url: `/objects/${novoCelularId}`,
        body: apiData.putPayload,
      });
    }).then((putResponse) => {
      cy.log("Validação do status da resposta do PUT");
      expect(putResponse.status).to.eq(200);
      cy.log("Validação do corpo da resposta do PUT");
      expect(putResponse.body).to.not.be.empty;
      expect(putResponse.body).to.be.an("object");
      cy.log("Verificando os dados atualizados do celular");
      expect(putResponse.body.id).to.eq(novoCelularId);
      expect(putResponse.body.name).to.eq(apiData.putPayload.name);
      expect(putResponse.body.data.year).to.eq(apiData.putPayload.data.year);
      expect(putResponse.body.data.price).to.eq(apiData.putPayload.data.price);
      expect(putResponse.body.data["CPU model"]).to.eq(apiData.putPayload.data["CPU model"]);
      expect(putResponse.body.data["Hard disk size"]).to.eq(apiData.putPayload.data["Hard disk size"]);
      expect(putResponse.body.data.color).to.eq(apiData.putPayload.data.color);
      cy.log("Teste de atualizar todos os dados de um celular concluído com sucesso");

      // Limpeza: Deletar o celular criado
      cy.log(`Deletando o celular de teste com ID: ${novoCelularId}`);
      return cy.request({
        method: "DELETE",
        url: `/objects/${novoCelularId}`,
      });
    }).then((deleteResponse) => {
      expect(deleteResponse.status).to.eq(200);
      cy.log(`Celular de teste com ID: ${novoCelularId} deletado com sucesso.`);
    });
  });

  it("Deve deletar um celular (cadastrar e depois excluir)", () => {
    let celularIdCriado;
    cy.log("Cadastrando um novo celular para posterior exclusão");
    cy.request({
      method: "POST",
      url: "/objects",
      body: apiData.deletePayload,
    }).then((response) => {
      cy.log("Validação do status da resposta do cadastro");
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("id");
      celularIdCriado = response.body.id;
      cy.log(`Celular com ID: ${celularIdCriado} cadastrado para exclusão.`);

      cy.log(`Acessando a API para deletar o celular com ID: ${celularIdCriado}`);
      return cy.request({
        method: "DELETE",
        url: `/objects/${celularIdCriado}`,
      });
    }).then((deleteResponse) => {
      cy.log("Validação do status da resposta da exclusão");
      expect(deleteResponse.status).to.eq(200);
      cy.log("Validação do corpo da resposta da exclusão");
      expect(deleteResponse.body).to.have.property("message");
      expect(deleteResponse.body.message).to.include(`Object with id = ${celularIdCriado} has been deleted.`);
      cy.log(`Celular com ID: ${celularIdCriado} deletado com sucesso.`);

      cy.log(`Tentando buscar o celular deletado com ID: ${celularIdCriado} para confirmar a exclusão`);
      return cy.request({
        method: "GET",
        url: `/objects/${celularIdCriado}`,
        failOnStatusCode: false,
      });
    }).then((getResponse) => {
        cy.log("Validação do status da resposta ao tentar buscar o celular deletado");
        expect(getResponse.status).to.eq(404);
        cy.log("Teste de deletar um celular (cadastrar e depois excluir) concluído com sucesso");
    });
  });
});

