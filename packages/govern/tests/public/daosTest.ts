import DaosAction from '../../internal/actions/DaosAction'
import { daos} from '../../public/daos'

// Mocks
jest.mock('../../internal/actions/DaosAction')

/**
 * daos test
 */
describe('daos Test', () => {
  const daosActionMock = DaosAction as jest.MockedClass<typeof DaosAction>

  it('calls daos and returns as expected', async () => {
    await daos()

    expect(DaosAction).toHaveBeenCalledTimes(1)

    expect(daosActionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1)
  })
})
