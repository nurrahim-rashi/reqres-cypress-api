describe("Reqres API - Automation Suite", () => {
  const MAX_MS = 5000;
  const headers = { "x-api-key": "reqres-free-v1" };

  it("TC01 - GET list users (page=2)", () => {
    cy.request({
      method: "GET",
      url: "/users",
      qs: { page: 2 },
      headers,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.duration).to.be.lessThan(MAX_MS);
      expect(res.body).to.have.property("data").that.is.an("array").and.not
        .empty;
      expect(res.body.page).to.eq(2);
    });
  });

  it("TC02 - GET single user (id=2)", () => {
    cy.request({
      method: "GET",
      url: "/users/2",
      headers,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.duration).to.be.lessThan(MAX_MS);
      expect(res.body).to.have.property("data");
      expect(res.body.data).to.have.property("id", 2);
      expect(res.headers)
        .to.have.property("content-type")
        .and.contains("application/json");
    });
  });

  it("TC03 - GET single user not found (id=23)", () => {
    cy.request({
      method: "GET",
      url: "/users/23",
      headers,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.duration).to.be.lessThan(MAX_MS);
      expect(res.body).to.be.empty;
    });
  });

  it("TC04 - POST create user", () => {
    cy.request({
      method: "POST",
      url: "/users",
      headers,
      body: { name: "morpheus", job: "leader" },
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.duration).to.be.lessThan(MAX_MS);
      expect(res.body).to.have.keys("name", "job", "id", "createdAt");
      expect(res.body.name).to.eq("morpheus");
      expect(res.body.job).to.eq("leader");
    });
  });

  it("TC05 - PUT update user (id=2)", () => {
    cy.request({
      method: "PUT",
      url: "/users/2",
      headers,
      body: { name: "neo", job: "zion resident" },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.duration).to.be.lessThan(MAX_MS);
      expect(res.body).to.include({ name: "neo", job: "zion resident" });
      expect(res.body).to.have.property("updatedAt");
    });
  });

  it("TC06 - PATCH partial update user (id=2)", () => {
    cy.request({
      method: "PATCH",
      url: "/users/2",
      headers,
      body: { job: "chosen one" },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.duration).to.be.lessThan(MAX_MS);
      expect(res.body).to.have.property("job", "chosen one");
      expect(res.body).to.have.property("updatedAt");
    });
  });

  it("TC07 - DELETE user (id=2)", () => {
    cy.request({
      method: "DELETE",
      url: "/users/2",
      headers,
    }).then((res) => {
      expect(res.status).to.eq(204);
      expect(res.duration).to.be.lessThan(MAX_MS);
      expect(res.body).to.be.empty;
    });
  });

  it("TC08 - POST register (success)", () => {
    cy.request({
      method: "POST",
      url: "/register",
      headers,
      body: { email: "eve.holt@reqres.in", password: "pistol" },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.duration).to.be.lessThan(MAX_MS);
      expect(res.body).to.have.keys("id", "token");
      expect(res.body.token).to.be.a("string").and.not.empty;
    });
  });

  it("TC09 - POST register (unsuccessful: missing password)", () => {
    cy.request({
      method: "POST",
      url: "/register",
      headers,
      body: { email: "sydney@fife" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.duration).to.be.lessThan(MAX_MS);
      expect(res.body).to.have.property("error").and.not.empty;
    });
  });

  it("TC10 - POST login (success)", () => {
    cy.request({
      method: "POST",
      url: "/login",
      headers,
      body: { email: "eve.holt@reqres.in", password: "cityslicka" },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property("token").and.not.empty;
      expect(res.duration).to.be.lessThan(MAX_MS);
    });
  });

  it("TC11 - POST login (unsuccessful: missing password)", () => {
    cy.request({
      method: "POST",
      url: "/login",
      headers,
      body: { email: "peter@klaven" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body)
        .to.have.property("error")
        .and.contains("Missing password");
      expect(res.duration).to.be.lessThan(MAX_MS);
    });
  });

  it("TC12 - GET delayed response (delay=2s)", () => {
    cy.request({
      method: "GET",
      url: "/users",
      qs: { delay: 2 },
      headers,
      timeout: 10000,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property("data").that.is.an("array").and.not
        .empty;
      expect(res.duration).to.be.gte(2000);
      expect(res.duration).to.be.lessThan(10000);
    });
  });
});
