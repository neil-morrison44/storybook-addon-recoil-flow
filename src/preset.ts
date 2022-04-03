const managerEntries = (entry = []) => [...entry, require.resolve("./register")]
const config = (entry = []) => [...entry, require.resolve("./decorators")]

module.exports = { managerEntries, config }
