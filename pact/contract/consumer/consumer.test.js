const path = require('path')
const { Pact } = require('@pact-foundation/pact')
const { Matchers } = require('@pact-foundation/pact')
const axios = require('axios')

const provider = new Pact({
  consumer: 'FrontendAppTest',
  provider: 'FakeBackendAPI',
  port: 3000,
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'info'
})

describe('Pact with BackendAPI', () => {
  before(() => provider.setup())

  after(() => provider.finalize())

  afterEach(() => provider.verify())

  it('Teste de contrato na rota /posts', async () => {
    await provider.addInteraction({
      state: 'Caminho feliz',
      uponReceiving: 'uma requisição GET para /users/1',
      withRequest: {
        method: 'GET',
        path: '/users/1'
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: Matchers.like({ id: 1, title: 'json-server' })
      }
    })

    const response = await axios.get('http://localhost:3000/posts')

    expect(response.status).toBe(200)
    expect(response.data).toEqual({ id: 1, title: 'json-server' })
  })
})

